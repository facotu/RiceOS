// Master Data Repository Layer for RiceOS
// File: src/features/master-data/repository/masterDataRepository.ts

import { db } from "../../../db/index.ts";

export interface MasterFarmer {
  id: string;
  organization_id: string;
  full_name: string;
  phone_number: string;
  address?: string;
  is_active: number;
}

export interface MasterVariety {
  id: string;
  name: string;
  description?: string;
}

export interface MasterWarehouse {
  id: string;
  name: string;
  capacity_kg: number;
  current_stock_kg: number;
}

export interface MasterPrice {
  id: string;
  rice_variety_id: string;
  price_buy: number;
  price_sell: number;
  valid_from: string;
}

export class MasterDataRepository {
  // --- FARMERS CRUD ---
  async getFarmers(): Promise<MasterFarmer[]> {
    return db.farmers.toArray();
  }

  async addFarmer(farmer: Omit<MasterFarmer, "id">): Promise<string> {
    const id = crypto.randomUUID();
    await db.farmers.add({ id, ...farmer });
    return id;
  }

  async updateFarmer(id: string, farmer: Partial<MasterFarmer>): Promise<void> {
    await db.farmers.update(id, farmer);
  }

  // --- VARIETIES CRUD ---
  async getVarieties(): Promise<MasterVariety[]> {
    return db.rice_varieties.toArray();
  }

  async addVariety(variety: Omit<MasterVariety, "id">): Promise<string> {
    const id = crypto.randomUUID();
    await db.rice_varieties.add({ id, ...variety });
    return id;
  }

  // --- WAREHOUSES CRUD ---
  async getWarehouses(): Promise<MasterWarehouse[]> {
    return db.warehouses.toArray();
  }

  async addWarehouse(warehouse: Omit<MasterWarehouse, "id">): Promise<string> {
    const id = crypto.randomUUID();
    await db.warehouses.add({ id, ...warehouse });
    return id;
  }
}

export const masterDataRepo = new MasterDataRepository();
export default masterDataRepo;
