// Data access layer for Inventory-Accounting Bridge
// File: src/features/accounting/repository/inventoryBridgeRepository.ts

import { InventoryTransaction, InventoryAccountMap } from "../domain/bridgeTypes.ts";
import { db } from "../../../db/index.ts";

export interface IInventoryBridgeRepository {
  getTransactions(warehouseId?: string): Promise<InventoryTransaction[]>;
  saveTransaction(tx: InventoryTransaction): Promise<void>;
  getAccountMap(varietyId: string): Promise<InventoryAccountMap | null>;
  saveAccountMap(map: InventoryAccountMap): Promise<void>;
}

export class InventoryBridgeRepository implements IInventoryBridgeRepository {
  async getTransactions(warehouseId?: string): Promise<InventoryTransaction[]> {
    const list = await db.table("inventory_transactions").toArray();
    if (warehouseId) {
      return list.filter(item => item.warehouse_id === warehouseId);
    }
    return list;
  }

  async saveTransaction(tx: InventoryTransaction): Promise<void> {
    await db.table("inventory_transactions").put(tx);
    
    // Đồng bộ cập nhật số lượng tồn kho (current_stock_kg) thực tế trong bảng warehouses
    const warehouse = await db.warehouses.get(tx.warehouse_id);
    if (warehouse) {
      let delta = tx.quantity_kg;
      if (tx.transaction_type === "out_drying_loss" || tx.transaction_type === "out_sale") {
        delta = -tx.quantity_kg;
      }
      warehouse.current_stock_kg = Math.max(0, warehouse.current_stock_kg + delta);
      await db.warehouses.put(warehouse);
    }
  }

  async getAccountMap(varietyId: string): Promise<InventoryAccountMap | null> {
    // Trả về mặc định nếu chưa lưu
    const map = await db.table("inventory_account_maps").get(varietyId);
    if (!map) {
      return {
        rice_variety_id: varietyId,
        account_code_raw: "1521", // 1521: Lúa tươi
        account_code_dry: "1522"  // 1522: Lúa khô sấy
      };
    }
    return map;
  }

  async saveAccountMap(map: InventoryAccountMap): Promise<void> {
    await db.table("inventory_account_maps").put(map);
  }
}

export const inventoryBridgeRepo = new InventoryBridgeRepository();
export default inventoryBridgeRepo;
