// User Role & Account Types
export type UserRole = 'admin' | 'editor' | 'view';
export type AccountStatus = 'active' | 'pending' | 'disabled';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: AccountStatus;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

// Master Data Types
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  cccd: string;
  cccd_issue_date: string;
  cccd_issue_place: string;
  cccd_expiry_date?: string;
  field_name: string; // Xứ đồng
  plot_no: string;    // Lô
  plot_id?: string;   // ID Lô ruộng liên kết
  area_sao: number;   // Diện tích (sào)
  variety_code?: string; // Giống lúa đang trồng
  estimated_yield_ton?: number; // Sản lượng dự kiến (tấn)
  harvest_status?: 'pending' | 'harvesting' | 'completed';
}

export interface Officer {
  id: string;
  full_name: string;
  phone: string;
  email: string;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  driver_name: string;
  driver_phone: string;
  status: 'active' | 'full' | 'loading';
  current_fresh_kg?: number;
  current_bags?: number;
  officer_name?: string;
  start_time?: string;
  end_time?: string;
}

export interface RiceVariety {
  id: string;
  code: string; // HG12, HG244, HT1, ĐT100, J02
  name: string;
  default_price: number;
}

// Field & Plot GIS Type with Google Maps Coordinates
export interface FieldPlot {
  id: string;
  field_name: string;    // Xứ đồng (VD: Xứ đồng An Trạch 1)
  plot_no: string;       // Mã Lô (VD: Lô A2)
  address: string;       // Địa chỉ cụ thể
  lat: number;           // Vĩ độ Google Maps (e.g. 15.9625)
  lng: number;           // Kinh độ Google Maps (e.g. 108.2045)
  zoom_level?: number;
  area_total_sao: number; // Tổng diện tích Lô (sào)
  main_variety: string;   // Giống lúa chủ đạo (HT1, J02, v.v.)
  status: 'harvesting' | 'waiting' | 'completed';
  description?: string;
  farmers_count?: number; // Số hộ sản xuất thuộc lô
}

// Push Notification Type
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'weighing' | 'user' | 'vehicle' | 'system';
}

// Weighing Code Entry Row (Individual scale code within a session)
export interface WeighingRow {
  id: string;
  time: string;
  bag_count: number;
  fresh_kg: number;
  tare_kg: number;
  dry_kg: number;
  price_per_kg: number;
  subtotal: number;
}

// Full Weighing Session
export interface WeighingSession {
  id: string;
  code: string; // e.g. PC-2026-088
  session_date: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  field_name: string;
  plot_no: string;
  officer_id: string;
  officer_name: string;
  vehicle_id: string;
  vehicle_plate: string;
  variety_code: string;
  variety_name: string;
  rows: WeighingRow[];
  total_bags: number;
  total_fresh_kg: number;
  tare_formula: 'percent' | 'kg_fixed';
  tare_value: number; // e.g. 5.0% or 1.2kg/bag
  total_tare_kg: number;
  total_dry_kg: number;
  price_per_kg: number;
  total_amount: number;
  advance_payment: number;
  remaining_payment: number;
  status: 'draft' | 'completed' | 'settled';
  notes?: string;
}

// System Settings Configuration
export interface SystemSettings {
  tare_formula: 'percent' | 'kg_fixed';
  default_tare_percent: number; // e.g. 5.0%
  default_tare_fixed_kg: number; // e.g. 1.2 kg/bag
  variety_prices: Record<string, number>;
  fields_plots: FieldPlot[];
}
