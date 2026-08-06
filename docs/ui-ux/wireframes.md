# PHÁC THẢO GIAO DIỆN (WIREFRAMES)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Tài liệu này phác thảo bố cục (Wireframe) của 8 màn hình cốt lõi trên cả thiết bị di động (Mobile-first) và máy tính, tối ưu hóa cho điều kiện sử dụng thực tế ngoài đồng ruộng của cán bộ Hợp tác xã.

---

## 1. Màn hình Đăng nhập (Login Screen - Mobile)

* **Thiết bị:** Di động.
* **Bố cục:** Tối giản, tập trung vào ô nhập số điện thoại và mật khẩu lớn để cán bộ cân dễ chạm nhập nhanh.

```text
+---------------------------------------+
|                RiceOS                 |
|   Smart Rice Procurement Platform     |
|                                       |
|  [Logo HTX Nông nghiệp Hòa Tiến 2]    |
|                                       |
|  Tên đăng nhập (Số điện thoại)        |
|  +---------------------------------+  |
|  | 0905123456                      |  |
|  +---------------------------------+  |
|                                       |
|  Mật khẩu                             |
|  +---------------------------------+  |
|  | **********                      |  |
|  +---------------------------------+  |
|                                       |
|  [ ] Nhớ mật khẩu đăng nhập           |
|                                       |
|  +---------------------------------+  |
|  |            ĐĂNG NHẬP            |  |  <-- Nút bấm chiều cao lớn (48px)
|  +---------------------------------+  |
|                                       |
+---------------------------------------+
```

---

## 2. Màn hình Dashboard (Trang chủ Giám đốc - Mobile/Desktop)

* **Thiết bị:** Di động/Máy tính.
* **Đặc điểm:** Xem nhanh các chỉ số sản lượng và tiền quyết toán của vụ mùa hiện tại.

```text
+---------------------------------------+
| 🏠 RiceOS - Vụ Đông Xuân 2026   [🔔1] |
|---------------------------------------|
| 🟢 ĐANG TRỰC TUYẾN - ĐÃ ĐỒNG BỘ       |
|---------------------------------------|
|  Sản lượng thu mua hôm nay:           |
|  >> 45,230 kg (45.2 Tấn)              |
|                                       |
|  Số tiền đã quyết toán:               |
|  >> 361,840,000 VNĐ                   |
|                                       |
|  +---------------------------------+  |
|  |   [+] LẬP PHIẾU CÂN MỚI NHANH   |  |  <-- Nút màu xanh lá nổi bật
|  +---------------------------------+  |
|                                       |
|  Tồn kho Silo thực tế:                |
|  +---------------------------------+  |
|  | Silo A (OM18): [======---] 75%  |  |
|  | Silo B (DT8) : [====------] 40%  |  |
|  +---------------------------------+  |
+---------------------------------------+
|  [🏠 Trang chủ]  [⚖️ Cân]  [📦 Kho]    |  <-- Bottom Nav Bar chiều cao lớn
+---------------------------------------+
```

---

## 3. Màn hình Tạo phiếu cân lần 1 (Weighing Receipt - Mobile)

* **Thiết bị:** Di động.
* **Đặc điểm:** Tối ưu hóa nhập liệu bằng một tay ngoài hiện trường trạm cân, chữ lớn, giảm gõ văn bản.

```text
+---------------------------------------+
| ← LẬP PHIẾU CÂN LẦN 1                 |
|---------------------------------------|
|  1. BIỂN SỐ XE                        |
|  +---------------------------------+  |
|  | 43C-123.45                      |  |
|  +---------------------------------+  |
|                                       |
|  2. GIỐNG LÚA                         |
|  [ OM18 ]  [ Đài Thơm 8 ]  [ IR504 ]  |  <-- Chọn nhanh dạng Card Button
|                                       |
|  3. NÔNG DÂN / THƯƠNG LÁI             |
|  +---------------------------------+  |
|  | Nguyễn Văn A (SĐT: 090...)      |  |
|  +---------------------------------+  |
|                                       |
|  4. KHỐI LƯỢNG TỔNG (GROSS - kg)      |
|  +---------------------------------+  |
|  | 12,450                          |  |  <-- Ô nhập số siêu lớn, tự focus
|  +---------------------------------+  |
|                                       |
|  5. CHẤT LƯỢNG LÚA                    |
|  Độ ẩm (%)         Tạp chất (%)       |
|  +--------------+  +---------------+  |
|  | 15.5         |  | 1.2           |  |
|  +--------------+  +---------------+  |
|                                       |
|  +---------------------------------+  |
|  |       LƯU PHIẾU CHỜ NHẬP KHO    |  |
|  +---------------------------------+  |
+---------------------------------------+
```

