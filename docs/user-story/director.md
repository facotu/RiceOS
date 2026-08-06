# USER STORIES - GIÁM ĐỐC (DIRECTOR)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Vai trò:** Giám đốc Hợp tác xã (Director)
* **Mục tiêu chính:** Giám sát toàn diện hoạt động kinh doanh, sản lượng thu mua, quản lý dòng tiền và phê duyệt từ xa các quyết định tài chính quan trọng.

---

### 1. User Story: Xem Dashboard giám sát thời gian thực
* **Định nghĩa:** Là một Giám đốc, tôi muốn xem bảng điều khiển trực quan (Dashboard) cập nhật số liệu thu mua thời gian thực trên điện thoại di động của mình, để nắm bắt tình hình vận hành của HTX ở bất cứ đâu.
* **Độ ưu tiên:** **Must Have** (Mức cơ bản) / **Should Have** (Đồ họa trực quan)
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Khi đăng nhập bằng tài khoản Giám đốc, giao diện mặc định là Dashboard tổng quan.
  2. Dashboard phải hiển thị các chỉ số cốt lõi:
     * **Tổng sản lượng lúa thu mua trong ngày** (tấn/kg) phân loại theo giống lúa.
     * **Tổng số tiền đã quyết toán** và số tiền thực tế đã chi trả.
     * **Tổng sản lượng tồn kho** hiện tại trong các silo.
  3. Số liệu tự động cập nhật mà không cần tải lại toàn bộ trang web.
  4. Hỗ trợ xem nhanh báo cáo so sánh giữa các vụ mùa hoặc tuần trước đó.

---

### 2. User Story: Phê duyệt từ xa phiếu thanh toán giá trị lớn
* **Định nghĩa:** Là một Giám đốc, tôi muốn nhận được thông báo và thực hiện phê duyệt (hoặc từ chối) các Phiếu thanh toán có giá trị từ **50,000,000 VNĐ** trở lên do kế toán lập trực tiếp trên điện thoại di động của tôi, để kiểm soát dòng tiền chi tiêu của Hợp tác xã một cách an toàn.
* **Độ ưu tiên:** **Must Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Hệ thống gửi thông báo (in-app notification hoặc hiển thị trong danh mục chờ duyệt) khi kế toán tạo phiếu thanh toán >= 50 triệu VNĐ.
  2. Màn hình chi tiết phê duyệt hiển thị đầy đủ: Số phiếu cân liên kết, Tên nông dân, Biển số xe tải, Khối lượng tịnh, Khối lượng quy đổi, Đơn giá áp dụng, Tổng số tiền và người lập phiếu.
  3. Giám đốc có 2 lựa chọn:
     * **Phê duyệt (Approve):** Phiếu chuyển sang trạng thái "Đã duyệt - Chờ thanh toán" để kế toán chi tiền.
     * **Từ chối (Reject):** Giám đốc bắt buộc nhập lý do từ chối. Phiếu chi chuyển về trạng thái nháp và trả về cho kế toán chỉnh sửa hoặc hủy bỏ.

---

### 3. User Story: Duyệt đơn giá ngày và mức giá đặc biệt
* **Định nghĩa:** Là một Giám đốc, tôi muốn phê duyệt bảng cấu hình đơn giá ngày cho các giống lúa hoặc duyệt các yêu cầu mua lúa với giá thỏa thuận đặc biệt vượt khung của kế toán, để đảm bảo đơn giá thu mua luôn bám sát thị trường và có sự kiểm soát của Ban quản trị HTX.
* **Độ ưu tiên:** **Should Have**
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  1. Khi kế toán gửi yêu cầu áp đơn giá thỏa thuận đặc biệt nằm ngoài bảng giá ngày đã cấu hình, hệ thống sẽ gửi trạng thái chờ duyệt tới Giám đốc.
  2. Giám đốc có thể xem chênh lệch giữa đơn giá đề xuất và đơn giá ngày tiêu chuẩn trước khi bấm nút Duyệt/Từ chối.
