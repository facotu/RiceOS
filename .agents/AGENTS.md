# Quy chuẩn Giao diện & Thiết kế UI/UX (MISA AMIS Enterprise ERP & Modern Suite Style)

Mọi dự án web và ứng dụng frontend được phát triển trong hệ thống này CẦN tuân thủ phong cách giao diện Quản trị Doanh nghiệp Hiện đại (Combine MISA AMIS Classic ERP & Modern MISA Accounting Suite) theo các quy chuẩn kết hợp bên dưới.

---

## 1. Cấu trúc Bố cục Tổng thể (Layout Architecture)

Giao diện tổng thể được thiết kế theo cấu trúc Quản trị Doanh nghiệp chuẩn (Enterprise Layout):

### 1.1. Thanh Header (Top Navigation Bar)
Hỗ trợ 2 phong cách linh hoạt dựa trên phân hệ:
- **Phong cách Modern Light Header (Mặc định cho Dashboard & Báo cáo):**
  - **Màu nền:** Trắng sáng / Slate xám nhạt (`#ffffff` / `#f8fafc`), có viền phân cách dưới `#e2e8f0`.
  - **Bên trái:** Logo ứng dụng + Tên phân hệ đậm (ví dụ: `RiceOS - KẾ TOÁN / QUẢN LÝ CÂN`) + Bộ chọn Chi nhánh/Đơn vị (`TLC (ĐTH)`, `The Locals`).
  - **Bên giữa:** Ô Tìm kiếm thông minh tích hợp AI (`Tìm kiếm thông minh AI`) + Nút `Hướng dẫn` sử dụng.
  - **Bên phải:** Cụm icon tác vụ nhanh: Chuông thông báo (kèm badge đếm đỏ/xanh), Nút cộng đồng, Hỗ trợ, Cài đặt (Gear icon), Lưới ứng dụng, Avatar & Tên người dùng.
- **Phong cách Classic ERP Navy Header (Cho màn hình nghiệp vụ tập trung):**
  - **Màu nền:** Xanh lam đậm đặc trưng ERP (`#0b6bbf` hoặc `#00407a`).
  - **Thông tin:** Hiển thị thương hiệu `AMIS.VN`, bộ chọn doanh nghiệp và ô tìm kiếm nhanh màu sẫm.

### 1.2. Thanh Menu bên trái (Left Sidebar Navigation)
- **Màu nền:** Dark Slate / Charcoal Navy (`#0e1e25` hoặc `#00407a`) mang cảm giác cao cấp và chuyên nghiệp.
- **Nút tác vụ đỉnh Menu:** Nút `+ Thêm nhanh` (Pill button) màu nổi bật giúp mở modal khởi tạo bản ghi nhanh.
- **Cấu trúc Menu dọc chia khối:**
  1. **Khối "HAY DÙNG" (Pinned / Favorites):** Chứa các tính năng được ghim dùng thường xuyên.
  2. **Khối "PHÂN HỆ" (Business Modules):** Danh sách icon đòn nét (Outlined SVG Icons) mượt mà kèm tên phân hệ (*Tổng quan, Thu mua/Phiên cân, Tiền mặt, Tiền gửi, Mua hàng, Bán hàng, Kho, Quản lý xe, Báo cáo, Cài đặt*).
- **Hiệu ứng Active (Mục đang chọn):** Highlight bằng dải màu xanh ngọc / dark teal (`#18333e`) kết hợp vệt viền cyan/vàng bắp (`#f39c12` hoặc `#00d2d3`) ở mép trái.
- **Chân Menu:** Nút `Thu gọn` (Collapse Sidebar) chuyển sang dạng Icon-only thu nhỏ diện tích.

### 1.3. Thanh Điều hướng phụ & Công cụ Tác vụ (Breadcrumb & Command Toolbar)
- **Đường dẫn (Breadcrumb):** Hiển thị phân cấp vị trí hiện tại (ví dụ: `Nghiệp vụ cân lúa > Phiên cân > Chi tiết cân`).
- **Thanh công cụ tác vụ (Action Command Bar):** Các nút bấm chuẩn nghiệp vụ dạng button mỏng phẳng:
  - `[Thêm nhanh]` / `[Sửa]` / `[Xóa]`
  - `[Ghi nhập]` (Save transaction)
  - `[Kết xuất Zalo]` / `[Xuất file ảnh .PNG]`
  - `[In phiếu cân]` (Print Ticket)
  - `[Xuất khẩu Excel/PDF]`
  - `[Nạp / Refresh]`

### 1.4. Khu vực Nội dung chính (Executive Dashboard & Master-Detail DataGrid)

