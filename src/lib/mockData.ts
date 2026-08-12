import {
  Farmer,
  StaffMember,
  Truck,
  RiceVariety,
  GrowingArea,
  WeighingSession,
  Profile,
  Settlement
} from '@/types/database.types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr-admin-01',
    full_name: 'Phạm Văn Admin (Quản trị viên)',
    phone: '0905111222',
    role: 'admin',
    is_active: true,
    status: 'active',
    email: 'admin@riceos.vn',
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'usr-staff-01',
    full_name: 'Phạm Văn Hùng (Cán bộ cân 1)',
    phone: '0988111222',
    role: 'staff',
    is_active: true,
    status: 'active',
    email: 'hung.canbo@riceos.vn',
    created_at: '2026-08-02T08:00:00Z',
  },
  {
    id: 'usr-staff-02',
    full_name: 'Trần Văn Nam (Cán bộ cân 2)',
    phone: '0905333444',
    role: 'staff',
    is_active: true,
    status: 'active',
    email: 'nam.canbo@riceos.vn',
    created_at: '2026-08-03T08:00:00Z',
  },
  {
    id: 'usr-pending-01',
    full_name: 'Lê Văn Mới (Chờ duyệt kích hoạt)',
    phone: '0914888999',
    role: 'staff',
    is_active: false,
    status: 'pending',
    email: 'levanmoi.new@gmail.com',
    created_at: '2026-08-12T10:00:00Z',
  },
  {
    id: 'usr-editor-01',
    full_name: 'Nguyễn Văn Editor (Biên tập viên)',
    phone: '0977333444',
    role: 'editor',
    is_active: true,
    status: 'active',
    email: 'editor@riceos.vn',
    created_at: '2026-08-03T08:00:00Z',
  },
  {
    id: 'usr-viewer-01',
    full_name: 'Trần Thị Viewer (Xem báo cáo)',
    phone: '0914999888',
    role: 'viewer',
    is_active: true,
    status: 'active',
    email: 'viewer@riceos.vn',
    created_at: '2026-08-04T08:00:00Z',
  }
];

export const INITIAL_FARMERS: Farmer[] = [
  {
    id: 'fm-01',
    name: 'Phạm Văn Bình',
    phone: '0905123456',
    cccd: '048092001122',
    cccd_date: '2021-05-10',
    cccd_place: 'Công an TP. Đà Nẵng',
    cccd_expiry: '2031-05-10',
    field_region: 'Xứ đồng An Trạch 1',
    lot: 'Lô A1',
    area: 5000,
    created_at: '2026-08-05T08:00:00Z',
  },
  {
    id: 'fm-02',
    name: 'Nguyễn Thị Mai',
    phone: '0914987654',
    cccd: '048185003344',
    cccd_date: '2020-08-15',
    cccd_place: 'Công an TP. Đà Nẵng',
    cccd_expiry: '2030-08-15',
    field_region: 'Xứ đồng An Trạch 2',
    lot: 'Lô B2',
    area: 7500,
    created_at: '2026-08-06T08:00:00Z',
  },
  {
    id: 'fm-03',
    name: 'Trần Văn Hùng',
    phone: '0935555777',
    cccd: '048088009988',
    cccd_date: '2019-12-01',
    cccd_place: 'Công an Quảng Nam',
    cccd_expiry: '2029-12-01',
    field_region: 'Xứ đồng Hòa Tiến',
    lot: 'Lô C3',
    area: 10000,
    created_at: '2026-08-07T08:00:00Z',
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'stf-01',
    user_id: 'usr-staff-01',
    full_name: 'Cán Bộ Cân Phạm Văn Hùng',
    phone: '0988111222',
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'stf-02',
    user_id: 'usr-staff-02',
    full_name: 'Cán Bộ Cân Trần Văn Nam',
    phone: '0905333444',
    created_at: '2026-08-02T08:00:00Z',
  }
];

export const INITIAL_TRUCKS: Truck[] = [
  {
    id: 'trk-01',
    driver_name: 'Nguyễn Văn Tải',
    license_plate: '92C-123.45',
    phone: '0905999888',
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'trk-02',
    driver_name: 'Trần Quốc Xe',
    license_plate: '43H-678.90',
    phone: '0914333222',
    created_at: '2026-08-02T08:00:00Z',
  }
];

export const INITIAL_VARIETIES: RiceVariety[] = [
  {
    id: 'var-01',
    code: 'ST25',
    name: 'Lúa ST25 Thơm Thượng Hạng',
    default_price: 9500,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'var-02',
    code: 'OM18',
    name: 'Lúa OM18 Chất Lượng Cao',
    default_price: 8200,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'var-03',
    code: 'DT8',
    name: 'Lúa Đài Thơm 8',
    default_price: 8500,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'var-04',
    code: 'IR50404',
    name: 'Lúa IR50404',
    default_price: 7800,
    created_at: '2026-08-01T08:00:00Z',
  }
];

