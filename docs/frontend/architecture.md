# KIẾN TRÚC FRONTEND (FRONTEND ARCHITECTURE)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

## 1. Công nghệ & Thư viện Lõi (Tech Stack)

* **Framework:** **React (TypeScript)** kết hợp với **Vite** làm công cụ build. Vite giúp đóng gói ứng dụng cực nhanh, tạo ra mã nguồn PWA tối ưu và khởi động máy chủ dev local tức thì.
* **Đóng gói PWA:** Sử dụng plugin `vite-plugin-pwa` để cấu hình Service Worker tự động cài đặt ứng dụng vào điện thoại di động và kích hoạt bộ nhớ đệm tài sản tĩnh (HTML/JS/CSS/Hình ảnh) để chạy offline.
* **Lưu trữ Cục bộ (Local Database):** **Dexie.js** (Thư viện bọc ngoài IndexedDB) giúp viết các câu lệnh truy vấn dữ liệu offline dễ dàng hơn bằng cơ chế Promise.
* **Quản lý Trạng thái (State Management):** **Zustand**. Thư viện quản lý state gọn nhẹ, hiệu năng cao và có sẵn plugin `persist` để tự động sao lưu cấu hình giao diện và trạng thái đăng nhập vào LocalStorage.
* **Giao tiếp API:** **Supabase JS Client SDK** cho các tương tác thời gian thực (Realtime WebSockets) và REST API.

---

## 2. Cấu trúc Thư mục Dự án (Folder Structure)

Mã nguồn frontend trong thư mục `src/` được tổ chức theo module tính năng (Feature-based) để dễ bảo trì và mở rộng:

```text
src/
├── assets/                 # Hình ảnh, icons, font chữ tĩnh
├── components/             # Reusable UI Components chung (Button, Input, Card, Table...)
│   └── ui/                 # Các component nguyên tử (atomic components)
├── db/                     # Cấu hình cơ sở dữ liệu IndexedDB local
│   ├── index.ts            # Khởi tạo Dexie DB và các bảng local
│   └── syncQueue.ts        # Các hàm CRUD với hàng đợi đồng bộ local
├── features/               # Các module tính năng nghiệp vụ của ứng dụng
│   ├── auth/               # Xác thực đăng nhập, đổi mật khẩu
│   ├── weighing/           # Nghiệp vụ trạm cân (Gross/Tare)
│   ├── warehouse/          # Nghiệp vụ thủ kho xác nhận silo
│   ├── finance/            # Nghiệp vụ kế toán quyết toán, giám đốc duyệt chi
│   └── dashboard/          # Báo cáo, biểu đồ cho Giám đốc
├── hooks/                  # Custom Hooks dùng chung hệ thống
│   ├── useOnlineStatus.ts  # Giám sát trạng thái mạng online/offline
│   └── useBluetooth.ts     # Kết nối máy in nhiệt mini qua Bluetooth
├── services/               # Kết nối API bên ngoài và Supabase Client
├── store/                  # Lưu trữ trạng thái toàn cục (Global Store)
│   ├── authStore.ts        # Quản lý phiên đăng nhập
│   └── uiStore.ts          # Quản lý cỡ chữ lớn, ngôn ngữ, theme
└── main.tsx                # File khởi chạy ứng dụng
```

---

## 3. Quản lý Trạng thái Toàn cục (State Management - Zustand)

Zustand được chọn để quản lý state toàn cục thay thế cho Redux vì cấu trúc đơn giản, ít code boilerplate và phù hợp với mô hình Offline-First.

### 3.1. Quản lý Đăng nhập (`authStore.ts`):
* Lưu thông tin người dùng đang đăng nhập (`user`), token JWT, và trạng thái quyền hạn (`role`).
* Cấu hình lưu trữ bền vững (Persist) tự động lưu token vào `localStorage` để người dùng không cần đăng nhập lại khi mở app ngoại tuyến.

### 3.2. Quản lý Giao diện (`uiStore.ts`):
* `isLargeFont`: Trạng thái bật/tắt cỡ chữ to ngoài đồng.
* `isDarkMode`: Trạng thái giao diện ban đêm/độ tương phản cao.

---

## 4. Giải pháp Tích hợp Hoạt động Ngoại tuyến (Offline Integration)

Quy trình phối hợp giữa Service Worker (SW), IndexedDB và Sync Engine:

1. **Bộ nhớ đệm Tài nguyên (Asset Caching):**
   * Service Worker cấu hình theo chiến lược `CacheFirst` hoặc `StaleWhileRevalidate` cho toàn bộ file tĩnh (CSS, JS, Fonts). Điều này đảm bảo khi mất mạng, người dùng mở trình duyệt gõ địa chỉ app vẫn hiển thị giao diện tức thì.
2. **Khởi tạo Database Local (Dexie.js):**
   * Định nghĩa cấu trúc IndexedDB cục bộ khớp với Data Dictionary của hệ thống.
3. **Đồng bộ hóa Tự động (Sync Engine Loop):**
   * Tạo một custom hook `useSyncEngine.ts` chạy vòng lặp ngầm (Background Sync):
     * Lắng nghe sự kiện đổi từ offline sang online của trình duyệt.
     * Khi phát hiện có mạng, đọc bản ghi đầu tiên trong bảng `sync_queue`.
     * Gửi API đồng bộ lên server.
     * Nếu thành công, xóa bản ghi khỏi queue local và đệ quy gửi bản ghi tiếp theo cho đến khi queue trống.
