# MỤC TIÊU SẢN PHẨM (PRODUCT OBJECTIVES)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

## 1. Mục tiêu Nghiệp vụ cho Hợp tác xã (Business Objectives)

Mục tiêu cốt lõi của RiceOS khi áp dụng vào quy trình vận hành của **Hợp tác xã Nông nghiệp Hòa Tiến 2** bao gồm:

* **Tối ưu hóa thời gian (Time Reduction):**
  * Giảm **80%** thời gian kế toán tính toán và lập bảng kê thanh toán cho nông dân (từ trung bình 24-48 giờ xuống dưới 5 phút sau khi lúa nhập kho).
  * Rút ngắn thời gian lập và in một phiếu cân lúa tại trạm cân xuống dưới **1 phút**.
* **Loại bỏ sai sót tài chính (Zero Calculation Errors):**
  * Đạt tỷ lệ **0%** sai sót trong việc áp công thức khấu trừ độ ẩm và tạp chất nhờ tính toán tự động bằng phần mềm.
* **Minh bạch hóa 100% dữ liệu:**
  * Toàn bộ phiếu cân, lịch sử giao dịch và nhật ký sửa đổi số liệu được lưu trữ tập trung, không thể bị xóa và có thể truy xuất đối chiếu tức thì khi có tranh chấp.
* **Tối ưu hóa tồn kho:**
  * Quản lý sản lượng tồn kho thực tế chính xác đến từng kg theo từng loại lúa và silo chứa, kiểm soát hao hụt lưu kho dưới mức quy định của HTX.

---

## 2. Mục tiêu Sản phẩm & Tính năng (Product & Feature Objectives)

RiceOS hướng tới hoàn thiện các nhóm tính năng chính trong phiên bản đầu tiên (v1.0):

* **Quản lý trạm cân di động (Mobile Weighing):**
  * Giao diện Web App chạy mượt mà trên mọi điện thoại di động của Nhân viên cân.
  * Hỗ trợ chức năng in phiếu cân trực tiếp từ điện thoại ra máy in hóa đơn mini cầm tay qua Bluetooth.
* **Tính toán quyết toán tự động (Auto Settlement):**
  * Cấu hình linh hoạt bảng giá thu mua theo ngày và loại lúa.
  * Tự động áp công thức khấu trừ ẩm/tạp chất theo biểu đồ quy định của HTX.
* **Báo cáo động cho Giám đốc (Executive Dashboard):**
  * Biểu đồ sản lượng thu mua, luồng tiền đã thanh toán và dự kiến chi cập nhật theo thời gian thực.
  * Xuất báo cáo tổng hợp vụ mùa ra file Excel chuẩn định dạng của Hợp tác xã chỉ bằng một click.

---

## 3. Mục tiêu Kỹ thuật & Công nghệ (Technical Objectives)

* **Tốc độ phản hồi (Performance):**
  * Thời gian phản hồi của API hệ thống dưới **500ms** trong điều kiện mạng ổn định.
  * Giao diện tải trang dưới **1.5 giây** trên thiết bị di động kết nối mạng 3G/4G trung bình.
* **Tính khả dụng khi mất kết nối (Offline Capability):**
  * Nhân viên cân vẫn có thể tạo phiếu cân và lưu tạm thời trên bộ nhớ cục bộ (Local Storage/IndexedDB) của thiết bị di động khi mất mạng, tự động đồng bộ hóa lên server ngay khi có kết nối mạng trở lại.
* **An toàn dữ liệu & Bảo mật (Security & Reliability):**
  * Thiết lập cơ chế bảo mật hàng (Row Level Security - RLS) trên Database để đảm bảo dữ liệu của HTX nào chỉ HTX đó được truy cập (sẵn sàng cho mô hình SaaS đa đơn vị).
  * Độ khả dụng của hệ thống (Uptime) đạt tối thiểu **99.9%** trong suốt thời gian diễn ra vụ mùa thu mua.

---

## 4. Chỉ số Đo lường Thành công (Key Performance Indicators - KPIs)

Hệ thống được coi là triển khai thành công tại HTX Hòa Tiến 2 nếu đạt được các chỉ số sau sau 1 vụ mùa vận hành:

1. **Tỷ lệ áp dụng (Adoption Rate):** 100% cán bộ cân, thủ kho và kế toán của HTX sử dụng phần mềm để ghi nhận giao dịch thay thế hoàn toàn cho sổ sách giấy.
2. **Thời gian xử lý trung bình (Process Time):** Tổng thời gian từ lúc xe lúa vào trạm cân đến khi nông dân nhận được tiền mặt hoặc lệnh chuyển khoản thành công giảm dưới **30 phút** (đối với các lô hàng thông thường).
3. **Mức độ hài lòng của nông dân:** Đạt trên **90%** phản hồi tích cực từ nông dân liên kết về tính minh bạch của phiếu cân và tốc độ thanh toán tiền lúa của Hợp tác xã.
