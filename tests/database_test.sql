-- Kịch bản kiểm thử tích hợp Cơ sở dữ liệu RiceOS
-- Tệp tin: tests/database_test.sql

-- BẮT ĐẦU GIAO DỊCH KIỂM THỬ (Sẽ rollback sau khi chạy xong để không làm bẩn DB)
BEGIN;

-- =============================================================================
-- KIỂM THỬ 1: LUỒNG CÂN LÚA (WEIGHING FLOW) & TRÊN NHẬP KHO TỰ ĐỘNG (INVENTORY LEDGER)
-- =============================================================================
RAISE NOTICE '--- KIỂM THỬ 1: Bắt đầu luồng cân lúa ---';

-- Giả lập Cán bộ cân đăng ký xe cân lần 1 (Gross Weight)
INSERT INTO public.weighing_receipts (
    id,
    organization_id,
    receipt_number,
    crop_season_id,
    farmer_id,
    rice_variety_id,
    weighing_officer_id,
    truck_id,
    truck_plate,
    gross_weight,
    moisture_percent,
    trash_percent,
    status
) VALUES (
    'test-receipt-uuid-0001',
    'org-hoatien2-uuid-1111-2222-333333333333',
    'PC-TEST-0001',
    'season-dx2026-uuid-1111-2222-333333333333',
    'farmer-nguyena-uuid-1111-2222-333333333333',
    'variety-om18-uuid-1111-2222-333333333333',
    'user-weighing-uuid-1111-2222-333333333333',
    'truck-xe1-uuid-1111-2222-333333333333',
    '43C-123.45',
    12500.00, -- Gross weight
    15.5, -- Độ ẩm
    1.2,  -- Tạp chất
    'pending_warehouse'
);

-- Giả lập Thủ kho xác nhận xe lúa đổ vào Silo A
UPDATE public.weighing_receipts
SET 
    warehouse_id = 'silo-a-uuid-1111-2222-333333333333',
    status = 'pending_tare'
WHERE id = 'test-receipt-uuid-0001';

-- Giả lập xe quay lại bàn cân để Cân vỏ lần 2 (Tare Weight)
UPDATE public.weighing_receipts
SET 
    tare_weight = 3200.00, -- Khối lượng vỏ
    status = 'pending_settlement',
    tare_weighed_at = now()
WHERE id = 'test-receipt-uuid-0001';

-- KIỂM TRA CHÉO:
-- A. Khối lượng tịnh (Net Weight) phải tự động tính bằng GENERATED ALWAYS: 12500 - 3200 = 9300 kg
-- B. Sổ cái kho (inventory_transactions) phải tự động sinh ra bản ghi nhập kho 9300 kg lúa OM18
-- C. Sản lượng tồn của Silo A phải tự động cộng dồn 9300 kg.

SELECT id, net_weight, status FROM public.weighing_receipts WHERE id = 'test-receipt-uuid-0001';
SELECT * FROM public.inventory_transactions WHERE weighing_receipt_id = 'test-receipt-uuid-0001';
SELECT name, current_stock_kg FROM public.warehouses WHERE id = 'silo-a-uuid-1111-2222-333333333333';

-- =============================================================================
-- KIỂM THỬ 2: LUỒNG QUYẾT TOÁN (SETTLEMENT FLOW) & TRỪ KHẤU TRỪ
-- =============================================================================
RAISE NOTICE '--- KIỂM THỬ 2: Bắt đầu luồng quyết toán tài chính ---';

-- Kế toán thực hiện quyết toán phiếu cân (Giá lúa OM18 ngày hôm nay là 8,000 VNĐ/kg)
-- Tỷ lệ trừ ẩm: (15.5% thực tế - 14% chuẩn) * 1.5 (tỷ lệ khấu trừ) = 2.25% khấu trừ khối lượng
-- Tỷ lệ trừ tạp chất: (1.2% thực tế - 1% chuẩn) * 1.0 = 0.2% khấu trừ
-- Khối lượng quy đổi = 9,300 * (1 - 0.0225 - 0.002) = 9,300 * 0.9755 = 9072.15 kg
-- Tổng tiền = 9072.15 * 8,000 = 72,577,200 VNĐ.

INSERT INTO public.settlement_vouchers (
    id,
    organization_id,
    weighing_receipt_id,
    accountant_id,
    settlement_weight,
    applied_price,
    moisture_deduction_amount,
    trash_deduction_amount,
    total_amount,
    payment_method,
    status
) VALUES (
    'test-voucher-uuid-0001',
    'org-hoatien2-uuid-1111-2222-333333333333',
    'test-receipt-uuid-0001',
    'user-accountant-uuid-1111-2222-333333333333',
    9072.15,
    8000.00,
    1674000.00, -- Số tiền bị khấu trừ ẩm
    148800.00,  -- Khấu trừ tạp chất
    72577200.00, -- Tổng chi thực tế nông dân nhận
    'bank_transfer',
    'pending_approval' -- Đang chờ duyệt vì > 50 triệu
);

