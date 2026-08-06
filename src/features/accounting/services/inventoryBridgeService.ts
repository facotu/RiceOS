// Inventory Accounting Bridge Service implementing costing, loss and automatic entries
// File: src/features/accounting/services/inventoryBridgeService.ts

import { inventoryBridgeRepo } from "../repository/inventoryBridgeRepository.ts";
import { InventoryValidationRules } from "../domain/inventoryRules.ts";
import { InventoryTransaction, InventoryAccountMap, DryingLossSummary } from "../domain/bridgeTypes.ts";
import { Settlement, LedgerEntry } from "../domain/types.ts";
import { db } from "../../../db/index.ts";

export class InventoryBridgeService {
  // 1. Tự động hạch toán định khoản kế toán kép khi kết thúc quyết toán mua lúa
  async recordPurchaseReceipt(settlement: Settlement, warehouseId: string): Promise<void> {
    // 1.1. Tính toán hao hụt sấy lúa thực tế
    const rawWeight = settlement.total_raw_weight;
    const dryWeight = settlement.total_dry_weight;
    const lossWeight = rawWeight - dryWeight;
    const lossPercent = InventoryValidationRules.validateDryingLoss(rawWeight, dryWeight);

    // Lấy bản đồ tài khoản kho ứng với giống lúa sấy
    const map = await inventoryBridgeRepo.getAccountMap(settlement.receipt_id);
    const rawAccount = map?.account_code_raw || "1521"; // TK Lúa tươi
    const dryAccount = map?.account_code_dry || "1522"; // TK Lúa khô sấy

    const unitPrice = settlement.price_per_kg;
    const totalRawValue = rawWeight * unitPrice;
    const totalDryValue = dryWeight * unitPrice;
    const lossValue = lossWeight * unitPrice;

    // 1.2. Tạo giao dịch nhập kho lúa tươi
    const txInId = crypto.randomUUID();
    const txIn: InventoryTransaction = {
      id: txInId,
      warehouse_id: warehouseId,
      rice_variety_id: settlement.receipt_id,
      transaction_type: 'in_purchase',
      quantity_kg: rawWeight,
      unit_cost: unitPrice,
      total_value: totalRawValue,
      ref_doc_id: settlement.id,
      created_at: new Date().toISOString()
    };
    await inventoryBridgeRepo.saveTransaction(txIn);

    // 1.3. Tạo giao dịch xuất hao hụt sấy khô lúa
    if (lossWeight > 0) {
      const txLossId = crypto.randomUUID();
      const txLoss: InventoryTransaction = {
        id: txLossId,
        warehouse_id: warehouseId,
        rice_variety_id: settlement.receipt_id,
        transaction_type: 'out_drying_loss',
        quantity_kg: lossWeight,
        unit_cost: unitPrice,
        total_value: lossValue,
        ref_doc_id: settlement.id,
        created_at: new Date().toISOString()
      };
      await inventoryBridgeRepo.saveTransaction(txLoss);
    }

    // 1.4. Tự động hạch toán Nhật ký & Sổ cái kế toán (Automatic Journal Mapping)
    // - Bút toán 1: Nhập kho lúa tươi, ghi nhận nợ phải trả nông dân
    //   Nợ TK 1521 (Lúa tươi): rawValue
    //   Có TK 331 (Phải trả nông dân): rawValue
    const entry1Debit: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: settlement.id,
      account_code: rawAccount,
      entry_type: 'debit',
      amount: totalRawValue,
      description: `Nhap kho lua tuoi phieu ${settlement.receipt_id}`,
      created_at: new Date().toISOString()
    };
    const entry1Credit: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: settlement.id,
      account_code: "331",
      entry_type: 'credit',
      amount: totalRawValue,
      description: `Ghi nhan phai tra nong dan phieu ${settlement.receipt_id}`,
      created_at: new Date().toISOString()
    };

    // - Bút toán 2: Chuyển lúa khô vào Silo sấy và kết chuyển giá trị hao hụt sấy lúa
    //   Nợ TK 1522 (Lúa sấy khô): dryValue
    //   Có TK 1521 (Lúa tươi kết chuyển): rawValue
    //   Nợ TK 632 / TK 811 (Chi phí hao hụt sấy lúa): lossValue
    const entry2DebitDry: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: settlement.id,
      account_code: dryAccount,
      entry_type: 'debit',
      amount: totalDryValue,
      description: `Ket chuyen nhap Silo lua kho say phieu ${settlement.receipt_id}`,
      created_at: new Date().toISOString()
    };
    const entry2DebitLoss: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: settlement.id,
      account_code: "632", // Chi phí hao hụt tính vào giá vốn lúa sấy
      entry_type: 'debit',
      amount: lossValue,
      description: `Hao hut trong lo say phieu ${settlement.receipt_id}`,
      created_at: new Date().toISOString()
    };
    const entry2CreditRaw: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: settlement.id,
      account_code: rawAccount,
      entry_type: 'credit',
      amount: totalRawValue,
      description: `Ket chuyen xuat lua tuoi di say phieu ${settlement.receipt_id}`,
      created_at: new Date().toISOString()
    };

    await db.table("ledger_entries").bulkPut([
      entry1Debit,
      entry1Credit,
      entry2DebitDry,
      entry2DebitLoss,
      entry2CreditRaw
    ]);
  }

  // 2. Tính giá vốn bình quân gia quyền kho sấy lúa (Weighted Average Costing)
  async calculateWeightedAverageCost(riceVarietyId: string, warehouseId: string): Promise<number> {
    const txs = await inventoryBridgeRepo.getTransactions(warehouseId);
    
    // Lọc các giao dịch nhập lúa cùng loại
    const inTxs = txs.filter(t => 
      t.rice_variety_id === riceVarietyId && 
      (t.transaction_type === 'in_purchase' || t.transaction_type === 'in_drying')
    );

    const totalWeight = inTxs.reduce((sum, t) => sum + t.quantity_kg, 0);
    const totalVal = inTxs.reduce((sum, t) => sum + t.total_value, 0);

    if (totalWeight <= 0) return 0;
    return Math.round(totalVal / totalWeight);
  }
}

export const inventoryBridgeService = new InventoryBridgeService();
export default inventoryBridgeService;
