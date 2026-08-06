# TỪ ĐIỂN DỮ LIỆU CHI TIẾT HOÀN THIỆN (DATA DICTIONARY FINAL)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.5 (Bản hoàn thiện trước UI/UX)
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất phê duyệt

---

Tài liệu này định nghĩa chi tiết kiểu dữ liệu, các ràng buộc và ý nghĩa của từng trường thông tin trong cơ sở dữ liệu hệ thống RiceOS.

---

## 1. Bảng `organizations` (Thông tin Tổ chức / Hợp tác xã)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh duy nhất của Hợp tác xã. |
| `name` | `VARCHAR(255)` | Not Null | Tên của Hợp tác xã (Ví dụ: HTX Nông nghiệp Hòa Tiến 2). |
| `address` | `TEXT` | Nullable | Địa chỉ trụ sở chính. |
| `phone_number`| `VARCHAR(20)` | Nullable | Số điện thoại liên hệ chính thức. |
| `tax_code` | `VARCHAR(50)` | Nullable | Mã số thuế của Hợp tác xã. |
| `settings` | `JSONB` | Not Null | Lưu trữ cấu hình đặc thù (Tỷ lệ độ ẩm chuẩn, tỷ lệ trừ ẩm mặc định, hạn mức tự động duyệt chi,...). |
| `created_at` | `TIMESTAMP` | Not Null | Thời gian khởi tạo bản ghi. |
| `updated_at` | `TIMESTAMP` | Not Null | Thời gian cập nhật bản ghi gần nhất. |

---

## 2. Bảng `users` (Tài khoản Cán bộ Hợp tác xã)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh duy nhất của người dùng. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)` để xác định Hợp tác xã. |
| `full_name` | `VARCHAR(100)`| Not Null | Họ và tên đầy đủ của cán bộ. |
| `phone_number`| `VARCHAR(20)` | Not Null, Unique| Số điện thoại dùng để đăng nhập. |
| `email` | `VARCHAR(100)`| Nullable, Unique| Email của cán bộ (nếu có). |
| `password_hash`| `VARCHAR(255)`| Not Null | Mật khẩu đã được mã hóa bằng bcrypt/argon2. |
| `role` | `VARCHAR(50)` | Not Null | Vai trò trong hệ thống: `admin`, `weighing_officer`, `warehouse_keeper`, `accountant`, `director`, `viewer`. |
| `is_active` | `BOOLEAN` | Default True | Trạng thái hoạt động (`true`: Hoạt động, `false`: Bị khóa). |
| `created_at` | `TIMESTAMP` | Not Null | Thời gian tạo tài khoản. |

---

## 3. Bảng `farmers` (Danh mục Nông dân & Thương lái)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh nông dân. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `full_name` | `VARCHAR(100)`| Not Null | Họ và tên nông dân hoặc tên thương lái đại diện. |
| `phone_number`| `VARCHAR(20)` | Not Null | Số điện thoại liên hệ nhận tiền/đối chiếu. |
| `address` | `TEXT` | Nullable | Địa chỉ nơi canh tác hoặc nơi ở. |
| `bank_name` | `VARCHAR(100)`| Nullable | Tên ngân hàng nhận tiền chuyển khoản (Ví dụ: Agribank). |
| `bank_account_number`| `VARCHAR(50)`| Nullable | Số tài khoản ngân hàng. |
| `bank_account_name`| `VARCHAR(100)`| Nullable | Tên chủ tài khoản ngân hàng. |
| `is_active` | `BOOLEAN` | Default True | Trạng thái liên kết (`true`: Hoạt động, `false`: Ngừng giao dịch). |
| `created_at` | `TIMESTAMP` | Not Null | Thời gian tạo danh mục nông dân. |

---

## 4. Bảng `crop_seasons` (Danh mục Mùa vụ Thu mua)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh mùa vụ. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `name` | `VARCHAR(100)`| Not Null | Tên vụ mùa (Ví dụ: Vụ Đông Xuân 2026, Vụ Hè Thu 2026). |
| `start_date` | `DATE` | Not Null | Ngày bắt đầu vụ thu mua. |
| `end_date` | `DATE` | Not Null | Ngày kết thúc vụ thu mua. |
| `is_active` | `BOOLEAN` | Default True | Trạng thái vụ mùa (`true`: Vụ mùa hiện tại, `false`: Đã kết thúc và đóng sổ số liệu). |

