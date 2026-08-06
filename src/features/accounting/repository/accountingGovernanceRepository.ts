// Accounting Governance Repository Layer
// File: src/features/accounting/repository/accountingGovernanceRepository.ts

import { AccountNode, CostCenter, ProfitCenter } from "../domain/governanceTypes.ts";
import { db } from "../../../db/index.ts";

export interface IAccountingGovernanceRepository {
  getAccounts(): Promise<AccountNode[]>;
  addAccount(account: AccountNode): Promise<void>;
  
  getCostCenters(orgId: string): Promise<CostCenter[]>;
  addCostCenter(cc: CostCenter): Promise<void>;

  getProfitCenters(orgId: string): Promise<ProfitCenter[]>;
  addProfitCenter(pc: ProfitCenter): Promise<void>;
}

export class AccountingGovernanceRepository implements IAccountingGovernanceRepository {
  // --- CHART OF ACCOUNTS (COA) ---
  async getAccounts(): Promise<AccountNode[]> {
    // Seed tài khoản chuẩn kế toán VN (VAS) nếu trống
    const count = await db.table("coa_nodes").count();
    if (count === 0) {
      const seedAccounts: AccountNode[] = [
        { code: "1111", name: "Tiền mặt tại quỹ HTX", type: "asset", is_active: 1 },
        { code: "1121", name: "Tiền gửi ngân hàng", type: "asset", is_active: 1 },
        { code: "152", name: "Nguyên liệu vật liệu (Lúa gạo)", type: "asset", is_active: 1 },
        { code: "331", name: "Phải trả nông dân", type: "liability", is_active: 1 },
        { code: "511", name: "Doanh thu bán gạo sấy", type: "revenue", is_active: 1 },
        { code: "632", name: "Giá vốn lúa gạo bán", type: "expense", is_active: 1 }
      ];
      for (const node of seedAccounts) {
        await db.table("coa_nodes").add(node);
      }
    }
    return db.table("coa_nodes").toArray();
  }

  async addAccount(account: AccountNode): Promise<void> {
    await db.table("coa_nodes").put(account);
  }

  // --- COST CENTERS ---
  async getCostCenters(orgId: string): Promise<CostCenter[]> {
    // Seed trung tâm chi phí mẫu nếu trống
    const count = await db.table("cost_centers").count();
    if (count === 0) {
      await db.table("cost_centers").add({
        id: "cc-dry-a",
        code: "CC-DRY-A",
        name: "Lò sấy lúa Hòa Tiến - Lò A",
        description: "Trung tâm theo dõi chi phí lò sấy lúa A",
        organization_id: orgId
      });
    }
    const list = await db.table("cost_centers").toArray();
    return list.filter(item => item.organization_id === orgId);
  }

  async addCostCenter(cc: CostCenter): Promise<void> {
    await db.table("cost_centers").put(cc);
  }

  // --- PROFIT CENTERS ---
  async getProfitCenters(orgId: string): Promise<ProfitCenter[]> {
    const list = await db.table("profit_centers").toArray();
    return list.filter(item => item.organization_id === orgId);
  }

  async addProfitCenter(pc: ProfitCenter): Promise<void> {
    await db.table("profit_centers").put(pc);
  }
}

export const accountingGovRepo = new AccountingGovernanceRepository();
export default accountingGovRepo;