---

## 4. Màn hình Chi tiết phiếu cân & Cân lần 2 (Mobile)

* **Thiết bị:** Di động.
* **Đặc điểm:** Gọi lại phiếu khi xe quay ra để cân vỏ và in phiếu chính thức.

```text
+---------------------------------------+
| ← PHIẾU CÂN: PC-20260806-0001         |
|---------------------------------------|
|  Trạng thái: Chờ cân vỏ               |
|  Biển số: 43C-123.45 | Lúa: OM18      |
|  Nông dân: Nguyễn Văn A               |
|---------------------------------------|
|  Khối lượng tổng: 12,450 kg           |
|  Độ ẩm: 15.5%    | Tạp chất: 1.2%     |
|  Silo nhập kho: Silo A (Xác nhận bởi  |
|                 Thủ kho Tư)           |
|---------------------------------------|
|  NHẬP KHỐI LƯỢNG VỎ XE (TARE - kg)     |
|  +---------------------------------+  |
|  | 3,250                           |  |  <-- Nhập vỏ xe trống
|  +---------------------------------+  |
|                                       |
|  Khối lượng tịnh tính toán:           |
|  >> 9,200 kg                          |
|                                       |
|  +---------------------------------+  |
|  |  HOÀN TẤT & IN PHIẾU CHÍNH THỨC |  |  <-- Tự động in hóa đơn Bluetooth
|  +---------------------------------+  |
+---------------------------------------+
```

---

## 5. Màn hình Xe nhận (Warehouse Receipt Queue - Mobile)

* **Thiết bị:** Di động.
* **Đặc điểm:** Màn hình của thủ kho để quản lý hàng đợi và chỉ định silo chứa lúa.

```text
+---------------------------------------+
| 📦 HÀNG ĐỢI XE CHỜ NHẬP KHO     [🔄] |
|---------------------------------------|
|  [Xe 1] Biển số: 43C-123.45           |
|  Lúa: OM18 | Cân tổng: 12,450 kg      |
|  +---------------------------------+  |
|  | CHỈ ĐỊNH SILO NHẬN LÚA          |  |  <-- Chạm chọn silo trống thích hợp
|  +---------------------------------+  |
|  [ Silo A (OM18): 75% ] [ Silo C: Trống] |
|                                       |
|  +---------------------------------+  |
|  |       XÁC NHẬN NHẬP KHO OK      |  |  <-- Chạm để chuyển trạng thái xe
|  +---------------------------------+  |
|---------------------------------------|
|  [Xe 2] Biển số: 92H-567.89           |
|  Lúa: Đài Thơm 8 | Chờ chỉ định...    |
+---------------------------------------+
```

---

## 6. Màn hình Quyết toán (Settlement Screen - Desktop Portal)

* **Thiết bị:** Máy tính (Desktop).
* **Đặc điểm:** Giao diện cột chia đôi: Bên trái chọn phiếu cân đã nhập kho, bên phải hiển thị chi tiết bảng tính khấu trừ tiền lúa và nút thanh toán.

