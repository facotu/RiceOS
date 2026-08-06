-- Migration: 004_finance_inventory.sql
-- Description: Khởi tạo các bảng tài chính & quản lý kho (settlement_vouchers, payment_transactions, warehouse_receipts, inventory_transactions) và trigger cập nhật kho tự động.

-- 1. Bảng settlement_vouchers (Phiếu thanh quyết toán tài chính)
CREATE TABLE IF NOT EXISTS public.settlement_vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    weighing_receipt_id UUID NOT NULL REFERENCES public.weighing_receipts(id) ON DELETE RESTRICT,
    accountant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    approver_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
    settlement_weight DECIMAL(10,2) NOT NULL CHECK (settlement_weight >= 0),
    applied_price DECIMAL(10,2) NOT NULL CHECK (applied_price >= 0),
    moisture_deduction_amount DECIMAL(12,2) DEFAULT 0.00 NOT NULL CHECK (moisture_deduction_amount >= 0),
    trash_deduction_amount DECIMAL(12,2) DEFAULT 0.00 NOT NULL CHECK (trash_deduction_amount >= 0),
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer')),
    status VARCHAR(50) DEFAULT 'pending_approval' NOT NULL CHECK (status IN ('pending_approval', 'approved', 'paid', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_receipt_settlement UNIQUE (weighing_receipt_id)
);

-- 2. Bảng payment_transactions (Giao dịch thanh toán tiền lúa)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    settlement_voucher_id UUID NOT NULL REFERENCES public.settlement_vouchers(id) ON DELETE CASCADE,
    paid_by_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer')),
    bank_ref_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bảng warehouse_receipts (Phiếu nhập kho thực tế của thủ kho)
CREATE TABLE IF NOT EXISTS public.warehouse_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    weighing_receipt_id UUID NOT NULL REFERENCES public.weighing_receipts(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    warehouse_keeper_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT,
    CONSTRAINT unique_receipt_warehouse_entry UNIQUE (weighing_receipt_id)
);

-- 4. Bảng inventory_transactions (Sổ cái biến động kho / Giao dịch kho)
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE RESTRICT,
    weighing_receipt_id UUID REFERENCES public.weighing_receipts(id) ON DELETE SET NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('in', 'out')), -- in: Nhập lúa, out: Xuất bán/sấy
    quantity_kg DECIMAL(12,2) NOT NULL CHECK (quantity_kg > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Chỉ mục (Indexes)
CREATE INDEX idx_settlements_org ON public.settlement_vouchers(organization_id);
CREATE INDEX idx_payments_org ON public.payment_transactions(organization_id);
CREATE INDEX idx_wh_receipts_org ON public.warehouse_receipts(organization_id);
CREATE INDEX idx_inv_transactions_org_wh ON public.inventory_transactions(organization_id, warehouse_id);

-- 6. Trigger cập nhật tổng kho thực tế từ inventory_transactions (Inventory Ledger Trigger)
CREATE OR REPLACE FUNCTION public.fn_update_warehouse_stock_by_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.transaction_type = 'in') THEN
        UPDATE public.warehouses
        SET current_stock_kg = current_stock_kg + NEW.quantity_kg
        WHERE id = NEW.warehouse_id;
    ELSIF (NEW.transaction_type = 'out') THEN
        UPDATE public.warehouses
        SET current_stock_kg = current_stock_kg - NEW.quantity_kg
        WHERE id = NEW.warehouse_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_warehouse_stock_by_transaction
    AFTER INSERT ON public.inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_update_warehouse_stock_by_transaction();

-- 7. Trigger tự động tạo inventory_transaction khi phiếu cân hoàn tất cân vỏ
CREATE OR REPLACE FUNCTION public.fn_create_inventory_transaction_on_receipt()
RETURNS TRIGGER AS $$
BEGIN
    -- Khi phiếu cân chuyển trạng thái sang 'pending_settlement' (Đã hoàn tất cân vỏ)
    -- Và trước đó chưa ở trạng thái 'pending_settlement' hoặc 'settled'
    IF NEW.status IN ('pending_settlement', 'settled') AND OLD.status NOT IN ('pending_settlement', 'settled') THEN
        IF NEW.warehouse_id IS NOT NULL AND NEW.net_weight IS NOT NULL THEN
            -- Tạo giao dịch kho nhập
            INSERT INTO public.inventory_transactions (
                organization_id,
                warehouse_id,
                weighing_receipt_id,
                transaction_type,
                quantity_kg
            ) VALUES (
                NEW.organization_id,
                NEW.warehouse_id,
                NEW.id,
                'in',
                NEW.net_weight
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_create_inventory_transaction_on_receipt
    AFTER UPDATE ON public.weighing_receipts
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_create_inventory_transaction_on_receipt();
