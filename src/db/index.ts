// IndexedDB Database Schema & Types for RiceOS
// File: src/db/index.ts

import Dexie, { Table } from "dexie";

// 1. Chủ ruộng (Farmer)
export interface LocalFarmer {
  id: string;
  full_name: string;
  phone_number: string;
  id_card_number?: string; // Số CCCD
  id_card_date?: string;   // Ngày cấp
  id_card_place?: string;  // Nơi cấp
  id_card_expiry?: string; // Ngày hết hạn
  field_location?: string; // Xứ đồng
  plot_number?: string;    // Lô
  area_size?: number;      // Diện tích (sào/ha)
  address?: string;
  is_active: number;
}

// 2. Cán bộ cân (Weighing Officer)
export interface LocalOfficer {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  role: 'admin' | 'editor' | 'view';
  is_active: number;
}

// 3. Xe nhận (Truck)
export interface LocalTruck {
  id: string;
  driver_name: string;
  plate_number: string;
  phone_number: string;
  is_active: number;
}

// 4. Giống lúa (Rice Variety)
export interface LocalVariety {
  id: string;
  code: 'HG12' | 'HG244' | 'HT1' | 'ĐT100' | 'J02' | string;
  name: string;
  unit_price: number;
}

// 5. Phiếu cân / Phiên cân (Weighing Session)
export interface WeighEntry {
  bags_count: number;
  gross_weight_kg: number;
}

export interface LocalReceipt {
  id: string;
  receipt_number: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  field_location: string;
  plot_number: string;
  officer_id: string;
  officer_name: string;
  truck_id: string;
  truck_plate: string;
  driver_name: string;
  variety_code: string;
  variety_name: string;
  entries: WeighEntry[];
  total_bags: number;
  total_fresh_kg: number;
  tare_type: 'kg' | 'percent';
  tare_value: number;
  total_dry_kg: number;
  unit_price: number;
  total_amount: number;
  start_time: string;
  end_time: string;
  status: 'pending_settlement' | 'settled';
  created_at: string;
  synced: number;
}

// 6. Cài đặt hệ thống (Settings)
export interface LocalSetting {
  id: string;
  tare_type: 'kg' | 'percent';
  default_tare_value: number;
  field_locations: string[];
  plots: string[];
  unit_prices: Record<string, number>;
}

export interface SyncQueueItem {
  id?: number;
  action: 'insert_receipt' | 'confirm_warehouse' | 'update_tare';
  payload: any;
  timestamp: string;
  retry_count: number;
}

// Khởi tạo Database Dexie
class RiceOSDatabase extends Dexie {
  farmers!: Table<LocalFarmer>;
  officers!: Table<LocalOfficer>;
  trucks!: Table<LocalTruck>;
  rice_varieties!: Table<LocalVariety>;
  weighing_receipts!: Table<LocalReceipt>;
  settings!: Table<LocalSetting>;
  sync_queue!: Table<SyncQueueItem>;

  constructor() {
    super("RiceOS_LocalDB");
    this.version(2).stores({
      farmers: "id, full_name, phone_number, field_location, plot_number",
      officers: "id, full_name, phone_number, role, email",
      trucks: "id, driver_name, plate_number",
      rice_varieties: "id, code, name",
      weighing_receipts: "id, receipt_number, farmer_id, officer_id, truck_id, variety_code, status, created_at",
      settings: "id",
      sync_queue: "++id, action, timestamp"
    });
  }
}

export const db = new RiceOSDatabase();
export default db;
