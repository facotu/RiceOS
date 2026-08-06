// Accounting Domain Service implementing hardening, reconciliation, adjustments & period locking
// File: src/features/accounting/services/accountingService.ts

import { IAccountingRepository } from "../repository/accountingRepository.ts";
import { SettlementStateMachine } from "../domain/stateMachine.ts";
import { AccountingRulesEngine } from "../domain/rulesEngine.ts";
import { 
  Settlement, 
  PaymentTransaction, 
  LedgerEntry, 
  PaymentMethod, 
  AccountingPeriod, 
  PaymentReconciliation, 
  SettlementAdjustment 
} from "../domain/types.ts";
import { 
  DomainEvents, 
  SettlementCreatedEvent, 
  SettlementApprovedEvent, 
  SettlementPaidEvent 
} from "../domain/events.ts";

export class AccountingService {
  private repository: IAccountingRepository;

  constructor(repository: IAccountingRepository) {
    this.repository = repository;
  }

  // Helper check khóa sổ kỳ kế toán trước khi thực hiện bất cứ sửa đổi nào
  private async checkPeriodLock(orgId: string, dateStr: string) {
    const period = await this.repository.getPeriodByDate(orgId, dateStr);
    AccountingRulesEngine.validatePeriodNotLocked(period);
  }

  // 1. Trình duyệt phê duyệt phiếu quyết toán (Accountant gửi)
  async submitForApproval(settlementId: string, actor: string): Promise<void> {
    const settlement = await this.repository.getSettlementById(settlementId);
    if (!settlement) throw new Error("Không tìm thấy phiếu quyết toán.");

    // Kiểm tra khóa sổ kỳ kế toán vụ mùa
    await this.checkPeriodLock(settlement.farmer_id, settlement.created_at);

    // Kiểm tra tính hợp lệ qua máy trạng thái
    const nextState = SettlementStateMachine.transition(settlement.state, 'pending_approval');
    await this.repository.updateSettlementState(settlementId, nextState, actor);
    
    // Phát tán Sự kiện Nghiệp vụ
    const updated = await this.repository.getSettlementById(settlementId);
    if (updated) {
      DomainEvents.dispatch(new SettlementCreatedEvent(updated));
    }
  }

  // 2. Phê duyệt duyệt chi (Director ký)
  async approveSettlement(settlementId: string, actor: string): Promise<void> {
    const settlement = await this.repository.getSettlementById(settlementId);
    if (!settlement) throw new Error("Không tìm thấy phiếu quyết toán.");

    await this.checkPeriodLock(settlement.farmer_id, settlement.created_at);

    const nextState = SettlementStateMachine.transition(settlement.state, 'approved');
    await this.repository.updateSettlementState(settlementId, nextState, actor);

    const updated = await this.repository.getSettlementById(settlementId);
    if (updated) {
      DomainEvents.dispatch(new SettlementApprovedEvent(updated));
    }
  }

  // 3. Thực thi thanh toán và ghi nhận sổ cái kế toán
  async paySettlement(settlementId: string, method: PaymentMethod, refCode: string, actor: string): Promise<void> {
    const settlement = await this.repository.getSettlementById(settlementId);
    if (!settlement) throw new Error("Không tìm thấy phiếu quyết toán.");

    await this.checkPeriodLock(settlement.farmer_id, settlement.created_at);

    const nextState = SettlementStateMachine.transition(settlement.state, 'completed');
    await this.repository.updateSettlementState(settlementId, nextState, actor);

    // Ghi nhận Giao dịch Thanh toán
    const paymentId = crypto.randomUUID();
    const payment: PaymentTransaction = {
      id: paymentId,
      settlement_id: settlementId,
      amount: settlement.total_amount,
      payment_method: method,
      reference_code: refCode,
      paid_by: actor,
      paid_at: new Date().toISOString()
    };
    await this.repository.savePayment(payment);

    // Ghi nhận Bút toán Sổ cái kép (Double-Entry Ledger)
    const ledgerDebit: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: settlementId,
      account_code: "331", // Phải trả nông dân
      entry_type: "debit",
      amount: settlement.total_amount,
      description: `Ghi no thanh toan phieu ${settlement.receipt_id}`,
      created_at: new Date().toISOString()
    };
    
    const ledgerCredit: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: settlementId,
      account_code: method === "cash" ? "1111" : "1121",
      entry_type: "credit",
      amount: settlement.total_amount,
      description: `Ghi co thanh toan phieu ${settlement.receipt_id} qua ${method}`,
      created_at: new Date().toISOString()
    };

    await this.repository.saveLedgerEntry(ledgerDebit);
    await this.repository.saveLedgerEntry(ledgerCredit);

    // Tự động liên kết hạch toán kho lúa (Inventory-Accounting Bridge)
    try {
      const { inventoryBridgeService } = await import("./inventoryBridgeService.ts");
      await inventoryBridgeService.recordPurchaseReceipt(settlement, "cc-dry-a");
    } catch (e) {
      console.error("Lỗi tự động liên kết hạch toán kho lúa sấy:", e);
    }

    // Bắn sự kiện thanh toán hoàn tất
    DomainEvents.dispatch(new SettlementPaidEvent(payment));
  }

  // 4. Đối soát giao dịch với sao kê ngân hàng
  async reconcilePayment(paymentId: string, refCode: string, actor: string, notes?: string): Promise<void> {
    const reconciliation: PaymentReconciliation = {
      id: crypto.randomUUID(),
      payment_transaction_id: paymentId,
      bank_statement_ref: refCode,
      status: "matched",
      reconciled_by: actor,
      reconciled_at: new Date().toISOString(),
      notes
    };
    await this.repository.saveReconciliation(reconciliation);
  }

  // 5. Điều chỉnh quyết toán lúa (Bù trừ số tiền chênh lệch)
  async adjustSettlement(settlementId: string, newAmount: number, reason: string, actor: string): Promise<void> {
    const settlement = await this.repository.getSettlementById(settlementId);
    if (!settlement) throw new Error("Không tìm thấy phiếu quyết toán.");

    // Kiểm tra chốt chặn khóa kế toán
    await this.checkPeriodLock(settlement.farmer_id, settlement.created_at);

    // Kiểm tra canAdjust
    AccountingRulesEngine.validateCanAdjust(settlement);

    // Kiểm tra hạn mức điều chỉnh (max 20%)
    AccountingRulesEngine.validateAdjustmentLimit(settlement.total_amount, newAmount);

    const originalAmount = settlement.total_amount;
    const delta = newAmount - originalAmount;

    // Cập nhật số tiền mới
    settlement.total_amount = newAmount;
    await this.repository.saveSettlement(settlement);

    // Lưu vết lịch sử điều chỉnh (SettlementAdjustment)
    const adjustment: SettlementAdjustment = {
      id: crypto.randomUUID(),
      settlement_id: settlementId,
      original_amount: originalAmount,
      adjusted_amount: newAmount,
      delta_amount: delta,
      reason,
      adjusted_by: actor,
      adjusted_at: new Date().toISOString()
    };
    await this.repository.saveAdjustment(adjustment);
  }

  // 6. Khóa sổ kỳ kế toán (Director khóa)
  async lockPeriod(periodId: string, actor: string): Promise<void> {
    await this.repository.lockAccountingPeriod(periodId, actor);
  }
}