```text
+---------------------------------------------------------------------------------+
| RiceOS Portal                                            [ Kế toán Lan ] [🔔]  |
|---------------------------------------------------------------------------------|
| [Báo cáo]   | DANH SÁCH CHỜ QUYẾT TOÁN     | CHI TIẾT TÍNH TIỀN: Phiếu PC-0001  |
| [*Quyết toán|------------------------------|------------------------------------|
| [Kho Silo]  | [ ] PC-0001 - Xe 43C-123.45  | Nông dân: Nguyễn Văn A             |
| [Danh mục]  |     Lúa: OM18 | 9,200 kg     | Khối lượng tịnh: 9,200 kg          |
| [Cài đặt]   |     HTX: Hòa Tiến 2          | ---------------------------------- |
|             | [ ] PC-0002 - Xe 92H-567.89  | Đơn giá ngày: 8,000 VNĐ/kg         |
|             |     Lúa: DT8  | 8,500 kg     | Trừ ẩm (15.5%): -1.8% (-165 kg)    |
|             |                              | Trừ tạp chất (1.2%): -0.2% (-18 kg)|
|             |                              | Khối lượng quy đổi: 9,017 kg       |
|             |                              | ---------------------------------- |
|             |                              | TỔNG CHI TRẢ: 72,136,000 VNĐ       |
|             |                              | (Vượt hạn mức 50M -> Chờ Sếp duyệt)|
|             |                              | ---------------------------------- |
|             |                              | [Gửi yêu cầu Giám đốc phê duyệt]   |
+---------------------------------------------------------------------------------+
```

---

## 7. Màn hình Báo cáo (Reporting Screen - Desktop Portal)

* **Thiết bị:** Máy tính (Desktop).
* **Đặc điểm:** Xuất báo cáo Excel và theo dõi biểu đồ tồn kho, dòng tiền thu mua.

```text
+---------------------------------------------------------------------------------+
| RiceOS Portal                                            [ Kế toán Lan ] [🔔]  |
|---------------------------------------------------------------------------------|
| [Báo cáo]   | BÁO CÁO VỤ MÙA ĐÔNG XUÂN 2026                                    |
| [Quyết toán]| ---------------------------------------------------------------- |
| [Kho Silo]  | Bộ lọc báo cáo:                                                  |
| [Danh mục]  | Từ ngày: [ 01/08/2026 ]  Tới ngày: [ 06/08/2026 ]                |
| [Cài đặt]   | Giống lúa: [ Tất cả v ]  Đối tác: [ Nguyễn Văn A   ]             |
|             |                                                                   |
|             | [ XUẤT FILE EXCEL ĐỐI SOÁT ]    [ XUẤT FILE BÁO CÁO THU MUA ]     |
|             | ---------------------------------------------------------------- |
|             | Thống kê tổng hợp:                                               |
|             | * Tổng sản lượng thu mua: 154.5 Tấn                              |
|             | * Tổng tiền đã chi: 1,236,000,000 VNĐ                            |
|             | * Tổng số phiếu cân đã quyết toán: 182 phiếu                      |
+---------------------------------------------------------------------------------+
```

---

## 8. Màn hình Cài đặt (Settings Screen - Mobile)

* **Thiết bị:** Di động.
* **Đặc điểm:** Chứa cài đặt kích thước chữ siêu lớn ngoài đồng và quản lý đồng bộ dữ liệu ngoại tuyến.

```text
+---------------------------------------+
| ← CÀI ĐẶT & HỒ SƠ                     |
|---------------------------------------|
|  Tài khoản: Nguyễn Văn B (Cán bộ cân)  |
|  Hợp tác xã: Hòa Tiến 2               |
|---------------------------------------|
|  CẤU HÌNH GIAO DIỆN                   |
|  [ ] Bật cỡ chữ siêu lớn (Ngoài đồng)  |
|                                       |
|  CHỮ KÝ CỦA BẠN (Dùng in phiếu)        |
|  [Ảnh chữ ký: signature_B.png]        |
|  [ Thay đổi chữ ký tay ]              |
|---------------------------------------|
|  ĐỒNG BỘ DỮ LIỆU NGOẠI TUYẾN          |
|  Trạng thái: Đã kết nối Internet      |
|  Bản ghi chưa đồng bộ: 0              |
|                                       |
|  +---------------------------------+  |
|  |     ĐỒNG BỘ DỮ LIỆU NGAY        |  |  <-- Bấm đồng bộ cưỡng bức
|  +---------------------------------+  |
+---------------------------------------+
```

---

## 9. Màn hình Đồng bộ Offline (Offline Sync Screen - Mobile)

* **Thiết bị:** Di động.
* **Đặc điểm:** Giám sát hàng đợi đồng bộ local, kiểm soát lỗi xung đột chéo dữ liệu và quản lý trạng thái mạng thực tế.

