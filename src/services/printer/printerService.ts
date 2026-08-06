// Bluetooth ESC/POS Printer Service for K57/K80 thermal printers
// File: src/services/printer/printerService.ts

export class PrinterService {
  private device: any = null;
  private characteristic: any = null;

  // Cấu hình mã điều khiển máy in nhiệt ESC/POS chuẩn
  private ESC_POS = {
    INIT: new Uint8Array([0x1B, 0x40]),
    ALIGN_LEFT: new Uint8Array([0x1B, 0x61, 0x00]),
    ALIGN_CENTER: new Uint8Array([0x1B, 0x61, 0x01]),
    ALIGN_RIGHT: new Uint8Array([0x1B, 0x61, 0x02]),
    TEXT_NORMAL: new Uint8Array([0x1B, 0x21, 0x00]),
    TEXT_BOLD: new Uint8Array([0x1B, 0x21, 0x08]),
    TEXT_LARGE: new Uint8Array([0x1B, 0x21, 0x30]),
    FEED_LINE: new Uint8Array([0x0A])
  };

  // Yêu cầu kết nối Bluetooth tới máy in cầm tay mini
  async connect(): Promise<boolean> {
    try {
      if (!navigator.bluetooth) {
        throw new Error("Trình duyệt không hỗ trợ Web Bluetooth. Khuyên dùng Chrome Android.");
      }

      this.device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }], // Service in nhiệt Bluetooth tiêu chuẩn
        optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"]
      });

      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");
      
      // Tìm Characteristic ghi dữ liệu (Write Characteristic)
      const characteristics = await service.getCharacteristics();
      this.characteristic = characteristics.find((c: any) => c.properties.write || c.properties.writeWithoutResponse);

      if (!this.characteristic) {
        throw new Error("Không tìm thấy cổng truyền dữ liệu ghi trên máy in.");
      }

      return true;
    } catch (err) {
      console.error("Lỗi kết nối máy in:", err);
      alert("Kết nối máy in thất bại: " + err.message);
      return false;
    }
  }

  // Gửi lệnh byte thô tới máy in nhiệt
  private async writeRaw(data: Uint8Array) {
    if (!this.characteristic) return;
    await this.characteristic.writeValue(data);
  }

  // Gửi chuỗi văn bản UTF-8 không dấu (máy in nhiệt mini không hỗ trợ tiếng Việt có dấu chuẩn)
  private removeVietnameseTones(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  async printText(text: string, bold = false, align: 'left' | 'center' | 'right' = 'left') {
    if (!this.characteristic) return;
    
    // Áp dụng định dạng căn lề
    if (align === 'center') await this.writeRaw(this.ESC_POS.ALIGN_CENTER);
    else if (align === 'right') await this.writeRaw(this.ESC_POS.ALIGN_RIGHT);
    else await this.writeRaw(this.ESC_POS.ALIGN_LEFT);

    // Áp dụng độ đậm
    if (bold) await this.writeRaw(this.ESC_POS.TEXT_BOLD);
    else await this.writeRaw(this.ESC_POS.TEXT_NORMAL);

    // Encode text và ghi
    const encoder = new TextEncoder();
    const cleanText = this.removeVietnameseTones(text) + "\n";
    await this.writeRaw(encoder.encode(cleanText));
  }

  // Thực hiện in toàn bộ phiếu cân lúa
  async printReceipt(receipt: any, farmerName: string, varietyName: string) {
    if (!this.characteristic) {
      const ok = await this.connect();
      if (!ok) return;
    }

    try {
      // Khởi tạo máy in
      await this.writeRaw(this.ESC_POS.INIT);
      
      // Tiêu đề
      await this.printText("HTX NON nghiệp HOA TIEN 2", true, "center");
      await this.printText("--- PHIEU CAN LUA ---", true, "center");
      await this.printText("--------------------------------", false, "center");
      
      // Thông tin chung
      await this.printText(`Phieu so: ${receipt.receipt_number}`);
      await this.printText(`Ngay can: ${new Date(receipt.created_at).toLocaleString()}`);
      await this.printText(`Chu ruong: ${farmerName}`);
      await this.printText(`Bien so xe: ${receipt.truck_plate}`);
      await this.printText(`Giong lua: ${varietyName}`);
      await this.printText("--------------------------------", false, "center");

      // Khối lượng
      await this.printText(`Can Tong (Gross): ${receipt.gross_weight} kg`, true);
      if (receipt.tare_weight) {
        await this.printText(`Can Vo (Tare):    ${receipt.tare_weight} kg`, true);
        const net = receipt.gross_weight - receipt.tare_weight;
        await this.printText(`Can Tinh (Net):   ${net} kg`, true);
      }
      await this.printText(`Do am: ${receipt.moisture_percent}% | Tap chat: ${receipt.trash_percent}%`);
      await this.printText("--------------------------------", false, "center");

      // Ký nhận
      await this.printText("Can Bo Can        Nong Dan Ky", true, "center");
      await this.printRaw(this.ESC_POS.FEED_LINE);
      await this.printRaw(this.ESC_POS.FEED_LINE);
      await this.printRaw(this.ESC_POS.FEED_LINE);
      await this.printText("(Ky va ghi ro ho ten)", false, "center");
      
      // Đẩy giấy ra thêm 3 dòng
      await this.printRaw(this.ESC_POS.FEED_LINE);
      await this.printRaw(this.ESC_POS.FEED_LINE);
      await this.printRaw(this.ESC_POS.FEED_LINE);
    } catch (err) {
      console.error("Lỗi khi gửi lệnh in:", err);
    }
  }
}

export const printerService = new PrinterService();
export default printerService;
