-- Seed Data for HTX Nông nghiệp Hòa Tiến 2
-- File: supabase/seed.sql

-- 1. Tạo tổ chức HTX Nông nghiệp Hòa Tiến 2
INSERT INTO public.organizations (id, name, address, phone_number, tax_code, settings)
VALUES (
    'org-hoatien2-uuid-1111-2222-333333333333',
    'Hợp tác xã Nông nghiệp Hòa Tiến 2',
    'Xã Hòa Tiến, Huyện Hòa Vang, Thành phố Đà Nẵng',
    '02363846123',
    '0400123456',
    '{"moisture_standard": 14.0, "moisture_deduction_rate": 0.015, "trash_standard": 1.0, "trash_deduction_rate": 0.01, "auto_approve_limit": 50000000}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. Tạo danh mục giống lúa dùng chung
INSERT INTO public.rice_varieties (id, name, description) VALUES
('variety-om18-uuid-1111-2222-333333333333', 'OM18', 'Lúa thơm chất lượng cao, hạt dài, cơm dẻo nhẹ, kháng sâu bệnh tốt.'),
('variety-dt8-uuid-1111-2222-333333333333', 'Đài Thơm 8', 'Giống lúa thuần chất lượng cao, hạt gạo trong, không bạc bụng, cơm thơm ngon.'),
('variety-ir504-uuid-1111-2222-333333333333', 'IR504', 'Lúa hạt tròn, năng suất cao, cơm khô xốp phù hợp làm bột hoặc chế biến thức ăn.')
ON CONFLICT (name) DO NOTHING;

-- 3. Tạo tài khoản người dùng cho HTX Hòa Tiến 2
INSERT INTO public.users (id, organization_id, full_name, phone_number, email, role, is_active) VALUES
-- Admin
('user-admin-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Phạm Tuân (Admin)', '0905111111', 'tuan.pv@hoatien2.com', 'admin', true),
-- Cán bộ cân
('user-weighing-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Nguyễn Văn Cân (Cán bộ cân)', '0905222222', 'can.nv@hoatien2.com', 'weighing_officer', true),
-- Thủ kho
('user-warehouse-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Lê Văn Kho (Thủ kho)', '0905333333', 'kho.lv@hoatien2.com', 'warehouse_keeper', true),
-- Kế toán
('user-accountant-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Trần Thị Toán (Kế toán)', '0905444444', 'toan.tt@hoatien2.com', 'accountant', true),
-- Giám đốc
('user-director-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Lê Hòa (Giám đốc HTX)', '0905555555', 'hoa.le@hoatien2.com', 'director', true)
ON CONFLICT (phone_number) DO NOTHING;

-- 4. Khởi tạo User Profiles và chữ ký
INSERT INTO public.user_profiles (id, avatar_url, signature_image_url, phone_secondary, ui_preferences) VALUES
('user-admin-uuid-1111-2222-333333333333', 'https://avatar.url/admin.jpg', NULL, NULL, '{"isLargeFont": false, "isDarkMode": false}'::jsonb),
('user-weighing-uuid-1111-2222-333333333333', 'https://avatar.url/cang.jpg', 'https://storage.hoatien2.com/signatures/can_signature.png', '0905999999', '{"isLargeFont": true, "isDarkMode": false}'::jsonb),
('user-warehouse-uuid-1111-2222-333333333333', 'https://avatar.url/kho.jpg', 'https://storage.hoatien2.com/signatures/kho_signature.png', NULL, '{"isLargeFont": false, "isDarkMode": false}'::jsonb),
('user-accountant-uuid-1111-2222-333333333333', 'https://avatar.url/toan.jpg', 'https://storage.hoatien2.com/signatures/toan_signature.png', NULL, '{"isLargeFont": false, "isDarkMode": false}'::jsonb),
('user-director-uuid-1111-2222-333333333333', 'https://avatar.url/director.jpg', 'https://storage.hoatien2.com/signatures/director_signature.png', NULL, '{"isLargeFont": false, "isDarkMode": false}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 5. Tạo danh mục nông dân
INSERT INTO public.farmers (id, organization_id, full_name, phone_number, address, bank_name, bank_account_number, bank_account_name, is_active) VALUES
('farmer-nguyena-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Nguyễn Văn An (Nông dân)', '0914000111', 'Thôn Lệ Sơn, Xã Hòa Tiến, Huyện Hòa Vang, Đà Nẵng', 'Agribank Vang Vang', '2004205123456', 'NGUYEN VAN AN', true),
('farmer-tranb-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Trần Văn Bình (Thương lái)', '0914000222', 'Thôn La Bông, Xã Hòa Tiến, Huyện Hòa Vang, Đà Nẵng', 'Vietcombank', '0041000123456', 'TRAN VAN BINH', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Tạo danh mục mùa vụ (Vụ Đông Xuân 2026)
INSERT INTO public.crop_seasons (id, organization_id, name, start_date, end_date, is_active)
VALUES (
    'season-dx2026-uuid-1111-2222-333333333333',
    'org-hoatien2-uuid-1111-2222-333333333333',
    'Vụ Đông Xuân 2026',
    '2026-08-01',
    '2026-09-30',
    true
) ON CONFLICT (id) DO NOTHING;

-- 7. Tạo danh mục Silo kho sấy chứa lúa
INSERT INTO public.warehouses (id, organization_id, name, capacity_kg, current_stock_kg, description) VALUES
('silo-a-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Silo Sấy Lúa A', 100000.00, 0.00, 'Silo sấy công suất lớn chuyên dùng lúa OM18.'),
('silo-b-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'Silo Sấy Lúa B', 100000.00, 0.00, 'Silo chuyên dùng lúa Đài Thơm 8.')
ON CONFLICT (id) DO NOTHING;

-- 8. Tạo danh mục xe tải chở lúa
INSERT INTO public.trucks (id, organization_id, plate_number, owner_farmer_id, truck_type, tare_weight_default) VALUES
('truck-xe1-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', '43C-123.45', 'farmer-nguyena-uuid-1111-2222-333333333333', 'Xe tải 5 tấn', 3200.00),
('truck-xe2-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', '92H-567.89', 'farmer-tranb-uuid-1111-2222-333333333333', 'Xe tải 8 tấn', 4500.00)
ON CONFLICT (id) DO NOTHING;

-- 9. Tạo bảng giá lúa ngày (Vụ Đông Xuân 2026 ngày 06/08/2026)
INSERT INTO public.price_configurations (id, organization_id, rice_variety_id, price_per_kg, effective_date) VALUES
('price-om18-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'variety-om18-uuid-1111-2222-333333333333', 8000.00, '2026-08-06'),
('price-dt8-uuid-1111-2222-333333333333', 'org-hoatien2-uuid-1111-2222-333333333333', 'variety-dt8-uuid-1111-2222-333333333333', 8500.00, '2026-08-06')
ON CONFLICT (id) DO NOTHING;
