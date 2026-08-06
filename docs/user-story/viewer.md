# USER STORIES - NGƯỜI XEM (VIEWER)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Vai trò:** Người xem (Viewer)
* **Đối tượng thực tế:** Kiểm toán viên nội bộ, đại diện đối tác xuất khẩu, hoặc thành viên kiểm tra giám sát của Hợp tác xã.
* **Mục tiêu chính:** Xem thông tin, đối chiếu số liệu và giám sát tiến độ mà không có quyền thay đổi dữ liệu trên hệ thống.

---

### 1. User Story: Tra cứu phiếu cân lúa kiểm tra tính hợp lệ
* **Định nghĩa:** Là một Người xem, tôi muốn tìm kiếm và xem chi tiết nội dung các phiếu cân lúa đã hoàn thành, để thực hiện công tác kiểm tra, giám sát chất lượng và đối chiếu độc lập số liệu mà không sợ vô tình làm thay đổi thông tin.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Người xem có thể tìm kiếm phiếu cân theo Số phiếu, Biển số xe hoặc Tên nông dân.
  2. Giao diện hiển thị chi tiết phiếu cân đầy đủ các chỉ số (Gross, Tare, Net, Độ ẩm, Tạp chất, Người cân, Thủ kho nhận) nhưng tất cả các trường nhập liệu đều bị khóa (Read-only mode).
  3. Tuyệt đối không hiển thị các nút chức năng: "Lưu", "Cập nhật", "Xóa", hoặc "Nhập kho".

---

### 2. User Story: Xem sản lượng tồn kho thực tế của các silo
* **Định nghĩa:** Là một Người xem, tôi muốn xem lượng tồn kho hiện tại của các silo/kho chứa, để đánh giá năng lực sấy và lưu kho của HTX phục vụ mục tiêu thu mua hoặc kế hoạch xuất bán gạo.
* **Độ ưu tiên:** **Should Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Người xem truy cập được màn hình sơ đồ kho chứa lúa.
  2. Hiển thị thông số lượng tồn kho thực tế của từng silo, loại lúa đang chứa và dung lượng còn lại.
  3. Quyền hạn chỉ cho phép xem thông tin tổng quan và chi tiết, không được phép thực hiện các thao tác xuất kho, nhập kho, điều chuyển hay ghi nhận hao hụt kho.
