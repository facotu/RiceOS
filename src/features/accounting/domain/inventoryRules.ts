// Inventory Validation Rules for RiceOS ERP
// File: src/features/accounting/domain/inventoryRules.ts

export class InventoryValidationRules {
  // Quy tắc 1: Ngăn chặn xuất âm kho lúa sấy
  public static validateStockQuantity(currentStock: number, outputQuantity: number) {
    if (currentStock < outputQuantity) {
      throw new Error(`Lỗi kiểm tra kho lúa: Tồn kho thực tế (${currentStock.toLocaleString()} kg) không đủ để thực hiện xuất (${outputQuantity.toLocaleString()} kg).`);
    }
  }

  // Quy tắc 2: Kiểm soát tỷ lệ hao hụt sấy lúa thực tế (Chuẩn từ 10% đến 25%)
  public static validateDryingLoss(rawWeight: number, dryWeight: number) {
    if (rawWeight <= 0) throw new Error("Khối lượng lúa tươi thu mua phải lớn hơn 0 kg.");
    if (dryWeight > rawWeight) {
      throw new Error("Lỗi nghịch lý sấy: Khối lượng lúa khô sau sấy không được phép lớn hơn khối lượng lúa tươi ban đầu.");
    }

    const loss = rawWeight - dryWeight;
    const lossPercent = (loss / rawWeight) * 100;

    if (lossPercent < 10 || lossPercent > 25) {
      console.warn(`[CẢNH BÁO KHO SẤY] Tỷ lệ hao hụt sấy lúa thực tế (${lossPercent.toFixed(1)}%) nằm ngoài khoảng hao hụt định mức tiêu chuẩn của HTX (10% - 25%).`);
    }
    return lossPercent;
  }
}
