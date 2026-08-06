// Executive Dashboard Repository (Dexie Offline First)
// File: src/features/executive-dashboard/repository/executiveDashboardRepository.ts

import { db } from "../../../db/index.ts";
import { ExecutiveKPI } from "../domain/types.ts";

export class ExecutiveDashboardRepository {
  async getKPIs(): Promise<ExecutiveKPI[]> {
    return await db.table("executive_kpis").toArray();
  }

  async getLatestKPI(): Promise<ExecutiveKPI | undefined> {
    const list = await this.getKPIs();
    return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  }

  async saveKPI(kpi: ExecutiveKPI): Promise<void> {
    await db.table("executive_kpis").put(kpi);
  }
}
export default ExecutiveDashboardRepository;
