-- Migration: 005_security.sql
-- Description: Bật RLS và cài đặt Policies bảo mật đa hợp tác xã (Multi-Tenant) và phân quyền vai trò (Role-Based Access Control) cho toàn bộ bảng.

-- 1. Bảng sync_status (Theo dõi đồng bộ thiết bị)
CREATE TABLE IF NOT EXISTS public.sync_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    device_identifier VARCHAR(255) NOT NULL,
    device_name VARCHAR(150),
    os_version VARCHAR(50),
    last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pending_sync_count INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_sync_status_org ON public.sync_status(organization_id);

-- 2. Kích hoạt Row-Level Security (RLS) trên tất cả các bảng nghiệp vụ
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rice_prices_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weighing_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weighing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Lưu ý: Bảng public.rice_varieties là danh mục dùng chung hệ thống, không cần bật RLS (hoặc cho phép mọi người đọc).

-- 3. Tạo hàm Helper kiểm tra Claims để tránh trùng lặp code Policy
CREATE OR REPLACE FUNCTION public.fn_get_user_org_id()
RETURNS UUID AS $$
BEGIN
    RETURN (nullif(current_setting('request.jwt.claims', true)::json->>'organization_id', ''))::uuid;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.fn_get_user_role()
RETURNS VARCHAR AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::json->>'role';
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Định nghĩa các chính sách bảo mật cô lập đa tổ chức (Multi-Tenant Policies)

-- A. Bảng organizations: Thành viên chỉ được đọc thông tin của tổ chức mình
CREATE POLICY policy_org_isolation ON public.organizations
    FOR SELECT
    USING (id = public.fn_get_user_org_id());

-- B. Bảng users: Cô lập theo org_id
CREATE POLICY policy_users_isolation ON public.users
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- C. Bảng user_profiles: Chỉ được xem và sửa hồ sơ cá nhân
CREATE POLICY policy_profile_isolation ON public.user_profiles
    FOR ALL
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- D. Bảng farmers: Cô lập theo org_id
CREATE POLICY policy_farmers_isolation ON public.farmers
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- E. Bảng crop_seasons: Cô lập theo org_id
CREATE POLICY policy_seasons_isolation ON public.crop_seasons
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- F. Bảng trucks: Cô lập theo org_id
CREATE POLICY policy_trucks_isolation ON public.trucks
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- G. Bảng warehouses: Cô lập theo org_id
CREATE POLICY policy_warehouses_isolation ON public.warehouses
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- H. Bảng price_configurations: Cô lập theo org_id
CREATE POLICY policy_prices_isolation ON public.price_configurations
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- I. Bảng rice_prices_history: Cô lập theo org_id
CREATE POLICY policy_prices_history_isolation ON public.rice_prices_history
    FOR SELECT
    USING (organization_id = public.fn_get_user_org_id());

-- J. Bảng weighing_receipts: Cô lập theo org_id
CREATE POLICY policy_weighing_receipts_isolation ON public.weighing_receipts
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- K. Bảng weighing_items: Cô lập dựa trên RLS của weighing_receipts liên kết
CREATE POLICY policy_weighing_items_isolation ON public.weighing_items
    FOR ALL
    USING (
        weighing_receipt_id IN (
            SELECT id FROM public.weighing_receipts 
            WHERE organization_id = public.fn_get_user_org_id()
        )
    )
    WITH CHECK (
        weighing_receipt_id IN (
            SELECT id FROM public.weighing_receipts 
            WHERE organization_id = public.fn_get_user_org_id()
        )
    );

-- L. Bảng settlement_vouchers: Cô lập theo org_id
CREATE POLICY policy_settlements_isolation ON public.settlement_vouchers
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- M. Bảng payment_transactions: Cô lập theo org_id
CREATE POLICY policy_payments_isolation ON public.payment_transactions
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- N. Bảng warehouse_receipts: Cô lập theo org_id
CREATE POLICY policy_wh_receipts_isolation ON public.warehouse_receipts
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- O. Bảng inventory_transactions: Cô lập theo org_id
CREATE POLICY policy_inv_transactions_isolation ON public.inventory_transactions
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- P. Bảng sync_status: Cô lập theo org_id
CREATE POLICY policy_sync_status_isolation ON public.sync_status
    FOR ALL
    USING (organization_id = public.fn_get_user_org_id())
    WITH CHECK (organization_id = public.fn_get_user_org_id());

-- Q. Bảng audit_logs: Chỉ cho phép admin và director xem, cô lập theo org_id
CREATE POLICY policy_audit_logs_isolation ON public.audit_logs
    FOR SELECT
    USING (
        organization_id = public.fn_get_user_org_id() 
        AND public.fn_get_user_role() IN ('admin', 'director')
    );

-- 5. Đăng ký Trigger ghi log thay đổi tự động (fn_auto_audit_log) cho tất cả các bảng nghiệp vụ nhạy cảm
CREATE TRIGGER audit_trg_farmers AFTER INSERT OR UPDATE OR DELETE ON public.farmers FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_crop_seasons AFTER INSERT OR UPDATE OR DELETE ON public.crop_seasons FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_trucks AFTER INSERT OR UPDATE OR DELETE ON public.trucks FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_warehouses AFTER INSERT OR UPDATE OR DELETE ON public.warehouses FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_price_configurations AFTER INSERT OR UPDATE OR DELETE ON public.price_configurations FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_weighing_receipts AFTER INSERT OR UPDATE OR DELETE ON public.weighing_receipts FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_settlement_vouchers AFTER INSERT OR UPDATE OR DELETE ON public.settlement_vouchers FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_payment_transactions AFTER INSERT OR UPDATE OR DELETE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_warehouse_receipts AFTER INSERT OR UPDATE OR DELETE ON public.warehouse_receipts FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
CREATE TRIGGER audit_trg_inventory_transactions AFTER INSERT OR UPDATE OR DELETE ON public.inventory_transactions FOR EACH ROW EXECUTE FUNCTION public.fn_auto_audit_log();
