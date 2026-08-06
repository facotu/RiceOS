// Traceability Engine Domain Service
// File: src/features/traceability/services/traceabilityService.ts

import { ITraceabilityRepository } from "../repository/traceabilityRepository.ts";
import { RiceTraceBatch, TraceBatchStatus } from "../domain/types.ts";
import { TraceabilityRules } from "../domain/traceabilityRules.ts";

export class TraceabilityService {
  private repository: ITraceabilityRepository;

  constructor(repository: ITraceabilityRepository) {
    this.repository = repository;
  }

  // 1. Sinh mã lô lúa tự động (Ví dụ: HTX-J02-20260806-0001)
  private async generateBatchCode(variety: string): Promise<string> {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const all = await this.repository.getBatches();
    const countToday = all.filter(b => b.batchCode.includes(todayStr)).length + 1;
    const indexStr = String(countToday).padStart(4, "0");
    return `HTX-${variety}-${todayStr}-${indexStr}`;
  }

  // 2. Khởi tạo lô lúa truy xuất mới từ ruộng (HARVEST / WEIGHING)
  async createTraceBatch(
    farmerId: string,
    weighingSessionId: string,
    variety: string,
    weightKg: number,
    moisture: number
  ): Promise<string> {
    const id = crypto.randomUUID();
    const batchCode = await this.generateBatchCode(variety);

    const batch: RiceTraceBatch = {
      id,
      batchCode,
      farmerId,
      weighingSessionId,
      riceVariety: variety,
      freshWeightKg: weightKg,
      moistureInput: moisture,
      qualityGrade: moisture > 22.0 ? 'B' : 'A',
      status: 'WEIGHING',
      createdAt: new Date().toISOString()
    };

    TraceabilityRules.validateTracebatch(batch);
    await this.repository.saveBatch(batch);
    return id;
  }

  // 3. Cập nhật trạng thái chu kỳ vòng đời (State Transition)
  async updateLifecycle(id: string, nextStatus: TraceBatchStatus, data: Partial<RiceTraceBatch>): Promise<void> {
    const batch = await this.repository.getBatchById(id);
    if (!batch) throw new Error("Không tìm thấy lô lúa truy xuất.");

    const updated: RiceTraceBatch = {
      ...batch,
      ...data,
      status: nextStatus
    };

    TraceabilityRules.validateTracebatch(updated);
    await this.repository.saveBatch(updated);
  }
}
export default TraceabilityService;
