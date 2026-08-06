// Drying Alert monitoring and notification service
// File: src/features/drying/services/dryingAlertService.ts

import { db } from "../../../db/index.ts";

export interface DryingAlert {
  id: string;
  order_id: string;
  alert_type: 'high_temp' | 'drying_complete' | 'sensor_disconnected';
  message: string;
  severity: 'warning' | 'critical' | 'info';
  created_at: string;
}

export class DryingAlertService {
  // Kiểm tra chỉ số cảm biến để phát sinh cảnh báo
  public static async analyzeReading(orderId: string, temp: number, moisture: number): Promise<DryingAlert | null> {
    let alertItem: Omit<DryingAlert, 'id' | 'created_at'> | null = null;

    if (temp > 45.0) {
      alertItem = {
        order_id: orderId,
        alert_type: 'high_temp',
        message: `CẢNH BÁO QUÁ NHIỆT: Lò sấy đang quá nóng (${temp}°C). Nguy cơ làm nứt hạt lúa!`,
        severity: 'critical'
      };
    } else if (moisture <= 14.0) {
      alertItem = {
        order_id: orderId,
        alert_type: 'drying_complete',
        message: `THÔNG BÁO: Mẻ lúa sấy đã đạt ẩm độ tiêu chuẩn (${moisture}%). Hãy tắt lò sấy.`,
        severity: 'info'
      };
    }

    if (alertItem) {
      const fullAlert: DryingAlert = {
        id: crypto.randomUUID(),
        ...alertItem,
        created_at: new Date().toISOString()
      };
      await db.table("drying_alerts").add(fullAlert);
      return fullAlert;
    }

    return null;
  }
}
export default DryingAlertService;
