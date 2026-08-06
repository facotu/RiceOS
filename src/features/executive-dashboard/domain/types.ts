// Executive Dashboard Domain Types & Entities (DDD)
// File: src/features/executive-dashboard/domain/types.ts

export interface ExecutiveKPI {
  id: string;
  totalWeightRaw: number;      // Tổng sản lượng thu mua (kg)
  totalAmountBuy: number;      // Tổng giá trị mua (VNĐ)
  siloStockWeight: number;     // Sản lượng đang tồn silo (kg)
  avgCostPerKg: number;        // Giá vốn bình quân/kg
  dryingCostPerKg: number;     // Chi phí sấy/kg
  expectedProfit: number;      // Lợi nhuận dự kiến (VNĐ)
  farmerPayable: number;       // Công nợ nông dân (VNĐ)
  currentCashFlow: number;     // Dòng tiền hiện tại (VNĐ)
  updatedAt: string;
}
