// Drying operation IndexedDB Repository
// File: src/features/drying/repository/dryingRepository.ts

import { DryingOrder, DryingResult, DryingSensorLog } from "../domain/types.ts";
import { db } from "../../../db/index.ts";

export interface IDryingRepository {
  getOrders(): Promise<DryingOrder[]>;
  getOrderById(id: string): Promise<DryingOrder | null>;
  saveOrder(order: DryingOrder): Promise<void>;
  
  getResults(): Promise<DryingResult[]>;
  saveResult(result: DryingResult): Promise<void>;

  getSensorLogs(orderId: string): Promise<DryingSensorLog[]>;
  saveSensorLog(log: DryingSensorLog): Promise<void>;
}

export class DryingRepository implements IDryingRepository {
  async getOrders(): Promise<DryingOrder[]> {
    return db.table("drying_orders").toArray();
  }

  async getOrderById(id: string): Promise<DryingOrder | null> {
    const item = await db.table("drying_orders").get(id);
    return item || null;
  }

  async saveOrder(order: DryingOrder): Promise<void> {
    await db.table("drying_orders").put(order);
  }

  async getResults(): Promise<DryingResult[]> {
    return db.table("drying_results").toArray();
  }

  async saveResult(result: DryingResult): Promise<void> {
    await db.table("drying_results").put(result);
  }

  async getSensorLogs(orderId: string): Promise<DryingSensorLog[]> {
    const list = await db.table("drying_sensor_logs").toArray();
    return list.filter(log => log.order_id === orderId);
  }

  async saveSensorLog(log: DryingSensorLog): Promise<void> {
    await db.table("drying_sensor_logs").put(log);
  }
}

export const dryingRepo = new DryingRepository();
export default dryingRepo;
