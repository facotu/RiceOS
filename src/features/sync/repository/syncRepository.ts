// Cloud Sync Queue Repository (Dexie Offline First)
// File: src/features/sync/repository/syncRepository.ts

import { db } from "../../../db/index.ts";
import { SyncQueueItem, SyncConflict } from "../domain/syncTypes.ts";

export class SyncRepository {
  async getQueue(): Promise<SyncQueueItem[]> {
    return await db.table("sync_queue").toArray();
  }

  async addToQueue(item: Omit<SyncQueueItem, 'id'>): Promise<number> {
    return await db.table("sync_queue").add(item);
  }

  async removeFromQueue(id: number): Promise<void> {
    await db.table("sync_queue").delete(id);
  }

  async getConflicts(): Promise<SyncConflict[]> {
    return await db.table("sync_conflicts").toArray();
  }

  async saveConflict(conflict: SyncConflict): Promise<void> {
    await db.table("sync_conflicts").put(conflict);
  }
}
export default SyncRepository;