export const INITIAL_GROWING_AREAS: GrowingArea[] = [
  {
    id: 'area-01',
    field_region: 'Xứ đồng An Trạch 1',
    lot: 'Lô A1',
    area: 5000,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'area-02',
    field_region: 'Xứ đồng An Trạch 2',
    lot: 'Lô B2',
    area: 7500,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'area-03',
    field_region: 'Xứ đồng Hòa Tiến',
    lot: 'Lô C3',
    area: 10000,
    created_at: '2026-08-01T08:00:00Z',
  }
];

export const INITIAL_SESSIONS: WeighingSession[] = [
  {
    id: 'ses-01',
    session_code: 'PC-20260812-001',
    farmer_id: 'fm-01',
    staff_id: 'stf-01',
    truck_id: 'trk-01',
    variety_id: 'var-01',
    field_region: 'Xứ đồng An Trạch 1',
    lot: 'Lô A1',
    total_fresh_weight: 1250,
    total_tare_weight: 150,
    total_dry_weight: 1100,
    total_bags: 25,
    unit_price: 9500,
    total_amount: 10450000,
    status: 'completed',
    started_at: '2026-08-12T07:30:00Z',
    completed_at: '2026-08-12T08:45:00Z',
    notes: 'Phiên cân riêng của Phạm Văn Hùng (Cán bộ 1)',
    created_by: 'usr-staff-01',
    farmer: INITIAL_FARMERS[0],
    staff: INITIAL_STAFF[0],
    truck: INITIAL_TRUCKS[0],
    variety: INITIAL_VARIETIES[0],
    items: [
      { id: 'itm-01', session_id: 'ses-01', sequence: 1, bag_count: 3, gross_weight: 150, tare_percent: 12, tare_weight: 18, net_weight: 132, weighed_at: '2026-08-12T07:35:00Z' },
      { id: 'itm-02', session_id: 'ses-01', sequence: 2, bag_count: 3, gross_weight: 152, tare_percent: 12, tare_weight: 18.24, net_weight: 133.76, weighed_at: '2026-08-12T07:42:00Z' }
    ]
  },
  {
    id: 'ses-02',
    session_code: 'PC-20260812-002',
    farmer_id: 'fm-02',
    staff_id: 'stf-01',
    truck_id: 'trk-01',
    variety_id: 'var-02',
    field_region: 'Xứ đồng An Trạch 2',
    lot: 'Lô B2',
    total_fresh_weight: 2100,
    total_tare_weight: 252,
    total_dry_weight: 1848,
    total_bags: 40,
    unit_price: 8200,
    total_amount: 15153600,
    status: 'completed',
    started_at: '2026-08-12T09:00:00Z',
    completed_at: '2026-08-12T10:30:00Z',
    notes: 'Phiên cân riêng của Phạm Văn Hùng (Cán bộ 1)',
    created_by: 'usr-staff-01',
    farmer: INITIAL_FARMERS[1],
    staff: INITIAL_STAFF[0],
    truck: INITIAL_TRUCKS[0],
    variety: INITIAL_VARIETIES[1],
    items: []
  },
  {
    id: 'ses-03',
    session_code: 'PC-20260812-003',
    farmer_id: 'fm-03',
    staff_id: 'stf-02',
    truck_id: 'trk-02',
    variety_id: 'var-03',
    field_region: 'Xứ đồng Hòa Tiến',
    lot: 'Lô C3',
    total_fresh_weight: 3100,
    total_tare_weight: 372,
    total_dry_weight: 2728,
    total_bags: 60,
    unit_price: 8500,
    total_amount: 23188000,
    status: 'completed',
    started_at: '2026-08-12T11:00:00Z',
    completed_at: '2026-08-12T12:45:00Z',
    notes: 'Phiên cân riêng của Trần Văn Nam (Cán bộ 2)',
    created_by: 'usr-staff-02',
    farmer: INITIAL_FARMERS[2],
    staff: INITIAL_STAFF[1],
    truck: INITIAL_TRUCKS[1],
    variety: INITIAL_VARIETIES[2],
    items: []
  }
];

export const INITIAL_SETTLEMENTS: Settlement[] = [
  {
    id: 'set-01',
    settlement_code: 'QT-20260812-FM01',
    farmer_id: 'fm-01',
    total_dry_weight: 1100,
    total_amount: 10450000,
    paid_amount: 10450000,
    status: 'completed',
    settled_at: '2026-08-12T14:00:00Z',
    notes: 'Đã thanh toán đủ chuyển khoản ngân hàng',
    created_by: 'usr-staff-01',
    farmer: INITIAL_FARMERS[0]
  }
];
