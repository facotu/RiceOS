-- Migration: 006_device_soft_delete.sql
-- Description: Bổ sung Chiến lược Soft Delete (Xóa mềm bảo toàn dữ liệu) và Bảng Quản lý thiết bị đồng bộ (Device Management).

-- 1. Bổ sung cột Xóa mềm (Soft Delete) vào các bảng nghiệp vụ cốt lõi
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS deleted_by_user_id UUID REFERENCES public.users(id);

ALTER TABLE public.trucks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.trucks ADD COLUMN IF NOT EXISTS deleted_by_user_id UUID REFERENCES public.users(id);

ALTER TABLE public.weighing_receipts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.weighing_receipts ADD COLUMN IF NOT EXISTS deleted_by_user_id UUID REFERENCES public.users(id);

ALTER TABLE public.settlement_vouchers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.settlement_vouchers ADD COLUMN IF NOT EXISTS deleted_by_user_id UUID REFERENCES public.users(id);

-- 2. Chỉ mục cho Xóa mềm để tối ưu truy vấn SELECT dữ liệu đang hoạt động
CREATE INDEX IF NOT EXISTS idx_farmers_soft_delete ON public.farmers(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_trucks_soft_delete ON public.trucks(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_receipts_soft_delete ON public.weighing_receipts(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_settlements_soft_delete ON public.settlement_vouchers(organization_id) WHERE deleted_at IS NULL;

-- 3. Tạo bảng device_registrations (Quản lý và phê duyệt thiết bị di động trạm cân)
CREATE TABLE IF NOT EXISTS public.device_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    device_identifier VARCHAR(255) NOT NULL, -- UUID hoặc Fingerprint thiết bị
    device_name VARCHAR(150), -- Ví dụ: Samsung Tab S9
    os_version VARCHAR(50), -- Ví dụ: Android 14
    is_approved BOOLEAN DEFAULT false NOT NULL, -- Admin phê duyệt mới được đồng bộ
    is_locked BOOLEAN DEFAULT false NOT NULL, -- Khóa khẩn cấp khi mất thiết bị
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_org_device UNIQUE (organization_id, device_identifier)
);

CREATE INDEX idx_device_regs_org ON public.device_registrations(organization_id);

-- Bật RLS cho device_registrations
ALTER TABLE public.device_registrations ENABLE ROW LEVEL SECURITY;

-- Cài đặt RLS Policy cho device_registrations
CREATE POLICY policy_device_regs_isolation ON public.device_registrations
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- 4. Cập nhật các RLS Policies hiện tại để lọc bỏ các bản ghi đã xóa mềm (deleted_at IS NULL)
-- Lưu ý: Supabase thay thế policy bằng cách DROP cũ và CREATE mới

DROP POLICY IF EXISTS policy_farmers_isolation ON public.farmers;
CREATE POLICY policy_farmers_isolation ON public.farmers
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id() AND deleted_at IS NULL)
    WITH CHECK (organization_id = public.fn_get_user_org_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS policy_trucks_isolation ON public.trucks;
CREATE POLICY policy_trucks_isolation ON public.trucks
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id() AND deleted_at IS NULL)
    WITH CHECK (organization_id = public.fn_get_user_org_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS policy_weighing_receipts_isolation ON public.weighing_receipts;
CREATE POLICY policy_weighing_receipts_isolation ON public.weighing_receipts
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id() AND deleted_at IS NULL)
    WITH CHECK (organization_id = public.fn_get_user_org_id() AND deleted_at IS NULL);

DROP POLICY IF EXISTS policy_settlements_isolation ON public.settlement_vouchers;
CREATE POLICY policy_settlements_isolation ON public.settlement_vouchers
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id() AND deleted_at IS NULL)
    WITH CHECK (organization_id = public.fn_get_user_org_id() AND deleted_at IS NULL);
