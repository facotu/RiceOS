# KIẾN TRÚC THÔNG TIN (INFORMATION ARCHITECTURE)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

## 1. Cấu trúc Menu & Sơ đồ Trang (System Sitemap)

Hệ thống RiceOS được chia làm 2 phân hệ giao diện chính tối ưu cho từng loại thiết bị:
* **Giao diện Di động (Mobile App - PWA):** Dành cho Cán bộ cân và Thủ kho làm việc ngoài hiện trường.
* **Giao diện Máy tính (Desktop Portal):** Dành cho Admin, Kế toán và Giám đốc xử lý số liệu tại văn phòng.

```text
RiceOS System Navigation Structure
├── [Giao diện Di động - Bottom Navigation]
│   ├── 🏠 Trang chủ (Dashboard di động rút gọn)
│   ├── ⚖️ Trạm cân (Danh sách phiếu cân & Tạo mới)
│   ├── 📦 Nhà kho (Hàng đợi nhận xe & Sơ đồ Silo)
│   └── ⚙️ Cài đặt (Hồ sơ cá nhân, đổi mật khẩu, đồng bộ offline)
│
└── [Giao diện Desktop - Sidebar Navigation]
    ├── 📊 Bảng điều khiển (Real-time Dashboard)
    ├── ⚖️ Phiếu cân lúa (Danh sách đối soát sản lượng)
    ├── 💰 Quyết toán tài chính (Danh sách duyệt chi & thanh toán)
    ├── 📦 Quản lý Kho (Sản lượng tồn, vị trí lô hàng)
    ├── 👥 Quản lý Danh mục (Nông dân, Giống lúa, Xe tải)
    ├── ⚙️ Cài đặt hệ thống (Người dùng, Cấu hình HTX, Đơn giá ngày)
    └── 📜 Nhật ký hệ thống (Audit Logs)
```

---

## 2. Thiết kế Thanh Điều hướng (Navigation Design)

### 2.1. Bottom Navigation Bar (Giao diện Di động)
Để hỗ trợ thao tác một tay dễ dàng ngoài đồng ruộng, menu di động được đặt ở dưới cùng màn hình (Bottom Nav) với chiều cao lớn (64px) và các nút chạm to:
* **Nút 1: Trang chủ (Home)** -> Chứa trạng thái mạng, nút đồng bộ nhanh và tóm tắt công việc trong ngày.
* **Nút 2: Trạm cân (Weighing)** -> Mở danh sách phiếu cân tạm, nút "+" nổi bật màu xanh lá ở góc phải để tạo phiếu cân mới nhanh.
* **Nút 3: Nhà kho (Warehouse)** -> Hiển thị danh sách xe đang đợi nhập kho (được gắn Badge số đỏ chỉ lượng xe đang chờ).
* **Nút 4: Cá nhân (Settings)** -> Xem hồ sơ, chữ ký số và tùy chọn bật/tắt kích thước chữ siêu lớn.

### 2.2. Sidebar Navigation (Giao diện Desktop Portal)
Menu nằm bên trái màn hình, hỗ trợ thu gọn lại thành dạng icon để tối ưu không gian hiển thị bảng biểu dữ liệu cho Kế toán.

---

## 3. Phân quyền hiển thị Menu theo vai trò (Visibility Matrix)

Hệ thống tự động ẩn hoặc hiện các mục menu trên thanh điều hướng dựa trên vai trò của người dùng sau khi đăng nhập để tránh nhầm lẫn giao diện:

| Menu Mục | Admin | Cán bộ cân | Thủ kho | Kế toán | Giám đốc | Người xem |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Tạo phiếu cân mới (`+`)** | ❌ | **Hiện** | ❌ | ❌ | ❌ | ❌ |
| **Xác nhận nhập kho** | ❌ | ❌ | **Hiện** | ❌ | ❌ | ❌ |
| **Lập phiếu chi quyết toán** | ❌ | ❌ | ❌ | **Hiện** | ❌ | ❌ |
| **Phê duyệt chi tiền** | ❌ | ❌ | ❌ | ❌ | **Hiện** | ❌ |
| **Cấu hình Đơn giá ngày** | **Hiện** | ❌ | ❌ | ❌ | **Hiện** | ❌ |
| **Quản lý Tài khoản (User)**| **Hiện** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Xem Audit Logs** | **Hiện** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Dashboard Báo cáo** | ❌ | ❌ | ❌ | **Hiện** | **Hiện** | **Hiện** |
