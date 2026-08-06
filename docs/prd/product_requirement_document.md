# TÀI LIỆU YÊU CẦU SẢN PHẨM (PRODUCT REQUIREMENT DOCUMENT - PRD)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

## 1. Giới thiệu & Bối cảnh (Introduction & Context)

Dự án **RiceOS** được xây dựng nhằm cung cấp giải pháp quản trị số hóa, tự động hóa toàn bộ chuỗi thu mua lúa gạo tại các Hợp tác xã Nông nghiệp. Khách hàng đầu tiên là **Hợp tác xã Nông nghiệp Hòa Tiến 2**.

Hiện tại, quy trình của HTX đang dựa hoàn toàn vào ghi chép thủ công trên giấy tờ và tính toán đơn giá, khấu trừ tạp chất, độ ẩm bằng Excel. Điều này dẫn đến sự chậm trễ trong khâu thanh toán tiền lúa cho nông dân (mất 24 - 48 giờ), rủi ro sai sót dữ liệu và thiếu báo cáo tổng hợp thời gian thực cho Ban Giám đốc.

---

## 2. Mục tiêu Sản phẩm (Product Goals)

* **Số hóa quy trình cân lúa:** Nhân viên cân ghi nhận thông tin xe hàng, cân nặng tổng (Gross) và cân nặng bì (Tare) trực tiếp trên giao diện di động.
* **Tự động hóa quyết toán:** Loại bỏ việc kế toán nhập tay tính toán khấu trừ ẩm/tạp chất, tự động áp bảng giá ngày để xuất hóa đơn quyết toán ngay khi lúa nhập kho.
* **Kiểm soát tồn kho:** Theo dõi lượng lúa nhập kho chính xác theo từng kho/silo chứa và theo từng lô hàng vụ mùa.
* **Báo cáo thời gian thực:** Cung cấp số liệu sản lượng, dòng tiền cho Giám đốc tức thì trên thiết bị di động để kịp thời đưa ra quyết định thương mại.

---

## 3. Các thực thể dữ liệu cốt lõi (Core Data Entities)

Hệ thống quản trị dữ liệu dựa trên các thực thể chính sau:
* **Hợp tác xã (Tenant/HTX):** Chứa thông tin đơn vị sử dụng (Mã HTX, Tên, Địa chỉ, Số điện thoại).
* **Người dùng (User):** Cán bộ vận hành hệ thống (Mã người dùng, Tên, Email/Số điện thoại, Mật khẩu băm, Vai trò).
* **Nông dân/Thương lái (Farmer):** Danh mục đối tác bán lúa (Mã nông dân, Tên, SĐT, Địa chỉ, Số tài khoản).
* **Giống lúa (RiceVariety):** Danh mục giống lúa thu mua (Mã giống lúa, Tên giống lúa, Mô tả).
* **Bảng giá ngày (PriceConfig):** Cấu hình giá lúa (Giống lúa, Đơn giá/kg, Ngày áp dụng, Trạng thái phê duyệt).
* **Kho chứa (Warehouse/Silo):** Danh mục kho chứa (Mã kho, Tên kho, Sức chứa tối đa, Số lượng tồn thực tế).
* **Phiếu cân (WeighingReceipt):** Bản ghi chi tiết cân lúa (Số phiếu, Mã nông dân, Biển số xe, Giống lúa, Khối lượng tổng, Khối lượng bì, Khối lượng tịnh, Độ ẩm %, Tạp chất %, Người cân, Trạng thái).
* **Phiếu thanh toán (SettlementVoucher):** Bản ghi quyết toán tiền lúa (Mã phiếu thanh toán, Mã phiếu cân, Khối lượng thanh toán sau khấu trừ, Đơn giá áp dụng, Tổng tiền, Kế toán thực hiện, Người phê duyệt, Trạng thái thanh toán).

---

## 4. Yêu cầu Chức năng chi tiết (Functional Requirements)

### 4.1. Module Quản trị & Danh mục (Admin & Master Data)
* **Quản lý Thành viên:** Admin có thể tạo mới, phân quyền, khóa tài khoản cán bộ trạm cân, thủ kho, kế toán, giám đốc.
* **Quản lý Giống lúa:** Thêm mới và cấu hình danh mục giống lúa thu mua.
* **Quản lý Đối tác:** Quản lý danh mục Nông dân và Thương lái liên kết.

### 4.2. Module Trạm Cân (Weighing Operations)
* **Tạo Phiếu cân lần 1 (Nhập hàng):** Ghi nhận Nông dân, Giống lúa, Biển số xe, Khối lượng tổng (Gross Weight), Đo độ ẩm (Moisture %), Đo tạp chất (Trash %).
* **Tạo Phiếu cân lần 2 (Ra cổng):** Gọi lại phiếu cân tạm thời, ghi nhận Khối lượng bì (Tare Weight). Hệ thống tự tính Khối lượng tịnh (Net Weight = Gross - Tare).
* **In phiếu cân tạm thời:** In ra máy in nhiệt di động qua kết nối Bluetooth/mạng nội bộ.