---

## 5. Bảng `rice_varieties` (Danh mục Giống lúa Hệ thống)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã giống lúa. |
| `name` | `VARCHAR(100)`| Not Null, Unique| Tên giống lúa (Ví dụ: OM18, Đài Thơm 8, IR504). |
| `description` | `TEXT` | Nullable | Mô tả đặc tính lúa. |

---

## 6. Bảng `price_configurations` (Bảng Giá lúa Ngày)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã cấu hình giá. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `rice_variety_id`| `UUID` | FK | Tham chiếu đến `rice_varieties(id)`. |
| `price_per_kg` | `DECIMAL(10,2)`| Not Null | Đơn giá thu mua (VNĐ/kg). |
| `effective_date`| `DATE` | Not Null | Ngày đơn giá này có hiệu lực. |
| `created_at` | `TIMESTAMP` | Not Null | Thời gian tạo cấu hình giá. |

---

## 7. Bảng `warehouses` (Danh mục Kho & Silo chứa lúa)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh kho chứa. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `name` | `VARCHAR(100)`| Not Null | Tên silo hoặc kho chứa (Ví dụ: Silo Sấy A, Kho Lưu Trữ B). |
| `capacity_kg` | `DECIMAL(12,2)`| Not Null | Sức chứa tối đa của kho (tính bằng kg). |
| `current_stock_kg`| `DECIMAL(12,2)`| Default 0.00 | Trọng lượng lúa tồn thực tế hiện tại. |
| `description` | `TEXT` | Nullable | Ghi chú vị trí hoặc trạng thái kho. |

---

## 8. Bảng `weighing_receipts` (Phiếu cân lúa chi tiết)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh phiếu cân lúa. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `receipt_number` | `VARCHAR(50)` | Not Null, Unique| Số phiếu cân sinh tự động (Ví dụ: PC-20260806-0001). |
| `crop_season_id` | `UUID` | FK | Tham chiếu đến `crop_seasons(id)`. |
| `farmer_id` | `UUID` | FK | Tham chiếu đến `farmers(id)`. |
| `rice_variety_id`| `UUID` | FK | Tham chiếu đến `rice_varieties(id)`. |
| `warehouse_id` | `UUID` | FK, Nullable | Tham chiếu đến `warehouses(id)`. Cập nhật khi thủ kho nhận hàng. |
| `weighing_officer_id`| `UUID` | FK | Người lập phiếu cân (tham chiếu đến `users(id)`). |
| `truck_id` | `UUID` | FK, Nullable | Tham chiếu đến `trucks(id)` để lấy thông tin xe tải nhanh chóng. |
| `truck_plate` | `VARCHAR(20)` | Not Null | Biển số xe tải chở lúa (nhập tay hoặc tự động điền từ `trucks`). |
| `gross_weight` | `DECIMAL(10,2)`| Not Null | Khối lượng tổng (Xe + Lúa) cân lần 1 (kg). |
| `tare_weight` | `DECIMAL(10,2)`| Nullable | Khối lượng vỏ xe cân lần 2 (kg). |
| `net_weight` | `DECIMAL(10,2)`| Nullable | Khối lượng tịnh thực tế của lúa (kg). |
| `moisture_percent`| `DECIMAL(4,2)` | Not Null | Chỉ số độ ẩm đo thực tế (%). |
| `trash_percent` | `DECIMAL(4,2)` | Not Null | Chỉ số tỷ lệ tạp chất đo thực tế (%). |
| `status` | `VARCHAR(50)` | Default 'pending_warehouse' | Trạng thái phiếu: `pending_warehouse` (Chờ nhập kho), `pending_tare` (Chờ cân vỏ), `pending_settlement` (Chờ quyết toán), `settled` (Đã quyết toán). |
| `created_at` | `TIMESTAMP` | Not Null | Thời gian lập phiếu cân lần 1. |
| `tare_weighed_at`| `TIMESTAMP` | Nullable | Thời gian hoàn tất cân vỏ lần 2. |

