# BÁO CÁO HOÀN THÀNH PHASE 7.6.3-B.1 (PHASE 7.6.3-B.1 COMPLETION REPORT)

## 1. Thông tin Phase
* **Tên Phase:** Phase 7.6.3-B.1 - Thiết Lập Tiến Trình Vận Hành Sấy & Hạch Toán Chi Phí Lò (Drying Domain Foundation)
* **Mục tiêu:** Xây dựng cấu trúc quản lý các lệnh sấy chủ động (Drying Order), kết quả sấy và chi phí vận hành lò sấy; tính toán tỷ lệ hao hụt ẩm bốc hơi của hạt lúa và tự động hạch toán chi phí lò sấy (nhiên liệu trấu, nhân công trực lò, điện năng quạt gió) vào Sổ cái kế toán bút toán kép.
* **Ngày thực hiện:** 2026-08-06

---

## 2. Các tệp tin đã khởi tạo mới và nâng cấp

1. **[types.ts](file:///m:/GitHub/RiceOS/src/features/drying/domain/types.ts) (Mới):** Cấu trúc thực thể `DryingOrder`, `DryingResult` và cấu trúc nhật ký cảm biến lò sấy `DryingSensorLog` chuẩn bị tích hợp cảm biến IoT.
2. **[calculationEngine.ts](file:///m:/GitHub/RiceOS/src/features/drying/domain/calculationEngine.ts) (Mới):** Bộ máy tính khối lượng khô sấy hao hụt, nước bốc hơi (lít) và chi phí sấy theo số giờ chạy lò thực tế.
3. **[rulesEngine.ts](file:///m:/GitHub/RiceOS/src/features/drying/domain/rulesEngine.ts) (Mới):** Bộ quy tắc kiểm định quy trình sấy lò (kiểm tra độ ẩm lưu kho chuẩn 13%-15.5%, ngăn chặn sấy mẻ mới khi nhiệt độ lò đang quá nhiệt >45°C).
4. **[dryingRepository.ts](file:///m:/GitHub/RiceOS/src/features/drying/repository/dryingRepository.ts) (Mới):** Lớp kết nối lệnh sấy lò và log cảm biến trên database IndexedDB local.
5. **[dryingService.ts](file:///m:/GitHub/RiceOS/src/features/drying/services/dryingService.ts) (Mới):** Tự động hạch toán kế toán giá vốn sấy lò (Nợ TK 154 | Có TK 1111 và Nợ TK 1522 | Có TK 154) khi kết thúc sấy lò lúa.
6. **[useDrying.ts](file:///m:/GitHub/RiceOS/src/features/drying/hooks/useDrying.ts) (Mới):** Custom Hook React điều khiển quy trình lò sấy.
7. **[Warehouse.tsx](file:///m:/GitHub/RiceOS/src/app/portal/pages/Warehouse.tsx) (Nâng cấp):** Tích hợp giao diện quản lý lệnh sấy đang chạy, mô phỏng cảm biến IoT gửi log nhiệt độ/độ ẩm lúa thực tế, tính toán chi phí sấy lò lúa trực quan.
8. **[index.ts](file:///m:/GitHub/RiceOS/src/db/index.ts) (Nâng cấp):** Đăng ký thêm bảng `drying_orders`, `drying_results` và `drying_sensor_logs` vào IndexedDB local.

---

## 3. Quy trình hạch toán chi phí sấy lò tự động (Drying Cost Accounting Flow)

Khi Thủ kho hoàn tất mẻ sấy lò, hệ thống tính toán chi phí vận hành (Năng lượng sấy + Điện năng quạt gió + Nhân công trực lò) và kích hoạt ghi nhận định khoản:
```
Bút toán 1 (Tập hợp chi phí sấy lò thực tế):
  Nợ TK 154 (Chi phí sản xuất dở dang - Lò sấy A/B): Tổng chi phí sấy
  Có TK 1111 (Tiền mặt chi trả trấu sấy/điện/nhân công): Tổng chi phí sấy

Bút toán 2 (Kết chuyển tăng nguyên giá lúa khô sấy thành phẩm):
  Nợ TK 1522 (Lúa sấy khô): Tổng chi phí sấy
  Có TK 154 (Kết chuyển chi phí sấy lò): Tổng chi phí sấy
```
Quy trình giúp kế toán trưởng theo dõi chính xác giá thành lúa sấy thực tế sau khi thu hoạch.

---

## 4. Trạng thái
* **Trạng thái:** ✅ Hoàn thành - Chờ CTO Review
