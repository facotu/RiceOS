// Enterprise Cache Layer Manager
// File: src/core/cache/cacheManager.ts

import { db } from "../../db/index.ts";

export class CacheManager {
  public static async set(storeName: string, id: string, data: any): Promise<void> {
    await db.table(storeName).put({
      id,
      data,
      updatedAt: new Date().toISOString()
    });
  }

  public static async get<T>(storeName: string, id: string): Promise<T | null> {
    const item = await db.table(storeName).get(id);
    return item ? (item.data as T) : null;
  }

  public static async clear(storeName: string): Promise<void> {
    await db.table(storeName).clear();
  }

  // Clear all caches
  public static async clearAllCaches(): Promise<void> {
    await this.clear("executive_dashboard_cache");
    await this.clear("business_insight_cache");
    await this.clear("ai_context_cache");
    await this.clear("alert_cache");
  }
}
export default CacheManager;
