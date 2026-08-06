// Accounting Governance Service Layer (DDD Domain Service)
// File: src/features/accounting/services/accountingGovernanceService.ts

import { accountingGovRepo } from "../repository/accountingGovernanceRepository.ts";
import { FinancialValidationEngine } from "../domain/validationEngine.ts";
import { AccountNode, CostCenter, ProfitCenter, AccountingDimensions } from "../domain/governanceTypes.ts";
import { LedgerEntry } from "../domain/types.ts";

export class AccountingGovernanceService {
  // 1. Thêm tài khoản mới có kiểm duyệt định dạng mã
  async createAccount(code: string, name: string, type: any): Promise<void> {
    if (!/^\d+$/.test(code)) {
      throw new Error("Mã tài khoản phải là chữ số nguyên dương (VAS Standard).");
    }
    if (!name.trim()) throw new Error("Tên tài khoản không được để trống.");

    await accountingGovRepo.addAccount({
      code,
      name,
      type,
      is_active: 1
    });
  }

  // 2. Thêm trung tâm chi phí (Cost Center) mới
  async createCostCenter(code: string, name: string, orgId: string, desc?: string): Promise<void> {
    if (!code.trim()) throw new Error("Mã trung tâm chi phí không được để trống.");
    if (!name.trim()) throw new Error("Tên trung tâm chi phí không được để trống.");

    await accountingGovRepo.addCostCenter({
      id: crypto.randomUUID(),
      code: code.toUpperCase(),
      name,
      description: desc,
      organization_id: orgId
    });
  }

  // 3. Chạy bộ kiểm định tài chính đa chiều đối với danh sách bút toán (Audit Dimension Validation)
  async validateFinancialEntries(entries: LedgerEntry[], dims: AccountingDimensions): Promise<void> {
    // 3.1. Kiểm tra tính cân đối của bút toán Nợ/Có kép
    const debitTotal = entries.filter(e => e.entry_type === "debit").reduce((sum, e) => sum + e.amount, 0);
    const creditTotal = entries.filter(e => e.entry_type === "credit").reduce((sum, e) => sum + e.amount, 0);
    FinancialValidationEngine.validateDoubleEntryBalance(debitTotal, creditTotal);

    // 3.2. Kiểm tra chiều phân tích cho từng tài khoản đầu chi phí/doanh thu
    entries.forEach(e => {
      FinancialValidationEngine.validateDimensions(e.account_code, dims);
    });
  }

  // 4. Liên kết phân bổ giá vốn kho sấy lúa (Warehouse Inventory Costing Ready)
  calculateUnitCost(totalCost: number, totalDryWeightKg: number): number {
    if (totalDryWeightKg <= 0) return 0;
    // Giá vốn lúa khô sấy = Tổng chi phí thu mua / Tổng sản lượng khô thu hoạch
    return Math.round(totalCost / totalDryWeightKg);
  }
}

export const accountingGovService = new AccountingGovernanceService();
export default accountingGovService;
