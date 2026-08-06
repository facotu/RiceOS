// Executive Dashboard Calculation Domain Service
// File: src/features/executive-dashboard/services/executiveDashboardService.ts

import { ExecutiveDashboardRepository } from "../repository/executiveDashboardRepository.ts";
import { ExecutiveKPI } from "../domain/types.ts";
import { db } from "../../../db/index.ts";

export class ExecutiveDashboardService {
  private repository: ExecutiveDashboardRepository;

  constructor(repository: ExecutiveDashboardRepository) {
    this.repository = repository;
  }

  // Tính toán động toàn bộ các chỉ số điều hành cấp cao từ database local
  async calculateKPIs(): Promise<ExecutiveKPI> {
    const receipts = await db.table("weighing_receipts").toArray();
    const silos = await db.table("silos").toArray();
    const settlements = await db.table("settlements").toArray();
    const payments = await db.table("payment_transactions").toArray();

    // 1. Tổng sản lượng lúa tươi và tổng giá trị mua
    const totalWeightRaw = receipts.reduce((acc, r) => acc + (r.net_weight_kg || 0), 0);
    const totalAmountBuy = receipts.reduce((acc, r) => acc + (r.total_amount || 0), 0);

    // 2. Sản lượng đang tồn trong các silo bảo quản lúa khô
    const siloStockWeight = silos.reduce((acc, s) => acc + (s.current_stock_kg || 0), 0);

    // 3. Giá vốn bình quân/kg (bình quân đơn giá lúa tươi mua ruộng + chi phí lò sấy)
    const avgCostPerKg = totalWeightRaw > 0 ? Math.round(totalAmountBuy / totalWeightRaw) : 8000;

    // 4. Chi phí sấy lò bình quân/kg
    const dryingCostPerKg = 320; // 320 VNĐ/kg lúa sấy bình quân

    // 5. Công nợ nông dân chưa quyết toán thanh toán
    const totalSettled = settlements.reduce((acc, s) => acc + s.total_amount, 0);
    const totalPaid = payments.filter(p => p.status === "success").reduce((acc, p) => acc + p.amount, 0);
    const farmerPayable = Math.max(0, totalSettled - totalPaid);

    // 6. Dòng tiền hiện hữu (Mô phỏng hạn mức quỹ HTX còn lại)
    const currentCashFlow = 450000000; // 450 Triệu VNĐ

    // 7. Lợi nhuận dự kiến (Chênh lệch giá bán kỳ vọng xuất khẩu - giá vốn)
    const expectedProfit = siloStockWeight * 2500; // Chênh lệch biên 2.500 VNĐ/kg

    const kpi: ExecutiveKPI = {
      id: crypto.randomUUID(),
      totalWeightRaw,
      totalAmountBuy,
      siloStockWeight,
      avgCostPerKg,
      dryingCostPerKg,
      expectedProfit,
      farmerPayable,
      currentCashFlow,
      updatedAt: new Date().toISOString()
    };

    await this.repository.saveKPI(kpi);
    return kpi;
  }
}
export default ExecutiveDashboardService;
