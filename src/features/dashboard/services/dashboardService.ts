// Dashboard Service Layer for RiceOS
// File: src/features/dashboard/services/dashboardService.ts

import { IDashboardRepository, DashboardStats, ActivityLog } from "../repository/dashboardRepository.ts";

export interface FormattedDashboardStats {
  totalSảnLượngText: string;
  đãCânHômNayText: string;
  siloSấyPercentText: string;
  tổngChiThanhToánText: string;
  xeĐangChờText: string;
  siloSấyRaw: number;
}

export class DashboardService {
  private repository: IDashboardRepository;

  constructor(repository: IDashboardRepository) {
    this.repository = repository;
  }

  // Lấy chỉ số KPIs đã định dạng hiển thị cho giao diện
  async getStatsForUI(orgId: string): Promise<FormattedDashboardStats> {
    const raw = await this.repository.fetchStats(orgId);
    
    return {
      totalSảnLượngText: `${raw.totalSảnLượngKg.toLocaleString("vi-VN")} kg`,
      đãCânHômNayText: `${raw.đãCânHômNayKg.toLocaleString("vi-VN")} kg`,
      siloSấyPercentText: `${((raw.siloSấyTấn / 200) * 100).toFixed(1)}%`,
      tổngChiThanhToánText: `${(raw.tổngChiThanhToán / 1000000000).toFixed(2)} tỷ VNĐ`,
      xeĐangChờText: `${raw.xeĐangChờ} xe`,
      siloSấyRaw: raw.siloSấyTấn
    };
  }

  // Lấy danh sách hoạt động
  async getRecentActivities(orgId: string): Promise<ActivityLog[]> {
    return this.repository.fetchRecentActivities(orgId);
  }
}
