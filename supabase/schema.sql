-- ========================================================
-- RICE OS (HỆ THỐNG CÂN LÚA THÔNG MINH) - SUPABASE DATABASE SCHEMA
-- Execute this SQL script in Supabase SQL Editor
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User Roles & Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer', 'staff')) DEFAULT 'staff',
    is_active BOOLEAN DEFAULT true,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMERS TABLE (Chủ ruộng / Hộ sản xuất)
CREATE TABLE IF NOT EXISTS public.farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    cccd TEXT,
    cccd_date DATE,
    cccd_place TEXT,
    cccd_expiry DATE,
    field_region TEXT NOT NULL, -- Xứ đồng
    lot TEXT NOT NULL,          -- Lô
    area NUMERIC DEFAULT 0,     -- Diện tích (m2)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STAFF MEMBERS TABLE (Cán bộ cân)
CREATE TABLE IF NOT EXISTS public.staff_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRUCKS TABLE (Xe nhận)
CREATE TABLE IF NOT EXISTS public.trucks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_name TEXT NOT NULL,
    license_plate TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RICE VARIETIES TABLE (Giống lúa)
CREATE TABLE IF NOT EXISTS public.rice_varieties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    default_price NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GROWING AREAS TABLE (Vùng trồng)
CREATE TABLE IF NOT EXISTS public.growing_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_region TEXT NOT NULL,
    lot TEXT NOT NULL,
    area NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. WEIGHING SESSIONS TABLE (Phiên cân lúa)
CREATE TABLE IF NOT EXISTS public.weighing_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code TEXT NOT NULL UNIQUE,
    farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.staff_members(id) ON DELETE SET NULL,
    truck_id UUID REFERENCES public.trucks(id) ON DELETE SET NULL,
    variety_id UUID REFERENCES public.rice_varieties(id) ON DELETE SET NULL,
    field_region TEXT NOT NULL,
    lot TEXT NOT NULL,
    total_fresh_weight NUMERIC DEFAULT 0,
    total_tare_weight NUMERIC DEFAULT 0,
    total_dry_weight NUMERIC DEFAULT 0,
    total_bags INTEGER DEFAULT 0,
    unit_price NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    status TEXT CHECK (status IN ('in_progress', 'completed', 'settled')) DEFAULT 'in_progress',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 8. WEIGHING ITEMS TABLE (Chi tiết từng lượt cân)
CREATE TABLE IF NOT EXISTS public.weighing_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.weighing_sessions(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    bag_count INTEGER DEFAULT 2 CHECK (bag_count >= 1),
    gross_weight NUMERIC NOT NULL,
    tare_weight NUMERIC DEFAULT 0,
    net_weight NUMERIC NOT NULL,
    weighed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SETTLEMENTS TABLE (Quyết toán tiền mua lúa)
CREATE TABLE IF NOT EXISTS public.settlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    settlement_code TEXT NOT NULL UNIQUE,
    farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
    total_dry_weight NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    paid_amount NUMERIC DEFAULT 0,
    status TEXT CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
    settled_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- 10. NOTIFICATIONS TABLE (Thông báo hệ thống)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, email)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        'staff', -- Mặc định khi đăng ký là staff, Admin có thể đổi role
        new.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- SAMPLE MOCK DATA FOR DEMO & TESTING
-- ========================================================

-- Sample Rice Varieties
INSERT INTO public.rice_varieties (code, name, default_price) VALUES
('ST25', 'Lúa ST25 Thơm Thượng Hạng', 9500),
('OM18', 'Lúa OM18 Chất Lượng Cao', 8200),
('DT8', 'Lúa Đài Thơm 8', 8500),
('IR50404', 'Lúa IR50404', 7800)
ON CONFLICT (code) DO NOTHING;

-- Sample Farmers
INSERT INTO public.farmers (name, phone, cccd, cccd_date, cccd_place, cccd_expiry, field_region, lot, area) VALUES
('Phạm Văn Bình', '0905123456', '048092001122', '2021-05-10', 'Công an TP. Đà Nẵng', '2031-05-10', 'Xứ đồng An Trạch 1', 'Lô A1', 5000),
('Nguyễn Thị Mai', '0914987654', '048185003344', '2020-08-15', 'Công an TP. Đà Nẵng', '2030-08-15', 'Xứ đồng An Trạch 2', 'Lô B2', 7500),
('Trần Văn Hùng', '0935555777', '048088009988', '2019-12-01', 'Công an Quảng Nam', '2029-12-01', 'Xứ đồng Hòa Tiến', 'Lô C3', 10000)
ON CONFLICT DO NOTHING;

-- Sample Staff Members
INSERT INTO public.staff_members (full_name, phone) VALUES
('Cán Bộ Cân Phạm Văn Hùng', '0988111222'),
('Cán Bộ Cân Lê Văn Cường', '0977333444')
ON CONFLICT DO NOTHING;

-- Sample Trucks
INSERT INTO public.trucks (driver_name, license_plate, phone) VALUES
('Nguyễn Văn Tải', '92C-123.45', '0905999888'),
('Trần Quốc Xe', '43H-678.90', '0914333222')
ON CONFLICT DO NOTHING;

-- Sample Growing Areas
INSERT INTO public.growing_areas (field_region, lot, area) VALUES
('Xứ đồng An Trạch 1', 'Lô A1', 5000),
('Xứ đồng An Trạch 2', 'Lô B2', 7500),
('Xứ đồng Hòa Tiến', 'Lô C3', 10000)
ON CONFLICT DO NOTHING;

-- RLS Enablement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rice_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growing_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weighing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weighing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon Read for Demo / Development Mode
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public All Farmers" ON public.farmers FOR ALL USING (true);
CREATE POLICY "Public All Staff" ON public.staff_members FOR ALL USING (true);
CREATE POLICY "Public All Trucks" ON public.trucks FOR ALL USING (true);
CREATE POLICY "Public All Varieties" ON public.rice_varieties FOR ALL USING (true);
CREATE POLICY "Public All Areas" ON public.growing_areas FOR ALL USING (true);
CREATE POLICY "Public All Sessions" ON public.weighing_sessions FOR ALL USING (true);
CREATE POLICY "Public All Items" ON public.weighing_items FOR ALL USING (true);
CREATE POLICY "Public All Settlements" ON public.settlements FOR ALL USING (true);
CREATE POLICY "Public All Notifications" ON public.notifications FOR ALL USING (true);
