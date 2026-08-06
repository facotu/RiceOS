// Financial Validation Engine checking accounting entries and dimensions
// File: src/features/accounting/domain/validationEngine.ts

import { LedgerEntry } from "./types.ts";
import { AccountingDimensions } from "./governanceTypes.ts";

export class FinancialValidationEngine {
  // Kiểm tra tính cân đối của bút toán kép
  public static validateDoubleEntryBalance(debitTotal: number, creditTotal: number) {
    if (debitTotal !== creditTotal) {
      throw new Error(`Sai luật kế toán kép: Tổng Nợ (${debitTotal.toLocaleString()} đ) phải bằng Tổng Có (${creditTotal.toLocaleString()} đ).`);
    }
  }

  // Kiểm tra chiều kế toán phân tích hợp lệ theo tài khoản
  public static validateDimensions(accountCode: string, dims: AccountingDimensions) {
    // Quy tắc 1: Tài khoản chi phí đầu tư thu mua lúa (Ví dụ TK 621, 627, 642) bắt buộc phải gắn Trung tâm chi phí (Cost Center)
    if (accountCode.startsWith("6") && !dims.cost_center_code) {
      throw new Error(`Lỗi quản trị dữ liệu: Tài khoản chi phí [TK ${accountCode}] bắt buộc phải chỉ định Trung tâm chi phí (Cost Center).`);
    }

    // Quy tắc 2: Tài khoản doanh thu (TK 511) bắt buộc phải chỉ định Trung tâm lợi nhuận (Profit Center)
    if (accountCode.startsWith("5") && !dims.profit_center_code) {
      throw new Error(`Lỗi quản trị dữ liệu: Tài khoản doanh thu [TK ${accountCode}] bắt buộc phải chỉ định Trung tâm lợi nhuận (Profit Center).`);
    }
  }
}
