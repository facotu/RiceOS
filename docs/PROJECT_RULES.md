# PROJECT RULES
## RiceOS Smart Rice Procurement Platform

* **Phiên bản:** 1.0
* **Chủ sở hữu:** Phạm Tuân
* **Bản quyền:** Copyright © 2026 Phạm Tuân
* **Triển khai đầu tiên:** HTX Hòa Tiến 2

---

## 1. VAI TRÒ TRONG DỰ ÁN

### Product Owner
* **Thông tin:** Phạm Tuân
* **Nhiệm vụ:**
  * Xác định mục tiêu kinh doanh.
  * Xác nhận yêu cầu nghiệp vụ.
  * Phê duyệt các quyết định quan trọng.
  * Quyết định chuyển Phase.

### AI Development Agent (Antigravity)
* **Vai trò:** Senior Product Manager, Senior Business Analyst, Solution Architect, Database Architect, Frontend Developer, Backend Developer, QA Engineer.
* **Nhiệm vụ:**
  * Phân tích yêu cầu.
  * Thiết kế hệ thống.
  * Triển khai.
  * Kiểm thử.
  * Báo cáo kết quả.

### AI Reviewer (ChatGPT)
* **Vai trò:** CTO Reviewer, Quality Assurance, Architecture Reviewer.
* **Nhiệm vụ:**
  * Phản biện thiết kế.
  * Kiểm tra nghiệp vụ.
  * Kiểm tra kiến trúc.
  * Đánh giá chất lượng.
  * Phát hiện rủi ro.
  * Đề xuất cải tiến.

---

## 2. QUY TRÌNH TRIỂN KHAI BẮT BUỘC

Mỗi Phase phải thực hiện theo quy trình tuyến tính sau:

```text
Yêu cầu
  ↓
Phân tích
  ↓
Đề xuất giải pháp
  ↓
Thiết kế
  ↓
Chờ phê duyệt
  ↓
Triển khai
  ↓
Kiểm thử
  ↓
Báo cáo
  ↓
Review CTO
  ↓
Chuyển Phase
```

---

## 3. QUY TẮC KHÔNG ĐƯỢC VI PHẠM

### Không tự ý viết code
Antigravity không được:
* Viết code khi chưa hoàn thành phân tích.
* Tạo database khi chưa có thiết kế.
* Tạo UI khi chưa có UX Flow.

### Không bỏ qua nghiệp vụ
Mọi chức năng phải trả lời được các câu hỏi:
* Ai sử dụng?
* Khi nào sử dụng?
* Dữ liệu đầu vào?
* Dữ liệu đầu ra?
* Quyền truy cập?
* Ảnh hưởng đến module nào?

### Không làm dư thừa
* **Ưu tiên:** Đơn giản, Dễ dùng, Nhanh, Ổn định.
* **Không ưu tiên:** Tính năng phức tạp không cần thiết, Công nghệ mới nhưng không có giá trị thực tế.

---

## 4. QUY TRÌNH MỖI PHASE

Mỗi Phase bắt buộc tạo báo cáo:
* **Tên file:** `PHASE_XX_COMPLETION_REPORT.md` (Lưu tại thư mục báo cáo tương ứng hoặc thư mục gốc tài liệu theo chỉ định).
* **Nội dung cấu trúc báo cáo:**

```markdown
# PHASE XX REPORT

## 1. Thông tin Phase
* Tên Phase:
* Mục tiêu:
* Ngày thực hiện:

## 2. Công việc đã hoàn thành
* [x] Công việc 1
* [x] Công việc 2

## 3. Tài liệu đã tạo
* docs/xxx.md
* database/xxx.sql
* components/xxx.tsx

## 4. Thiết kế đã thực hiện
* Kiến trúc.
* Luồng dữ liệu.
* Quyết định kỹ thuật.

## 5. Kiểm thử
* [ ] Chức năng
* [ ] Dữ liệu
* [ ] Quyền
* [ ] Hiệu năng
* [ ] Bảo mật

## 6. Vấn đề phát sinh
* Vấn đề.
* Nguyên nhân.
* Giải pháp.

## 7. Rủi ro còn lại (Nếu có)

## 8. Đề xuất Phase tiếp theo

## 9. Trạng thái (Chỉ chọn một trong hai)
* ✅ Hoàn thành - Chờ CTO Review
* ⚠️ Chưa hoàn thành
```

