// Accounting Domain Types & Aggregates (DDD) for RiceOS
// File: src/features/accounting/domain/types.ts

export type SettlementState = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed';
export type PaymentMethod = 'cash' | 'bank_transfer';
export type LedgerEntryType = 'debit' | 'credit';

// Aggregate Root: Phiếu quyết toán lúa
export interface Settlement {
  id: string;
  receipt_id: string;
  farmer_id: string;
  total_raw_weight: number;
  deductions_weight: number;
  total_dry_weight: number;
  price_per_kg: number;
  total_amount: number;
  state: SettlementState;
  created_at: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

// Entity: Giao dịch thanh toán tiền lúa thực tế
export interface PaymentTransaction {
  id: string;
  settlement_id: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_code?: string;
  paid_by: string;
  paid_at: string;
}

// Value Object: Bút toán sổ cái kế toán (Ledger Entry)
export interface LedgerEntry {
  id: string;
  settlement_id: string;
  account_code: string; // Ví dụ: '1111' (Tiền mặt), '1121' (Tiền gửi ngân hàng)
  entry_type: LedgerEntryType;
  amount: number;
  description: string;
  created_at: string;
}

// Aggregate: Kỳ kế toán (Accounting Period)
export interface AccountingPeriod {
  id: string;
  organization_id: string;
  name: string; // Ví dụ: "Vụ Đông Xuân 2026 - Tháng 08"
  start_date: string;
  end_date: string;
  is_locked: boolean;
  locked_by?: string;
  locked_at?: string;
}

// Entity: Báo cáo đối soát thanh toán (Payment Reconciliation)
export interface PaymentReconciliation {
  id: string;
  payment_transaction_id: string;
  bank_statement_ref?: string;
  status: 'matched' | 'unmatched';
  reconciled_by: string;
  reconciled_at: string;
  notes?: string;
}

// Entity: Điều chỉnh quyết toán (Settlement Adjustment)
export interface SettlementAdjustment {
  id: string;
  settlement_id: string;
  original_amount: number;
  adjusted_amount: number;
  delta_amount: number;
  reason: string;
  adjusted_by: string;
  adjusted_at: string;
}

