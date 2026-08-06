# Hồ sơ Quyết định Kiến trúc (Architecture Decision Records - ADR)

Thư mục này chứa toàn bộ các bản ghi ghi nhận các quyết định kiến trúc quan trọng trong quá trình phát triển hệ thống RiceOS.

---

## ❓ Quyết định Kiến trúc (ADR) là gì?

Hồ sơ Quyết định Kiến trúc (ADR) là một tài liệu kỹ thuật ngắn gọn nhằm ghi nhận một lựa chọn thiết kế kiến trúc quan trọng (ví dụ: Lựa chọn cơ sở dữ liệu, mô hình xác thực, ngôn ngữ lập trình Backend, cấu trúc thư mục,...). Nó mô tả:
* Bối cảnh thực tế (Tại sao lại có vấn đề cần giải quyết?).
* Các phương án thay thế được cân nhắc.
* Quyết định được lựa chọn và lý do tại sao.
* Hệ quả/Ảnh hưởng của quyết định đó đối với hệ thống trong tương lai.

Việc lưu trữ các ADR giúp các lập trình viên mới gia nhập dự án hiểu ngay lý do tại sao hệ thống lại được thiết kế như hiện tại mà không cần phải đoán hoặc hỏi lại.

---

## ✍️ Quy trình tạo và phê duyệt ADR

1. **Bước 1: Đề xuất**
   * Copy tệp tin [template.md](template.md) thành một file mới trong thư mục này với tên định dạng: `XXXX-ten-quyet-dinh.md` (ví dụ: `0001-su-dung-supabase-lam-backend.md`).
   * Trạng thái ban đầu của tài liệu là `Đề xuất` (Proposed).

2. **Bước 2: Thảo luận & Xem xét**
   * Chia sẻ đề xuất với Chủ dự án/Tech Lead để tiến hành phản biện kỹ thuật.
   * Cập nhật các nội dung phản biện vào tài liệu.

3. **Bước 3: Quyết định**
   * Nếu đề xuất được thông qua, chuyển trạng thái sang `Được chấp nhận` (Accepted).
   * Nếu không được thông qua, chuyển trạng thái sang `Bị từ chối` (Rejected) để làm tài liệu tham khảo cho tương lai.
   * Nếu có một quyết định mới thay thế quyết định cũ, chuyển trạng thái quyết định cũ sang `Bị thay thế` (Superseded) và dẫn link tới quyết định mới.

---

## 📁 Danh sách tài liệu mẫu

* [Mẫu ADR Tiêu chuẩn (template.md)](template.md)
