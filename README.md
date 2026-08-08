# 🌾 RiceOS - Hệ Thống Quản Trị & Thu Mua Lúa Nông Nghiệp (MISA AMIS Enterprise ERP Style)

> **RiceOS** là Hệ thống Quản trị & Điều hành Thu mua Lúa Nông nghiệp thông minh chuyên nghiệp dành cho doanh nghiệp thu mua lúa, thương lái và hợp tác xã nông nghiệp. Giao diện được thiết kế chuẩn theo phong cách kết hợp **MISA AMIS Classic ERP & Modern Suite** (Header Modern Light tích hợp AI Search, Sidebar Dark Slate `#0e1e25` sang trọng, Thẻ AVA AI Assistant Insights và Bảng DataGrid Master-Detail mật độ cao).

---

## 🚀 Tính Năng Nổi Bật

- **🔑 Xác thực & Phân quyền (Supabase Auth & RBAC):** Đăng nhập tài khoản, Đăng ký xác minh Email, **Đăng nhập bằng Google**, Phân quyền **Admin** (toàn quyền & quản lý thành viên), **Editor** (Cán bộ cân thực địa) và **View** (Quyền giám sát).
- **📊 Dashboard AVA AI Insights & KPIs:** Thống kê sản lượng tươi, lúa khô quy đổi %, giá trị thu mua & tạm ứng kèm câu nhận xét phân tích tự động từ AI.
- **⚖️ Phân Hệ Phiên Cân Live (Core Scale Session):**
  - Quản lý thông tin Chủ ruộng, Số CCCD, Ngày cấp, Nơi cấp, Hạn dùng, Xứ đồng, Lô, Diện tích.
  - **Mặc định công thức Trừ Bì % độ ẩm/tạp chất** (cho phép đổi kg/bao).
  - ✏️ **Chức năng Chỉnh Sửa Mã Cân Nhập Nhầm:** Cho phép Cán bộ cân click `[Sửa]` trực tiếp mã cân bị nhập nhầm trên dòng, tự động nhảy lại tức thì toàn bộ các chỉ số tổng (Kg tươi, Kg trừ bì %, Kg lúa khô & Thành tiền).
  - 📱 **Kết xuất Copy Zalo 1-Click:** Tự động tạo tin nhắn định dạng chuẩn để copy gửi Zalo Web/App.
  - 🖨️ **In Phiếu Cân Nhiệt 80mm & A5:** Mẫu in phiếu sắc nét cho cầu cân.
- **💰 Quyết Toán Hộ Dân:** Nạp toàn bộ các phiên cân trong đợt của chủ hộ, tính tiền đã tạm ứng và số tiền còn lại phải trả.
- **🚚 Quản Lý Xe Nhận & Logistics:** Theo dõi biển số xe, tài xế, sản lượng tươi bốc lên xe và trạng thái tải trọng.
- **📷 Module AI Camera:** Mô phỏng đếm bao lúa tự động qua băng chuyền & OCR đọc biển số xe / CCCD.
- **📈 Báo Cáo Đa Chiều & Cài Đặt:** Thống kê theo ngày, theo giống lúa (`HT1`, `HG12`, `HG244`, `ĐT100`, `J02`), cài đặt đơn giá thu mua và xuất file Excel (.XLSX).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend:** React 18 + TypeScript + Vite + Lucide React Icons
- **Design System:** MISA AMIS Enterprise ERP CSS Tokens (Modern Light Header + Dark Slate Sidebar `#0e1e25` + Amber Highlight `#f39c12`)
- **Backend & Database:** Supabase Auth (Google OAuth + Email Confirmation) & Supabase PostgreSQL
- **Hosting & Deployment:** Vercel

---

## 📦 Hướng Dẫn Đưa Code Đã Đóng Gói Lên GitHub

Mở Terminal tại thư mục dự án `m:\GitHub\RiceOS` và chạy các lệnh sau:

```bash
# 1. Khởi tạo Git repository local (nếu chưa tạo)
git init

# 2. Thêm tất cả các tệp vào staging
git add .

# 3. Tạo commit đầu tiên
git commit -m "feat: complete RiceOS Enterprise ERP MISA UI system"

# 4. Đổi tên branch chính thành main
git branch -M main

# 5. Kết nối tới Repository trên GitHub của bạn (Thay URL bằng link GitHub của bạn)
git remote add origin https://github.com/USERNAME/RiceOS.git

# 6. Push code lên GitHub
git push -u origin main
```

---

## ⚡ Hướng Dẫn Cấu Hình Supabase (Auth & Database)

### Bước 1: Tạo dự án Supabase mới
1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập/tạo tài khoản.
2. Bấm **New Project**, nhập tên dự án: `RiceOS-Production`, chọn Database Password và khu vực (Region: Singapore).

### Bước 2: Chạy Script khởi tạo Cơ sở Dữ liệu (Migration)
1. Trong giao diện điều khiển Supabase, chọn mục **SQL Editor** ở thanh menu bên trái.
2. Bấm **New Query**, mở tệp [supabase_schema.sql](file:///m:/GitHub/RiceOS/supabase_schema.sql) trong dự án này, copy toàn bộ nội dung SQL và dán vào ô truy vấn.
3. Bấm **Run** để khởi tạo các bảng: `profiles`, `farmers`, `vehicles`, `rice_varieties`, `weighing_sessions`, `weighing_rows`.

### Bước 3: Cấu hình Google OAuth (Tùy chọn cho Đăng nhập Google)
1. Trong Supabase Dashboard, chuyển tới **Authentication** > **Providers** > **Google**.
2. Bật công tắc **Enable Google provider**, nhập **Client ID** và **Client Secret** từ Google Cloud Console.

### Bước 4: Lấy API Key kết nối
1. Vào **Project Settings** > **API**.
2. Coppy hai giá trị:
   - **Project URL** (Ví dụ: `https://xyz.supabase.co`)
   - **anon / public key** (Ví dụ: `eyJhbG...`)

---

## 🌐 Hướng Dẫn Triển Khai Lên Vercel (Deployment)

### Bước 1: Kết nối Vercel với GitHub
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Bấm **Add New** > **Project**.
3. Chọn Repository **`RiceOS`** từ danh sách GitHub của bạn và bấm **Import**.

### Bước 2: Cấu hình Biến Môi Trường (Environment Variables)
Trong mục **Environment Variables** trên Vercel, thêm 2 biến sau:

| Name | Value (Lấy từ Supabase API) |
| :--- | :--- |
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here` |

### Bước 3: Deploy
1. Để nguyên cấu hình mặc định:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
2. Bấm **Deploy**. Sau 1-2 phút, dự án của bạn sẽ xuất hiện đường link trang web trực tuyến (Ví dụ: `https://riceos.vercel.app`)!

---

## 💻 Hướng Dẫn Chạy Dự Án Ở Local (Development)

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Tạo tệp .env cấu hình Supabase API Key
cp .env.example .env

# 3. Chạy Server thử nghiệm local
npm run dev
```

Mở trình duyệt truy cập `http://localhost:3000` để trải nghiệm ứng dụng.

---

## 📜 Giấy Phép (License)
Dự án được bảo hộ bản quyền cho hệ thống **RiceOS Enterprise ERP**.
