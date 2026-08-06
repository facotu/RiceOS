# QUY TẮC NGHIỆP VỤ CHI TIẾT (BUSINESS RULES)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Tài liệu này quy định tất cả các quy tắc nghiệp vụ bắt buộc phải được lập trình cứng (hoặc cấu hình thông qua bảng tham số) trong hệ thống RiceOS để đảm bảo tính nhất quán và ngăn chặn gian lận trong thu mua lúa gạo.

---

## 1. Quy tắc Thiết lập Bảng giá & Giống lúa (Pricing Rules)

1. **Đơn giá lúa theo ngày:** Đơn giá thu mua của mỗi loại lúa (ví dụ: OM18, Đài Thơm 8) được thiết lập theo từng ngày (áp dụng từ 00:00:00 đến 23:59:59 của ngày đó).
2. **Quyền điều chỉnh giá:** Chỉ có tài khoản Giám đốc hoặc Admin được phân quyền mới có thể cập nhật đơn giá lúa ngày. Kế toán và nhân viên trạm cân chỉ được xem đơn giá áp dụng, không thể sửa đổi đơn giá mặc định này trên phiếu cân.
3. **Áp đơn giá đặc biệt:** Trường hợp thương lượng giá đặc biệt với thương lái lớn, kế toán có thể nhập đơn giá điều chỉnh thủ công nhưng phải đính kèm lý do ghi chú và hệ thống sẽ gửi yêu cầu phê duyệt trực tiếp đến Giám đốc trước khi cho phép lập phiếu chi.

---

## 2. Quy tắc Cân lúa tại Trạm cân (Weighing Rules)

Để tránh gian lận về khối lượng lúa, quy trình cân xe lúa phải tuân thủ nghiêm ngặt các quy tắc sau:

1. **Khối lượng tịnh thực tế (Net Weight):**
   $$\text{Khối lượng tịnh (Net Weight)} = \text{Khối lượng tổng (Gross Weight)} - \text{Khối lượng vỏ (Tare Weight)}$$
2. **Thời gian tối đa giữa 2 lần cân:** Thời gian chênh lệch giữa lúc cân Khối lượng tổng (khi xe lúa đầy vào trạm) và cân Khối lượng vỏ (sau khi xe đã trút lúa xong và quay ra) không được vượt quá **120 phút**. Nếu vượt quá thời gian này, phiếu cân sẽ bị khóa và đánh dấu trạng thái "Cảnh báo gian lận" (do nghi ngờ xe lúa có thể đã ghé trạm khác trút bớt hàng hoặc nạp thêm vật nặng lên xe vỏ).
3. **Giới hạn Khối lượng tịnh:** Khối lượng tịnh của một xe lúa không được nhỏ hơn hoặc bằng 0 kg. Hệ thống phải từ chối xác nhận phiếu cân nếu Khối lượng vỏ (Tare) lớn hơn hoặc bằng Khối lượng tổng (Gross).

---

## 3. Quy tắc Khấu trừ Độ ẩm & Tạp chất (Deduction Rules)

Chất lượng lúa quyết định tỷ lệ khấu trừ khối lượng thực tế thanh toán. Công thức khấu trừ tại HTX Hòa Tiến 2 được chuẩn hóa như sau:

### 3.1. Khấu trừ Độ ẩm (Moisture Deduction)
* **Độ ẩm tiêu chuẩn:** **14%**. Lúa có độ ẩm từ 14% trở xuống không bị trừ khối lượng.
* **Độ ẩm cho phép thu mua:** Từ **14.1%** đến **25%**.
* **Công thức trừ khối lượng do ẩm:** Mỗi tăng **1%** độ ẩm vượt chuẩn sẽ bị trừ **1.2%** khối lượng tịnh thực tế.
  $$\text{Tỷ lệ trừ ẩm} = (\text{Độ ẩm thực tế} - 14) \times 1.2\%$$
* **Ngưỡng từ chối thu mua:** Lúa có độ ẩm lớn hơn **25%** sẽ bị hệ thống cảnh báo cảnh báo đỏ và từ chối tạo phiếu cân (bắt buộc phải qua sấy sơ bộ hoặc cần Giám đốc phê duyệt ngoại lệ).

### 3.2. Khấu trừ Tạp chất (Trash Deduction)
* **Tạp chất tiêu chuẩn:** **1%**. Lúa có tỷ lệ tạp chất từ 1% trở xuống không bị trừ khối lượng.
* **Công thức trừ khối lượng do tạp chất:** Mỗi tăng **1%** tạp chất vượt chuẩn sẽ bị trừ **1%** khối lượng tịnh thực tế.
  $$\text{Tỷ lệ trừ tạp chất} = (\text{Tỷ lệ tạp chất thực tế} - 1) \times 1.0\%$$
* **Ngưỡng từ chối thu mua:** Lúa có tỷ lệ tạp chất vượt quá **5%** sẽ bị hệ thống từ chối nhập kho trực tiếp.

### 3.3. Khối lượng Quy đổi Quyết toán (Settlement Weight)
$$\text{Khối lượng quy đổi} = \text{Khối lượng tịnh} \times \left(1 - \text{Tỷ lệ trừ ẩm} - \text{Tỷ lệ trừ tạp chất}\right)$$

---

## 4. Quy tắc Quản lý Kho bãi (Warehouse Rules)

1. **Nhập kho thực tế:** Phiếu cân lúa chỉ được phép quyết toán tài chính khi và chỉ khi Thủ kho đã bấm "Xác nhận nhập kho" và chọn một Silo/Kho chứa cụ thể trên hệ thống.
2. **Không tồn kho âm:** Số lượng xuất kho của mỗi Silo/Kho chứa không được vượt quá số lượng tồn kho thực tế hiện tại. Hệ thống không cho phép xác nhận các giao dịch xuất kho gây âm kho.
3. **Theo dõi theo lô (Batch Tracking):** Mỗi đợt thu mua trong vụ mùa được gắn với một Mã lô hàng (`Batch Code`). Một Silo có thể chứa nhiều lô hàng của cùng một loại lúa, nhưng không được phép chứa trộn lẫn các loại lúa khác nhau (ví dụ: Không được đổ lúa OM18 chung vào silo đang chứa lúa Đài Thơm 8).

---

## 5. Quy tắc Thanh quyết toán (Settlement & Payment Rules)

1. **Hạn mức duyệt chi của Kế toán:** Kế toán được quyền trực tiếp phê duyệt và chi tiền đối với các Phiếu thanh toán có giá trị dưới **50,000,000 VNĐ** (Năm mươi triệu đồng).
2. **Quy trình phê duyệt ngoại lệ:** Các phiếu thanh toán có giá trị từ **50,000,000 VNĐ** trở lên bắt buộc phải chuyển sang trạng thái "Chờ Giám đốc duyệt" và chỉ được thực hiện chi tiền sau khi tài khoản Giám đốc xác nhận duyệt chi trên hệ thống.
3. **Hình thức thanh toán:** Hệ thống hỗ trợ 2 hình thức: Tiền mặt hoặc Chuyển khoản ngân hàng. Khi chọn chuyển khoản, kế toán phải nhập số tham chiếu giao dịch ngân hàng trước khi xác nhận phiếu đã thanh toán.
