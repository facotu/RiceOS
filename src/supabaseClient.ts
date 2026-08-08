import { createClient } from '@supabase/supabase-js';
import { UserProfile, SystemSettings, AppNotification, Farmer } from './types';

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

// Master Farmers list mapped to plots
export const SAMPLE_FARMERS: Farmer[] = [
  {
    id: 'f-01',
    name: 'Nguyễn Văn Bình',
    phone: '0914.123.456',
    cccd: '048092001234',
    cccd_issue_date: '15/05/2021',
    cccd_issue_place: 'Cục CSQLHC về TTXH',
    cccd_expiry_date: '15/05/2036',
    field_name: 'Xứ đồng An Trạch 1',
    plot_no: 'Lô A2',
    plot_id: 'fp-1',
    area_sao: 12.5,
    variety_code: 'HT1',
    estimated_yield_ton: 7.5,
    harvest_status: 'harvesting'
  },
  {
    id: 'f-02',
    name: 'Trần Văn Cường',
    phone: '0988.765.432',
    cccd: '048095005678',
    cccd_issue_date: '20/10/2020',
    cccd_issue_place: 'Công an TP Đà Nẵng',
    cccd_expiry_date: '20/10/2035',
    field_name: 'Xứ đồng Hòa Tiến',
    plot_no: 'Lô B',
    plot_id: 'fp-2',
    area_sao: 18.0,
    variety_code: 'J02',
    estimated_yield_ton: 11.2,
    harvest_status: 'harvesting'
  },
  {
    id: 'f-03',
    name: 'Lê Thị Mai',
    phone: '0905.888.999',
    cccd: '048188009999',
    cccd_issue_date: '10/01/2022',
    cccd_issue_place: 'Cục CSQLHC về TTXH',
    cccd_expiry_date: '10/01/2037',
    field_name: 'Xứ đồng Đa Phước 3',
    plot_no: 'Lô C',
    plot_id: 'fp-3',
    area_sao: 15.0,
    variety_code: 'HG12',
    estimated_yield_ton: 9.0,
    harvest_status: 'waiting'
  },
  {
    id: 'f-04',
    name: 'Phạm Văn Hùng',
    phone: '0913.777.888',
    cccd: '048096001122',
    cccd_issue_date: '05/04/2019',
    cccd_issue_place: 'Công an TP Đà Nẵng',
    cccd_expiry_date: '05/04/2034',
    field_name: 'Xứ đồng An Trạch 1',
    plot_no: 'Lô A2',
    plot_id: 'fp-1',
    area_sao: 10.0,
    variety_code: 'HT1',
    estimated_yield_ton: 6.0,
    harvest_status: 'harvesting'
  },
  {
    id: 'f-05',
    name: 'Võ Thị Hồng',
    phone: '0935.444.555',
    cccd: '048192003344',
    cccd_issue_date: '12/08/2022',
    cccd_issue_place: 'Cục CSQLHC về TTXH',
    cccd_expiry_date: '12/08/2037',
    field_name: 'Xứ đồng Hòa Tiến',
    plot_no: 'Lô B',
    plot_id: 'fp-2',
    area_sao: 14.5,
    variety_code: 'J02',
    estimated_yield_ton: 8.8,
    harvest_status: 'completed'
  }
];

// Default System Settings with Google Maps Plot Coordinates & Polygon Boundaries
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
    {
      id: 'fp-1',
      field_name: 'Xứ đồng An Trạch 1',
      plot_no: 'Lô A2',
      address: 'Thôn An Trạch, Xã Hòa Tiến, Huyện Hòa Vang, Đà Nẵng',
      lat: 15.9625,
      lng: 108.2045,
      polygon_coords: [
        { lat: 15.9632, lng: 108.2040 },
        { lat: 15.9636, lng: 108.2052 },
        { lat: 15.9619, lng: 108.2058 },
        { lat: 15.9614, lng: 108.2043 }
      ],
      area_total_sao: 22.5,
      area_total_ha: 1.125,
      main_variety: 'HT1',
      status: 'harvesting',
      description: 'Cánh đồng bãi bồi đất phù sa chuyên canh lúa chất lượng cao HT1',
      farmers_count: 2
    },
    {
      id: 'fp-2',
      field_name: 'Xứ đồng Hòa Tiến',
      plot_no: 'Lô B',
      address: 'Thôn La Bông, Xã Hòa Tiến, Huyện Hòa Vang, Đà Nẵng',
      lat: 15.9712,
      lng: 108.1988,
      polygon_coords: [
        { lat: 15.9722, lng: 108.1980 },
        { lat: 15.9726, lng: 108.1996 },
        { lat: 15.9704, lng: 108.2001 },
        { lat: 15.9701, lng: 108.1983 }
      ],
      area_total_sao: 32.5,
      area_total_ha: 1.625,
      main_variety: 'J02',
      status: 'harvesting',
      description: 'Cánh đồng mẫu lớn liên kết sản xuất gạo Nhật J02 xuất khẩu',
      farmers_count: 2
    },
    {
      id: 'fp-3',
      field_name: 'Xứ đồng Đa Phước 3',
      plot_no: 'Lô C',
      address: 'Thôn Đa Phước, Xã Hòa Nhơn, Huyện Hòa Vang, Đà Nẵng',
      lat: 15.9550,
      lng: 108.2110,
      polygon_coords: [
        { lat: 15.9558, lng: 108.2102 },
        { lat: 15.9562, lng: 108.2118 },
        { lat: 15.9542, lng: 108.2122 },
        { lat: 15.9538, lng: 108.2105 }
      ],
      area_total_sao: 15.0,
      area_total_ha: 0.75,
      main_variety: 'HG12',
      status: 'waiting',
      description: 'Vùng thu mua lúa thuần HG12 chuẩn bị thu hoạch đợt 2',
      farmers_count: 1
    }
  ]
};

// Initial App Notifications
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n-1', title: 'Phiên cân mới', message: 'Cán bộ Đoàn Thị Ngọc Phương vừa hoàn thành phiên cân #PC-2026-088 cho hộ Nguyễn Văn Bình (140 bao - 7.000kg tươi).', timestamp: '11:15 Hôm nay', read: false, type: 'weighing' },
  { id: 'n-2', title: 'Xe đã đầy tải', message: 'Xe 43C-123.45 đã nhận đủ 490 bao lúa tươi (24.500kg). Chuẩn bị xuất phát.', timestamp: '10:45 Hôm nay', read: false, type: 'vehicle' },
  { id: 'n-3', title: 'Vùng trồng Google Maps', message: 'Hệ thống vừa cập nhật tọa độ khoanh vùng ranh giới Lô A2 (Xứ đồng An Trạch 1) trên bản đồ Google Maps.', timestamp: '09:00 Hôm nay', read: true, type: 'system' }
];
