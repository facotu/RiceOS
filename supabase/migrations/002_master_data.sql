-- Migration: 002_master_data.sql
-- Description: Khởi tạo các bảng danh mục (farmers, crop_seasons, rice_varieties, trucks, warehouses, price_configurations, rice_prices_history) và trigger giá lúa.

-- 1. Bảng farmers (Nông dân & Thương lái)
CREATE TABLE IF NOT EXISTS public.farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT,
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_account_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bảng crop_seasons (Mùa vụ thu mua)
CREATE TABLE IF NOT EXISTS public.crop_seasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT check_dates CHECK (start_date <= end_date)
);

-- 3. Bảng rice_varieties (Danh mục giống lúa dùng chung hệ thống)
CREATE TABLE IF NOT EXISTS public.rice_varieties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    CONSTRAINT unique_variety_name UNIQUE (name)
);

-- 4. Bảng trucks (Danh mục xe tải đăng ký)
CREATE TABLE IF NOT EXISTS public.trucks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plate_number VARCHAR(20) NOT NULL,
    owner_farmer_id UUID REFERENCES public.farmers(id) ON DELETE SET NULL,
    truck_type VARCHAR(100),
    tare_weight_default DECIMAL(10,2) CHECK (tare_weight_default >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_org_plate UNIQUE (organization_id, plate_number)
);

-- 5. Bảng warehouses (Danh mục kho/silo chứa lúa)
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    capacity_kg DECIMAL(12,2) NOT NULL CHECK (capacity_kg > 0),
    current_stock_kg DECIMAL(12,2) DEFAULT 0.00 NOT NULL CHECK (current_stock_kg >= 0),
    description TEXT
);

-- 6. Bảng price_configurations (Cấu hình đơn giá ngày)
CREATE TABLE IF NOT EXISTS public.price_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    rice_variety_id UUID NOT NULL REFERENCES public.rice_varieties(id) ON DELETE CASCADE,
    price_per_kg DECIMAL(10,2) NOT NULL CHECK (price_per_kg > 0),
    effective_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_org_variety_date UNIQUE (organization_id, rice_variety_id, effective_date)
);

-- 7. Bảng rice_prices_history (Nhật ký thay đổi đơn giá)
CREATE TABLE IF NOT EXISTS public.rice_prices_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    rice_variety_id UUID NOT NULL REFERENCES public.rice_varieties(id) ON DELETE CASCADE,
    price_old DECIMAL(10,2) NOT NULL CHECK (price_old > 0),
    price_new DECIMAL(10,2) NOT NULL CHECK (price_new > 0),
    changed_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Chỉ mục (Indexes)
CREATE INDEX idx_farmers_org ON public.farmers(organization_id);
CREATE INDEX idx_crop_seasons_org ON public.crop_seasons(organization_id);
CREATE INDEX idx_trucks_org_plate ON public.trucks(organization_id, plate_number);
CREATE INDEX idx_warehouses_org ON public.warehouses(organization_id);
CREATE INDEX idx_price_config_date ON public.price_configurations(organization_id, effective_date);
CREATE INDEX idx_price_history_org ON public.rice_prices_history(organization_id);

-- 9. Hàm trigger lưu lịch sử thay đổi đơn giá (fn_log_rice_price_history)
CREATE OR REPLACE FUNCTION public.fn_log_rice_price_history()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Lấy user_id hiện tại từ jwt claims của Supabase Auth
    BEGIN
        v_user_id := (auth.jwt_claims() ->> 'sub')::uuid;
    EXCEPTION WHEN OTHERS THEN
        v_user_id := NULL;
    END;

    -- Chỉ ghi nhận log khi đơn giá thực sự thay đổi
    IF (TG_OP = 'UPDATE') THEN
        IF OLD.price_per_kg <> NEW.price_per_kg THEN
            INSERT INTO public.rice_prices_history (
                organization_id,
                rice_variety_id,
                price_old,
                price_new,
                changed_by_user_id,
                effective_date
            ) VALUES (
                NEW.organization_id,
                NEW.rice_variety_id,
                OLD.price_per_kg,
                NEW.price_per_kg,
                v_user_id,
                NEW.effective_date
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Tạo trigger trên price_configurations
CREATE TRIGGER trg_log_rice_price_history
    AFTER UPDATE ON public.price_configurations
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_log_rice_price_history();
