import { createClient } from '@supabase/supabase-js';
import { UserProfile, SystemSettings, AppNotification } from './types';

// Read Supabase environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://demo-riceos.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Default Demo User State
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@riceos.vn',
    full_name: 'Đoàn Thị Ngọc Phương',
    role: 'admin',
    status: 'active',
    phone: '0914.111.222',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-editor-01',
    email: 'canbo1@riceos.vn',
    full_name: 'Trần Văn Nam',
    role: 'editor',
    status: 'active',
    phone: '0905.333.444',
    created_at: '2026-01-02T00:00:00Z'
  },
  {
    id: 'usr-view-01',
    email: 'giamstat@riceos.vn',
    full_name: 'Lê Thị Thu',
    role: 'view',
    status: 'active',
    phone: '0988.555.666',
    created_at: '2026-01-03T00:00:00Z'
  }
];

// Default System Settings
export const DEFAULT_SETTINGS: SystemSettings = {
  tare_formula: 'percent',
  default_tare_percent: 5.0,
  default_tare_fixed_kg: 1.2,
  variety_prices: {
    'HT1': 8000,
    'HG12': 7500,
    'HG244': 7800,
    'ĐT100': 8200,
    'J02': 8500
  },
  fields_plots: [
    { id: 'fp-1', field_name: 'Xứ đồng An Trạch 1', plot_no: 'Lô A2', description: 'Đất phù sa bãi bồi' },
    { id: 'fp-2', field_name: 'Xứ đồng Hòa Tiến', plot_no: 'Lô B', description: 'Cánh đồng mẫu lớn' },
    { id: 'fp-3', field_name: 'Xứ đồng Đa Phước 3', plot_no: 'Lô C', description: 'Khu vực chuyên canh HT1' }
  ]
};

// Initial App Notifications
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n-1', title: 'Phiên cân mới', message: 'Cán bộ Đoàn Thị Ngọc Phương vừa hoàn thành phiên cân #PC-2026-088 cho hộ Nguyễn Văn Bình (140 bao - 7.000kg tươi).', timestamp: '11:15 Hôm nay', read: false, type: 'weighing' },
  { id: 'n-2', title: 'Xe đã đầy tải', message: 'Xe 43C-123.45 đã nhận đủ 490 bao lúa tươi (24.500kg). Chuẩn bị xuất phát.', timestamp: '10:45 Hôm nay', read: false, type: 'vehicle' },
  { id: 'n-3', title: 'Tài khoản mới', message: 'Cán bộ Trần Văn Nam đã kích hoạt tài khoản Editor thành công.', timestamp: '09:00 Hôm nay', read: true, type: 'user' }
];
