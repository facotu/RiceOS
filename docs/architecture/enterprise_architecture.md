# TÀI LIỆU KIẾN TRÚC DOANH NGHIỆP RICEOS (ENTERPRISE ARCHITECTURE SPECIFICATION)

## 1. Tổng quan Kiến trúc (Overall Architecture)
RiceOS áp dụng mô hình kiến trúc **Enterprise Clean Architecture**, **Domain-Driven Design (DDD)** và **Event-Driven Architecture (EDA)** cho toàn bộ hệ thống quản trị chuỗi giá trị lúa gạo HTX Hòa Tiến 2.

```text
               +----------------------------------+
               |     React UI Layer (Components)  |
               +----------------------------------+
                                 |
                                 v
               +----------------------------------+
               |   Application Layer (Use Cases)  |
               +----------------------------------+
                                 |
           +---------------------+---------------------+
           |                                           |
           v                                           v
+-----------------------+                   +-----------------------+
|  Domain Event Bus     |                   | Configurable Rule     |
|  (Publish / Subscribe) |                   | Engine & Scheduler    |
+-----------------------+                   +-----------------------+
           |                                           |
           +---------------------+---------------------+
                                 |
                                 v
               +----------------------------------+
               |  IndexedDB Dexie / Cache Layer   |
               +----------------------------------+
```

---

## 2. Các phân lớp hệ thống cốt lõi (Core Layer Infrastructure)

### A. Core Errors Framework (`src/core/errors/errorFramework.ts`)
- **Phân loại lỗi chuẩn hóa:**
  - `ValidationError`: Lỗi dữ liệu đầu vào.
  - `BusinessError`: Lỗi vi phạm quy tắc nghiệp vụ.
  - `RepositoryError`: Lỗi lưu trữ cơ sở dữ liệu local/remote.
  - `NetworkError`: Lỗi kết nối mạng.
  - `UnexpectedError`: Lỗi ngoại lệ hệ thống.

### B. Domain Events & Central EventBus (`src/core/events/`)
- **EventBus trung tâm (`eventBus.ts`):** Trình điều phối sự kiện bất đồng bộ Pub/Sub giúp các module hoạt động hoàn toàn độc lập, không gọi trực tiếp lẫn nhau.
- **Danh mục Domain Events bất biến (`domainEvents.ts`):**
  - `PurchaseCompletedEvent`
  - `DryingCompletedEvent`
  - `WarehouseInventoryChangedEvent`
  - `FinanceTransactionCreatedEvent`
  - `KPIUpdatedEvent`
  - `BusinessInsightGeneratedEvent`
  - `AlertGeneratedEvent`

### C. Rule Engine động (`src/core/rules/`)
- **Động cơ đánh giá quy tắc (`ruleEngine.ts`):** Hỗ trợ đăng ký quy tắc động kèm độ ưu tiên (`priority`), mức độ nghiêm trọng (`severity`), điều kiện kiểm tra (`condition`), khuyến nghị (`recommendation`) và hành động (`action`).
- **Danh mục quy tắc mặc định (`ruleRegistry.ts`):** Quản lý cảnh báo tồn lâu >60 ngày, quá nhiệt sấy >45°C, vọt chi phí >10%, trần công nợ >50M.

### D. System Scheduler (`src/core/scheduler/systemScheduler.ts`)
- **Trình lên lịch hệ thống:** Quản lý các Jobs chạy ngầm định kỳ:
  - `refreshKPI` (Mỗi 10s)
  - `refreshDashboard` (Mỗi 15s)
  - `scanRules` (Mỗi 30s)
  - `cleanupCache` (Hàng ngày)

### E. Cache Layer (`src/core/cache/cacheManager.ts`)
- **Bộ nhớ đệm hiệu năng cao:** Dashboard và AI Assistant luôn truy vấn dữ liệu đệm từ Cache stores (`executive_dashboard_cache`, `business_insight_cache`, `ai_context_cache`, `alert_cache`), giúp Render tức thì không bị nghẽn gián đoạn.

### F. Audit Logger (`src/core/audit/auditLogger.ts`)
- **Nhật ký kiểm toán:** Theo dõi chi tiết vết thao tác `LOGIN`, `LOGOUT`, `CREATE`, `UPDATE`, `DELETE`, `APPROVE` lưu trữ trong bảng `audit_logs`.

### G. Notification Center (`src/core/notifications/notificationCenter.ts`)
- **Trung tâm thông báo đa tầng:** Tự động lắng nghe sự kiện từ EventBus và tạo các thông báo cấp độ `INFO`, `WARNING`, `HIGH`, `CRITICAL` trực quan cho người dùng.

---

## 3. Đánh giá tính sẵn sàng triển khai Phase 7.7 (Logistics & Fleet Management)
Hệ thống RiceOS hiện tại đã đạt tiêu chuẩn Enterprise ERP với tính mở rộng cao, không phụ thuộc cứng giữa các thành phần, sẵn sàng tiếp nhận thêm phân hệ Điều phối đoàn xe tải vận chuyển lúa ở Phase 7.7.
