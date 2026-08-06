// IoT Sensor Gateway routing MQTT payloads into RiceOS Event-Driven Architecture
// File: src/features/iot/services/sensorGateway.ts

import { MQTTAdapter } from "./mqttAdapter.ts";
import { db } from "../../../db/index.ts";

export class SensorGateway {
  public static initGateway() {
    // Đăng ký nhận gói tin cảm biến Silo từ Broker MQTT
    MQTTAdapter.subscribe("silo/+/sensor", async (topic, message) => {
      try {
        const parts = topic.split("/");
        const siloId = parts[1]; // e.g. "silo-001" or "silo-002"
        const data = JSON.parse(message);

        // 1. Cập nhật nhịp tim và trạng thái thiết bị cảm biến
        const devId = `device-${siloId}`;
        const device = await db.table("iot_devices").get(devId);
        if (device) {
          device.status = "online";
          device.lastHeartbeat = new Date().toISOString();
          await db.table("iot_devices").put(device);
        }

        // 2. Tìm lệnh sấy active tương ứng để đẩy tín hiệu cập nhật tức thời
        const activeOrder = await db.table("drying_orders")
          .filter(o => o.silo_id === siloId && o.status === "active")
          .first();

        if (activeOrder) {
          // Gửi CustomEvent chuẩn kiến trúc hướng sự kiện thời gian thực (Event-Driven)
          const reading = {
            orderId: activeOrder.id,
            temperature: parseFloat(data.temperature.toFixed(1)),
            moisture: parseFloat(data.humidity.toFixed(1)), // lúa sử dụng trường ẩm
            timestamp: new Date().toISOString()
          };

          const event = new CustomEvent("iot-sensor-update", { detail: reading });
          window.dispatchEvent(event);
        }
      } catch (err) {
        console.error("[GATEWAY] Lỗi biên dịch bản tin IoT cảm biến:", err);
      }
    });
  }
}
export default SensorGateway;
