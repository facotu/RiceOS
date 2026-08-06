# ĐẶC TẢ GIAO DIỆN LẬP TRÌNH (API SPECIFICATION)
## RiceOS - Hệ thống Quản lý Thu mua Lúa gạo Thông minh

* **Dự án:** RiceOS
* **Phiên bản:** 1.0
* **Tác giả:** Phạm Tuân
* **Trạng thái:** Đề xuất

---

Hệ thống sử dụng mô hình RESTful API bảo mật bằng JWT token để giao tiếp dữ liệu giữa Client và Server.

---

## 1. Các API Xác thực (Authentication)

### 1.1. Đăng nhập hệ thống (POST `/api/v1/auth/login`)
* **Mô tả:** Người dùng nhập số điện thoại và mật khẩu để lấy Access Token JWT.
* **Headers:** `Content-Type: application/json`
* **Yêu cầu (Request Body):**
  ```json
  {
    "phone_number": "0905123456",
    "password": "hashed_or_plain_password"
  }
  ```
* **Phản hồi thành công (Response 200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "expires_in": 3600,
    "user": {
      "id": "u-uuid-123",
      "full_name": "Nguyễn Văn B",
      "role": "weighing_officer",
      "organization_id": "org-uuid-456"
    }
  }
  ```
* **Phản hồi lỗi (Response 401 Unauthorized):**
  ```json
  {
    "error": "Số điện thoại hoặc mật khẩu không chính xác."
  }
  ```

---

## 2. Các API Nghiệp vụ Trạm Cân (Weighing Receipts)

Mọi API nghiệp vụ dưới đây yêu cầu Header: `Authorization: Bearer <access_token>`.

### 2.1. Đăng ký Phiếu cân lần 1 - Gross (POST `/api/v1/weighing-receipts`)
* **Mô tả:** Nhân viên cân tạo phiếu cân lúa mới khi xe chở lúa vào trạm.
* **Yêu cầu (Request Body):**
  ```json
  {
    "farmer_id": "farmer-uuid-789",
    "rice_variety_id": "variety-uuid-111",
    "truck_plate": "43C-123.45",
    "gross_weight": 12450.00,
    "moisture_percent": 15.5,
    "trash_percent": 1.2
  }
  ```
* **Phản hồi thành công (Response 201 Created):**
  ```json
  {
    "id": "receipt-uuid-001",
    "receipt_number": "PC-20260806-0001",
    "status": "pending_warehouse",
    "created_at": "2026-08-06T13:00:00Z"
  }
  ```

### 2.2. Đồng bộ danh sách ngoại tuyến (POST `/api/v1/weighing-receipts/bulk-sync`)
* **Mô tả:** Đẩy mảng các phiếu cân tạo offline từ IndexedDB lên máy chủ khi có mạng trở lại.
* **Yêu cầu (Request Body):**
  ```json
  {
    "receipts": [
      {
        "id": "receipt-uuid-offline-1",
        "farmer_id": "farmer-uuid-789",
        "rice_variety_id": "variety-uuid-111",
        "truck_plate": "92H-999.99",
        "gross_weight": 8500.00,
        "moisture_percent": 14.0,
        "trash_percent": 0.8,
        "created_at": "2026-08-06T11:20:00Z"
      }
    ]
  }
  ```
* **Phản hồi thành công (Response 200 OK):**
  ```json
  {
    "synced_count": 1,
    "errors": []
  }
  ```

---

## 3. Các API Nghiệp vụ Thủ kho (Warehouse Check-In)

### 3.1. Xác nhận xe lúa đã đổ vào Silo (PUT `/api/v1/weighing-receipts/{id}/warehouse-confirm`)
* **Mô tả:** Thủ kho chọn xe và chọn Silo chứa để xác nhận thực nhận hàng.
* **Yêu cầu (Request Body):**
  ```json
  {
    "warehouse_id": "warehouse-silo-uuid-101"
  }
  ```
* **Phản hồi thành công (Response 200 OK):**
  ```json
  {
    "id": "receipt-uuid-001",
    "status": "pending_tare",
    "warehouse_id": "warehouse-silo-uuid-101",
    "confirmed_at": "2026-08-06T13:15:00Z"
  }
  ```

---

## 4. Các API Nghiệp vụ Kế toán & Quyết toán (Settlement)

### 4.1. Lập Phiếu quyết toán thanh toán (POST `/api/v1/settlements`)
* **Mô tả:** Kế toán tạo phiếu chi trả tiền lúa cho nông dân.
* **Yêu cầu (Request Body):**
  ```json
  {
    "weighing_receipt_id": "receipt-uuid-001",
    "applied_price": 8000.00,
    "payment_method": "bank_transfer"
  }
  ```
* **Phản hồi thành công (Response 201 Created):**
  ```json
  {
    "id": "settlement-uuid-501",
    "total_amount": 72136000.00,
    "status": "pending_approval",
    "message": "Số tiền vượt hạn mức 50 triệu, đang chờ Giám đốc duyệt."
  }
  ```

### 4.2. Phê duyệt duyệt chi của Giám đốc (PUT `/api/v1/settlements/{id}/approve`)
* **Mô tả:** Giám đốc thực hiện duyệt chi trên điện thoại.
* **Yêu cầu (Request Body):**
  ```json
  {
    "action": "approve | reject",
    "reason": "Nếu chọn reject bắt buộc nhập lý do vào đây"
  }
  ```
* **Phản hồi thành công (Response 200 OK):**
  ```json
  {
    "id": "settlement-uuid-501",
    "status": "approved",
    "approved_at": "2026-08-06T13:45:00Z"
  }
  ```
