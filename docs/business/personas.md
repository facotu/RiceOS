# CHÂN DUNG NGƯỜI DÙNG (PERSONAS)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Để đảm bảo hệ thống RiceOS hoạt động hiệu quả ngoài thực tế, thiết kế hệ thống phải bám sát chân dung và hành vi của 4 nhân vật điển hình đại diện cho các nhóm người dùng chính tại Hợp tác xã Hòa Tiến 2:

---

## 👥 1. Nhân viên cân: Chú Ba Cân (52 tuổi)

* **Vai trò:** Weighing Officer (Nhân viên trạm cân lúa)
* **Trình độ công nghệ:** Thấp. Chú chủ yếu dùng điện thoại di động để nghe gọi, xem YouTube và nhắn tin Zalo. Ngại sử dụng các ứng dụng có nhiều menu phức tạp hoặc chữ nhỏ.
* **Môi trường làm việc:** 
  * Ngoài trời, tại trạm cân lúa của HTX.
  * Nắng nóng, bụi bặm, tiếng ồn xe tải lớn.
  * Tay thường dính bụi lúa, mồ hôi.
* **Hành vi & Thói quen:**
  * Thường cầm điện thoại bằng một tay để nhập liệu, tay kia cầm bút ghi chép tạm thời hoặc hướng dẫn tài xế lùi xe vào bàn cân.
  * Thích thao tác chạm (click/tap) chọn danh mục có sẵn hơn là phải gõ bàn phím ảo trên điện thoại.
* **Nhu cầu cốt lõi đối với RiceOS:**
  * Giao diện chữ siêu to, độ tương phản cao để đọc rõ dưới ánh nắng mặt trời chói chang.
  * Nhập phiếu cân cực nhanh để giải phóng xe hàng, tránh ùn tắc trạm cân.
  * Các nút bấm to để chạm chính xác bằng ngón tay cái khi đang cầm điện thoại một tay.
  * Tính năng hoạt động ngoại tuyến khi mất sóng 4G ngoài đồng.

---

## 👥 2. Kế toán Hợp tác xã: Cô Lan Kế toán (35 tuổi)

* **Vai trò:** Accountant (Kế toán thanh toán)
* **Trình độ công nghệ:** Trung bình khá. Thành thạo máy tính văn phòng, sử dụng Excel rất giỏi để làm bảng lương, bảng tính tiền lúa.
* **Môi trường làm việc:** 
  * Văn phòng Hợp tác xã mát mẻ.
  * Sử dụng máy tính bàn hoặc Laptop màn hình lớn.
* **Hành vi & Thói quen:**
  * Làm việc rất kỹ lưỡng, cẩn thận, yêu cầu độ chính xác về số tiền đến từng đồng.
  * Thường xuyên đối chiếu phiếu cân giấy với số liệu thủ kho gửi lên trước khi chi tiền.
  * Muốn xuất toàn bộ dữ liệu ra file Excel để lưu trữ nội bộ và báo cáo thuế.
* **Nhu cầu cốt lõi đối với RiceOS:**
  * Hệ thống tự động tính tiền lúa sau khi trừ ẩm/tạp chất chính xác tuyệt đối theo cấu hình giá lúa của ngày.
  * Danh sách các phiếu cân cần quyết toán hiển thị trực quan, dễ tìm kiếm theo tên nông dân hoặc số phiếu.
  * Tính năng xuất file Excel chuẩn mẫu của HTX chỉ bằng một nút bấm.
  * Mọi lịch sử điều chỉnh số liệu (nếu có) phải được lưu vết rõ ràng để đối chiếu cuối kỳ.

---

## 👥 3. Giám đốc Hợp tác xã: Anh Tuấn Giám đốc (45 tuổi)

* **Vai trò:** Director (Giám đốc HTX Hòa Tiến 2)
* **Trình độ công nghệ:** Trung bình. Sử dụng iPhone để đọc tin tức, duyệt email, kiểm tra số dư ngân hàng và trao đổi công việc.
* **Môi trường làm việc:** 
  * Thường xuyên di chuyển ra đồng ruộng chỉ đạo, đi họp với UBND xã, huyện hoặc gặp đối tác thu mua gạo xuất khẩu.
* **Hành vi & Thói quen:**
  * Không có thời gian ngồi máy tính thường xuyên.
  * Thích xem các báo cáo tổng hợp dạng biểu đồ trực quan nhanh chóng trên điện thoại di động.
  * Cần phê duyệt các khoản chi tài chính lớn từ xa mà không cần về văn phòng ký giấy.
* **Nhu cầu cốt lõi đối với RiceOS:**
  * Dashboard hiển thị thời gian thực tổng sản lượng lúa đã thu mua hôm nay, tổng số tiền đã quyết toán và số tiền cần chuẩn bị tiếp theo.
  * Nhận thông báo đẩy (push notification) trên điện thoại khi có phiếu thanh toán lớn chờ phê duyệt.
  * Giao diện duyệt chi nhanh chóng, an toàn bảo mật.

---

## 👥 4. Thủ kho: Chú Tư Kho (48 tuổi)

* **Vai trò:** Warehouse Keeper (Thủ kho)
* **Trình độ công nghệ:** Thấp. Tương tự như chú Ba Cân.
* **Môi trường làm việc:** 
  * Trong các nhà kho chứa lúa hoặc khu vực Silo sấy lúa.
  * Bụi bặm nhiều, sóng Wi-Fi/4G thường yếu do nhà kho lợp tôn kín che chắn sóng.
* **Hành vi & Thói quen:**
  * Quản lý lúa nhập kho theo từng đống hoặc từng silo chứa.
  * Thích cầm điện thoại thông minh quét mã (nếu có) hoặc chọn nhanh số phiếu cân để xác nhận nhập kho thực tế.
* **Nhu cầu cốt lõi đối với RiceOS:**
  * Xem nhanh danh sách xe lúa đã qua bàn cân và đang di chuyển vào kho chờ trút lúa.
  * Chỉ cần thao tác 2 chạm trên màn hình điện thoại: (1) Chọn Silo nhận lúa -> (2) Bấm "Xác nhận nhập kho".
  * Theo dõi tồn kho thực tế của từng kho chứa một cách dễ dàng để báo cáo kế toán khi kho đầy.
