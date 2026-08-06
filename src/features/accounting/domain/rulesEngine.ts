// Business Rules Engine Foundation for RiceOS Accounting Domain
// File: src/features/accounting/domain/rulesEngine.ts

import { Settlement, AccountingPeriod } from "./types.ts";

export class AccountingRulesEngine {
  // Quy tắc 1: Hạn mức duyệt chi tự động không cần Giám đốc (50 triệu VNĐ)
  public static readonly AUTO_APPROVAL_LIMIT = 50000000;

  // Quy tắc 2: Kiểm tra kỳ kế toán có bị khóa hay không
  public static validatePeriodNotLocked(period: AccountingPeriod | null) {
    if (period && period.is_locked) {
      throw new Error(`Giao dịch tài chính thất bại: Kỳ kế toán [${period.name}] đã bị khóa sổ.`);
    }
  }

  // Quy tắc 3: Kiểm tra chênh lệch điều chỉnh tối đa cho phép (20% số tiền gốc)
  public static validateAdjustmentLimit(originalAmount: number, adjustedAmount: number) {
    const diff = Math.abs(adjustedAmount - originalAmount);
    const limit = originalAmount * 0.20; // 20%
    if (diff > limit) {
      throw new Error(`Không thể thực hiện điều chỉnh: Số tiền điều chỉnh lệch vượt quá hạn mức tối đa cho phép (20% giá trị gốc: ${limit.toLocaleString()} đ).`);
    }
  }

  // Quy tắc 4: Kiểm tra trạng thái của phiếu quyết toán có hợp lệ để điều chỉnh hay không
  public static validateCanAdjust(settlement: Settlement) {
    if (settlement.state === "completed") {
      throw new Error("Không thể điều chỉnh: Phiếu quyết toán này đã hoàn tất thanh toán chi trả quỹ.");
    }
  }
}
