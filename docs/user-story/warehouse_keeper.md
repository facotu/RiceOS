# USER STORIES - THỦ KHO (WAREHOUSE KEEPER)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Vai trò:** Thủ kho (Warehouse Keeper)
* **Mục tiêu chính:** Quản lý thực tế nhập kho lúa, chỉ định silo lưu kho và theo dõi sản lượng tồn kho.

---

### 1. User Story: Xem hàng đợi xe lúa đang chờ nhập kho
* **Định nghĩa:** Là một Thủ kho, tôi muốn xem danh sách các xe lúa đã qua bàn cân lần 1 và đang di chuyển vào khu vực kho chứa, để chủ động sắp xếp vị trí đổ lúa.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Màn hình di động của thủ kho hiển thị danh sách các phiếu cân ở trạng thái **"Chờ nhập kho"**.
  2. Danh sách hiển thị rõ ràng: Biển số xe, Tên nông dân, Giống lúa và thời gian phiếu cân được tạo ở trạm cân.
  3. Danh sách tự động cập nhật danh sách (hoặc có nút làm mới nhanh) khi có xe cân xong lần 1.

---

### 2. User Story: Xác nhận nhập kho thực tế & Chỉ định Silo chứa lúa
* **Định nghĩa:** Là một Thủ kho, tôi muốn chọn một xe lúa trong hàng đợi, chỉ định Silo/Kho chứa lúa và xác nhận lúa đã được trút vào kho thành công, để thông báo cho trạm cân tiến hành cân vỏ xe (Tare) và kế toán bắt đầu quy trình thanh toán.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Thủ kho chọn xe lúa từ hàng đợi, nhấn nút "Nhập kho".
  2. Giao diện hiển thị danh sách các Silo/Kho chứa lúa còn trống hoặc chứa cùng giống lúa tương ứng. Hệ thống cảnh báo nếu thủ kho chọn Silo đang chứa giống lúa khác.
  3. Thủ kho xác nhận hoàn tất. Trạng thái phiếu cân chuyển từ "Chờ nhập kho" sang **"Đang nhập kho - Chờ cân vỏ"**.
  4. Hệ thống tự động ghi nhật ký tồn kho tạm tính (tăng sản lượng tạm tính của Silo tương ứng dựa trên Khối lượng tổng tạm tính, sẽ cập nhật chính xác sau khi cân vỏ xong).

---

### 3. User Story: Theo dõi tồn kho thực tế của từng Silo
* **Định nghĩa:** Là một Thủ kho, tôi muốn xem sơ đồ trực quan và số lượng tồn kho lúa hiện tại của từng Silo/Kho chứa theo thời gian thực, để kiểm soát sức chứa kho và lập kế hoạch sấy/xuất kho lúa.
* **Độ ưu tiên:** **Should Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Giao diện hiển thị danh sách tất cả Silo/Kho chứa kèm theo thanh tiến độ dung lượng (Capacity Bar) thể hiện tỷ lệ % đã sử dụng.
  2. Thông tin chi tiết mỗi Silo hiển thị: Tên Silo, Giống lúa đang chứa, Sức chứa tối đa (tấn), Tồn kho thực tế (tấn/kg), Ngày nhập lô hàng gần nhất.
  3. Hệ thống hiển thị cảnh báo màu đỏ nếu lượng lúa tồn vượt quá **90%** sức chứa tối đa của Silo.
