# KIẾN TRÚC TỔNG THỂ HỆ THỐNG (SYSTEM ARCHITECTURE)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

## 1. Mô hình Kiến trúc Tổng thể (Overall Architecture Model)

RiceOS áp dụng mô hình kiến trúc **SPA (Single Page Application) / PWA (Progressive Web App)** kết hợp với **BaaS (Backend-as-a-Service - Supabase/PostgreSQL)** để tối ưu hóa khả năng phản hồi trên thiết bị di động, hoạt động ngoại tuyến (Offline-First) và cô lập bảo mật đa đơn vị (Multi-tenant) ở mức cơ sở dữ liệu.

```text
+---------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                    |
|                                                                                 |
|  +--------------------+   +--------------------+   +-------------------------+  |
|  | Cán bộ cân (PWA)   |   |  Thủ kho (PWA)     |   | Kế toán/Giám đốc (Web)  |  |
|  | - Offline Mode     |   |  - Warehouse App   |   | - Desktop Portal        |  |
|  | - Bluetooth Print  |   |  - Silo Management |   | - Real-time Dashboard   |  |
|  +----------+---------+   +---------+----------+   +------------+------------+  |
|             |                       |                           |               |
|             |                       v                           |               |
|             +-------------> [ Local Sync Manager ] <------------+               |
|                             - IndexedDB / RxDB                                  |
|                             - Online/Offline Switcher                           |
+-------------------------------------+-------------------------------------------+
                                      |
                                      | HTTPS / WebSockets (Khi có Internet)
                                      v
+---------------------------------------------------------------------------------+
|                                GATEWAY & AUTH                                   |
|                                                                                 |
|                      [ Supabase API Gateway & Auth JWT ]                        |
+-------------------------------------+-------------------------------------------+
                                      |
                                      v
+---------------------------------------------------------------------------------+
|                                 BACKEND LAYER                                   |
|                                                                                 |
|   +--------------------------+  +-------------------+  +--------------------+   |
|   | PostgreSQL (Multi-tenant)|  | Cloud Functions   |  | Storage            |   |
|   | - Row Level Security     |  | - PDF Generator   |  | - Receipts PDF     |   |
|   | - Triggers / Audit Logs  |  | - e-Payment Sync  |  | - Bank statements  |   |
|   +--------------------------+  +-------------------+  +--------------------+   |
+---------------------------------------------------------------------------------+
```

### Chi tiết các lớp:
1. **Lớp ứng dụng khách (Client Layer):**
   * Được xây dựng bằng công nghệ Web hiện đại (như React/Next.js).
   * Chạy trực tiếp trên trình duyệt Web di động dưới dạng **PWA (Progressive Web App)**, cho phép cài đặt ứng dụng vào màn hình chính điện thoại của cán bộ cân và thủ kho để sử dụng giống như ứng dụng Native.
   * Tích hợp **Local Sync Manager** quản lý dữ liệu lưu tạm dưới IndexedDB khi mất sóng, hỗ trợ in hóa đơn di động qua trình duyệt bằng Web Bluetooth API.
2. **Lớp dịch vụ trung gian (Gateway & Auth):**
   * Kiểm soát toàn bộ các yêu cầu HTTP gửi từ Client lên Server.
   * Xác thực danh tính người dùng thông qua mã JWT (JSON Web Token) chứa mã định danh người dùng và mã đơn vị hợp tác xã (`tenant_id`).
3. **Lớp lưu trữ và xử lý backend (Backend Layer):**
   * Sử dụng cơ sở dữ liệu **PostgreSQL** làm lõi lưu trữ dữ liệu.
   * Sử dụng cơ chế Row Level Security (RLS) để cô lập dữ liệu tuyệt đối giữa các Hợp tác xã (Tenants).
   * Các Trigger tự động hóa ghi nhật ký hoạt động (Audit Logs) và cập nhật số lượng tồn kho.

---

## 2. Phân rã các Module Hệ thống (System Modules)

Hệ thống RiceOS được chia thành 6 module chức năng độc lập nhưng liên kết chặt chẽ với nhau:

