// IoT Sensor Simulator Service (MQTT ready event dispatcher)
// File: src/features/drying/services/sensorSimulatorService.ts

export interface SensorReading {
  orderId: string;
  temperature: number;
  moisture: number;
  timestamp: string;
}

export class SensorSimulatorService {
  private static intervals: Record<string, number> = {};

  // Khởi chạy vòng lặp giả lập đẩy log cảm biến (tương tự sub MQTT topic)
  public static startSimulation(
    orderId: string, 
    initialMoisture: number, 
    onReading: (reading: SensorReading) => void
  ) {
    if (this.intervals[orderId]) return;

    let currentMoisture = initialMoisture;
    let tickCount = 0;

    const intervalId = setInterval(() => {
      tickCount++;
      // Nhiệt độ lò sấy dao động tự nhiên quanh mức 39°C - 43°C
      let temp = 40 + Math.sin(tickCount) * 2;
      
      // Giả lập thỉnh thoảng nhiệt độ vượt ngưỡng an toàn (quá nhiệt >45°C) để test cảnh báo
      if (tickCount % 12 === 0) {
        temp = 46.5; 
      }

      // Độ ẩm giảm dần 0.1% mỗi lần quét
      currentMoisture = Math.max(13.0, currentMoisture - 0.1);

      const reading: SensorReading = {
        orderId,
        temperature: parseFloat(temp.toFixed(1)),
        moisture: parseFloat(currentMoisture.toFixed(1)),
        timestamp: new Date().toISOString()
      };

      // Phát sự kiện CustomEvent cho kiến trúc hướng sự kiện (Event-driven)
      const event = new CustomEvent("iot-sensor-update", { detail: reading });
      window.dispatchEvent(event);

      onReading(reading);
    }, 3000) as any;

    this.intervals[orderId] = intervalId;
  }

  public static stopSimulation(orderId: string) {
    if (this.intervals[orderId]) {
      clearInterval(this.intervals[orderId]);
      delete this.intervals[orderId];
    }
  }
}
export default SensorSimulatorService;
