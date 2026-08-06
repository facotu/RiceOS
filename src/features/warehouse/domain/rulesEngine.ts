// Warehouse Safety & Calibration Rules Engine
// File: src/features/warehouse/domain/rulesEngine.ts

import { Silo } from "./types.ts";

export class WarehouseRulesEngine {
  // Ngưỡng nhiệt độ an toàn sấy lúa (Tránh nứt gãy hạt lúa, chuẩn tối đa 45 độ C)
  public static readonly MAX_SAFE_TEMPERATURE_CELSIUS = 45;

  // Độ ẩm lúa khô thành phẩm tiêu chuẩn (Đạt chuẩn bảo quản xuất khẩu)
  public static readonly STANDARD_DRY_MOISTURE_PERCENT = 14.0;

  // Kiểm tra Silo sấy có bị quá tải tải trọng hay không
  public static validateSiloCapacity(silo: Silo, addingWeightKg: number) {
    const total = silo.current_stock_kg + addingWeightKg;
    if (total > silo.capacity_kg) {
      throw new Error(`Cảnh báo an toàn lò sấy: Thêm ${addingWeightKg.toLocaleString()} kg vượt quá sức chứa tối đa của ${silo.name} (Tối đa: ${(silo.capacity_kg / 1000).toFixed(1)} Tấn).`);
    }
  }

  // Kiểm tra nhiệt độ sấy lò có vượt quá giới hạn an toàn hay không
  public static validateSiloTemperature(tempCelsius: number) {
    if (tempCelsius > this.MAX_SAFE_TEMPERATURE_CELSIUS) {
      throw new Error(`NGUY HIỂM HỎA HOẠN: Nhiệt độ sấy lò (${tempCelsius}°C) đã vượt quá ngưỡng an toàn tối đa cho phép (${this.MAX_SAFE_TEMPERATURE_CELSIUS}°C). Cần giảm ga/nhiệt ngay lập tức.`);
    }
  }
}
