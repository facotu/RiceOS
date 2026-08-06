// AI Context Builder gathering ERP metrics for edge/cloud LLM model queries
// File: src/features/ai/services/aiContextBuilder.ts

import { db } from "../../../db/index.ts";
import { AIExecutionContext } from "../domain/aiTypes.ts";

export class AIContextBuilder {
  // Biên soạn bối cảnh dữ liệu hệ thống thời gian thực (Context Snapshot)
  public static async buildERPContext(): Promise<string> {
    const silos = await db.table("silos").toArray();
    const receipts = await db.table("weighing_receipts").toArray();
    const settlements = await db.table("settlements").toArray();
    const activeOrders = await db.table("drying_orders").filter(o => o.status === "active").toArray();

    const totalRawWeight = receipts.reduce((acc, r) => acc + (r.net_weight_kg || 0), 0);
    const totalSiloStock = silos.reduce((acc, s) => acc + (s.current_stock_kg || 0), 0);
    const totalSettled = settlements.reduce((acc, s) => acc + s.total_amount, 0);

    const context: AIExecutionContext = {
      totalSilosCount: silos.length,
      totalActiveDryers: activeOrders.length,
      avgMoisturePercent: 14.1,
      totalOwedAmount: totalSettled,
      expectedProfit: totalSiloStock * 2500,
      activeVariety: "J02"
    };

    // Cache context snapshot
    await db.table("ai_context_cache").put({
      id: "latest_context",
      data: JSON.stringify(context),
      updatedAt: new Date().toISOString()
    });

    return JSON.stringify(context, null, 2);
  }

  // Giả lập xử lý trả lời của LLM cục bộ dựa trên Context
  public static async answerQuestion(query: string): Promise<string> {
    await this.buildERPContext();
    const cleanQuery = query.toLowerCase();

    if (cleanQuery.includes("bao nhiêu lúa j02") || cleanQuery.includes("tồn kho")) {
      const silos = await db.table("silos").toArray();
      const j02Stock = silos.reduce((acc, s) => acc + (s.current_stock_kg || 0), 0);
      return `BÁO CÁO TRỢ LÝ: HTX hiện còn ${j02Stock.toLocaleString()} kg lúa khô J02 lưu chứa an toàn tại các Silo sấy. Trạng thái chất lượng: TỐT.`;
    }

    if (cleanQuery.includes("giá vốn") || cleanQuery.includes("avg cost")) {
      return "BÁO CÁO TRỢ LÝ: Giá vốn bình quân lúa J02 vụ Đông Xuân đạt 8.000 đ/kg chưa bao gồm phân bổ giá thành trấu đốt lò sấy.";
    }

    if (cleanQuery.includes("lò sấy nào đang chạy") || cleanQuery.includes("lò sấy")) {
      const activeOrders = await db.table("drying_orders").filter(o => o.status === "active").toArray();
      if (activeOrders.length === 0) {
        return "BÁO CÁO TRỢ LÝ: Hiện không có lò sấy nào đang chạy sấy nóng dở dang.";
      }
      return `BÁO CÁO TRỢ LÝ: Có ${activeOrders.length} lò sấy đang chạy sấy nóng (Lò sấy Silo sấy A01) xử lý mẻ giống lúa J02.`;
    }

    if (cleanQuery.includes("dự báo dòng tiền") || cleanQuery.includes("dòng tiền")) {
      return "BÁO CÁO TRỢ LÝ: Quỹ HTX hiện còn 450.000.000 VNĐ khả dụng. Dòng tiền tháng 8/2026 dự toán dư nợ an toàn do công nợ mua lúa đã được quyết toán.";
    }

    if (cleanQuery.includes("xe nào đang rảnh") || cleanQuery.includes("xe rảnh")) {
      const vehicles = await db.table("vehicles").filter(v => v.status === "available").toArray();
      if (vehicles.length === 0) return "BÁO CÁO TRỢ LÝ: Tất cả phương tiện đội xe hiện đang có chuyến vận chuyển lúa.";
      const plates = vehicles.map(v => `${v.plateNumber} (${v.type})`).join(", ");
      return `BÁO CÁO TRỢ LÝ: Hiện có ${vehicles.length} xe đang rảnh sẵn sàng điều phối: ${plates}.`;
    }

    if (cleanQuery.includes("bao nhiêu chuyến") || cleanQuery.includes("số chuyến")) {
      const trips = await db.table("trips").toArray();
      return `BÁO CÁO TRỢ LÝ: Hôm nay đội xe đã và đang thực hiện tổng cộng ${trips.length} chuyến vận chuyển lúa tươi từ ruộng về HTX.`;
    }

    if (cleanQuery.includes("nhiên liệu") || cleanQuery.includes("chi phí xăng dầu")) {
      return "BÁO CÁO TRỢ LÝ: Chi phí nhiên liệu vận tải bình quân đạt 18-22 Lít/100km. Tổng chi ngân sách dầu diezel tuần này đạt 12.500.000 VNĐ.";
    }

    if (cleanQuery.includes("xe nào nên bảo dưỡng") || cleanQuery.includes("bảo dưỡng")) {
      return "BÁO CÁO TRỢ LÝ: Xe tải 43C-145.89 đã chạy >90 ngày từ đợt bảo dưỡng trước. Đề xuất đưa vào xưởng kiểm tra dầu máy và hệ thống phanh.";
    }

    return "BÁO CÁO TRỢ LÝ: Tôi chưa tìm thấy dữ liệu phù hợp trong ngữ cảnh ERP của trạm thu mua Hòa Tiến 2. Vui lòng hỏi lại.";
  }
}
export default AIContextBuilder;
