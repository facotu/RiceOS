# HỆ THỐNG THIẾT KẾ GIAO DIỆN (DESIGN SYSTEM)
## RiceOS - Smart Rice Procurement Platform

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Hệ thống thiết kế RiceOS được xây dựng đặc thù cho ngành nông nghiệp và ứng dụng di động ngoài đồng ruộng, đáp ứng các tiêu chuẩn: **Độ tương phản cao (dễ nhìn dưới nắng chói), Kích thước nút bấm lớn (dễ chạm khi tay dính mồ hôi/bụi), và Khoảng cách thoáng**.

---

## 1. Bảng màu sắc chuyên biệt (Color Palette)

Để wowed người dùng và mang lại cảm xúc tin cậy, an toàn, bảng màu được lấy cảm hứng từ cây lúa và ruộng đồng Việt Nam:

* **Màu chủ đạo (Primary - Xanh lúa chín):** `#1b4d3e` (Xanh lục sẫm rừng già, tạo sự chắc chắn, chuyên nghiệp) kết hợp với màu phụ trợ `#d4af37` (Màu vàng lúa chín óng, dùng làm điểm nhấn quan trọng).
* **Màu nền (Background):**
  * Giao diện máy tính văn phòng: Nền sáng nhẹ sạch sẽ `#f8f9fa` và thẻ card trắng tinh `#ffffff`.
  * Giao diện di động ngoài đồng ruộng (Outdoor Mode): Hỗ trợ chế độ nền tối (Dark Mode) hoặc độ tương phản cao với nền `#f0f2f5` để chống lóa mắt dưới nắng.
* **Màu cảnh báo & Trạng thái (Alerts & Status):**
  * Màu thành công: `#2e7d32` (Xanh lá đậm - Đã quyết toán, Đã nhập kho).
  * Màu cảnh báo: `#ef6c00` (Cam đất - Độ ẩm cao, Chưa đồng bộ offline).
  * Màu lỗi/nguy hiểm: `#c62828` (Đỏ sẫm - Lỗi thiết bị, Từ chối duyệt chi).

---

## 2. Hệ thống kiểu chữ (Typography)

* **Font chữ chủ đạo:** **Outfit** hoặc **Inter** (Google Fonts). Đây là các font chữ không chân (sans-serif) có độ bo tròn mềm mại hiện đại, cực kỳ dễ đọc trên màn hình điện thoại giá rẻ có mật độ điểm ảnh trung bình.
* **Kích thước chữ (Font Sizes):**

| Kiểu hiển thị | Kích thước chuẩn (Desktop) | Kích thước ngoài đồng (Mobile Outdoor Mode) | Ứng dụng thực tế |
| :--- | :---: | :---: | :--- |
| **Title (Tiêu đề lớn)** | `24px` (Bold) | `28px` (Bold) | Tiêu đề trang, số lượng sản phẩm lớn. |
| **Subtitle (Tiêu đề phụ)**| `18px` (Medium)| `20px` (Medium)| Tên nông dân, số phiếu cân. |
| **Body (Nội dung chính)** | `14px` (Regular)| `16px` (Medium)| Số kg cân, ghi chú, nhãn trường nhập liệu. |
| **Caption (Chữ nhỏ)** | `12px` (Regular)| `14px` (Regular)| Thời gian, trạng thái đồng bộ ngoại tuyến. |

---

## 3. Các thành phần giao diện chuẩn di động (Components Specification)

### 3.1. Nút bấm di động (Buttons)
* **Kích thước vùng chạm (Touch Target):** Chiều cao tối thiểu của nút trên di động là **48px** (Khuyên dùng **54px** cho nút thao tác chính ngoài hiện trường).
* **Bo góc (Border Radius):** `12px` để mang lại cảm giác premium, thân thiện.
* **Khoảng cách:** Khoảng cách giữa các nút bấm cạnh nhau tối thiểu là **12px** để tránh bấm nhầm bằng ngón tay cái.

### 3.2. Thẻ hiển thị thông tin (Cards)
* Sử dụng thẻ Card để nhóm các thông tin phiếu cân hoặc xe hàng lại với nhau.
* Cấu trúc thẻ: Nền trắng, bo góc `12px`, bóng mờ mềm (shadow: `0px 4px 12px rgba(0,0,0,0.05)`). Viền thẻ mảnh 1px màu xám nhạt `#e0e0e0` để tách biệt thông tin khi nhìn ngoài trời nắng.

### 3.3. Biểu mẫu nhập liệu (Forms & Inputs)
* **Chiều cao ô nhập:** Bắt buộc từ **48px** trở lên.
* **Vùng chọn nhanh (Chips select):** Đối với các trường danh mục ít giá trị (ví dụ: Giống lúa: OM18, Đài Thơm 8, IR504), thiết kế dưới dạng các khối nút chọn nhanh (Segmented Control) thay vì dropdown để người dùng chọn chỉ bằng 1 chạm.
* **Tự động kích hoạt bàn phím số:** Đối với các trường nhập khối lượng, độ ẩm, tạp chất, input bắt buộc sử dụng thuộc tính `inputmode="decimal"` hoặc `type="number"` để bàn phím số tự động mở lớn trên điện thoại.

### 3.4. Bảng biểu dữ liệu di động (Mobile Responsive Tables)
* Trên máy tính, sử dụng bảng lưới Excel tiêu chuẩn.
* Trên di động, không sử dụng bảng cuộn ngang (vì rất khó kéo ngoài đồng). Toàn bộ danh sách phiếu cân sẽ được chuyển đổi hiển thị dưới dạng danh sách các Card xếp dọc, mỗi Card chứa 3 thông tin quan trọng nhất hiển thị chữ đậm lớn.

### 3.5. Thanh trạng thái kết nối (Offline Status Badge)
* Nằm ở vị trí cố định trên cùng hoặc dưới cùng màn hình di động:
  * Trực tuyến: Thanh nền xanh lục mảnh, chữ màu trắng: "🟢 ĐÃ KẾT NỐI - DỮ LIỆU ĐÃ ĐỒNG BỘ".
  * Ngoại tuyến: Thanh nền cam đất nhấp nháy nhẹ, chữ trắng: "⚠️ ĐANG NGOẠI TUYẾN - [3] PHIẾU CHỜ ĐỒNG BỘ".
