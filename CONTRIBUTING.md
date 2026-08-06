# Hướng dẫn Đóng góp dự án RiceOS

Chào mừng bạn đến với đội ngũ phát triển dự án RiceOS! Tài liệu này quy định các quy trình và tiêu chuẩn đóng góp mã nguồn nhằm đảm bảo chất lượng, tính ổn định và tính bảo mật cao nhất cho hệ thống.

---

## 🔒 Cam kết Bảo mật thông tin

Dự án RiceOS là dự án **bản quyền tư nhân đóng**. Mọi lập trình viên tham gia phát triển dự án bắt buộc phải tuân thủ nghiêm ngặt thỏa thuận không tiết lộ thông tin (NDA):
1. Không được công khai chia sẻ mã nguồn hoặc tài liệu dự án lên các kho lưu trữ công cộng.
2. Không được sử dụng lại các đoạn code đặc thù của hệ thống cho các dự án thương mại khác.
3. Báo cáo ngay các nguy cơ rò rỉ mã nguồn hoặc thông tin khách hàng cho Quản trị viên/Chủ dự án (Phạm Tuân).

---

## 🌿 Quy trình làm việc với Nhánh Git (Git Flow)

Dự án áp dụng mô hình Git Flow tối giản để kiểm soát luồng code:

* **`main` (hoặc `master`):** Nhánh chính thức chứa mã nguồn đã phát hành (Production-ready). Chỉ có Chủ dự án hoặc Tech Lead mới có quyền merge vào nhánh này.
* **`develop`:** Nhánh tích hợp chính dành cho các hoạt động phát triển hàng ngày. Tất cả các tính năng mới đều được tích hợp vào đây trước khi đưa lên sản xuất.
* **`feature/<tên-tính-năng>`:** Nhánh phát triển tính năng mới. Được phân tách ra từ `develop`.
* **`bugfix/<tên-lỗi>`:** Nhánh sửa lỗi phát sinh trong quá trình chạy thử nghiệm hoặc kiểm tra chất lượng. Được tách ra từ `develop`.
* **`hotfix/<tên-lỗi-khẩn-cấp>`:** Nhánh sửa lỗi khẩn cấp trực tiếp từ môi trường sản xuất. Được tách ra từ `main` và sau khi hoàn tất sẽ merge lại vào cả `main` và `develop`.

### Các bước tạo và gửi mã nguồn:
1. Đảm bảo nhánh `develop` trên máy local của bạn đã cập nhật mới nhất:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Tạo nhánh feature mới từ `develop`:
   ```bash
   git checkout -b feature/quan-ly-phieu-can
   ```
3. Thực hiện công việc lập trình, tuân thủ nghiêm ngặt [Tiêu chuẩn Code (CODING_STANDARD.md)](CODING_STANDARD.md).
4. Thực hiện chạy thử nghiệm local để kiểm tra tính ổn định.
5. Commit code theo định dạng [Quy tắc Dự án (PROJECT_RULES.md)](PROJECT_RULES.md).
6. Đẩy nhánh lên remote repository:
   ```bash
   git push origin feature/quan-ly-phieu-can
   ```
7. Tạo một **Pull Request (PR)** hướng về nhánh `develop`.

---

## 📝 Quy chuẩn tạo Pull Request (PR)

Một Pull Request chất lượng cần đáp ứng các tiêu chuẩn sau:

1. **Tiêu đề PR:** Phải ngắn gọn, rõ ràng và tuân theo cấu trúc:
   `feat(scope): Mô tả ngắn gọn bằng tiếng Việt` hoặc `fix(scope): Sửa lỗi gì đó`
2. **Mô tả PR (PR Description):** Phải mô tả chi tiết:
   - **Mục đích:** Tính năng này giải quyết vấn đề gì?
   - **Giải pháp áp dụng:** Cách thức xử lý kỹ thuật thế nào?
   - **Danh sách thay đổi:** Các file và hàm nào đã được tạo mới hoặc chỉnh sửa?
   - **Ảnh chụp màn hình/Video minh họa:** Bắt buộc đối với các thay đổi liên quan đến Giao diện (UI).
3. **Quy trình Review:**
   - Mỗi PR cần có ít nhất **1 sự phê duyệt (Approve)** từ thành viên khác hoặc Tech Lead trước khi được phép merge.
   - Lập trình viên có trách nhiệm giải quyết tất cả các ý kiến phản hồi (comments) từ người review.
   - Code phải vượt qua toàn bộ các bài kiểm tra tự động (CI/CD Quality Gates) nếu có trước khi merge.

---

## 🐞 Báo cáo Lỗi và Yêu cầu Tính năng

Nếu bạn phát hiện lỗi hoặc muốn đề xuất cải tiến:
1. Kiểm tra danh sách Issue hiện tại trên GitHub/GitLab của dự án xem vấn đề đã được ghi nhận chưa.
2. Tạo một Issue mới sử dụng các mẫu có sẵn trong thư mục `.github/ISSUE_TEMPLATE/`:
   - [Báo cáo lỗi (báo_cáo_lỗi.md)](.github/ISSUE_TEMPLATE/báo_cáo_lỗi.md)
   - [Yêu cầu tính năng (yêu_cầu_tính_năng.md)](.github/ISSUE_TEMPLATE/yêu_cầu_tính_năng.md)
3. Điền đầy đủ thông tin: Các bước tái hiện lỗi, kết quả mong đợi, kết quả thực tế và log chi tiết.

Cảm ơn sự hợp tác và cống hiến của bạn để cùng xây dựng RiceOS trở thành một hệ thống quản lý thu mua lúa gạo vững chắc và chuyên nghiệp!
