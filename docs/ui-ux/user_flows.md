# LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG (USER FLOWS)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Tài liệu này mô tả chi tiết các bước tương tác trên giao diện của từng nhóm vai trò người dùng trong hệ thống RiceOS để hoàn thành nhiệm vụ của mình.

---

## 1. Luồng của Nhân viên cân (Weighing Officer Flow)

Mục tiêu: Hoàn tất cân lúa 2 lần và in phiếu cân di động.

```text
[Đăng nhập] ──> [Trang chủ di động] ──> [Nhấp nút "+" nổi bật]
                                               │
                                               v
[Chọn Nông dân/Thương lái] <── [Nhập Biển số xe & Giống lúa]
            │
            v
[Cân lần 1: Nhập Khối lượng tổng - Gross] ──> [Đo & Nhập Độ ẩm %, Tạp chất %]
                                                     │
                                                     v
[Nhấn "Lưu phiếu cân tạm"] <── [In Phiếu cân tạm lần 1 qua Bluetooth]
            │
            v
[Xe di chuyển vào kho trút lúa] (Chờ thủ kho xác nhận nhập kho)
            │
            v  (Xe tải trống quay lại bàn cân lần 2)
[Tìm kiếm biển số xe trong danh sách "Chờ cân vỏ"] ──> [Cân lần 2: Nhập Khối lượng vỏ - Tare]
                                                               │
                                                               v
[Hệ thống tự tính Net Weight] <── [Nhấn "Hoàn tất Phiếu Cân"]
            │
            v
[In Phiếu cân chính thức] ──> [Bàn giao nông dân ký nhận]
```

---

## 2. Luồng của Thủ kho (Warehouse Keeper Flow)

Mục tiêu: Đón xe trút lúa vào đúng silo chứa và xác nhận nhập kho.

```text
[Đăng nhập] ──> [Trang chủ di động] ──> [Vào mục "Nhập kho / Xe nhận"]
                                               │
                                               v
[Xem danh sách xe tải đang chờ nhập kho xếp theo thời gian]
                                               │
                                               v (Chọn xe thực tế đang lùi vào hầm nhận)
[Nhấp chọn Xe tương ứng] ──> [Hệ thống tự động lọc danh sách Silo phù hợp với loại lúa]
                                               │
                                               v
[Nhấp chọn Silo sẽ trút lúa vào] ──> [Đổ lúa thực tế vào silo]
                                               │
                                               v
[Nhấp nút "Xác nhận nhập kho" lớn] ──> [Hệ thống cập nhật sản lượng tồn kho Silo]
                                               │
                                               v
[Xe tải quay lại bàn cân để cân vỏ]
```

---

## 3. Luồng của Kế toán (Accountant Flow)

Mục tiêu: Tính tiền lúa và thanh toán nhanh chóng, chính xác.

```text
[Đăng nhập Portal máy tính] ──> [Vào mục "Quyết toán tài chính"]
                                       │
                                       v
[Chọn Phiếu cân đã nhập kho trong danh sách "Chờ quyết toán"]
                                       │
                                       v
[Hệ thống tự động áp đơn giá ngày & hiển thị công thức khấu trừ ẩm/tạp chất]
                                       │
                                       v (Kế toán kiểm tra đối chiếu số liệu tính toán)
[Nhấn "Lập phiếu thanh toán"]
       │
       ├──> (Nếu Số tiền < 50 triệu) ──> [Tự động chuyển sang trạng thái: Chờ thanh toán]
       │                                                      │
       └──> (Nếu Số tiền >= 50 triệu) ──> [Chờ Giám đốc duyệt] ┼─> [Thực hiện chi tiền]
                                                 │            │           │
                     [Giám đốc bấm Duyệt trên điện thoại] ────┘           │
                                                                          v
[Chọn hình thức: Tiền mặt hoặc Chuyển khoản] ──> [Nhập Mã giao dịch ngân hàng (nếu CK)]
                                                               │
                                                               v
[Nhấn "Xác nhận đã thanh toán"] ──> [Hệ thống khóa giao dịch & lưu trữ logs]
```

---

## 4. Luồng của Giám đốc (Director Flow)

Mục tiêu: Theo dõi báo cáo tài chính và phê duyệt chi tiền từ xa.

```text
[Đăng nhập điện thoại] ──> [Xem Dashboard sản lượng, dòng tiền thực tế vụ mùa]
                                    │
                                    v (Có thông báo phiếu chi lớn chờ duyệt)
[Nhấp vào Thông báo] ──> [Xem chi tiết bảng kê tính tiền lúa và người lập]
                                    │
                                    ├──> [Bấm "TỪ CHỐI"] ──> [Nhập lý do] ──> [Trả về Kế toán]
                                    │
                                    └──> [Bấm "PHÊ DUYỆT DUYỆT CHI"] ──> [Kế toán được quyền chi]
```

---

## 5. Luồng của Quản trị viên (Admin Flow)

Mục tiêu: Đảm bảo dữ liệu người dùng và danh mục của HTX luôn đầy đủ.

```text
[Đăng nhập Portal máy tính] ──> [Vào mục "Quản trị người dùng"] ──> [Nhấn "Thêm thành viên"]
                                                                           │
                                                                           v
[Nhập Tên, Số điện thoại đăng nhập, Phân vai trò] <── [Hệ thống tự động gán organization_id]
            │
            v
[Cấp tài khoản cho cán bộ] ──> [Vào mục "Cấu hình HTX" để nhập bảng giá ngày cho ngày hôm nay]
```
