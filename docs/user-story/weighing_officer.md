# USER STORIES - CÂN HÀNG (WEIGHING OFFICER)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Vai trò:** Nhân viên cân (Weighing Officer)
* **Mục tiêu chính:** Ghi nhận khối lượng lúa, độ ẩm, tạp chất và lập phiếu cân nhanh chóng tại trạm cân.

---

### 1. User Story: Lập Phiếu cân lần 1 (Cân Gross và đo chất lượng lúa)
* **Định nghĩa:** Là một Nhân viên cân, tôi muốn tạo phiếu cân mới để ghi nhận thông tin nông dân, biển số xe tải, giống lúa, khối lượng tổng (cả xe và lúa), tỷ lệ độ ẩm và tạp chất đo thực tế, nhằm bắt đầu quy trình thu mua cho xe hàng mới vào trạm.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Giao diện tối ưu trên di động, hiển thị các trường nhập thông tin: Nông dân/Thương lái (chọn từ danh sách gợi ý nhanh hoặc tạo nhanh nông dân mới), Biển số xe, Giống lúa (chọn từ danh sách thả xuống), Khối lượng tổng (Gross Weight - kg), Độ ẩm (%), Tạp chất (%).
  2. Hệ thống cảnh báo đỏ nếu độ ẩm nhập vào vượt quá **25%** hoặc tạp chất vượt quá **5%** để nhân viên cân báo lại cho nông dân hoặc xin ý kiến phê duyệt ngoại lệ.
  3. Bấm lưu sẽ tạo phiếu cân ở trạng thái **"Chờ nhập kho"** (Pending Warehouse). Hệ thống sinh mã phiếu cân duy nhất (ví dụ: `PC-20260806-0001`).

---

### 2. User Story: Hoàn thành Phiếu cân lần 2 (Cân Tare và tính Net Weight)
* **Định nghĩa:** Là một Nhân viên cân, tôi muốn gọi lại phiếu cân cũ của xe tải vừa trút lúa xong và nhập khối lượng vỏ xe (Tare Weight), để hệ thống tự động tính khối lượng tịnh (Net Weight) của lúa thu mua thực tế.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Giao diện hiển thị danh sách các phiếu cân đang ở trạng thái **"Chờ cân vỏ"** (đã trút lúa xong).
  2. Nhân viên cân chọn phiếu cân tương ứng và nhập Khối lượng vỏ xe (Tare Weight - kg).
  3. Hệ thống tự động tính toán Khối lượng tịnh:
     $$\text{Net Weight} = \text{Gross Weight} - \text{Tare Weight}$$
  4. Hệ thống báo lỗi nếu Khối lượng vỏ lớn hơn hoặc bằng Khối lượng tổng.
  5. Thời gian giữa 2 lần cân (Gross và Tare) nếu vượt quá **120 phút** sẽ hiển thị cảnh báo màu vàng để nhân viên cân xác minh lý do trước khi bấm hoàn tất.

---

### 3. User Story: In phiếu cân tạm thời qua Bluetooth di động
* **Định nghĩa:** Là một Nhân viên cân, tôi muốn in phiếu cân tạm thời ra máy in nhiệt mini cầm tay qua Bluetooth ngay sau khi hoàn tất cân vỏ, để ký xác nhận khối lượng lúa với tài xế và nông dân tại bàn cân.
* **Độ ưu tiên:** **Should Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Sau khi bấm hoàn tất cân vỏ, giao diện hiển thị nút "In phiếu cân".
  2. Ứng dụng kết nối không dây tới máy in nhiệt cầm tay (khổ giấy K57 hoặc K80) qua giao tiếp Bluetooth hoặc Wi-Fi nội bộ trạm cân.
  3. Nội dung phiếu in phải rõ ràng bao gồm: Tên HTX Hòa Tiến 2, Số phiếu cân, Ngày giờ, Tên nông dân, Biển số xe, Loại lúa, Khối lượng tổng, Khối lượng bì, Khối lượng tịnh, Độ ẩm, Tạp chất, Chữ ký nhân viên cân và nông dân.

---

### 4. User Story: Cân lúa ngoại tuyến (Offline Mode) khi mất sóng
* **Định nghĩa:** Là một Nhân viên cân, tôi muốn có thể tạo phiếu cân và lưu dữ liệu cục bộ trên điện thoại ngay cả khi trạm cân bị mất mạng Internet/4G, để công việc thu mua không bị gián đoạn.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Khi mất kết nối mạng, ứng dụng tự động chuyển sang chế độ ngoại tuyến (Offline Mode), hiển thị thanh trạng thái cảnh báo màu cam "Đang ngoại tuyến".
  2. Nhân viên cân vẫn thực hiện tạo phiếu cân, lưu dữ liệu bình thường. Dữ liệu được lưu trữ an toàn trong IndexedDB hoặc LocalStorage của trình duyệt trên điện thoại.
  3. Khi có kết nối mạng trở lại, ứng dụng tự động đồng bộ tất cả phiếu cân lưu tạm lên máy chủ mà không làm trùng lặp mã phiếu cân hoặc ghi đè dữ liệu.