---

## 5. QUY TẮC DATABASE

Trước khi tạo Database phải có:
1. Sơ đồ thực thể quan hệ (ERD).
2. Mô hình dữ liệu (Data Model).
3. Quan hệ giữa các bảng.
4. Cấu hình quyền bảo mật hàng RLS (Row Level Security).
5. Thiết lập Index.
6. Thiết lập Trigger.

*Tuyệt đối không được tự ý sửa Database khi chưa được ghi nhận thiết kế.*

---

## 6. QUY TẮC CODE

Mã nguồn phải đảm bảo:
* Sử dụng TypeScript strict mode.
* Có chú thích (comments) giải thích đầy đủ khi cần thiết.
* Không lặp lại mã nguồn (DRY - Don't Duplicate Code).
* Thiết kế component có khả năng tái sử dụng cao.
* Đặt tên (Naming) rõ ràng, tường minh.

---

## 7. QUY TẮC UI/UX

Thiết kế giao diện phải ưu tiên:
* Phục vụ đối tượng người dùng nông nghiệp (dễ hiểu, thân thiện).
* Ưu tiên thiết kế trên thiết bị di động trước (Mobile-first).
* Giảm thiểu tối đa thao tác nhập liệu.
* Sử dụng kích thước chữ lớn, rõ ràng.
* Dễ đọc dưới ánh sáng ngoài đồng ruộng.

Mỗi màn hình thiết kế phải làm rõ:
* Mục tiêu của màn hình.
* Đối tượng người dùng trực tiếp.
* Luồng thao tác của người dùng.
* Trạng thái lỗi (Error States).
* Trạng thái không có dữ liệu (Empty States).

---

## 8. QUY TẮC AI

Mọi tính năng có sử dụng trí tuệ nhân tạo (AI Feature) phải xác định rõ:
* Dữ liệu đầu vào (Input).
* Kết quả mong muốn (Output).
* Mô hình (Model) sử dụng.
* Chi phí vận hành ước tính.
* Độ chính xác yêu cầu.
* Phương án dự phòng (Fallback) khi AI gặp sự cố.

*Không dùng AI chỉ để tạo hiệu ứng mà không đem lại giá trị nghiệp vụ thực chất.*

---

## 9. QUY TẮC BÁO CÁO SAU MỖI PHASE

Sau khi hoàn thành công việc của từng Phase, Antigravity phải xuất báo cáo theo định dạng sau ra cửa sổ chat:

```text
===== BÁO CÁO HOÀN THÀNH PHASE =====
Phase:
Mục tiêu:
Đã làm:
Chưa làm:
Rủi ro:
Đề xuất:
====================================
```
*Chủ sở hữu dự án sẽ copy báo cáo này gửi cho ChatGPT (CTO Reviewer) để đánh giá.*

---

## 10. QUY TRÌNH REVIEW CỦA CTO

AI Reviewer (ChatGPT) sẽ tiến hành đánh giá thiết kế và kết quả triển khai dựa trên các khía cạnh:

1. **Kiến trúc:** Có đúng hướng không? Có khả năng mở rộng không?
2. **Nghiệp vụ:** Có phù hợp với quy trình của Hợp tác xã không? Có thiếu sót quy trình nào không?
3. **UX:** Giao diện có thực sự dễ sử dụng và tối ưu không?
4. **Kỹ thuật:** Đánh giá cấu trúc Database, Bảo mật (Security) và Hiệu năng (Performance).

Kết luận cuối cùng từ CTO Reviewer sẽ thuộc một trong ba trạng thái sau:
* 🟢 **APPROVED:** Được đồng ý chuyển sang Phase tiếp theo.
* 🟡 **NEED IMPROVEMENT:** Cần chỉnh sửa các điểm được chỉ ra trước khi review lại.
* 🔴 **REJECTED:** Không đạt yêu cầu, bắt buộc phải thiết kế lại từ đầu.

---

## 11. MỤC TIÊU CUỐI CÙNG

RiceOS phải đạt được các mục tiêu cốt lõi:
1. Dễ sử dụng, thích ứng tốt với thực tế làm việc tại địa phương.
2. Hoạt động ổn định, mượt mà.
3. Đảm bảo an toàn bảo mật thông tin.
4. Có khả năng mở rộng kiến trúc linh hoạt.
5. Giải quyết triệt để nhu cầu nghiệp vụ thực tế của **Hợp tác xã Hòa Tiến 2**.
6. Có định hướng phát triển bền vững thành một nền tảng quản lý thu mua lúa gạo chuyên nghiệp.

---

## 12. QUY TẮC NGHIỆP VỤ HTX
* Mọi chức năng phải ưu tiên phù hợp với quy trình vận hành thực tế của HTX.
* Không thiết kế theo mô hình phần mềm chung chung.
* Phải xem xét kỹ lưỡng:
  * Quy trình cân lúa thực tế.
  * Thói quen của cán bộ cân.
  * Điều kiện làm việc ngoài đồng ruộng.
  * Khả năng sử dụng của nông dân.
  * Khả năng mất kết nối Internet (chế độ Offline/Local-first).

---

## 13. QUY TẮC MOBILE FIRST
RiceOS ưu tiên sử dụng trên thiết bị di động. Mọi màn hình phải:
* Dễ dàng thao tác bằng một tay.
* Sử dụng các nút bấm lớn, dễ chạm.
* Hạn chế tối đa việc nhập liệu bằng bàn phím.
* Đạt tốc độ phản hồi nhanh chóng.
* Hoạt động mượt mà trên các thiết bị di động cấu hình thấp.

---

## 14. QUY TẮC DỮ LIỆU
Dữ liệu cân lúa là dữ liệu cực kỳ quan trọng. Nghiêm cấm:
* Xóa dữ liệu trực tiếp khỏi cơ sở dữ liệu.
* Ghi đè lịch sử giao dịch.
* Thực hiện thay đổi dữ liệu mà không có lịch sử ghi vết (log).

Mọi thay đổi dữ liệu phải ghi nhận đầy đủ:
* Người thực hiện thay đổi.
* Thời gian thực hiện thay đổi.
* Giá trị trước khi thay đổi (Old Value).
* Giá trị sau khi thay đổi (New Value).

---

## 15. QUY TẮC MỞ RỘNG SAAS
Hệ thống phải được thiết kế có khả năng mở rộng cho nhiều đơn vị (multi-tenant) sử dụng. Tuyệt đối không được khóa cứng (hardcode):
* Tên Hợp tác xã Hòa Tiến 2.
* Danh mục các giống lúa.
* Đơn giá thu mua.
* Danh sách các xứ đồng/vùng trồng.
* Quy trình thanh toán cụ thể.

---

## 16. QUY TẮC AI
Trí tuệ nhân tạo (AI) chỉ được sử dụng khi đem lại giá trị thực tế rõ ràng. Mỗi tính năng tích hợp AI phải đánh giá đầy đủ:
* Độ chính xác của mô hình.
* Chi phí vận hành ước tính (Token, API cost).
* Khả năng thay thế bằng quy trình thuật toán truyền thống.
* Phương án dự phòng (Fallback) khi AI không hoạt động hoặc trả về kết quả sai lệch.
