// Financial Governance & Chart of Accounts Types (DDD)
// File: src/features/accounting/domain/governanceTypes.ts

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

// Tài khoản kế toán (Chart of Accounts Node)
export interface AccountNode {
  code: string; // Khóa chính (Ví dụ: '1111', '152', '331', '632')
  name: string;
  type: AccountType;
  is_active: number; // 1: true, 0: false
}

// Trung tâm chi phí (Cost Center - Ví dụ: Trạm sấy lúa A, Lò hấp B)
export interface CostCenter {
  id: string;
  code: string; // Ví dụ: 'CC-DRY-A'
  name: string;
  description?: string;
  organization_id: string;
}

// Trung tâm lợi nhuận (Profit Center - Ví dụ: Bán gạo thành phẩm)
export interface ProfitCenter {
  id: string;
  code: string; // Ví dụ: 'PC-RETAIL'
  name: string;
  description?: string;
  organization_id: string;
}

// Chiều kế toán phân tích (Accounting Dimensions)
export interface AccountingDimensions {
  cost_center_code?: string;
  profit_center_code?: string;
  crop_season_id?: string;
  farmer_id?: string;
}
