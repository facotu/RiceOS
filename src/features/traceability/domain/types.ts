// Traceability Domain Types & Entities (DDD)
// File: src/features/traceability/domain/types.ts

export type TraceBatchStatus = 'HARVEST' | 'WEIGHING' | 'SETTLEMENT' | 'DRYING' | 'STORAGE' | 'SALE';

// Thực thể lô lúa truy xuất nguồn gốc (Rice Trace Batch)
export interface RiceTraceBatch {
  id: string;
  batchCode: string; // Định dạng: HTX-[Variety]-[YYYYMMDD]-[Index] (Ví dụ: HTX-J02-20260806-0001)
  farmerId: string;
  weighingSessionId: string;
  riceVariety: string;
  freshWeightKg: number;
  moistureInput: number;
  dryingBatchId?: string;
  dryWeightKg?: number;
  siloId?: string;
  qualityGrade: 'A' | 'B' | 'C';
  status: TraceBatchStatus;
  createdAt: string;
}
