# KẾ HOẠCH TRIỂN KHAI CƠ SỞ DỮ LIỆU (DATABASE IMPLEMENTATION PLAN)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Tài liệu này chi tiết hóa kế hoạch cài đặt cơ sở dữ liệu vật lý trên PostgreSQL, chiến lược chạy Migration, lập trình các Trigger tự động hóa và phân lập bảo mật đa hợp tác xã (Multi-Tenant RLS).

---

## 1. Chiến lược Quản lý Phiên bản Cơ sở dữ liệu (Migration Strategy)

Dự án sử dụng công cụ **Supabase CLI** để quản lý phiên bản cơ sở dữ liệu dưới dạng các file mã nguồn SQL Migration nằm trong thư mục `supabase/migrations/`.

* **Quy tắc tạo tệp Migration:** Mỗi thay đổi cấu trúc bảng, thêm chỉ mục (Index) hay đổi kiểu dữ liệu bắt buộc phải tạo một file SQL migration mới được đánh số thứ tự thời gian tăng dần:
  * Ví dụ: `supabase/migrations/20260806130000_init_schema.sql`
* **Quy trình chạy Migration:**
  * Tại môi trường local: Chạy lệnh `supabase db reset` để tái tạo toàn bộ database local khớp với mã nguồn.
  * Môi trường Production: Khi release phiên bản mới, Supabase GitHub Action sẽ tự động áp dụng các file SQL mới vào database cloud thông qua lệnh `supabase db push`.
  * **Nghiêm cấm:** Tuyệt đối không được sử dụng giao diện Supabase Studio Dashboard để sửa trực tiếp cấu trúc bảng trên môi trường Cloud khi chưa chạy qua file Migration.

---

## 2. Kế hoạch lập trình Triggers tự động hóa (Trigger Plan)

Để đảm bảo tính nhất quán dữ liệu và giảm tải xử lý cho server API, hệ thống sử dụng 3 trigger tự động chạy trong PostgreSQL:

### 2.1. Trigger cập nhật Tồn kho Silo (`trg_update_warehouse_stock`)
* **Thời điểm kích hoạt:** `AFTER UPDATE` trên bảng `weighing_receipts`.
* **Điều kiện logic:** Chạy khi trường `status` thay đổi:
  * Nếu trạng thái chuyển thành `pending_tare` (Thủ kho xác nhận xe lúa đổ vào silo sấy): Tạm tính tăng lượng tồn kho của silo chứa (`warehouse_id`) dựa trên khối lượng ước tính sơ bộ (`gross_weight` trừ đi tải trọng xe đăng ký mặc định).
  * Nếu trạng thái chuyển thành `pending_settlement` (Đã hoàn tất cân vỏ lần 2): Tính toán chính xác khối lượng tịnh thực tế của lúa (`net_weight = gross_weight - tare_weight`). Thực hiện cập nhật cộng chính xác khối lượng lúa này vào trường `current_stock_kg` trong bảng `warehouses` tương ứng.
  * Nếu trạng thái chuyển từ bất kỳ trạng thái nào sang `rejected` (Hủy phiếu cân): Thực hiện trừ lượng tồn kho tương ứng khỏi silo chứa để hoàn trả lại số liệu gốc.

### 2.2. Trigger tự động ghi lịch sử Giá lúa (`trg_log_rice_price_history`)
* **Thời điểm kích hoạt:** `AFTER INSERT OR UPDATE` trên bảng `price_configurations`.
* **Logic xử lý:** Khi đơn giá của một giống lúa bị thay đổi, trigger tự động thực hiện ghi chép một dòng log mới vào bảng `rice_prices_history` lưu trữ: ID giống lúa, giá trị đơn giá cũ, giá trị đơn giá mới, người thực hiện sửa đổi và ngày hiệu lực của giá.

### 2.3. Trigger tự động ghi Nhật ký hệ thống (`trg_auto_audit_log`)
* **Thời điểm kích hoạt:** `AFTER UPDATE OR DELETE` trên các bảng nhạy cảm tài chính: `weighing_receipts`, `settlement_vouchers`, `price_configurations`.
* **Logic xử lý:** 
  * Tự động trích xuất Claims người dùng đăng nhập hiện tại từ JWT (`auth.uid()`).
  * Chuyển đổi toàn bộ hàng dữ liệu cũ (OLD) và hàng dữ liệu mới (NEW) thành cấu trúc JSONB.
  * Ghi bản ghi log mới vào bảng `audit_logs` lưu trữ rõ ràng: Tên bảng bị sửa, ID bản ghi, dữ liệu cũ dạng JSON, dữ liệu mới dạng JSON và thời gian sửa.

---

## 3. Chiến lược áp dụng Row-Level Security (RLS Strategy)

Bảo mật dữ liệu multi-tenant cô lập giữa các Hợp tác xã đăng ký sử dụng được triển khai triệt để ở mức cơ sở dữ liệu PostgreSQL:

1. **Bật RLS trên toàn bộ các bảng dữ liệu:**
   ```sql
   ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE weighing_receipts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE settlement_vouchers ENABLE ROW LEVEL SECURITY;
   ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
   -- Áp dụng tương tự cho tất cả các bảng khác trừ bảng dùng chung rice_varieties.
   ```
2. **Quy định Tenant claim trong JWT:**
   * Khi người dùng đăng nhập thành công, máy chủ Auth Supabase sẽ sinh ra JWT Token chứa claim tùy chỉnh: `app_metadata.organization_id`.
3. **Thiết lập Policy cách ly dữ liệu:**
   * Mọi câu lệnh truy vấn dữ liệu từ Client gửi lên Supabase API sẽ được database tự động lọc qua điều kiện:
     `WHERE organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid`
   * Bất kỳ nỗ lực truy cập dữ liệu chéo của một tài khoản thuộc HTX A sang dữ liệu của HTX B đều bị PostgreSQL chặn lại từ đầu và trả về mảng kết quả trống, đảm bảo an toàn bảo mật dữ liệu tuyệt đối.
