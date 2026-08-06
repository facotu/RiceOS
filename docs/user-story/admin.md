# USER STORIES - QUẢN TRỊ VIÊN (ADMIN)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Vai trò:** Admin (Quản trị viên hệ thống)
* **Mục tiêu chính:** Quản trị tài khoản thành viên, cấu hình tham số hệ thống và danh mục dùng chung.

---

### 1. User Story: Quản lý và phân quyền tài khoản cán bộ
* **Định nghĩa:** Là một Admin, tôi muốn tạo mới, sửa đổi thông tin và phân vai trò cho các cán bộ Hợp tác xã (nhân viên cân, thủ kho, kế toán, giám đốc), để đảm bảo mỗi người có tài khoản riêng và chỉ truy cập đúng chức năng của họ.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Admin có giao diện quản lý danh sách tài khoản thuộc Hợp tác xã của mình.
  2. Khi tạo tài khoản mới, Admin bắt buộc nhập: Họ tên, Số điện thoại/Email (dùng làm tên đăng nhập), Mật khẩu và chọn 1 trong các vai trò: Cán bộ cân, Thủ kho, Kế toán, Giám đốc, Người xem.
  3. Tên đăng nhập (SĐT/Email) phải là duy nhất, hệ thống báo lỗi nếu trùng lặp.
  4. Admin có quyền khóa (deactivate) tài khoản tạm thời khi cán bộ đó nghỉ việc hoặc đổi vị trí công tác. Tài khoản bị khóa không thể đăng nhập vào hệ thống.

---

### 2. User Story: Cấu hình giống lúa thu mua
* **Định nghĩa:** Là một Admin, tôi muốn quản lý danh mục các giống lúa (ví dụ: Đài Thơm 8, OM18, Khang Dân), để trạm cân và kế toán có dữ liệu chính xác để chọn khi lập phiếu.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Giao diện hiển thị danh sách giống lúa hiện tại của HTX.
  2. Admin có thể thêm mới giống lúa với các trường thông tin: Mã giống lúa (duy nhất, tự sinh hoặc nhập tay), Tên giống lúa, Mô tả chi tiết.
  3. Không cho phép xóa cứng giống lúa nếu giống lúa đó đã được sử dụng trong các phiếu cân thực tế (chỉ cho phép ẩn/ngừng thu mua).

---

### 3. User Story: Giám sát nhật ký hoạt động hệ thống (Audit Logs)
* **Định nghĩa:** Là một Admin, tôi muốn xem lịch sử ghi vết các hoạt động thay đổi dữ liệu quan trọng trong hệ thống, để phục vụ việc kiểm toán dữ liệu và giải quyết tranh chấp.
* **Độ ưu tiên:** **Should Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Admin có màn hình tra cứu nhật ký hệ thống.
  2. Mỗi bản ghi nhật ký phải lưu lại rõ ràng: Người thực hiện, Thời gian hành động, Loại hành động (Thêm mới, Chỉnh sửa, Phê duyệt), Bản ghi bị tác động, Giá trị trước khi sửa và Giá trị sau khi sửa.
  3. Hỗ trợ bộ lọc tìm kiếm theo Khoảng thời gian, Người thực hiện, hoặc Loại dữ liệu (ví dụ: tìm kiếm lịch sử sửa đổi đơn giá).
