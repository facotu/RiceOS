// Warehouse & Silo IndexedDB Repository Layer
// File: src/features/warehouse/repository/warehouseRepository.ts

import { Silo, RiceBatch, InventoryMovement } from "../domain/types.ts";
import { db } from "../../../db/index.ts";

export interface IWarehouseRepository {
  getSilos(orgId: string): Promise<Silo[]>;
  getSiloById(id: string): Promise<Silo | null>;
  saveSilo(silo: Silo): Promise<void>;
  
  getBatches(siloId?: string): Promise<RiceBatch[]>;
  saveBatch(batch: RiceBatch): Promise<void>;

  getMovements(siloId?: string): Promise<InventoryMovement[]>;
  saveMovement(movement: InventoryMovement): Promise<void>;
}

export class WarehouseRepository implements IWarehouseRepository {
  async getSilos(orgId: string): Promise<Silo[]> {
    // Seed silos mẫu nếu trống
    const count = await db.table("silos").count();
    if (count === 0) {
      await db.table("silos").add({
        id: "silo-001",
        warehouse_id: "wh-hoatien",
        name: "Lò sấy Silo A - Hòa Tiến",
        capacity_kg: 100000, // 100 Tấn
        current_stock_kg: 0,
        status: "idle",
        current_temp_celsius: 32,
        current_moisture_percent: 22.5
      });
      await db.table("silos").add({
        id: "silo-002",
        warehouse_id: "wh-hoatien",
        name: "Lò sấy Silo B - Hòa Tiến",
        capacity_kg: 120000, // 120 Tấn
        current_stock_kg: 0,
        status: "idle",
        current_temp_celsius: 31,
        current_moisture_percent: 21.0
      });
    }
    return db.table("silos").toArray();
  }

  async getSiloById(id: string): Promise<Silo | null> {
    const item = await db.table("silos").get(id);
    return item || null;
  }

  async saveSilo(silo: Silo): Promise<void> {
    await db.table("silos").put(silo);
  }

  async getBatches(siloId?: string): Promise<RiceBatch[]> {
    const list = await db.table("rice_batches").toArray();
    if (siloId) {
      return list.filter(b => b.silo_id === siloId);
    }
    return list;
  }

  async saveBatch(batch: RiceBatch): Promise<void> {
    await db.table("rice_batches").put(batch);
  }

  async getMovements(siloId?: string): Promise<InventoryMovement[]> {
    const list = await db.table("inventory_movements").toArray();
    if (siloId) {
      return list.filter(m => m.silo_id === siloId);
    }
    return list;
  }

  async saveMovement(movement: InventoryMovement): Promise<void> {
    await db.table("inventory_movements").put(movement);
  }
}

export const warehouseRepo = new WarehouseRepository();
export default warehouseRepo;
