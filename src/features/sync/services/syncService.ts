// Offline-First cloud synchronization engine with conflict resolution
// File: src/features/sync/services/syncService.ts

import { SyncRepository } from "../repository/syncRepository.ts";
import { SyncQueueItem, SyncConflict } from "../domain/syncTypes.ts";

export class SyncService {
  private repository: SyncRepository;
  private isOnline = true;

  constructor(repository: SyncRepository) {
    this.repository = repository;
  }

  // Cấu hình mô phỏng trạng thái mạng ngoại tuyến/trực tuyến
  public setOnlineStatus(online: boolean) {
    this.isOnline = online;
    console.log(`[ĐỒNG BỘ] Trạng thái mạng thay đổi: ${online ? "ONLINE" : "OFFLINE"}`);
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // 1. Đưa thao tác thay đổi vào hàng đợi khi offline
  async enqueueChange(tableName: string, payload: any, action: 'CREATE' | 'UPDATE' | 'DELETE'): Promise<void> {
    const item: Omit<SyncQueueItem, 'id'> = {
      action,
      tableName,
      payload,
      timestamp: new Date().toISOString(),
      attempts: 0
    };

    await this.repository.addToQueue(item);

    // Nếu đang trực tuyến, kích hoạt đồng bộ ngay lập tức
    if (this.isOnline) {
      await this.syncOfflineData();
    }
  }

  // 2. Kích hoạt đồng bộ các thay đổi cục bộ lên đám mây
  async syncOfflineData(): Promise<void> {
    if (!this.isOnline) {
      console.log("[ĐỒNG BỘ] Thiết bị đang OFFLINE, tạm hoãn đẩy hàng đợi.");
      return;
    }

    const queue = await this.repository.getQueue();
    if (queue.length === 0) return;

    console.log(`[ĐỒNG BỘ] Phát hiện ${queue.length} hành động trong hàng đợi. Đang tiến hành đẩy...`);

    for (const item of queue) {
      try {
        // Giả lập gửi request API lên PostgreSQL máy chủ
        console.log(`[ĐỒNG BỘ] Đang đẩy bảng ${item.tableName} [${item.action}]...`);
        
        // Mô phỏng tỷ lệ xảy ra xung đột nhỏ (Conflict simulation)
        if (item.tableName === "farmers" && item.payload.full_name.includes("Xung đột")) {
          const conflict: SyncConflict = {
            id: crypto.randomUUID(),
            tableName: item.tableName,
            recordId: item.payload.id || "1",
            localData: item.payload,
            serverData: { ...item.payload, full_name: `${item.payload.full_name} (Máy chủ)` },
            resolved: false
          };
          await this.repository.saveConflict(conflict);
          console.warn("[ĐỒNG BỘ] Phát hiện xung đột dữ liệu! Đã đưa vào danh mục giải quyết xung đột.");
        }

        if (item.id !== undefined) {
          await this.repository.removeFromQueue(item.id);
        }
      } catch (err) {
        console.error("[ĐỒNG BỘ] Lỗi đẩy bản ghi:", err);
      }
    }
  }

  // 3. Giải quyết xung đột dữ liệu (Conflict Resolution Strategy)
  async resolveConflict(conflictId: string, strategy: 'client_wins' | 'server_wins'): Promise<void> {
    const conflicts = await this.repository.getConflicts();
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    conflict.resolved = true;
    conflict.resolvedAt = new Date().toISOString();
    await this.repository.saveConflict(conflict);

    console.log(`[ĐỒNG BỘ] Đã giải quyết xung đột ${conflictId} theo chiến lược: ${strategy}`);
  }
}

export const syncService = new SyncService(new SyncRepository());
export default syncService;
