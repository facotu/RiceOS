import Dexie, { Table } from "https://esm.sh/dexie@3.2.4";

// Khai báo các Interface cho IndexedDB
export interface LocalFarmer {
  id: string;
  full_name: string;
  phone_number: string;
  address?: string;
  is_active: number; // 1: true, 0: false
}

export interface LocalVariety {
  id: string;
  name: string;
}

export interface LocalWarehouse {
  id: string;
  name: string;
  capacity_kg: number;
  current_stock_kg: number;
}

export interface LocalReceipt {
  id: string; // Tự sinh uuid offline hoặc nhận uuid tạm
  receipt_number: string;
  crop_season_id: string;
  farmer_id: string;
  rice_variety_id: string;
  weighing_officer_id: string;
  truck_plate: string;
  gross_weight: number;
  tare_weight?: number;
  moisture_percent: number;
  trash_percent: number;
  status: 'pending_warehouse' | 'pending_tare' | 'pending_settlement' | 'settled';
  created_at: string;
  synced: number; // 0: Chưa đồng bộ, 1: Đã đồng bộ
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
  rice_varieties!: Table<LocalVariety>;
  warehouses!: Table<LocalWarehouse>;
  weighing_receipts!: Table<LocalReceipt>;
  sync_queue!: Table<SyncQueueItem>;

  constructor() {
    super("RiceOS_LocalDB");
    this.version(1).stores({
      farmers: "id, full_name, phone_number",
      rice_varieties: "id, name",
      warehouses: "id, name",
      trucks: "id, plate_number",
      weighing_receipts: "id, receipt_number, farmer_id, status, synced",
      settlements: "id, receipt_id, farmer_id, state",
      payment_transactions: "id, settlement_id, payment_method",
      ledger_entries: "id, settlement_id, account_code",
      accounting_periods: "id, organization_id, is_locked",
      payment_reconciliations: "id, payment_transaction_id, status",
      settlement_adjustments: "id, settlement_id, adjusted_by",
      coa_nodes: "code, name, type",
      cost_centers: "id, code, name",
      profit_centers: "id, code, name",
      inventory_transactions: "id, warehouse_id, rice_variety_id, transaction_type",
      inventory_account_maps: "rice_variety_id, account_code_raw",
      silos: "id, warehouse_id, status",
      rice_batches: "id, silo_id, status",
      inventory_movements: "id, silo_id, movement_type",
      drying_orders: "id, silo_id, status",
      drying_results: "id, order_id",
      drying_sensor_logs: "id, order_id",
      drying_alerts: "id, order_id, alert_type",
      drying_operation_logs: "id, dryingOrderId, operator, action",
      drying_batch_cards: "id, dryingOrderId, status",
      rice_trace_batches: "id, batchCode, farmerId, status",
      iot_devices: "id, deviceCode, status",
      sync_conflicts: "id, tableName, recordId, resolved",
      executive_kpis: "id, updatedAt",
      business_insights: "id, category, severity",
      alerts: "id, category, severity, resolved",
      ai_context_cache: "id, updatedAt",
      audit_logs: "id, timestamp, userId, action",
      notifications: "id, severity, read, hidden, created_at",
      executive_dashboard_cache: "id, updatedAt",
      business_insight_cache: "id, updatedAt",
      alert_cache: "id, updatedAt",
      vehicles: "id, plateNumber, status",
      drivers: "id, fullName, status",
      trips: "id, tripCode, vehicleId, status",
      trip_logs: "id, tripId",
      fuel_logs: "id, vehicleId, date",
      maintenance_logs: "id, vehicleId, type, date",
      pickup_locations: "id, farmerName",
      delivery_records: "id, tripId",
      proof_of_delivery: "id, tripId",
      logistics_dashboard_cache: "id, updatedAt",
      sync_queue: "++id, action, timestamp"
    });
  }
}

export const db = new RiceOSDatabase();
export default db;
