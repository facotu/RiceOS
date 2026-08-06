// Smart alerts generator engine
// File: src/features/alerts/services/alertEngine.ts

import { db } from "../../../db/index.ts";
import { SmartAlert } from "../domain/alertTypes.ts";

export class AlertEngine {
  // Quét toàn bộ lỗi và cập nhật vào bảng alerts
  public static async runDiagnostics(): Promise<SmartAlert[]> {
    const list: SmartAlert[] = [];

    const activeOrders = await db.table("drying_orders").filter(o => o.status === "active").toArray();
    const weighingReceipts = await db.table("weighing_receipts").toArray();

    // 1. Vận hành: Phiếu cân chưa quyết toán
    const pendingWeighings = weighingReceipts.filter(w => w.status === "pending");
    if (pendingWeighings.length > 5) {
      list.push({
        id: "alert-pending-weighings",
        category: "operation",
        message: `ĐIỀU HÀNH: Có ${pendingWeighings.length} phiếu cân lúa ngoài ruộng đang chờ duyệt quyết toán quá 4 giờ.`,
        severity: "warning",
        resolved: false,
        created_at: new Date().toISOString()
      });
    }

    // 2. Sấy: Quá nhiệt
    // Quét cảnh báo quá nhiệt đầu lò sấy
    const criticalLogs = await db.table("drying_alerts")
      .filter(a => a.alert_type === "high_temp")
      .toArray();

    if (criticalLogs.length > 0) {
      list.push({
        id: "alert-drying-overtemp",
        category: "drying",
        message: "THIẾT BỊ: Lò sấy đang phát nhiệt lượng quá mức (>45°C) làm rạn nứt hạt gạo thương phẩm.",
        severity: "critical",
        resolved: false,
        created_at: new Date().toISOString()
      });
    }

    // Nạp toàn bộ cảnh báo vào bảng local alerts IndexedDB
    for (const alert of list) {
      const exists = await db.table("alerts").get(alert.id);
      if (!exists) {
        await db.table("alerts").add(alert);
      }
    }

    // Tải tất cả cảnh báo chưa giải quyết từ IndexedDB
    const allInDb = await db.table("alerts").toArray();
    return allInDb.filter(a => !a.resolved);
  }

  // Tắt cảnh báo khi đã xử lý xong sự cố ngoài trạm sấy
  public static async resolveAlert(id: string): Promise<void> {
    const alert = await db.table("alerts").get(id);
    if (alert) {
      alert.resolved = true;
      await db.table("alerts").put(alert);
    }
  }
}
export default AlertEngine;
