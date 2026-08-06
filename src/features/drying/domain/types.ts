// Drying Operation Domain Types & Models (DDD)
// File: src/features/drying/domain/types.ts

export type DryingOrderStatus = 'active' | 'completed' | 'cancelled';

// Aggregate Root: Lệnh sấy lúa
export interface DryingOrder {
  id: string;
  silo_id: string;
  batch_id: string;
  start_time: string;
  end_time?: string;
  initial_weight_kg: number;
  initial_moisture_percent: number;
  status: DryingOrderStatus;
  operator: string;
}

// Entity: Kết quả sấy lúa & Chi phí vận hành lò
export interface DryingResult {
  id: string;
  order_id: string;
  final_weight_kg: number;
  final_moisture_percent: number;
  drying_loss_kg: number;
  water_evaporated_liters: number;
  total_fuel_cost: number;
  total_electricity_cost: number;
  total_labor_cost: number;
  total_drying_cost: number;
  completed_at: string;
}

// Value Object: Nhật ký cảm biến lò sấy (IoT Sensor Log)
export interface DryingSensorLog {
  id: string;
  order_id: string;
  timestamp: string;
  temperature_celsius: number;
  moisture_percent: number;
  ambient_humidity_percent?: number;
}
