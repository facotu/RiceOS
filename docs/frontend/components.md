# ĐẶC TẢ THÀNH PHẦN GIAO DIỆN (COMPONENT SPECIFICATION)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Tài liệu này đặc tả kỹ thuật các thành phần giao diện (UI Components) cốt lõi của RiceOS, bao gồm mục đích sử dụng, các tham số đầu vào (Props) và sự kiện đầu ra (Events) bằng TypeScript.

---

## 1. Component: `Button` (Nút bấm lớn)

* **Mục đích:** Nút chạm tương tác chính trên toàn hệ thống di động và desktop.
* **Props:**
  * `label` (`string`): Nhãn hiển thị trên nút.
  * `variant` (`'primary' | 'secondary' | 'danger' | 'success'`): Kiểu hiển thị màu sắc tương ứng.
  * `size` (`'normal' | 'large'`): Kích thước nút. Kích thước `large` (chiều cao 54px) dùng ngoài đồng ruộng.
  * `disabled` (`boolean`): Khóa tương tác của nút.
  * `isLoading` (`boolean`): Hiển thị icon xoay tròn chờ xử lý.
* **Events:**
  * `onClick` (`() => void`): Kích hoạt khi người dùng chạm vào nút.

---

## 2. Component: `Input` (Trường nhập liệu lớn)

* **Mục đích:** Hỗ trợ nhập số liệu (cân nặng, độ ẩm, tạp chất) chữ to, hỗ trợ tự động mở bàn phím số.
* **Props:**
  * `label` (`string`): Tên nhãn hiển thị phía trên trường nhập.
  * `value` (`string | number`): Giá trị của trường.
  * `placeholder` (`string`): Chữ gợi ý hiển thị mờ.
  * `type` (`'text' | 'number'`): Kiểu nhập liệu.
  * `inputMode` (`'text' | 'decimal' | 'numeric'`): Kích hoạt loại bàn phím ảo thích hợp trên điện thoại.
  * `error` (`string`): Thông điệp báo lỗi hiển thị chữ màu đỏ phía dưới.
* **Events:**
  * `onChange` (`(value: string) => void`): Kích hoạt khi người dùng thay đổi ký tự nhập.

---

## 3. Component: `OfflineStatusIndicator` (Thanh trạng thái kết nối)

* **Mục đích:** Hiển thị trạng thái mạng và số lượng bản ghi chưa đồng bộ trên PWA di động.
* **Props:**
  * `isOnline` (`boolean`): Trạng thái kết nối Internet thực tế.
  * `pendingSyncCount` (`number`): Số lượng phiếu cân đang nằm trong hàng đợi local.
* **Events:**
  * `onSyncNow` (`() => void`): Kích hoạt khi người dùng bấm nút ép buộc đồng bộ dữ liệu thủ công.

---

## 4. Component: `SiloSelector` (Bộ chọn Silo chứa lúa)

* **Mục đích:** Cho phép thủ kho chọn silo sấy lúa phù hợp với giống lúa đang nhận.
* **Props:**
  * `selectedSiloId` (`string`): ID của Silo đang được chọn.
  * `riceVarietyId` (`string`): ID giống lúa của xe hàng để hệ thống tự động lọc ra các Silo hợp lệ.
* **Events:**
  * `onSelect` (`(siloId: string) => void`): Kích hoạt khi thủ kho chạm chọn một Silo.

---

## 5. Component: `CapacityBar` (Thanh tiến độ sức chứa Silo)

* **Mục đích:** Hiển thị trực quan mức độ chứa lúa hiện tại của Silo để cảnh báo quá tải.
* **Props:**
  * `currentWeight` (`number`): Trọng lượng tồn thực tế trong silo (kg).
  * `maxCapacity` (`number`): Sức chứa tối đa (kg).
* **Events:** Không có.

---

## 6. Component: `BluetoothPrinterConnector` (Kết nối in hóa đơn)

* **Mục đích:** Thiết lập kết nối không dây từ trình duyệt điện thoại tới máy in nhiệt cầm tay.
* **Props:**
  * `receiptId` (`string`): ID phiếu cân cần in.
* **Events:**
  * `onConnectSuccess` (`(device: BluetoothDevice) => void`): Kích hoạt khi kết nối Bluetooth thành công.
  * `onPrintComplete` (`() => void`): Kích hoạt sau khi dữ liệu in đã truyền xong tới máy in.
