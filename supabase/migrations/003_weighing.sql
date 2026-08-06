-- Migration: 003_weighing.sql
-- Description: Khởi tạo các bảng phục vụ nghiệp vụ trạm cân (weighing_receipts, weighing_items) và các ràng buộc, chỉ số.

-- 1. Bảng weighing_receipts (Phiếu cân lúa chi tiết)
CREATE TABLE IF NOT EXISTS public.weighing_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) NOT NULL,
    crop_season_id UUID NOT NULL REFERENCES public.crop_seasons(id) ON DELETE RESTRICT,
    farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE RESTRICT,
    rice_variety_id UUID NOT NULL REFERENCES public.rice_varieties(id) ON DELETE RESTRICT,
    warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE RESTRICT, -- Cập nhật khi thủ kho chỉ định Silo nhận hàng
    weighing_officer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    truck_id UUID REFERENCES public.trucks(id) ON DELETE SET NULL,
    truck_plate VARCHAR(20) NOT NULL,
    gross_weight DECIMAL(10,2) NOT NULL CHECK (gross_weight > 0),
    tare_weight DECIMAL(10,2) CHECK (tare_weight >= 0),
    net_weight DECIMAL(10,2) GENERATED ALWAYS AS (
        CASE 
            WHEN tare_weight IS NOT NULL THEN (gross_weight - tare_weight)
            ELSE NULL
        END
    ) STORED CHECK (net_weight IS NULL OR net_weight > 0),
    moisture_percent DECIMAL(4,2) NOT NULL CHECK (moisture_percent >= 0 AND moisture_percent <= 100),
    trash_percent DECIMAL(4,2) NOT NULL CHECK (trash_percent >= 0 AND trash_percent <= 100),
    status VARCHAR(50) DEFAULT 'pending_warehouse' NOT NULL CHECK (status IN ('pending_warehouse', 'pending_tare', 'pending_settlement', 'settled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tare_weighed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_org_receipt_number UNIQUE (organization_id, receipt_number)
);

-- 2. Bảng weighing_items (Chi tiết từng mã cân lẻ của bao lúa/thùng lúa)
CREATE TABLE IF NOT EXISTS public.weighing_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    weighing_receipt_id UUID NOT NULL REFERENCES public.weighing_receipts(id) ON DELETE CASCADE,
    item_sequence INTEGER NOT NULL,
    gross_weight DECIMAL(10,2) NOT NULL CHECK (gross_weight > 0),
    tare_weight DECIMAL(10,2) NOT NULL CHECK (tare_weight >= 0),
    net_weight DECIMAL(10,2) GENERATED ALWAYS AS (gross_weight - tare_weight) STORED CHECK (net_weight > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_receipt_sequence UNIQUE (weighing_receipt_id, item_sequence)
);

-- 3. Chỉ mục (Indexes)
CREATE INDEX idx_receipts_org_status ON public.weighing_receipts(organization_id, status);
CREATE INDEX idx_receipts_farmer ON public.weighing_receipts(farmer_id);
CREATE INDEX idx_receipts_season ON public.weighing_receipts(crop_season_id);
CREATE INDEX idx_receipts_variety ON public.weighing_receipts(rice_variety_id);
CREATE INDEX idx_receipts_warehouse ON public.weighing_receipts(warehouse_id);
CREATE INDEX idx_weighing_items_receipt ON public.weighing_items(weighing_receipt_id);

-- 4. Trigger ngăn chặn chỉnh sửa khi phiếu cân đã quyết toán
CREATE OR REPLACE FUNCTION public.fn_lock_settled_weighing_receipts()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        -- Nếu phiếu cân cũ đã ở trạng thái 'settled' thì không cho phép thay đổi các cột nghiệp vụ chính
        IF OLD.status = 'settled' AND (
            OLD.gross_weight <> NEW.gross_weight OR
            OLD.tare_weight <> NEW.tare_weight OR
            OLD.moisture_percent <> NEW.moisture_percent OR
            OLD.trash_percent <> NEW.trash_percent OR
            OLD.farmer_id <> NEW.farmer_id OR
            OLD.rice_variety_id <> NEW.rice_variety_id
        ) THEN
            RAISE EXCEPTION 'Không thể sửa đổi số liệu nghiệp vụ của phiếu cân đã quyết toán xong.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lock_settled_weighing_receipts
    BEFORE UPDATE ON public.weighing_receipts
    FOR EACH ROW
    EXECUTE FUNCTION public.fn_lock_settled_weighing_receipts();