#### A. Phân hệ Thống kê & Dashboard (Executive AI Insights Cards)
- **Banner Hướng dẫn / Chào mừng:** Banner bo góc cong mềm mại với thanh tiến trình tròn (Progress ring widget) và nút CTA hành động.
- **Thanh Sub-tabs:** Các tab điều hướng phụ (`Tổng quan`, `Chi tiết`, `Tính năng mới`).
- **Khối Thẻ AI Insight ("AVA Assistant / Thống kê thông minh"):**
  - Khung Card trắng bo góc 8px (`box-shadow: 0 2px 8px rgba(0,0,0,0.06)`).
  - Góc trên phải có nhãn mốc thời gian (`Số liệu tính đến: HH:MM`) & nút `Xem tất cả >`.
  - Các ô chỉ số KPI trọng yếu (*Doanh thu, Chi phí, Lợi nhuận, Sản lượng tươi, Sản lượng khô, Số bao, Sản lượng xe*):
    - Đỉnh ô: Tiêu đề KPI + Câu nhận xét/phân tích chuyên sâu từ AI/Hệ thống.
    - Đáy ô: Link hành động `Phân tích chuyên sâu >`.
- **Khối Thẻ Tổng quan Tài chính & Vận hành:**
  - Bảng tổng hợp dòng tiền/sản lượng: Hiển thị các chỉ số chi tiết có phân màu phân biệt (Màu đỏ cho số nợ/chi/trừ bì, Màu xanh cyan cho tiền mặt/sản lượng tươi, Màu xanh lá cho lợi nhuận).
  - Thanh tiến trình mini (Mini Progress Bars): Biểu thị tỷ lệ nợ quá hạn / trong hạn hoặc tỷ lệ sản lượng lúa tươi vs lúa khô.

#### B. Phân hệ Quản lý Bảng dữ liệu Mật độ cao (Master-Detail DataGrid)
- **Master-Detail Layout (Chia 2 tầng bảng):**
  - **Bảng trên (Master):** Danh sách tổng quan các phiên cân / hợp đồng.
  - **Bảng dưới (Detail):** Chi tiết từng mã cân / danh sách nhân viên & xe nhận.
- **Compact Dense Padding:** Độ cao hàng vừa phải (32px - 36px), đường viền mảnh rõ ràng (`#d0d7de` hoặc `#e2e8f0`).
- **Hàng lọc điều kiện trực tiếp (Column Filter Row):** Ô input lọc nhanh ngay bên dưới tiêu đề từng cột (`*`, `=`, chứa từ khóa).
- **Row Grouping:** Gom nhóm dữ liệu theo từng tiêu chuẩn (ví dụ: Gom nhóm theo *Ban Giám Đốc*, *Theo Chủ ruộng*, *Theo Xe nhận*).
- **Thanh trạng thái Footer (Status Summary Bar):** Hiển thị dòng tổng hợp ở đáy mỗi bảng: `Tổng số: X bản ghi | Tổng kg tươi: Y kg | Tổng thành tiền: Z đ`.

---

## 2. Hệ màu & Design Tokens (Color Palette)

| Component | Modern Light Theme (Mặc định) | Classic Navy Theme |
| :--- | :--- | :--- |
| **Top Header BG** | `#ffffff` / `#f8fafc` | `#0b6bbf` (Navy Blue) |
| **Sidebar BG** | `#0e1e25` (Dark Slate) | `#00407a` (Deep Navy) |
| **Sidebar Active BG** | `#18333e` | `#0b4d75` |
| **Active Accent** | `#f39c12` (Amber) / `#00d2d3` | `#f2994a` (Warm Orange) |
| **Main App BG** | `#eef2f6` / `#f0f4f8` | `#f4f6f9` |
| **Card / Panel BG** | `#ffffff` | `#ffffff` |
| **Card Shadow** | `0 2px 8px rgba(0,0,0,0.06)` | `0 1px 3px rgba(0,0,0,0.1)` |
| **Grid Header BG** | `#f8fafc` / `#e9eff5` | `#e4eaef` |
| **Grid Border** | `#e2e8f0` | `#d0d7de` |
| **Text Primary** | `#0e1e25` / `#1e293b` | `#212529` |
| **Text Secondary** | `#64748b` | `#595959` |
| **Success Status** | `#10b981` (Green) | `#27ae60` |
| **Warning Status** | `#f59e0b` (Orange/Amber) | `#e67e22` |
| **Danger / Alarm** | `#ef4444` (Red) | `#e74c3c` |

---

## 3. Font chữ & Quy chuẩn UI Components (Typography & Elements)

- **Font family:** `Inter`, `Segoe UI`, `Roboto`, Arial, sans-serif.
- **Nút bấm (Buttons):**
  - Primary CTA: Bo góc 6px, nền cyan blue (`#1877f2`) hoặc green (`#10b981`), chữ trắng, font-weight 600.
  - Quick Add Sidebar: Button dẹt bo viền Pill shape `+ Thêm nhanh`.
- **Thẻ Card & Widgets:** Bo góc `8px`, viền mảnh `1px solid #e2e8f0`, đổ bóng nhẹ.
- **Mật độ hiển thị:** Ưu tiên hiển thị được tối đa lượng thông tin dữ liệu kinh doanh/cân lúa trên 1 màn hình, tránh lãng phí diện tích, nhưng vẫn giữ khoảng thở hiện đại, phẳng & sạch sẽ.