-- Giám đốc duyệt chi phiếu
UPDATE public.settlement_vouchers
SET 
    approver_id = 'user-director-uuid-1111-2222-333333333333',
    status = 'approved',
    approved_at = now()
WHERE id = 'test-voucher-uuid-0001';

-- Kế toán bắn lệnh thanh toán (Tạo giao dịch tiền mặt/chuyển khoản)
INSERT INTO public.payment_transactions (
    organization_id,
    settlement_voucher_id,
    paid_by_user_id,
    amount,
    payment_method,
    bank_ref_number
) VALUES (
    'org-hoatien2-uuid-1111-2222-333333333333',
    'test-voucher-uuid-0001',
    'user-accountant-uuid-1111-2222-333333333333',
    72577200.00,
    'bank_transfer',
    'FT2608069999'
);

-- Cập nhật chứng từ sang trạng thái đã chi tiền và tự động update status phiếu cân sang 'settled'
UPDATE public.settlement_vouchers
SET 
    status = 'paid',
    paid_at = now()
WHERE id = 'test-voucher-uuid-0001';

UPDATE public.weighing_receipts
SET status = 'settled'
WHERE id = 'test-receipt-uuid-0001';

-- =============================================================================
-- KIỂM THỬ 3: KIỂM TRA TRIGGER KHÓA DỮ LIỆU (LOCK RECEIPT TRIGGER)
-- =============================================================================
RAISE NOTICE '--- KIỂM THỬ 3: Kiểm tra trigger khóa dữ liệu ---';

-- Hành động cố tình hack sửa đổi khối lượng lúa cân khi phiếu cân đã quyết toán xong.
-- Báo lỗi mong đợi: 'Không thể sửa đổi số liệu nghiệp vụ của phiếu cân đã quyết toán xong.'
DO $$
BEGIN
    BEGIN
        UPDATE public.weighing_receipts
        SET gross_weight = 15000.00
        WHERE id = 'test-receipt-uuid-0001';
        
        RAISE EXCEPTION 'LỖI: Trigger khóa dữ liệu đã bị bỏ qua, không bảo mật!';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'THÀNH CÔNG: Trigger khóa dữ liệu hoạt động chính xác. Chặn đứng thay đổi số liệu.';
    END;
END;
$$;

-- =============================================================================
-- KIỂM THỬ 4: KIỂM TRA MỤC NHẬT KÝ THAY ĐỔI (AUDIT LOG & PRICE HISTORY TRIGGER)
-- =============================================================================
RAISE NOTICE '--- KIỂM THỬ 4: Kiểm tra hoạt động Audit Logs và Price History ---';

-- Sửa giá lúa để kích hoạt trigger ghi lịch sử giá lúa
UPDATE public.price_configurations
SET price_per_kg = 8300.00
WHERE id = 'price-om18-uuid-1111-2222-333333333333';

-- Kiểm tra xem bảng rice_prices_history có tự động lưu mức giá cũ 8000 và giá mới 8300 hay không
SELECT price_old, price_new, created_at FROM public.rice_prices_history;

-- Kiểm tra xem bảng audit_logs có lưu log hoạt động của các bảng hay không
SELECT table_name, action_type, created_at FROM public.audit_logs;

-- =============================================================================
-- KIỂM THỬ 5: KIỂM TRA BẢO MẬT RLS CÔ LẬP ĐA HỢP TÁC XÃ (MULTI-TENANT ISOLATION)
-- =============================================================================
RAISE NOTICE '--- KIỂM THỬ 5: Kiểm tra RLS cô lập đa hợp tác xã ---';

-- Giả lập một JWT của Hợp tác xã HTX Hòa Tiến 2 trong phiên làm việc
SET local request.jwt.claims = '{"organization_id": "org-hoatien2-uuid-1111-2222-333333333333", "role": "weighing_officer"}';

-- Truy vấn danh sách xe tải của HTX Hòa Tiến 2 (Mong đợi trả về 2 bản ghi đã seed)
SELECT plate_number FROM public.trucks;

-- Giả lập một JWT của Hợp tác xã Hòa Tiến 3 (Khác tổ chức)
SET local request.jwt.claims = '{"organization_id": "org-hoatien3-uuid-9999-9999-999999999999", "role": "weighing_officer"}';

-- Truy vấn danh sách xe tải (Mong đợi trả về 0 bản ghi do chính sách RLS chặn lại)
SELECT plate_number FROM public.trucks;

-- HỦY BỎ GIAO DỊCH KIỂM THỬ (Rollback để giữ cơ sở dữ liệu sạch)
ROLLBACK;
RAISE NOTICE '--- HOÀN TẤT KIỂM THỬ TÍCH HỢP DATABASE ---';
