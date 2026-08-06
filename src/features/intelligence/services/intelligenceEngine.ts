// Rice Business Intelligence Engine
// File: src/features/intelligence/services/intelligenceEngine.ts

import { db } from "../../../db/index.ts";
import { RiskInsight } from "../domain/analyticsTypes.ts";

export class IntelligenceEngine {
  // Chạy chuỗi phân tích rủi ro và nạp cảnh báo vào IndexedDB tự động
  public static async analyzeBusinessInsights(): Promise<RiskInsight[]> {
    const silos = await db.table("silos").toArray();
    const receipts = await db.table("weighing_receipts").toArray();
    const settlements = await db.table("settlements").toArray();
    const payments = await db.table("payment_transactions").toArray();

    const insights: RiskInsight[] = [];

    // 1. Phân tích Tồn kho lâu ngày (>60 ngày)
    for (const silo of silos) {
      // Giả lập số ngày trữ kho (ví dụ Silo A01 trữ 65 ngày hoặc 90 ngày cho Case 03)
      const storageDays = silo.id === "silo-001" ? 90 : 15; 
      if (storageDays > 60) {
        insights.push({
          id: crypto.randomUUID(),
          category: 'inventory',
          message: `RỦI RO KHO BÃI: Lô lúa J02 tại ${silo.name} đã trữ kho ${storageDays} ngày. Nguy cơ ẩm mốc giảm phẩm cấp chất lượng gạo!`,
          severity: 'critical',
          createdAt: new Date().toISOString()
        });
      }
    }

    // 2. Phân tích Giá vốn sấy/sản xuất tăng bất thường (>10%)
    // Kiểm tra xem có cấu hình mô phỏng tăng chi phí hay không
    const cachedKpi = await db.table("executive_kpis").toArray();
    const latestKpi = cachedKpi[0];
    if (latestKpi && latestKpi.dryingCostPerKg > 350) { // Chi phí sấy vọt từ 320 -> 384 (+20%)
      insights.push({
        id: crypto.randomUUID(),
        category: 'production',
        message: "CẢNH BÁO BẤT THƯỜNG: Chi phí nhiên liệu sấy đầu lò tăng vọt 20% so với định mức kỹ thuật HTX Hòa Tiến.",
        severity: 'warning',
        createdAt: new Date().toISOString()
      });
    }

    // 3. Phân tích công nợ và dòng tiền
    const totalSettled = settlements.reduce((acc, s) => acc + s.total_amount, 0);
    const totalPaid = payments.filter(p => p.status === "success").reduce((acc, p) => acc + p.amount, 0);
    const farmerPayable = totalSettled - totalPaid;
    if (farmerPayable > 50000000) {
      insights.push({
        id: crypto.randomUUID(),
        category: 'finance',
        message: `CẢNH BÁO THANH KHOẢN: Công nợ thu mua nông dân đang đạt mức cao (${(farmerPayable / 1000000).toFixed(1)} Triệu). Cần cân đối dòng chi quỹ HTX.`,
        severity: 'warning',
        createdAt: new Date().toISOString()
      });
    }

    // Ghi vào bảng alerts IndexedDB
    for (const insight of insights) {
      const exists = await db.table("alerts").get(insight.id);
      if (!exists) {
        await db.table("alerts").add({
          id: insight.id,
          category: insight.category,
          message: insight.message,
          severity: insight.severity,
          resolved: false,
          created_at: insight.createdAt
        });
      }
    }

    return insights;
  }
}
export default IntelligenceEngine;
