# Quy tắc Quản lý Dự án RiceOS

Tài liệu này quy định các quy tắc bắt buộc áp dụng cho hoạt động quản lý mã nguồn, viết commit, đặt tên nhánh git và quy trình phát hành phiên bản trong dự án RiceOS.

---

## 💬 Quy tắc Viết Commit Message (Conventional Commits)

Để lịch sử Git luôn sạch sẽ, dễ tra cứu và hỗ trợ tự động tạo Changelog, tất cả các commit phải tuân thủ định dạng **Conventional Commits**:

### Cấu trúc tiêu chuẩn:
```text
<kiểu>(<phạm-vi>): <mô-tả-ngắn-bằng-tiếng-việt>

[mô-tả-chi-tiet-nếu-có]

[các-mã-lỗi-liên-quan-ví-dụ-Closes-#12]
```

### Các kiểu commit bắt buộc (`<type>`):
* **`feat`**: Thêm một tính năng mới cho hệ thống.
* **`fix`**: Sửa một lỗi phần mềm.
* **`docs`**: Chỉ thay đổi hoặc bổ sung tài liệu (Markdown, Docstrings).
* **`style`**: Thay đổi về định dạng code (khoảng trắng, dấu chấm phẩy) nhưng không thay đổi logic chạy của code.
* **`refactor`**: Tái cấu trúc mã nguồn để cải thiện thiết kế mà không thêm tính năng mới hay sửa lỗi.
* **`test`**: Thêm mới hoặc sửa đổi các ca kiểm thử tự động (Unit/Integration Tests).
* **`chore`**: Các thay đổi phụ trợ phục vụ quá trình build hệ thống, cấu hình CI/CD hoặc cập nhật thư viện ngoài.

### Ví dụ minh họa commit hợp lệ:
```text
feat(weighing): tích hợp máy đo độ ẩm tự động vào phiếu cân

- Thêm API nhận dữ liệu từ cảm biến đo độ ẩm.
- Tự động trừ khối lượng lúa dựa trên tỷ lệ ẩm đo được.
- Hiển thị cảnh báo nếu độ ẩm vượt quá 25%.

Closes #45
```
```text
fix(settlement): sửa lỗi tính toán sai thuế VAT cho hợp tác xã
```

---

## 🌿 Quy tắc Đặt tên Nhánh Git (Git Branching Rules)

Mọi nhánh git được tạo ra để phát triển tính năng hoặc sửa lỗi phải tuân theo cấu trúc sau:

`[thư-mục-nhánh]/[mã-issue-nếu-có]-[tên-ngắn-gọn-không-dấu]`

### Các thư mục nhánh được chấp nhận:
* Nhánh tính năng mới: `feature/` (Ví dụ: `feature/we-102-nhap-phieu-can`)
* Nhánh sửa lỗi: `bugfix/` (Ví dụ: `bugfix/we-203-loi-lam-tron-khoi-luong`)
* Nhánh phát hành vặt: `release/` (Ví dụ: `release/v0.2.0`)
* Nhánh sửa lỗi khẩn cấp: `hotfix/` (Ví dụ: `hotfix/loi-bao-mat-xss`)

---

## 🚪 Cổng Chất lượng (Quality Gates) & Quy tắc Pull Request

Hệ thống áp dụng các chốt chặn chất lượng nghiêm ngặt trước khi một đoạn code được đưa vào nhánh chính:

1. **Không commit trực tiếp (No Direct Commit):** Tuyệt đối không được commit trực tiếp lên các nhánh bảo vệ là `main` (hoặc `master`) và `develop`. Mọi thay đổi phải đi qua Pull Request (PR) hoặc Merge Request (MR).
2. **Kiểm tra tự động bắt buộc (Mandatory CI):** Nếu dự án được cấu hình hệ thống CI/CD, mọi PR phải vượt qua 100% các bước chạy tự động bao gồm:
   * Build kiểm thử ứng dụng không lỗi.
   * Linter không phát hiện lỗi cú pháp nguy hiểm.
   * Tất cả các Unit Tests phải chạy thành công.
3. **Phê duyệt thủ công (Peer Review):** 
   * PR bắt buộc phải được review và chấp thuận bởi ít nhất 1 thành viên chính của dự án.
   * Tác giả của PR không được tự ý merge code của mình khi chưa có sự xác nhận của người khác.

---

## 📦 Quy tắc Phát hành Phiên bản (Version Release Rules)

Dự án RiceOS áp dụng quy chuẩn đánh số phiên bản **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

* **`MAJOR` (Phiên bản lớn):** Tăng khi có các thay đổi lớn về kiến trúc hoặc thay đổi không tương thích ngược (breaking changes).
* **`MINOR` (Phiên bản phụ):** Tăng khi bổ sung các tính năng mới nhưng vẫn tương thích ngược với các phiên bản trước đó.
* **`PATCH` (Phiên bản vá):** Tăng khi thực hiện sửa lỗi nhỏ, tối ưu hóa hệ thống mà không làm thay đổi các tính năng hiện có.

Mỗi khi phát hành phiên bản mới, lập trình viên có trách nhiệm cập nhật tệp [Nhật ký thay đổi (CHANGELOG.md)](CHANGELOG.md) để ghi nhận chi tiết các tính năng mới và các lỗi đã sửa.
