// Drying Operation Rules Engine
// File: src/features/drying/domain/rulesEngine.ts

export class DryingRulesEngine {
  public static readonly MIN_STORAGE_MOISTURE = 13.0;
  public static readonly MAX_STORAGE_MOISTURE = 15.5;

  // Kiểm tra độ ẩm mục tiêu có đạt chuẩn bảo quản an toàn hay không
  public static validateTargetMoisture(moisture: number) {
    if (moisture < this.MIN_STORAGE_MOISTURE || moisture > this.MAX_STORAGE_MOISTURE) {
      throw new Error(`Độ ẩm mục tiêu (${moisture}%) không đạt tiêu chuẩn an toàn lưu kho (${this.MIN_STORAGE_MOISTURE}% - ${this.MAX_STORAGE_MOISTURE}%).`);
    }
  }

  // Kiểm tra điều kiện bắt đầu sấy lúa
  public static checkStartDryingConditions(currentTemp: number, initialMoisture: number) {
    if (initialMoisture <= this.MIN_STORAGE_MOISTURE) {
      throw new Error(`Độ ẩm lúa tươi (${initialMoisture}%) đã đủ khô để lưu kho, không cần chạy sấy lò.`);
    }
    if (currentTemp > 45) {
      throw new Error(`Lò sấy đang quá nóng (${currentTemp}°C). Hãy hạ nhiệt về mức an toàn trước khi nạp mẻ lúa mới.`);
    }
  }
}
