# BÁO CÁO HOÀN THÀNH PHASE 2.5 (PHASE 2.5 COMPLETION REPORT)

## 1. Thông tin Phase
* **Tên Phase:** Phase 2.5 - Hoàn thiện Thiết kế Cơ sở Dữ liệu trước khi thiết kế UI/UX
* **Mục tiêu:** Mở rộng, bổ sung và hoàn thiện toàn bộ thiết kế cơ sở dữ liệu dựa trên phản hồi nghiệp vụ thực tế (bao gồm các bảng: trucks, user_profiles, weighing_items, rice_prices_history, sync_status). Định nghĩa các Enum trạng thái, quy trình luân chuyển trạng thái (Workflow States), hoàn thiện sơ đồ ERD, từ điển dữ liệu và chạy rà soát đối chiếu chéo (Verification Checklist) với tài liệu PRD & User Stories.
* **Ngày thực hiện:** 2026-08-06

---

## 2. Công việc đã hoàn thành
* [x] Bổ sung thêm 5 bảng dữ liệu mới vào thiết kế hệ thống: `trucks` (xe tải), `user_profiles` (hồ sơ cán bộ), `weighing_items` (cân lẻ từng bao lúa), `rice_prices_history` (nhật ký lịch sử giá lúa), `sync_status` (quản lý đồng bộ thiết bị).
* [x] Cập nhật sơ đồ thực thể quan hệ hoàn chỉnh **ERD** trong tệp [docs/database/concept.md](file:///m:/GitHub/RiceOS/docs/database/concept.md).
* [x] Cập nhật Từ điển dữ liệu hoàn chỉnh **Data Dictionary** định nghĩa đầy đủ 15 bảng nghiệp vụ trong tệp [docs/database/data_dictionary.md](file:///m:/GitHub/RiceOS/docs/database/data_dictionary.md).
* [x] Định nghĩa chi tiết các Enum trạng thái hệ thống (`UserRole`, `WeighingStatus`, `SettlementStatus`, `SyncStatusType`).
* [x] Mô hình hóa Luồng luân chuyển trạng thái (Workflow States) của Phiếu cân lúa từ lúc tạo lập đến khi quyết toán và khóa dữ liệu.
* [x] Thực hiện Rà soát đối chiếu chéo (Verification Checklist) để chứng minh thiết kế DB đáp ứng 100% tài liệu PRD, tài liệu User Stories theo từng vai trò, và kiến trúc SaaS cô lập dữ liệu đa hợp tác xã (Multi-Tenant RLS).
* [x] Cập nhật tệp tin `walkthrough.md` của dự án.

---

## 3. Các quyết định thiết kế dữ liệu quan trọng (Key Design Decisions)

1. **Tách biệt `users` và `user_profiles` (Mối quan hệ 1-1):** 
   * *Quyết định:* Thông tin tài khoản đăng nhập bảo mật (JWT claims) được cô lập trong bảng `users`, các thông tin mở rộng như cài đặt font chữ to (UI preference) và ảnh chữ ký tay phục vụ in phiếu được lưu riêng tại `user_profiles`.
   * *Ý nghĩa:* Giúp việc truy vấn xác thực tài khoản nhanh hơn và tăng tính bảo mật cho các trường thông tin nhạy cảm.
2. **Bổ sung bảng cân lẻ `weighing_items` (Mối quan hệ 1-N):**
   * *Quyết định:* Hỗ trợ ghi nhận nhiều mã cân lẻ của các đống lúa/bao lúa nhỏ bên trong một Phiếu cân lớn (`weighing_receipts`).
   * *Ý nghĩa:* Phù hợp với thực tế thu mua ngoài đồng khi nông dân cân từng khay lúa/bao lúa nhỏ gom lại thành một xe tải lớn. Giúp đối chiếu minh bạch khi có tranh chấp số liệu từng bao lúa.
3. **Bảng lịch sử biến động giá lúa `rice_prices_history`:**
   * *Quyết định:* Tự động ghi nhận log mỗi khi đơn giá ngày của giống lúa bị thay đổi, lưu trữ rõ ràng người thực hiện và đơn giá cũ/mới.
   * *Ý nghĩa:* Phục vụ báo cáo phân tích biến động giá lúa cho Giám đốc và ngăn chặn việc cán bộ trạm cân/kế toán tự ý điều chỉnh đơn giá ngày mà không được phê duyệt.
4. **Bảng theo dõi đồng bộ thiết bị `sync_status`:**
   * *Quyết định:* Ghi nhận chi tiết thông tin thiết bị (tên máy, hệ điều hành) và số lượng hàng đợi chưa đồng bộ (`pending_sync_count`).
   * *Ý nghĩa:* Giúp Admin/Tech Lead phát hiện ngay thiết bị nào của cán bộ cân đang bị kẹt mạng, chưa đồng bộ dữ liệu về văn phòng trung tâm để kịp thời xử lý kỹ thuật ngoài đồng ruộng.

---

## 4. Rủi ro còn lại & Giải pháp giảm thiểu
* **Rủi ro rò rỉ ảnh chữ ký số:** Ảnh chữ ký tay lưu trong `user_profiles` dùng để tự động chèn vào phiếu cân in ra có thể bị sử dụng sai mục đích nếu bị truy cập trái phép.
* **Giải pháp giảm thiểu:** Lưu trữ file chữ ký số trong Supabase Storage Private Bucket và chỉ cấp URL truy cập có thời hạn (Signed URL) khi ứng dụng thực hiện tác vụ in phiếu cân.

---

## 5. Đề xuất Phase tiếp theo
* **Đề xuất chuyển sang Phase 3.0 - Thiết kế Chi tiết Giao diện & Trải nghiệm Người dùng (UI/UX wireframes & User Flow).**
  * Thiết kế luồng đi màn hình chi tiết cho Nhân viên cân, Thủ kho, Kế toán và Giám đốc.
  * Phác thảo bố cục (Wireframes) giao diện di động (Mobile-first) trạm cân và kho chứa lúa.
  * Thiết lập mẫu thiết kế (Design System) bao gồm bảng màu, kiểu chữ và kích thước nút bấm.

---

## 6. Trạng thái
* **Trạng thái:** ✅ Hoàn thành - Chờ CTO Review
