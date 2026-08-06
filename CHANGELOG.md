# Nhật ký Thay đổi (Changelog) - RiceOS

Tất cả các thay đổi đáng chú ý đối với dự án RiceOS sẽ được ghi nhận trong tệp tin này. Định dạng của nhật ký tuân thủ nguyên tắc [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) và tuân thủ định dạng phiên bản [Semantic Versioning](https://semver.org/).

---

## [0.1.0] - 2026-08-06

### Khởi tạo dự án sơ bộ

Đây là phiên bản khởi tạo ban đầu cho dự án **RiceOS (Smart Rice Procurement Platform)**. Trong phiên bản này, chúng tôi tập trung thiết lập bộ khung tài liệu kiến trúc, quy tắc vận hành và chuẩn hóa quy trình phát triển.

#### Đã thêm (Added)
- Khởi tạo cấu trúc thư mục cốt lõi của dự án bao gồm các thư mục `docs/`, `src/`, `tests/` và `.github/`.
- Tạo tài liệu giới thiệu dự án [README.md](README.md) mô tả tổng quan, đối tượng người dùng (Admin, Nhân viên cân, Thủ kho, Kế toán, Giám đốc) và khách hàng triển khai đầu tiên (Hợp tác xã Hòa Tiến 2).
- Thiết lập tệp bản quyền tư nhân [LICENSE](LICENSE) bảo lưu mọi quyền sở hữu trí tuệ cho Phạm Tuân.
- Soạn thảo [Hướng dẫn Đóng góp (CONTRIBUTING.md)](CONTRIBUTING.md) hướng dẫn quy trình tạo nhánh, viết Pull Request và cam kết bảo mật.
- Soạn thảo [Hướng dẫn Phát triển (DEVELOPMENT_GUIDE.md)](DEVELOPMENT_GUIDE.md) hướng dẫn thiết lập môi trường lập trình local.
- Soạn thảo [Tiêu chuẩn Code (CODING_STANDARD.md)](CODING_STANDARD.md) thiết lập các quy tắc đặt tên, xử lý lỗi, chú thích code và bảo mật.
- Soạn thảo [Quy tắc Dự án (PROJECT_RULES.md)](PROJECT_RULES.md) định hình quy tắc commit, đặt tên nhánh git và cổng kiểm soát chất lượng.
- Thiết lập thư mục và tài liệu mẫu [Architecture Decision Record (ADR)](docs/adr/template.md) phục vụ việc ghi nhận các quyết định thiết kế kiến trúc hệ thống.
- Khởi tạo tài liệu đặc tả nghiệp vụ ban đầu theo vai trò [Đặc tả Nghiệp vụ (docs/business/specifications.md)](docs/business/specifications.md).
- Thiết lập các mẫu báo cáo lỗi và đề xuất tính năng trong `.github/ISSUE_TEMPLATE/`.
