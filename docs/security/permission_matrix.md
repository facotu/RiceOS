# MA TRẬN PHÂN QUYỀN (PERMISSION MATRIX)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Để đảm bảo an toàn thông tin và tính toàn vẹn của dữ liệu thu mua tài chính, RiceOS áp dụng phân quyền dựa trên vai trò (Role-Based Access Control - RBAC) và bảo mật dữ liệu cấp dòng (Row-Level Security - RLS).

Tài liệu này chi tiết hóa ma trận quyền hạn giữa các nhóm người dùng đối với các thực thể dữ liệu chính trong hệ thống.

---

## 1. Ký hiệu phân quyền sử dụng

* **C (Create):** Quyền tạo mới dữ liệu.
* **R (Read):** Quyền xem/đọc dữ liệu.
* **U (Update):** Quyền chỉnh sửa dữ liệu hiện có.
* **D (Delete):** Quyền xóa dữ liệu (Lưu ý: Hệ thống RiceOS nghiêm cấm xóa vật lý dữ liệu thu mua quan trọng, quyền này chủ yếu áp dụng cho các danh mục phụ hoặc chuyển sang trạng thái "Không hoạt động" - Soft Delete).
* **A (Approve):** Quyền phê duyệt (ví duyệt chi tài chính, duyệt giá đặc biệt).
* **`-` :** Không có quyền truy cập.

---

## 2. Bảng Ma trận phân quyền chức năng

| Thực thể dữ liệu (Entities) | Quản trị viên (Admin) | Nhân viên cân (Weighing Officer) | Thủ kho (Warehouse) | Kế toán (Accountant) | Giám đốc (Director) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Tài khoản người dùng (`User`)** | C, R, U, D | - | - | - | R |
| **Thông tin Hợp tác xã (`HTX`)** | R, U | - | - | - | R |
| **Thông tin Nông dân (`Farmer`)** | C, R, U | C, R, U | - | C, R, U | R |
| **Danh mục Giống lúa (`Variety`)** | C, R, U, D | R | R | R | R |
| **Cấu hình Đơn giá ngày (`Price`)** | C, R, U | R | - | R | C, R, U, A |
| **Phiếu cân lúa (`WeighingReceipt`)** | R | C, R, U* | R, U** | R | R |
| **Kho & Silo chứa (`Warehouse`)** | C, R, U | R | R, U | R | R |
| **Nhật ký tồn kho (`InventoryLog`)** | R | - | C, R | R | R |
| **Phiếu thanh toán (`Settlement`)** | R | - | - | C, R, U | R, A |
| **Nhật ký hệ thống (`AuditLog`)** | R | - | - | - | R |

### 💡 Ghi chú các quyền đặc biệt (*, **):
* `WeighingReceipt - U* (Nhân viên cân):` Nhân viên cân chỉ được quyền sửa Phiếu cân lúa khi phiếu cân đó ở trạng thái **"Mới tạo" (Chưa xác nhận nhập kho)**. Khi thủ kho đã xác nhận nhập kho, phiếu cân sẽ bị khóa quyền chỉnh sửa đối với Nhân viên cân để ngăn chặn sửa đổi số liệu sau khi bàn giao hàng.
* `WeighingReceipt - U** (Thủ kho):` Thủ kho chỉ được quyền cập nhật thông tin liên quan đến việc xác nhận nhập kho (chọn Silo chứa, xác nhận sản lượng thực nhận). Thủ kho không có quyền sửa đổi khối lượng tổng (Gross) hoặc kết quả đo độ ẩm/tạp chất do Nhân viên cân đã ghi nhận.

---

## 3. Quy tắc Bảo mật Cấp Cơ sở dữ liệu (RLS Rules)

Để RiceOS hoạt động như một nền tảng SaaS ổn định trong tương lai, cơ sở dữ liệu phải được cấu hình Row-Level Security (RLS) theo các quy tắc sau:

1. **Cô lập theo Đơn vị (Tenant Isolation):** 
   * Mọi bảng dữ liệu (trừ danh mục hệ thống chung như danh sách tỉnh thành) bắt buộc phải có cột `tenant_id` (Mã Hợp tác xã).
   * Người dùng đăng nhập thuộc Hợp tác xã nào thì chỉ truy vấn được các dòng dữ liệu có `tenant_id` bằng với mã HTX của mình.
   * Công thức RLS trên PostgreSQL:
     ```sql
     CREATE POLICY tenant_isolation_policy ON weighing_receipts
     FOR ALL
     USING (tenant_id = auth.jwt_claims() ->> 'tenant_id');
     ```
2. **Quyền truy cập API:** 
   * Mọi API endpoint gửi lên máy chủ phải được kiểm tra Token hợp lệ (JWT) chứa thông tin vai trò (`role`) của người dùng đăng nhập.
   * Server phải từ chối truy cập ngay lập tức nếu vai trò gửi lên không khớp với Ma trận phân quyền ở phần 2.
