// Drying Calculation Engine for moisture loss and cost accounting
// File: src/features/drying/domain/calculationEngine.ts

export class DryingCalculationEngine {
  // 1. Tính khối lượng lúa khô dự kiến dựa trên tỷ lệ bốc hơi nước ẩm tiêu chuẩn
  // Công thức: W_dry = W_raw * (100 - M_raw) / (100 - M_dry)
  public static calculateDryWeight(
    rawWeightKg: number,
    initialMoisture: number,
    targetMoisture: number
  ): number {
    if (initialMoisture <= targetMoisture) return rawWeightKg;
    if (targetMoisture >= 100) return 0;
    
    const dryWeight = rawWeightKg * (100 - initialMoisture) / (100 - targetMoisture);
    return Math.round(dryWeight);
  }

  // 2. Tính thể tích nước bốc hơi (lít/kg) thoát ra từ lò sấy
  public static calculateWaterEvaporated(rawWeightKg: number, dryWeightKg: number): number {
    return Math.max(0, rawWeightKg - dryWeightKg);
  }

  // 3. Tính toán chi phí vận hành lò sấy dựa trên số giờ chạy thực tế
  public static calculateOperationCosts(
    runHours: number,
    fuelRatePerHour: number = 85000,      // Chi phí trấu sấy/dầu chạy máy phát lò sấy
    electricityRatePerHour: number = 25000, // Điện năng quạt thổi
    laborRatePerHour: number = 35000       // Nhân công trực lò sấy
  ) {
    const totalFuel = runHours * fuelRatePerHour;
    const totalElectricity = runHours * electricityRatePerHour;
    const totalLabor = runHours * laborRatePerHour;
    
    return {
      totalFuel,
      totalElectricity,
      totalLabor,
      totalCost: totalFuel + totalElectricity + totalLabor
    };
  }
}
