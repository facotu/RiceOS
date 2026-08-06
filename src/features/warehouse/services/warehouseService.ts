// Warehouse and Silo Domain Service implementing business rules
// File: src/features/warehouse/services/warehouseService.ts

import { IWarehouseRepository } from "../repository/warehouseRepository.ts";
import { WarehouseRulesEngine } from "../domain/rulesEngine.ts";
import { Silo, RiceBatch, InventoryMovement } from "../domain/types.ts";

export class WarehouseService {
  private repository: IWarehouseRepository;

  constructor(repository: IWarehouseRepository) {
    this.repository = repository;
  }

  // 1. Nhập lúa tươi thu mua từ nông dân vào Silo sấy chỉ định
  async receiveRawRice(
    siloId: string, 
    riceVarietyId: string, 
    farmerId: string, 
    quantityKg: number, 
    moisturePercent: number,
    operator: string
  ): Promise<void> {
    const silo = await this.repository.getSiloById(siloId);
    if (!silo) throw new Error("Không tìm thấy Silo sấy chỉ định.");

    // Kiểm tra sức chứa an toàn của Silo chứa lúa
    WarehouseRulesEngine.validateSiloCapacity(silo, quantityKg);

    // Tạo Lô lúa sấy thu mua mới
    const batchId = crypto.randomUUID();
    const batch: RiceBatch = {
      id: batchId,
      silo_id: siloId,
      rice_variety_id: riceVarietyId,
      farmer_id: farmerId,
      quantity_kg: quantityKg,
      initial_moisture_percent: moisturePercent,
      target_moisture_percent: WarehouseRulesEngine.STANDARD_DRY_MOISTURE_PERCENT,
      status: "raw",
      created_at: new Date().toISOString()
    };
    await this.repository.saveBatch(batch);

    // Cập nhật trạng thái lò sấy và lượng tồn chứa thực tế
    silo.current_stock_kg += quantityKg;
    silo.status = "drying";
    silo.current_moisture_percent = moisturePercent;
    await this.repository.saveSilo(silo);

    // Lưu vết nhật ký chuyển đổi kho vật lý
    const movement: InventoryMovement = {
      id: crypto.randomUUID(),
      silo_id: siloId,
      batch_id: batchId,
      movement_type: "in_raw",
      quantity_kg: quantityKg,
      operator,
      created_at: new Date().toISOString()
    };
    await this.repository.saveMovement(movement);
  }

  // 2. Cập nhật các chỉ số đo cảm biến (Nhiệt độ & Độ ẩm thực tế lò sấy)
  async updateSiloMetrics(siloId: string, tempCelsius: number, moisturePercent: number): Promise<void> {
    const silo = await this.repository.getSiloById(siloId);
    if (!silo) throw new Error("Không tìm thấy Silo sấy chỉ định.");

    // Kiểm định an toàn nhiệt độ lò sấy hạt lúa
    WarehouseRulesEngine.validateSiloTemperature(tempCelsius);

    // Cập nhật thông số cảm biến
    silo.current_temp_celsius = tempCelsius;
    silo.current_moisture_percent = moisturePercent;
    
    // Nếu độ ẩm lúa đạt chuẩn 14% bảo quản, chuyển trạng thái hoàn tất sấy
    if (moisturePercent <= WarehouseRulesEngine.STANDARD_DRY_MOISTURE_PERCENT) {
      silo.status = "completed";
    }

    await this.repository.saveSilo(silo);
  }
}
