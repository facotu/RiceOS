// Dashboard Repository Layer for RiceOS
// File: src/features/dashboard/repository/dashboardRepository.ts

export interface DashboardStats {
  totalSảnLượngKg: number;
  đãCânHômNayKg: number;
  siloSấyTấn: number;
  tổngChiThanhToán: number;
  xeĐangChờ: number;
}

export interface ActivityLog {
  id: string;
  time: string;
  message: string;
  module: string;
  status: string;
}

export interface IDashboardRepository {
  fetchStats(orgId: string): Promise<DashboardStats>;
  fetchRecentActivities(orgId: string): Promise<ActivityLog[]>;
}

export class DashboardRepository implements IDashboardRepository {
  // Thực tế sẽ gọi API `/api/v1/report/summary` hoặc query IndexedDB local
  async fetchStats(orgId: string): Promise<DashboardStats> {
    // Trả về cấu trúc dữ liệu thô từ database
    return {
      totalSảnLượngKg: 345670,
      đãCânHômNayKg: 14500,
      siloSấyTấn: 115,
      tổngChiThanhToán: 2760000000,
      xeĐangChờ: 5
    };
  }

  async fetchRecentActivities(orgId: string): Promise<ActivityLog[]> {
    return [
      { id: "ACT-001", time: "10:14", message: "Trạm cân: Đã hoàn tất cân tổng xe tải 43C-123.45", module: "weighing", status: "Đã cân" },
      { id: "ACT-002", time: "09:30", message: "Kế toán: Phê duyệt thanh toán cho chủ ruộng Nguyễn Văn An", module: "accounting", status: "Đã chi" },
      { id: "ACT-003", time: "08:45", message: "Thủ kho: Đã nạp 10.2 Tấn lúa sấy vào Silo A", module: "warehouse", status: "Nhập kho" }
    ];
  }
}
