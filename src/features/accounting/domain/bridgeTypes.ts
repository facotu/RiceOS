// Inventory Accounting Bridge Domain Types (DDD)
// File: src/features/accounting/domain/bridgeTypes.ts

export type InventoryTransactionType = 'in_purchase' | 'in_drying' | 'out_drying_loss' | 'out_sale';

// Giao dịch kho lúa liên kết kế toán
export interface InventoryTransaction {
  id: string;
  warehouse_id: string;
  rice_variety_id: string;
  transaction_type: InventoryTransactionType;
  quantity_kg: number;
  unit_cost: number;
  total_value: number;
  ref_doc_id: string; // Mã phiếu cân lúa hoặc mã quyết toán tham chiếu
  created_at: string;
}

// Ánh xạ tài khoản kho lúa
export interface InventoryAccountMap {
  rice_variety_id: string;
  account_code_raw: string; // Ví dụ: '1521' (Lúa tươi)
  account_code_dry: string; // Ví dụ: '1522' (Lúa khô sấy)
}

// Tổng hợp hao hụt sấy lúa
export interface DryingLossSummary {
  ref_doc_id: string;
  raw_weight_kg: number;
  dry_weight_kg: number;
  loss_weight_kg: number;
  loss_percent: number;
}
