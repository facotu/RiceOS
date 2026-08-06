-- Migration: 001_core.sql
-- Description: Khởi tạo các bảng cốt lõi (organizations, users, user_profiles, audit_logs) và hàm trigger audit log.

-- 1. Bật extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bảng organizations (Tổ chức / Hợp tác xã)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone_number VARCHAR(20),
    tax_code VARCHAR(50),
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bảng users (Tài khoản Cán bộ HTX - tích hợp với auth.users của Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY, -- Trùng với auth.users.id
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'weighing_officer', 'warehouse_keeper', 'accountant', 'director', 'viewer')),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_phone_number UNIQUE (phone_number),
    CONSTRAINT unique_email UNIQUE (email)
);

-- 4. Bảng user_profiles (Thông tin hồ sơ và chữ ký cán bộ)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    signature_image_url TEXT,
    phone_secondary VARCHAR(20),
    ui_preferences JSONB NOT NULL DEFAULT '{"isLargeFont": false, "isDarkMode": false}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bảng audit_logs (Nhật ký thay đổi dữ liệu nhạy cảm)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('create', 'update', 'delete', 'approve', 'deactivate')),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Chỉ mục (Indexes)
CREATE INDEX idx_users_org ON public.users(organization_id);
CREATE INDEX idx_user_profiles_id ON public.user_profiles(id);
CREATE INDEX idx_audit_logs_org ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_record ON public.audit_logs(table_name, record_id);

-- 7. Hàm tự động ghi log thay đổi (fn_auto_audit_log)
CREATE OR REPLACE FUNCTION public.fn_auto_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    v_org_id UUID;
    v_user_id UUID;
    v_action VARCHAR(50);
    v_old JSONB := NULL;
    v_new JSONB := NULL;
BEGIN
    -- Xác định loại hành động
    IF (TG_OP = 'INSERT') THEN
        v_action := 'create';
        v_new := to_jsonb(NEW);
        v_org_id := NEW.organization_id;
    ELSIF (TG_OP = 'UPDATE') THEN
        v_action := 'update';
        v_old := to_jsonb(OLD);
        v_new := to_jsonb(NEW);
        v_org_id := NEW.organization_id;
    ELSIF (TG_OP = 'DELETE') THEN
        v_action := 'delete';
        v_old := to_jsonb(OLD);
        v_org_id := OLD.organization_id;
    END IF;

    -- Lấy user_id hiện tại từ jwt claims của Supabase Auth (nếu có)
    BEGIN
        v_user_id := (auth.jwt_claims() ->> 'sub')::uuid;
    EXCEPTION WHEN OTHERS THEN
        v_user_id := NULL;
    END;

    -- Chỉ ghi nhận log khi tìm được mã Hợp tác xã (organization_id)
    IF v_org_id IS NOT NULL THEN
        INSERT INTO public.audit_logs (
            organization_id,
            user_id,
            action_type,
            table_name,
            record_id,
            old_value,
            new_value
        ) VALUES (
            v_org_id,
            v_user_id,
            v_action,
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            v_old,
            v_new
        );
    END IF;

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
