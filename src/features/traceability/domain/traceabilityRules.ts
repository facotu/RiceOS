// Traceability Domain Business Rules Engine
// File: src/features/traceability/domain/traceabilityRules.ts

import { RiceTraceBatch } from "./types.ts";

export class TraceabilityRules {
  // 1. Kiểm tra tính toàn vẹn nguồn gốc
  public static validateTracebatch(batch: RiceTraceBatch): void {
    if (!batch.farmerId) {
      throw new Error("Quy tắc truy xuất: Lô lúa không được phép mất liên kết với hộ nông dân.");
    }
    if (!batch.weighingSessionId) {
      throw new Error("Quy tắc truy xuất: Lô lúa không được phép mất liên kết với phiên cân đầu vào ruộng lúa.");
    }
    if (batch.dryWeightKg !== undefined && batch.dryWeightKg > batch.freshWeightKg) {
      throw new Error("Quy tắc truy xuất: Sản lượng lúa khô sau sấy không được phép lớn hơn sản lượng lúa tươi ban đầu.");
    }
  }

  // 2. Kiểm tra tính hợp lệ của Silo lưu trữ lúa khô
  public static validateSiloStorage(siloId: string, currentSiloId?: string): void {
    if (currentSiloId && currentSiloId !== siloId) {
      throw new Error("Quy tắc truy xuất: Một lô lúa khô chỉ được lưu chứa tại một Silo duy nhất tại cùng một thời điểm.");
    }
  }
}
export default TraceabilityRules;
