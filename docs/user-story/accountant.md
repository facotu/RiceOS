# USER STORIES - KẾ TOÁN (ACCOUNTANT)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Vai trò:** Kế toán (Accountant)
* **Mục tiêu chính:** Thực hiện quyết toán tài chính chính xác, lập phiếu chi thanh toán tiền lúa và xuất dữ liệu báo cáo đối chiếu.

---

### 1. User Story: Tính toán số tiền quyết toán tự động
* **Định nghĩa:** Là một Kế toán, tôi muốn hệ thống tự động tính khối lượng quy đổi thanh toán và số tiền thực tế chi trả dựa trên đơn giá lúa ngày cùng các tỷ lệ trừ ẩm/tạp chất từ phiếu cân đã nhập kho, để giảm thời gian tính toán thủ công và đảm bảo độ chính xác.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Kế toán truy cập danh sách phiếu cân đã hoàn thành nhập kho (chờ quyết toán).
  2. Khi chọn phiếu cân, hệ thống tự động hiển thị: Đơn giá lúa ngày (theo danh mục giống lúa), Tỷ lệ trừ ẩm (tự động tính từ độ ẩm nhập vào), Tỷ lệ trừ tạp chất.
  3. Hệ thống tự động tính Khối lượng thanh toán (quy đổi sau trừ ẩm, tạp chất) và hiển thị Tổng tiền quyết toán chi tiết theo công thức nghiệp vụ quy định.
  4. Cho phép kế toán áp dụng giá thỏa thuận đặc biệt (nếu được cấp quyền), nhưng yêu cầu nhập lý do chi tiết và hệ thống sẽ gửi trạng thái chờ duyệt.

---

### 2. User Story: Lập Phiếu thanh toán và gửi duyệt tài chính
* **Định nghĩa:** Là một Kế toán, tôi muốn lập Phiếu thanh toán (Settlement Voucher) từ phiếu cân đã tính toán xong, để ghi nhận nghĩa vụ thanh toán và gửi yêu cầu duyệt chi tới Giám đốc nếu số tiền vượt hạn mức.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Kế toán bấm "Tạo phiếu thanh toán" sau khi đồng ý bảng tính tiền.
  2. Nếu số tiền thanh toán dưới **50,000,000 VNĐ**, phiếu thanh toán tự động chuyển sang trạng thái "Đã duyệt - Chờ thanh toán".
  3. Nếu số tiền thanh toán lớn hơn hoặc bằng **50,000,000 VNĐ**, phiếu thanh toán chuyển sang trạng thái "Chờ Giám đốc phê duyệt" và hệ thống gửi thông báo duyệt tới Giám đốc.

---

### 3. User Story: Xác nhận thanh toán thực tế (Chi tiền)
* **Định nghĩa:** Là một Kế toán, tôi muốn ghi nhận hình thức thanh toán (Tiền mặt hoặc Chuyển khoản ngân hàng) và mã số giao dịch ngân hàng đối với các phiếu chi đã được phê duyệt, để cập nhật trạng thái tài chính của giao dịch thành "Đã thanh toán" (Paid).
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Giao diện hiển thị danh sách phiếu chi ở trạng thái "Chờ thanh toán" (đã được duyệt).
  2. Kế toán chọn hình thức thanh toán: Tiền mặt hoặc Chuyển khoản.
  3. Nếu chọn Chuyển khoản ngân hàng, kế toán bắt buộc nhập mã tham chiếu giao dịch (Mã đối chiếu từ Internet Banking).
  4. Bấm "Xác nhận đã chi" để hoàn tất giao dịch. Hệ thống khóa phiếu chi này, không cho phép chỉnh sửa số liệu nữa.

---

### 4. User Story: Xuất danh sách quyết toán ra file Excel
* **Định nghĩa:** Là một Kế toán, tôi muốn xuất dữ liệu quyết toán thu mua của vụ mùa ra file Excel, để thực hiện đối chiếu số liệu nội bộ với thủ kho và báo cáo tài chính cuối kỳ.
* **Độ ưu tiên:** **Should Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Trên màn hình quản lý thanh toán, có nút "Xuất báo cáo Excel".
  2. Cho phép lọc dữ liệu theo: Khoảng ngày, Tên nông dân/thương lái, Giống lúa, Trạng thái thanh toán trước khi xuất.
  3. File Excel tải xuống có đầy đủ các thông tin: Mã phiếu cân, Mã phiếu chi, Tên nông dân, Khối lượng tịnh, Khối lượng quy đổi, Đơn giá, Khấu trừ ẩm/tạp chất, Tổng tiền, Mã giao dịch ngân hàng và người thực hiện chi.