```text
+---------------------------------------+
| ← GIÁM SÁT ĐỒNG BỘ OFFLINE            |
|---------------------------------------|
|  Trạng thái mạng: ⚠️ MẤT KẾT NỐI       |
|  Dữ liệu lưu tạm trên máy: [ 3 phiếu ] |
|---------------------------------------|
|  DANH SÁCH CHỜ ĐỒNG BỘ (Sync Queue)   |
|                                       |
|  1. [Phiếu Cân] PC-20260806-0004      |
|     Nông dân: Nguyễn Văn C            |
|     Khối lượng tổng: 8,500 kg         |
|     Trạng thái: Chờ mạng để gửi       |
|                                       |
|  2. [Xác nhận Kho] PC-20260806-0001   |
|     Thủ kho nhận: Silo A              |
|     Trạng thái: Lỗi xung đột [!]      |
|     [ Xem chi tiết và chọn phương án ]|  <-- Xử lý xung đột thủ công
|                                       |
|  +---------------------------------+  |
|  |   THỬ ĐỒNG BỘ LẠI CÁC PHIẾU LỖI |  |
|  +---------------------------------+  |
+---------------------------------------+
```

---

## 10. Màn hình Camera Quét AI (AI Camera Screen - Mobile)

* **Thiết bị:** Di động.
* **Đặc điểm:** Sử dụng camera quét bao lúa, tự động nhận diện chữ số ghi trên bao hoặc quét mã QR gắn trên xe lúa của nông dân để nhập nhanh thông tin.

```text
+---------------------------------------+
| ← CAMERA AI - QUÉT NHẬP LIỆU NHANH    |
|---------------------------------------|
|        [ Đèn Flash: Tắt ]             |
|                                       |
|     +---------------------------+     |
|     |                           |     |
|     |    Khung căn chỉnh quét   |     |
|     |    [Quét Mã QR Xe/Bao]    |     |
|     |            hoặc           |     |
|     |    [Quét Chữ Số Ghi Bao]  |     |
|     |                           |     |
|     +---------------------------+     |
|                                       |
|  Hệ thống nhận diện được:             |
|  >> Biển số xe: 43C-123.45            |
|  (Độ chính xác: 98%)                  |
|                                       |
|  +---------------------------------+  |
|  |     ĐỒNG Ý VÀ ÁP DỤNG KẾT QUẢ   |  |  <-- Nhấn để tự động điền Form
|  +---------------------------------+  |
|  |            QUÉT LẠI             |  |
|  +---------------------------------+  |
+---------------------------------------+
```

---

## 11. Màn hình xem trước Phiếu In Nhiệt (Printable Receipt Screen - Mobile)

* **Thiết bị:** Di động.
* **Đặc điểm:** Hiển thị bản vẽ xem trước (Preview) định dạng in nhiệt K57/K80 đúng kích cỡ giấy in nhiệt cầm tay trước khi bắn dữ liệu Bluetooth.

```text
+---------------------------------------+
| ← XEM TRƯỚC PHIẾU IN NHIỆT      [🖨️] |
|---------------------------------------|
|  Khổ giấy: [ K57 (58mm) v ]           |
|---------------------------------------|
|  +---------------------------------+  |
|  |      HTX NÔNG NGHIỆP HÒA TIẾN 2 |  |
|  |         --- RICEOS ---          |  |
|  |                                 |  |
|  | Phiếu số: PC-20260806-0001      |  |
|  | Ngày cân: 06/08/2026 13:00      |  |
|  | Biển số xe: 43C-123.45          |  |
|  | Nông dân: Nguyễn Văn A          |  |
|  | Giống lúa: OM18                 |  |
|  | ------------------------------- |  |
|  | Cân tổng (Gross): 12,450 kg     |  |
|  | Cân vỏ (Tare):     3,250 kg     |  |
|  | Cân tịnh (Net):    9,200 kg     |  |
|  | ------------------------------- |  |
|  | Độ ẩm: 15.5%  | Tạp chất: 1.2%  |
|  | Silo nhập: Silo A               |  |
|  |                                 |  |
|  | Chữ ký Cán Cân   Chữ ký Nông Dân|  |
|  |    [Ảnh Ký]                     |  |
|  +---------------------------------+  |
|                                       |
|  +---------------------------------+  |
|  |     BẮN LỆNH IN QUA BLUETOOTH   |  |  <-- Nút hành động chính
|  +---------------------------------+  |
+---------------------------------------+
```