---

## 9. Bảng `settlement_vouchers` (Phiếu thanh quyết toán tài chính)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh phiếu chi thanh toán. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `weighing_receipt_id`| `UUID`| FK, Unique | Tham chiếu duy nhất đến phiếu cân `weighing_receipts(id)`. |
| `accountant_id` | `UUID` | FK | Người lập phiếu chi (tham chiếu đến `users(id)`). |
| `approver_id` | `UUID` | FK, Nullable | Người duyệt chi (tham chiếu đến `users(id)`). |
| `settlement_weight`| `DECIMAL(10,2)`| Not Null | Khối lượng lúa quy đổi thực tế sau khi trừ khấu trừ (kg). |
| `applied_price` | `DECIMAL(10,2)`| Not Null | Đơn giá áp dụng thanh toán (VNĐ/kg). |
| `moisture_deduction_amount`| `DECIMAL(12,2)`| Not Null | Số tiền bị trừ do độ ẩm cao (VNĐ). |
| `trash_deduction_amount`| `DECIMAL(12,2)`| Not Null | Số tiền bị trừ do tạp chất cao (VNĐ). |
| `total_amount` | `DECIMAL(12,2)`| Not Null | Tổng số tiền thanh toán thực nhận (VNĐ). |
| `payment_method` | `VARCHAR(50)` | Not Null | Phương thức: `cash` (Tiền mặt), `bank_transfer` (Chuyển khoản). |
| `bank_ref_number`| `VARCHAR(100)`| Nullable | Mã số đối chiếu giao dịch chuyển khoản ngân hàng. |
| `status` | `VARCHAR(50)` | Default 'pending_approval' | Trạng thái phiếu chi: `pending_approval` (Chờ duyệt), `approved` (Đã duyệt - Chờ chi), `paid` (Đã chi tiền), `rejected` (Từ chối duyệt). |
| `created_at` | `TIMESTAMP` | Not Null | Thời gian tạo phiếu chi. |
| `approved_at` | `TIMESTAMP` | Nullable | Thời gian duyệt chi. |
| `paid_at` | `TIMESTAMP` | Nullable | Thời gian xác nhận chi tiền. |

---

## 10. Bảng `audit_logs` (Nhật ký thay đổi và bảo mật)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh log. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `user_id` | `UUID` | FK | Người thực hiện hành động (tham chiếu đến `users(id)`). |
| `action_type` | `VARCHAR(50)` | Not Null | Loại hành động: `create`, `update`, `approve`, `deactivate`. |
| `table_name` | `VARCHAR(100)`| Not Null | Tên bảng bị tác động (Ví dụ: `weighing_receipts`). |
| `record_id` | `UUID` | Not Null | Khóa chính của bản ghi bị tác động. |
| `old_value` | `JSONB` | Nullable | Dữ liệu cũ trước khi cập nhật (ở định dạng JSON). |
| `new_value` | `JSONB` | Nullable | Dữ liệu mới sau khi cập nhật (ở định dạng JSON). |
| `ip_address` | `VARCHAR(45)` | Nullable | Địa chỉ IP của thiết bị thực hiện. |
| `created_at` | `TIMESTAMP` | Default Now | Thời gian thực hiện ghi log. |

---

## 11. Bảng `trucks` (Danh mục Xe tải đăng ký)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh xe tải. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `plate_number` | `VARCHAR(20)` | Not Null, Unique| Biển số xe tải (Ví dụ: 43C-123.45). |
| `owner_farmer_id`| `UUID` | FK, Nullable | Tham chiếu đến `farmers(id)` (Chủ xe, có thể là nông dân/thương lái). |
| `truck_type` | `VARCHAR(100)`| Nullable | Loại xe (Xe tải 5 tấn, xe ba gác, công nông,...). |
| `tare_weight_default`| `DECIMAL(10,2)`| Nullable| Trọng lượng vỏ mặc định của xe (dùng để tham khảo đối chiếu). |
| `created_at` | `TIMESTAMP` | Not Null | Thời gian đăng ký xe. |

