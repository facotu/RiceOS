export type UserRole = 'admin' | 'editor' | 'viewer' | 'staff';
export type UserStatus = 'pending' | 'active' | 'blocked';

export interface Profile {
  id: string; // references auth.users
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  status?: UserStatus;
  email?: string;
  created_at: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  cccd: string;
  cccd_date?: string;
  cccd_place?: string;
  cccd_expiry?: string;
  field_region: string; // Xứ đồng
  lot: string; // Lô
  area: number; // Diện tích (m2 hoặc ha)
  created_at: string;
}

export interface StaffMember {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  created_at: string;
}

export interface Truck {
  id: string;
  driver_name: string;
  license_plate: string;
  phone: string;
  created_at: string;
}

export interface RiceVariety {
  id: string;
  code: string;
  name: string;
  default_price: number;
  created_at: string;
}

export interface GrowingArea {
  id: string;
  field_region: string;
  lot: string;
  area: number;
  created_at: string;
}

export type SessionStatus = 'in_progress' | 'completed' | 'settled';

export interface WeighingSession {
  id: string;
  session_code: string;
  farmer_id: string;
  staff_id: string;
  truck_id: string;
  variety_id: string;
  field_region: string;
  lot: string;
  total_fresh_weight: number; // kg lúa tươi
  total_tare_weight: number;  // kg trừ bì
  total_dry_weight: number;   // kg lúa khô
  total_bags: number;         // tổng số bao
  unit_price: number;         // đơn giá mua
  total_amount: number;       // thành tiền (VND)
  status: SessionStatus;
  started_at: string;
  completed_at?: string;
  notes?: string;
  created_by?: string;        // ID người dùng tạo phiên cân

  // Joined relations
  farmer?: Farmer;
  staff?: StaffMember;
  truck?: Truck;
  variety?: RiceVariety;
  items?: WeighingItem[];
}

export interface WeighingItem {
  id: string;
  session_id: string;
  sequence: number;     // Lần cân thứ
  bag_count: number;    // 1, 2 hoặc 3 bao
  gross_weight: number; // Kg lúa tươi lượt cân này
  tare_percent?: number;// Trừ bì %
  tare_weight: number;  // Trừ bì lượt cân này
  net_weight: number;   // Kg lúa khô lượt cân này
  weighed_at: string;
}

export interface Settlement {
  id: string;
  settlement_code: string;
  farmer_id: string;
  total_dry_weight: number;
  total_amount: number;
  paid_amount: number;
  status: 'pending' | 'completed';
  settled_at: string;
  notes?: string;
  created_by?: string;

  // Joined relations
  farmer?: Farmer;
}

export interface AppNotification {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}
