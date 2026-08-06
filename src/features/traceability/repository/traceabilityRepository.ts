// Traceability Repository (Dexie Offline First)
// File: src/features/traceability/repository/traceabilityRepository.ts

import { db } from "../../../db/index.ts";
import { RiceTraceBatch } from "../domain/types.ts";

export interface ITraceabilityRepository {
  getBatches(): Promise<RiceTraceBatch[]>;
  getBatchById(id: string): Promise<RiceTraceBatch | undefined>;
  getBatchByCode(code: string): Promise<RiceTraceBatch | undefined>;
  saveBatch(batch: RiceTraceBatch): Promise<void>;
  deleteBatch(id: string): Promise<void>;
}

export class TraceabilityRepository implements ITraceabilityRepository {
  async getBatches(): Promise<RiceTraceBatch[]> {
    return await db.table("rice_trace_batches").toArray();
  }

  async getBatchById(id: string): Promise<RiceTraceBatch | undefined> {
    return await db.table("rice_trace_batches").get(id);
  }

  async getBatchByCode(code: string): Promise<RiceTraceBatch | undefined> {
    return await db.table("rice_trace_batches").get({ batchCode: code });
  }

  async saveBatch(batch: RiceTraceBatch): Promise<void> {
    await db.table("rice_trace_batches").put(batch);
  }

  async deleteBatch(id: string): Promise<void> {
    await db.table("rice_trace_batches").delete(id);
  }
}
export default TraceabilityRepository;
