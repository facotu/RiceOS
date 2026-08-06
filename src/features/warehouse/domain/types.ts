// Warehouse & Silo Domain Entities (DDD)
// File: src/features/warehouse/domain/types.ts

export type SiloStatus = 'idle' | 'drying' | 'completed';
export type RiceBatchStatus = 'raw' | 'drying' | 'dry';
export type MovementType = 'in_raw' | 'out_loss' | 'out_dry';

// Aggregate: Kho bãi vật lý
export interface Warehouse {
  id: string;
  organization_id: string;
  name: string;
  location?: string;
}

// Entity: Silo sấy lúa công nghệ cao
export interface Silo {
  id: string;
  warehouse_id: string;
  name: string; // Ví dụ: Silo sấy A
  capacity_kg: number;
  current_stock_kg: number;
  status: SiloStatus;
  current_temp_celsius: number; // Nhiệt độ thực tế lò sấy
  current_moisture_percent: number; // Độ ẩm thực tế của lúa
}

// Aggregate Root: Theo dõi Lô lúa thu mua (Rice Batch Tracking)
export interface RiceBatch {
  id: string;
  silo_id: string;
  rice_variety_id: string;
  farmer_id: string;
  quantity_kg: number;
  initial_moisture_percent: number;
  target_moisture_percent: number;
  status: RiceBatchStatus;
  created_at: string;
}

// Value Object: Giao dịch chuyển đổi kho lúa (Inventory Movement Core)
export interface InventoryMovement {
  id: string;
  silo_id: string;
  batch_id: string;
  movement_type: MovementType;
  quantity_kg: number;
  operator: string;
  created_at: string;
}
