# Tiêu chuẩn Lập trình Dự án RiceOS

Tài liệu này quy định các tiêu chuẩn viết code, quy tắc đặt tên, xử lý lỗi và các thực hành bảo mật bắt buộc phải tuân thủ trong toàn bộ hệ thống RiceOS.

---

## 💡 Nguyên tắc Thiết kế Cốt lõi

Mã nguồn dự án RiceOS cần được xây dựng dựa trên các nguyên tắc cơ bản sau:
1. **KISS (Keep It Simple, Stupid):** Giữ cho giải pháp luôn đơn giản và dễ hiểu nhất có thể. Tránh tối ưu hóa sớm khi chưa cần thiết.
2. **DRY (Don't Repeat Yourself):** Hạn chế tối đa việc lặp lại mã nguồn. Gom các logic nghiệp vụ trùng lặp vào các hàm hoặc module dùng chung.
3. **Khai báo tường minh (Explicit over Implicit):** Logic rõ ràng, tường minh luôn tốt hơn các kỹ thuật ẩn hoặc tự động ngầm.
4. **Nguyên tắc SOLID:** Áp dụng thiết kế hướng đối tượng hoặc hướng module linh hoạt để đảm bảo hệ thống dễ mở rộng và bảo trì.

---

## 🏷️ Quy tắc Đặt tên (Naming Conventions)

Mặc dù tài liệu và giao diện hệ thống sử dụng **Tiếng Việt**, nhưng để đảm bảo tính tương thích với các thư viện kỹ thuật và công cụ lập trình, **tất cả mã nguồn (biến, hàm, class, cơ sở dữ liệu) phải được đặt tên bằng Tiếng Anh chuẩn**.

### 1. Quy tắc viết Hoa/Thường
| Đối tượng | Quy tắc | Ví dụ |
| :--- | :--- | :--- |
| **Lớp / Interface / Type** | `PascalCase` | `WeighingReceipt`, `WarehouseInventory` |
| **Biến / Thuộc tính / Hàm** | `camelCase` | `netWeight`, `calculatePricing()`, `isSettled` |
| **Hằng số (Constants)** | `UPPER_CASE_SNAKE` | `MAX_MOISTURE_PERCENT`, `DEFAULT_TAX_RATE` |
| **Bảng / Trường Cơ sở dữ liệu** | `snake_case` | `weighing_receipts`, `total_amount` |
| **Đường dẫn API (Endpoints)** | `kebab-case` | `/api/v1/weighing-receipts` |

### 2. Quy tắc ngữ nghĩa đặt tên
* **Hàm thực hiện hành động (Verbs):** Bắt đầu bằng một động từ thể hiện rõ mục đích: `getReceipt()`, `updateStatus()`, `validateWeight()`.
* **Biến Boolean:** Sử dụng các tiền tố khẳng định/phủ định: `isApproved`, `hasDiscrepancy`, `shouldRecalculate`.
* **Số nhiều:** Sử dụng hậu tố `List` hoặc chữ `s` (tiếng Anh) đối với mảng/danh sách: `receipts`, `userList`.

---

## ✍️ Chú thích Code (Code Comments)

* **Ngôn ngữ:** Tất cả các chú thích (comments) trong mã nguồn phải sử dụng **Tiếng Việt có dấu**, diễn đạt rõ ràng, mạch lạc.
* **Nguyên tắc chú thích:** Chỉ chú thích **TẠI SAO (Why)** đoạn code đó được viết như vậy, không giải thích **CÁI GÌ (What)** (vì code sạch phải tự giải thích được chính nó).
* **Đặc tả Hàm (Docstrings):** Tất cả các hàm nghiệp vụ phức tạp bắt buộc phải có mô tả đầu vào, đầu ra và ngoại lệ:
  ```typescript
  /**
   * Tính toán tổng tiền quyết toán cho phiếu cân dựa trên đơn giá và khấu trừ.
   * 
   * @param grossWeight Khối lượng tổng (bao gồm cả xe và lúa)
   * @param tareWeight Khối lượng vỏ xe (bì)
   * @param moisturePercent Tỷ lệ độ ẩm đo được (%)
   * @param basePrice Đơn giá lúa cơ bản trên mỗi kg
   * @returns Số tiền thực tế thanh toán sau khi trừ ẩm và tạp chất
   */
  function calculateSettlementAmount(
    grossWeight: number,
    tareWeight: number,
    moisturePercent: number,
    basePrice: number
  ): number {
    // Logic tính toán...
  }
  ```

---

## 🛡️ Xử lý lỗi & Ghi log (Error Handling & Logging)

### 1. Xử lý lỗi hệ thống
* **Không bao giờ bỏ qua ngoại lệ:** Không được sử dụng các khối `catch` rỗng. Mọi lỗi phát sinh phải được ghi log hoặc ném ra ngoài đúng cách.
* **Lỗi có ý nghĩa với người dùng:** Khi trả lỗi về giao diện, cần chuyển đổi mã lỗi kỹ thuật thành thông điệp tiếng Việt thân thiện với người dùng (ví dụ: Thay vì "Internal Server Error", hiển thị "Hệ thống đang bận, vui lòng thử lại sau").
* **Phân biệt loại lỗi:** 
  * `BusinessError`: Lỗi vi phạm quy tắc nghiệp vụ (ví dụ: Độ ẩm vượt quá 30% không cho phép nhập kho). Trả về mã lỗi HTTP 400/422.
  * `SystemError`: Lỗi hạ tầng, lỗi database. Trả về mã lỗi HTTP 500 và ghi log chi tiết.

### 2. Ghi nhật ký (Logging)
* Sử dụng các cấp độ log phù hợp:
  * `DEBUG`: Các thông tin chi tiết phục vụ quá trình phát triển.
  * `INFO`: Ghi nhận các sự kiện vận hành quan trọng (ví dụ: "Người dùng A đã xác nhận phiếu cân số #1203").
  * `WARN`: Cảnh báo các hành vi bất thường nhưng không làm sập hệ thống (ví dụ: "Kết nối DB bị chậm").
  * `ERROR`: Các lỗi nghiêm trọng làm gián đoạn luồng xử lý của khách hàng.
* **Bảo mật Log:** Tuyệt đối không ghi thông tin nhạy cảm (mật khẩu, khóa bảo mật, số thẻ tài khoản ngân hàng) vào hệ thống log.

---

## 🔒 Tiêu chuẩn Bảo mật (Security Standards)

1. **Ngăn chặn SQL Injection:** Luôn sử dụng các câu lệnh truy vấn được tham số hóa (Parameterized Queries) hoặc thư viện ORM an toàn. Tuyệt đối không cộng chuỗi SQL trực tiếp với đầu vào của người dùng.
2. **Kiểm tra đầu vào (Input Validation):** Mọi dữ liệu gửi từ Client lên Server phải được kiểm duyệt nghiêm ngặt về kiểu dữ liệu, độ dài và các ký tự đặc biệt.
3. **Phòng chống XSS:** Mã hóa toàn bộ dữ liệu do người dùng nhập trước khi hiển thị lên giao diện web.
4. **Kiểm soát quyền truy cập (Access Control):** Mỗi API endpoint phải được kiểm tra quyền hạn (Role-based Access Control) để đảm bảo "Nhân viên cân" không thể truy cập API duyệt thanh toán của "Kế toán" hoặc "Giám đốc".
5. **Mã hóa dữ liệu nhạy cảm:** Mật khẩu người dùng phải được băm (hash) bằng thuật toán mạnh (như `bcrypt` hoặc `argon2`) kèm muối (salt). Dữ liệu truyền tải giữa Client và Server bắt buộc sử dụng HTTPS.
