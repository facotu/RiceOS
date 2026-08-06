# RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

[![Bản quyền](https://img.shields.io/badge/B%E1%BA%A3n%20quy%E1%BB%81n-%C2%A9%202026%20Ph%E1%BA%A1m%20Tu%C3%A2n-blue.svg)](LICENSE)
[![Khách hàng](https://img.shields.io/badge/Kh%C3%A1ch%20h%C3%A0ng-HTX%20H%C3%B2a%20Ti%E1%BA%BFn%202-green.svg)](#khách-hàng-triển-khai-đầu-tiên)
[![Trạng thái](https://img.shields.io/badge/Tr%E1%BA%A1ng%20th%C3%A1i-Kh%E1%BB%9Fi%20t%E1%BA%A1o-orange.svg)](#)

RiceOS là nền tảng SaaS (Software as a Service) chuyên nghiệp được thiết kế đặc thù để quản trị quy trình thu mua lúa gạo, số hóa hoạt động cân đo, quản lý kho bãi, quyết toán tài chính, báo cáo và phân tích số liệu thời gian thực.

---

## 📌 Tổng quan dự án

- **Tên dự án:** RiceOS (Smart Rice Procurement Platform)
- **Chủ sở hữu & Thiết kế hệ thống:** Phạm Tuân
- **Bản quyền sở hữu:** Copyright © 2026 Phạm Tuân. Bảo lưu mọi quyền (All Rights Reserved).

### Khách hàng triển khai đầu tiên
* **Đơn vị:** Hợp tác xã Nông nghiệp Hòa Tiến 2
* **Mục tiêu:** Thực hiện chuyển đổi số toàn diện hoạt động thu mua lúa gạo tại địa phương, nâng cao tính minh bạch, giảm thiểu thất thoát và tối ưu hóa thời gian thanh quyết toán cho nông dân.

---

## 🎯 Mục tiêu & Phạm vi hệ thống

Hệ thống tập trung giải quyết các bài toán cốt lõi trong chuỗi cung ứng lúa gạo tại các Hợp tác xã:

1. **Quản lý thu mua (Procurement Management):** Số hóa phiếu cân lúa, ghi nhận cân nặng bì, cân nặng tịnh, độ ẩm, tạp chất và phân loại cấp độ lúa (Lúa OM18, Đài Thơm 8, Khang Dân,...).
2. **Quyết toán tài chính (Settlement):** Tính toán giá trị lô hàng dựa trên đơn giá thỏa thuận, tỷ lệ trừ ẩm/tạp chất, tự động lập bảng kê thanh toán và phê duyệt chi tiền.
3. **Quản lý kho (Warehouse):** Theo dõi số lượng lúa nhập kho theo lô, định vị silo/kho chứa và quản lý hao hụt trong quá trình lưu kho.
4. **Báo cáo & Phân tích (Reporting & Analytics):** Tổng hợp sản lượng thu mua theo ngày/tuần/vụ mùa, phân tích biểu đồ giá, thống kê hiệu suất thu mua và báo cáo tài chính tổng quan.

---

## 👥 Đối tượng người dùng mục tiêu

Hệ thống được thiết kế với phân quyền chặt chẽ cho 5 nhóm người dùng chính:

* **Quản trị viên (Administrator):** Quản lý cấu hình hệ thống, danh mục lúa, bảng giá, phân quyền tài khoản và giám sát lịch sử hệ thống.
* **Nhân viên cân (Weighing Officer):** Trực tiếp thao tác tại bàn cân, nhập khối lượng xe/bao lúa (hoặc tích hợp tự động với cân điện tử), ghi nhận độ ẩm và tạp chất.
* **Thủ kho (Warehouse):** Xác nhận nhập kho thực tế từ các xe hàng, quản lý số lô, vị trí lưu kho và theo dõi xuất kho.
* **Kế toán (Accountant):** Đối chiếu phiếu cân, áp đơn giá, tính khấu trừ, lập phiếu thanh toán và thực hiện chuyển khoản hoặc phát tiền mặt cho nông dân/thương lái.
* **Giám đốc (Director):** Theo dõi báo cáo trực quan (Dashboard), phê duyệt các khoản chi lớn, giám sát tiến độ thu mua và đưa ra quyết định vận hành dựa trên số liệu thực tế.

---

## 📂 Cấu trúc thư mục dự án

```text
RiceOS/
├── .github/                  # Các cấu hình và mẫu của GitHub (Issue, PR templates)
├── docs/                     # Tài liệu thiết kế hệ thống và nghiệp vụ
│   ├── adr/                  # Hồ sơ Quyết định Kiến trúc (Architecture Decision Records)
│   ├── business/             # Tài liệu đặc tả nghiệp vụ chi tiết theo từng vai trò
│   └── PROJECT_RULES.md      # Quy định vai trò thành viên (PO, AI, CTO Reviewer) và quy trình Phase
├── src/                      # Mã nguồn ứng dụng (Phát triển ở giai đoạn sau)
├── tests/                    # Mã nguồn kiểm thử tự động (Phát triển ở giai đoạn sau)
├── README.md                 # Tài liệu giới thiệu tổng quan dự án (File này)
├── LICENSE                   # Bản quyền tư nhân thuộc về Phạm Tuân
├── CONTRIBUTING.md           # Hướng dẫn đóng góp code và quy trình làm việc nhóm
├── DEVELOPMENT_GUIDE.md      # Hướng dẫn cài đặt môi trường và quy trình phát triển
├── CODING_STANDARD.md        # Tiêu chuẩn lập trình và quy ước viết code
├── PROJECT_RULES.md          # Quy tắc quản lý Git, Commit và Cổng chất lượng (CI/CD)
└── CHANGELOG.md              # Nhật ký ghi nhận các thay đổi qua từng phiên bản
```

---

## 🛠️ Hướng dẫn bắt đầu nhanh cho lập trình viên

Vui lòng tham khảo các tài liệu hướng dẫn chuyên sâu sau để bắt đầu làm việc với dự án:

1. Để thiết lập môi trường máy cá nhân: Xem [Hướng dẫn phát triển (DEVELOPMENT_GUIDE.md)](DEVELOPMENT_GUIDE.md).
2. Để nắm được các chuẩn đặt tên, định dạng code: Xem [Tiêu chuẩn Code (CODING_STANDARD.md)](CODING_STANDARD.md).
3. Để hiểu quy trình Git Branching và viết Commit: Xem [Quy tắc Git & Commit (PROJECT_RULES.md)](PROJECT_RULES.md).
4. Quy định vai trò, quy trình phát triển và kiểm duyệt của CTO Reviewer: Xem [Quy tắc dự án (docs/PROJECT_RULES.md)](docs/PROJECT_RULES.md).
5. Để đóng góp tính năng mới: Xem [Quy trình đóng góp (CONTRIBUTING.md)](CONTRIBUTING.md).


---

## 📄 Bản quyền và Giấy phép

Dự án này là tài sản trí tuệ riêng tư của **Phạm Tuân**. Mọi hành vi sao chép, phân phối hoặc sử dụng mã nguồn và tài liệu của dự án mà không có sự đồng ý bằng văn bản của chủ sở hữu đều là vi phạm pháp luật. Chi tiết xem tại tệp tin [LICENSE](LICENSE).
