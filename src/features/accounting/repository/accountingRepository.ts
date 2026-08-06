// Accounting Repository Layer for RiceOS
// File: src/features/accounting/repository/accountingRepository.ts

import { 
  Settlement, 
  PaymentTransaction, 
  LedgerEntry, 
  SettlementState, 
  AccountingPeriod, 
  PaymentReconciliation, 
  SettlementAdjustment 
} from "../domain/types.ts";
import { db } from "../../../db/index.ts";

export interface IAccountingRepository {
  getSettlements(orgId: string): Promise<Settlement[]>;
  getSettlementById(id: string): Promise<Settlement | null>;
  saveSettlement(settlement: Settlement): Promise<void>;
  updateSettlementState(id: string, state: SettlementState, actor: string): Promise<void>;
  savePayment(payment: PaymentTransaction): Promise<void>;
  saveLedgerEntry(entry: LedgerEntry): Promise<void>;
  
  // Nền tảng hardening bổ sung
  getAccountingPeriods(orgId: string): Promise<AccountingPeriod[]>;
  getPeriodByDate(orgId: string, date: string): Promise<AccountingPeriod | null>;
  lockAccountingPeriod(id: string, actor: string): Promise<void>;
  saveReconciliation(reconcile: PaymentReconciliation): Promise<void>;
  saveAdjustment(adjustment: SettlementAdjustment): Promise<void>;
}

export class AccountingRepository implements IAccountingRepository {
  async getSettlements(orgId: string): Promise<Settlement[]> {
    const list = await db.table("settlements").toArray();
    return list.filter(item => item.organization_id === orgId);
  }

  async getSettlementById(id: string): Promise<Settlement | null> {
    const item = await db.table("settlements").get(id);
    return item || null;
  }

  async saveSettlement(settlement: Settlement): Promise<void> {
    await db.table("settlements").put(settlement);
  }

  async updateSettlementState(id: string, state: SettlementState, actor: string): Promise<void> {
    const item = await this.getSettlementById(id);
    if (!item) throw new Error("Không tìm thấy phiếu quyết toán.");
    
    item.state = state;
    if (state === "approved") {
      item.approved_by = actor;
      item.approved_at = new Date().toISOString();
    }
    await db.table("settlements").put(item);
  }

  async savePayment(payment: PaymentTransaction): Promise<void> {
    await db.table("payment_transactions").put(payment);
  }

  async saveLedgerEntry(entry: LedgerEntry): Promise<void> {
    await db.table("ledger_entries").put(entry);
  }

  // --- ACCOUTING PERIODS IMPLEMENTATION ---
  async getAccountingPeriods(orgId: string): Promise<AccountingPeriod[]> {
    // Seed kỳ kế toán mẫu nếu trống
    const count = await db.table("accounting_periods").count();
    if (count === 0) {
      await db.table("accounting_periods").add({
        id: "period-2026-08",
        organization_id: orgId,
        name: "Vụ Đông Xuân 2026 - Kỳ Tháng 08",
        start_date: "2026-08-01",
        end_date: "2026-08-31",
        is_locked: false
      });
    }
    const list = await db.table("accounting_periods").toArray();
    return list.filter(item => item.organization_id === orgId);
  }

  async getPeriodByDate(orgId: string, date: string): Promise<AccountingPeriod | null> {
    const periods = await this.getAccountingPeriods(orgId);
    const target = new Date(date);
    const matched = periods.find(p => {
      const start = new Date(p.start_date);
      const end = new Date(p.end_date);
      return target >= start && target <= end;
    });
    return matched || null;
  }

  async lockAccountingPeriod(id: string, actor: string): Promise<void> {
    const period = await db.table("accounting_periods").get(id);
    if (!period) throw new Error("Không tìm thấy kỳ kế toán.");
    period.is_locked = true;
    period.locked_by = actor;
    period.locked_at = new Date().toISOString();
    await db.table("accounting_periods").put(period);
  }

  // --- RECONCILIATION & ADJUSTMENTS ---
  async saveReconciliation(reconcile: PaymentReconciliation): Promise<void> {
    await db.table("payment_reconciliations").put(reconcile);
  }

  async saveAdjustment(adjustment: SettlementAdjustment): Promise<void> {
    await db.table("settlement_adjustments").put(adjustment);
  }
}
export const accountingRepo = new AccountingRepository();
export default accountingRepo;