### 4.3. Module Kho chứa (Warehouse Management)
* **Xác nhận nhập kho:** Thủ kho tiếp nhận yêu cầu nhập hàng từ phiếu cân, chỉ định Silo/Kho chứa lúa và xác nhận lúa đã được trút vào kho thành công.
* **Theo dõi tồn kho:** Hiển thị sản lượng lúa thực tế của từng Silo theo giống lúa và theo từng lô hàng vụ mùa.

### 4.4. Module Quyết toán & Thanh toán (Settlement & Billing)
* **Tự động áp giá:** Kế toán đối chiếu phiếu cân đã nhập kho, hệ thống tự động áp bảng giá ngày tương ứng.
* **Tính toán khấu trừ chất lượng:** 
  * Áp dụng công thức trừ ẩm lũy tiến: Mỗi 1% độ ẩm vượt chuẩn 14% trừ 1.2% khối lượng tịnh.
  * Áp dụng công thức trừ tạp chất: Mỗi 1% tạp chất vượt chuẩn 1% trừ 1% khối lượng tịnh.
  * Tính khối lượng thanh toán quy đổi và tổng tiền thanh toán thực tế.
* **Lập và duyệt Phiếu chi:** 
  * Phiếu chi < 50,000,000 VNĐ: Kế toán duyệt trực tiếp.
  * Phiếu chi >= 50,000,000 VNĐ: Chờ Giám đốc duyệt từ xa trên điện thoại.
* **Thanh toán:** Kế toán xác nhận chuyển khoản ngân hàng hoặc chi tiền mặt thành công.

### 4.5. Báo cáo & Dashboard (Reporting)
* **Dashboard Giám đốc:** Xem biểu đồ sản lượng lúa thu mua theo ngày/vụ mùa, tiến độ chi tiền, sản lượng tồn kho của từng silo dưới dạng biểu đồ trực quan.
* **Xuất dữ liệu Excel:** Kế toán và Giám đốc có thể xuất báo cáo danh sách phiếu cân, phiếu chi ra file Excel để làm báo cáo nội bộ.

---

## 5. Phạm vi tính năng - MVP Scope (Must Have, Should Have, Future)

Hệ thống được phân loại tính năng theo mức độ ưu tiên để phát triển cuốn chiếu hiệu quả:

| Thứ tự ưu tiên | Nhóm tính năng | Chi tiết yêu cầu kỹ thuật nghiệp vụ |
| :--- | :--- | :--- |
| **Must Have** *(Bắt buộc phải có để chạy thử nghiệm)* | **Quản trị người dùng & Phân quyền** | Xác thực đăng nhập cơ bản, phân quyền 5 nhóm người dùng (Admin, Nhân viên cân, Thủ kho, Kế toán, Giám đốc). |
| | **Ghi nhận Phiếu Cân** | Lập phiếu cân 2 bước (Gross và Tare), ghi độ ẩm, tạp chất. |
| | **Tính toán khấu trừ tự động** | Công thức tự động trừ ẩm, tạp chất và áp giá ngày để tính tổng tiền lúa. |
| | **Xác nhận Kho bãi** | Thủ kho bấm nút xác nhận lúa vào silo và cập nhật sản lượng tồn kho. |
| | **Quy trình Thanh toán & Phê duyệt** | Kế toán lập phiếu chi, Giám đốc duyệt trực tuyến các phiếu lớn hơn 50 triệu VNĐ. |
| | **Offline Storage tạm thời** | Cho phép lưu tạm phiếu cân trên trình duyệt khi mất mạng để không gián đoạn cân. |
| **Should Have** *(Cần thiết cho vận hành chuyên nghiệp)* | **Giao diện di động Mobile-First** | Giao diện nút bấm lớn, chữ to, tối giản nhập liệu bằng một tay ngoài hiện trường. |
| | **In Bluetooth cầm tay** | Kết nối in hóa đơn nhiệt mini trực tiếp từ ứng dụng Web trên điện thoại di động của cán bộ cân. |
| | **Xuất nhập Excel** | Import danh sách nông dân từ file Excel; Export danh sách quyết toán ra Excel. |
| | **Báo cáo Dashboard trực quan** | Biểu đồ cột sản lượng theo ngày, biểu đồ tròn phân bố giống lúa. |
| | **Lịch sử ghi vết (Audit Log)** | Ghi log toàn bộ lịch sử chỉnh sửa phiếu cân và phiếu chi (Người sửa, Thời gian, Giá trị trước và sau). |
| **Future** *(Mở rộng và tự động hóa cao)* | **Tích hợp IoT đầu cân** | Đọc dữ liệu tự động từ đầu cân điện tử và máy đo ẩm tự động qua giao thức mạng/Bluetooth. |
| | **Thanh toán VietQR tự động** | Liên kết API ngân hàng, kế toán bấm nút chuyển khoản hệ thống tự sinh mã QR thanh toán nhanh hoặc thực hiện lệnh chi trực tiếp. |
| | **Trí tuệ nhân tạo (AI Classification)** | Sử dụng camera điện thoại nhận diện và đánh giá tỷ lệ hạt lép, hạt vỡ để đề xuất phân cấp chất lượng lúa. |
| | **Mô hình đa người thuê SaaS** | Cung cấp tài khoản độc lập cho các hợp tác xã khác ngoài HTX Hòa Tiến 2 đăng ký thuê bao. |
