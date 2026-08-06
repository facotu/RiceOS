// MQTT Adapter for virtual broker connection
// File: src/features/iot/services/mqttAdapter.ts

export type MQTTCallback = (topic: string, message: string) => void;

export class MQTTAdapter {
  private static subscribers: Record<string, MQTTCallback[]> = {};
  private static isConnected = false;

  public static async connect(brokerUrl: string): Promise<boolean> {
    console.log(`[MQTT] Đang kết nối tới Broker: ${brokerUrl}...`);
    this.isConnected = true;
    return true;
  }

  public static subscribe(topic: string, callback: MQTTCallback): void {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(callback);
    console.log(`[MQTT] Đã đăng ký lắng nghe topic: ${topic}`);
  }

  public static publish(topic: string, payload: string): void {
    if (!this.isConnected) {
      console.warn("[MQTT] Không thể gửi bản tin: Chưa kết nối broker.");
      return;
    }
    const callbacks = this.subscribers[topic] || [];
    callbacks.forEach(cb => cb(topic, payload));
  }
}
export default MQTTAdapter;
