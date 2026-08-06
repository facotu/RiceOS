# Hướng dẫn Phát triển Dự án RiceOS

Tài liệu này cung cấp các bước chi tiết để thiết lập môi trường lập trình local, quản lý cấu hình và vận hành dự án RiceOS một cách nhất quán.

---

## 🛠️ Yêu cầu Hệ thống & Công cụ Cần thiết

Trước khi bắt đầu, vui lòng cài đặt các công cụ nền tảng sau trên máy tính của bạn:

1. **Hệ quản trị phiên bản Git**: Tải và cài đặt phiên bản Git mới nhất.
2. **Môi trường chạy & Quản lý package**:
   * *Đề xuất kỹ thuật sơ bộ:* Dự án dự kiến sử dụng **Node.js** (Phiên bản LTS mới nhất) hoặc môi trường Backend tương ứng tùy thuộc vào quyết định kiến trúc chính thức.
3. **Trình soạn thảo mã nguồn**: Đề xuất sử dụng **Visual Studio Code (VS Code)** hoặc **Cursor** với các tiện ích mở rộng khuyên dùng:
   * *Prettier - Code formatter* (Định dạng code tự động)
   * *ESLint* (Kiểm tra lỗi cú pháp và tiêu chuẩn code)
   * *GitLens* (Giám sát lịch sử git)

---

## 🚀 Các bước Thiết lập Môi trường Local

### 1. Clone dự án từ kho lưu trữ
Thực hiện chạy lệnh sau trong terminal để tải mã nguồn về máy:
```bash
git clone <url-kho-luu-tru-riceos>
cd RiceOS
```

### 2. Quản lý cấu hình & Biến môi trường
Dự án quản lý các thông số cấu hình nhạy cảm (như kết nối cơ sở dữ liệu, API key, cấu hình cổng thanh toán) thông qua các biến môi trường.

1. Tại thư mục gốc của dự án, tạo file cấu hình môi trường `.env` từ file mẫu `.env.example` (file này sẽ được tạo khi dự án có mã nguồn):
   ```bash
   cp .env.example .env
   ```
2. Mở file `.env` vừa tạo và điền đầy đủ các thông số tương ứng với môi trường local của bạn.
3. **Lưu ý cực kỳ quan trọng:** Tuyệt đối **KHÔNG** bao giờ commit file `.env` chứa thông tin bảo mật thực tế lên Git. File `.env` phải luôn nằm trong danh mục `.gitignore`.

### 3. Cài đặt các thư viện phụ thuộc (Dependencies)
Khi dự án bắt đầu có mã nguồn, bạn sẽ tiến hành cài đặt các thư viện bằng trình quản lý tương ứng:
```bash
# Đối với dự án Node.js / Frontend:
npm install
# Hoặc đối với dự án Backend Go / Python:
# go mod download  (Go)
# pip install -r requirements.txt (Python)
```

---

## 🧪 Quy trình Chạy thử nghiệm & Kiểm thử (Testing)

Để đảm bảo các thay đổi của bạn không phá vỡ các chức năng hiện tại:

### 1. Chạy ứng dụng ở chế độ Phát triển (Development Mode)
Khởi động máy chủ dev local để tự động tải lại giao diện khi có thay đổi code:
```bash
npm run dev  # (Hoặc lệnh tương đương của Stack công nghệ được chọn)
```

### 2. Chạy kiểm thử tự động (Automated Testing)
Trước khi tạo PR, bắt buộc phải chạy bộ test để xác thực tính đúng đắn:
```bash
npm run test  # Chạy unit tests
npm run test:e2e  # Chạy kiểm thử tích hợp đầu cuối (nếu có)
```

---

## 🧹 Kiểm tra chất lượng trước khi Commit (Pre-commit Checklist)

Hãy chắc chắn rằng bạn đã thực hiện các bước sau trước khi thực hiện lệnh `git commit`:

- [ ] **Chạy Linter & Formatter**: Đảm bảo không có lỗi cảnh báo cú pháp và code đã được định dạng chuẩn.
  ```bash
  npm run lint
  npm run format
  ```
- [ ] **Kiểm thử cục bộ**: Đảm bảo 100% các ca kiểm thử tự động đều vượt qua (pass) thành công.
- [ ] **Không chứa thông tin bảo mật**: Kiểm tra xem có vô tình để lộ mật khẩu, API key hay dữ liệu nhạy cảm nào trong code không.
- [ ] **Không thừa code rác**: Xóa sạch các câu lệnh debug, `console.log` thừa hoặc các đoạn code bị comment không còn sử dụng.