### 2.1. Module Xác thực & Quản lý Tổ chức (Auth & Org Module)
* Quản lý thông tin cấu hình Hợp tác xã (Tên HTX, thông tin liên hệ, cài đặt tỷ lệ trừ ẩm/tạp chất mặc định).
* Quản lý tài khoản cán bộ vận hành, phân vai trò (Admin, Cân, Kho, Kế toán, Giám đốc, Người xem).
* Thực hiện xác thực JWT bảo mật khi gọi API.

### 2.2. Module Trạm Cân (Weighing Module)
* Giao diện nhập phiếu cân 2 bước cho cán bộ cân.
* Thuật toán tự động tính toán Khối lượng tịnh và Khối lượng quy đổi thanh toán ngay trên client.
* Hỗ trợ lưu trữ phiếu cân ngoại tuyến vào IndexedDB và đồng bộ.

### 2.3. Module Kho bãi (Warehouse Module)
* Quản lý danh mục các kho và silo chứa lúa.
* Quản lý vị trí lưu kho lúa theo mã lô hàng vụ mùa.
* Giao diện xác nhận nhập kho thực tế cho thủ kho.

### 2.4. Module Tài chính & Quyết toán (Settlement Module)
* Quản lý bảng giá lúa theo giống lúa và ngày.
* Luồng phê duyệt tài chính (tự động duyệt dưới 50 triệu VNĐ, gửi thông báo phê duyệt tới Giám đốc cho các phiếu từ 50 triệu VNĐ trở lên).
* Ghi nhận lịch sử chi trả (Mã giao dịch ngân hàng, người chi, thời gian).

### 2.5. Module Báo cáo & Giám sát (Dashboard & Reporting Module)
* Bảng điều khiển thời gian thực (Real-time Dashboard) hiển thị biểu đồ sản lượng, luồng tiền thu mua và biểu đồ phần trăm chứa của các silo.
* Công cụ xuất dữ liệu chi tiết ra file Excel phục vụ kế toán.

### 2.6. Module Đồng bộ hóa (Sync Module)
* Giám sát trạng thái kết nối mạng (Online/Offline) của thiết bị.
* Quản lý hàng đợi đồng bộ (Sync Queue) để đẩy dữ liệu từ IndexedDB lên PostgreSQL khi có mạng.
* Thực hiện cơ chế giải quyết xung đột dữ liệu (Conflict Resolution).

---

## 3. Luồng dữ liệu chính của hệ thống (Main Data Flows)

### 3.1. Luồng dữ liệu thu mua lúa 2 bước:
```text
Cán bộ cân               Thủ kho                  Cán bộ cân               Kế toán
(Cân lần 1)             (Nhận hàng)              (Cân lần 2)             (Tính tiền)
     |                       |                        |                       |
     |--- Tạo Phiếu cân ---->|                        |                       |
     |    (Trạng thái:       |                        |                       |
     |     Chờ nhập kho)     |                        |                       |
     |                       |--- Xác nhận nhập ----->|                       |
     |                       |    kho & chỉ định silo |                       |
     |                       |    (Trạng thái:        |                       |
     |                       |     Chờ cân vỏ)        |                       |
     |                       |                        |--- Cân vỏ xe -------->|
     |                       |                        |    (Tính Net weight,  |
     |                       |                        |     Trạng thái:       |
     |                       |                        |     Chờ quyết toán)   |
     |                       |                        |                       |--- Áp giá ngày,
     |                       |                        |                       |    Lập phiếu chi
     |                       |                        |                       |    (Trạng thái:
     |                       |                        |                       |     Chờ thanh toán)
```
### 3.2. Luồng dữ liệu đồng bộ khi hoạt động ngoại tuyến (Offline Sync Flow):
* Khi mất mạng, Client ghi phiếu vào **Local IndexedDB**.
* Khi kết nối Internet hoạt động trở lại, **Sync Module** kích hoạt:
  1. Đọc tuần tự các phiếu cân trong hàng đợi đồng bộ local (`Sync Queue`).
  2. Gửi request REST API đẩy dữ liệu lên máy chủ Supabase.
  3. Supabase ghi nhận vào Database PostgreSQL, chạy các Trigger kiểm tra an toàn dữ liệu và sinh Audit Log.
  4. Trả về mã phản hồi thành công (201 Created).
  5. Client nhận phản hồi, xóa bản ghi tương ứng trong hàng đợi local và chuyển trạng thái phiếu cân thành `Đã đồng bộ`.