---

## 12. Bảng `user_profiles` (Chi tiết Hồ sơ & Chữ ký Cán bộ)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK, FK | Liên kết 1-1 với `users(id)`. |
| `avatar_url` | `TEXT` | Nullable | Đường dẫn ảnh đại diện cán bộ. |
| `signature_image_url`| `TEXT` | Nullable | Ảnh chụp chữ ký tay của cán bộ (phục vụ in phiếu cân điện tử). |
| `phone_secondary`| `VARCHAR(20)` | Nullable | Số điện thoại phụ. |
| `ui_preferences` | `JSONB` | Nullable | Cài đặt tùy chỉnh cá nhân (Ví dụ: Chế độ chữ lớn cho cán bộ lớn tuổi). |
| `updated_at` | `TIMESTAMP` | Not Null | Thời gian cập nhật hồ sơ gần nhất. |

---

## 13. Bảng `weighing_items` (Chi tiết các đợt cân bao lẻ)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh bản ghi cân lẻ. |
| `weighing_receipt_id`| `UUID`| FK | Tham chiếu đến phiếu cân cha `weighing_receipts(id)`. |
| `item_sequence` | `INTEGER` | Not Null | Số thứ tự lần cân lẻ (1, 2, 3...). |
| `gross_weight` | `DECIMAL(10,2)`| Not Null | Khối lượng tổng của lần cân lẻ này (kg). |
| `tare_weight` | `DECIMAL(10,2)`| Not Null | Khối lượng bì (bao/khay chứa) của lần cân lẻ này (kg). |
| `net_weight` | `DECIMAL(10,2)`| Not Null | Khối lượng tịnh thực tế của lần cân lẻ này (kg). |
| `created_at` | `TIMESTAMP` | Default Now | Thời gian thực hiện lần cân lẻ. |

---

## 14. Bảng `rice_prices_history` (Nhật ký Thay đổi Giá lúa)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã log lịch sử giá. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `rice_variety_id`| `UUID` | FK | Tham chiếu đến `rice_varieties(id)`. |
| `price_old` | `DECIMAL(10,2)`| Not Null | Giá lúa trước khi sửa (VNĐ/kg). |
| `price_new` | `DECIMAL(10,2)`| Not Null | Giá lúa sau khi sửa (VNĐ/kg). |
| `changed_by_user_id`| `UUID` | FK | Cán bộ thực hiện đổi giá (tham chiếu đến `users(id)`). |
| `effective_date`| `DATE` | Not Null | Ngày giá lúa này bắt đầu có hiệu lực thực tế. |
| `created_at` | `TIMESTAMP` | Default Now | Thời gian thực hiện sửa đơn giá. |

---

## 15. Bảng `sync_status` (Theo dõi Đồng bộ Thiết bị Client)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `id` | `UUID` | PK | Mã định danh theo dõi thiết bị. |
| `organization_id`| `UUID` | FK | Tham chiếu đến `organizations(id)`. |
| `user_id` | `UUID` | FK | Tài khoản đăng nhập trên thiết bị (tham chiếu đến `users(id)`). |
| `device_identifier`| `VARCHAR(255)`| Not Null | Mã định danh thiết bị duy nhất (UUID thiết bị hoặc Fingerprint). |
| `device_name` | `VARCHAR(150)`| Nullable | Tên thiết bị (Ví dụ: Samsung Galaxy S23, iPad Pro). |
| `os_version` | `VARCHAR(50)` | Nullable | Hệ điều hành và phiên bản (Android 13, iOS 16.5). |
| `last_sync_at` | `TIMESTAMP` | Nullable | Thời điểm đồng bộ thành công gần nhất lên server. |
| `pending_sync_count`| `INTEGER` | Default 0 | Số lượng bản ghi còn tồn trong Sync Queue local chưa đồng bộ. |
| `updated_at` | `TIMESTAMP` | Not Null | Thời gian thiết bị cập nhật ping trạng thái. |
