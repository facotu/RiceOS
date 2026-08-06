// Drying operation Domain Service implementing State Machine, costing and logs
// File: src/features/drying/services/dryingService.ts

import { IDryingRepository } from "../repository/dryingRepository.ts";
import { DryingCalculationEngine } from "../domain/calculationEngine.ts";
import { DryingRulesEngine } from "../domain/rulesEngine.ts";
import { DryingStateMachine, DryingState } from "../domain/dryingStateMachine.ts";
import { DryingOrder, DryingResult, DryingSensorLog } from "../domain/types.ts";
import { DryingOperationLog, DryingBatchCard, DryingActionType } from "../domain/operationLogTypes.ts";
import { db } from "../../../db/index.ts";
import { LedgerEntry } from "../../accounting/domain/types.ts";

export class DryingService {
  private repository: IDryingRepository;

  constructor(repository: IDryingRepository) {
    this.repository = repository;
  }

  // Khởi dựng thẻ mẻ sấy mặc định
  private async getOrCreateBatchCard(orderId: string, initialWeight: number, initialMoisture: number): Promise<DryingBatchCard> {
    let card = await db.table("drying_batch_cards").get({ dryingOrderId: orderId });
    if (!card) {
      card = {
        id: crypto.randomUUID(),
        dryingOrderId: orderId,
        inputWeight: initialWeight,
        outputWeight: 0,
        inputMoisture: initialMoisture,
        outputMoisture: 0,
        cost: 0,
        status: "WAITING"
      };
      await db.table("drying_batch_cards").add(card);
    }
    return card;
  }

  // 1. Kích hoạt Lệnh sấy lúa (Drying Order Start)
  async startDrying(siloId: string, batchId: string, operator: string): Promise<string> {
    const silo = await db.table("silos").get(siloId);
    const batch = await db.table("rice_batches").get(batchId);
    if (!silo || !batch) throw new Error("Không tìm thấy lò Silo hoặc Lô lúa.");

    // Kiểm tra điều kiện nhiệt độ lò sấy và độ ẩm lúa tươi
    DryingRulesEngine.checkStartDryingConditions(silo.current_temp_celsius, batch.initial_moisture_percent);

    const orderId = crypto.randomUUID();
    const order: DryingOrder = {
      id: orderId,
      silo_id: siloId,
      batch_id: batchId,
      start_time: new Date().toISOString(),
      initial_weight_kg: batch.quantity_kg,
      initial_moisture_percent: batch.initial_moisture_percent,
      status: "active",
      operator
    };
    await this.repository.saveOrder(order);

    // Khởi tạo thẻ mẻ sấy WAITING
    await this.getOrCreateBatchCard(orderId, batch.quantity_kg, batch.initial_moisture_percent);

    // Cập nhật trạng thái lò Silo
    silo.status = "drying";
    await db.table("silos").put(silo);

    // Cập nhật trạng thái Lô lúa sấy
    batch.status = "drying";
    await db.table("rice_batches").put(batch);

    return orderId;
  }

  // 2. Ghi nhận nhật ký cảm biến lò sấy (IoT Sensor Integration)
  async logSensorData(orderId: string, temp: number, moisture: number): Promise<void> {
    const order = await this.repository.getOrderById(orderId);
    if (!order) throw new Error("Không tìm thấy lệnh sấy.");

    // Chỉ nhận log khi lò đang trong trạng thái chạy DRYING hoặc COOLING
    const card = await db.table("drying_batch_cards").get({ dryingOrderId: orderId });
    if (card && card.status !== "DRYING" && card.status !== "COOLING") {
      console.warn(`[LÒ SẤY] Không nhận tín hiệu cảm biến ở trạng thái ${card.status}`);
      return;
    }

    // Ghi nhận nhật ký IoT
    const log: DryingSensorLog = {
      id: crypto.randomUUID(),
      order_id: orderId,
      timestamp: new Date().toISOString(),
      temperature_celsius: temp,
      moisture_percent: moisture
    };
    await this.repository.saveSensorLog(log);

    // Cập nhật nhiệt độ và độ ẩm tức thời của Silo sấy
    const silo = await db.table("silos").get(order.silo_id);
    if (silo) {
      silo.current_temp_celsius = temp;
      silo.current_moisture_percent = moisture;
      await db.table("silos").put(silo);
    }
  }

  // 3. MÁY TRẠNG THÁI SẤY (Lifecycle transitions)
  async startLoading(orderId: string, operator: string): Promise<void> {
    const order = await this.repository.getOrderById(orderId);
    if (!order) throw new Error("Không tìm thấy lệnh sấy.");
    
    const card = await this.getOrCreateBatchCard(orderId, order.initial_weight_kg, order.initial_moisture_percent);
    card.status = DryingStateMachine.transition(card.status as DryingState, "LOADING");
    await db.table("drying_batch_cards").put(card);

    await this.addOperationLog(orderId, "Nạp lúa", "Đang nạp lúa tươi từ xe gặt vào lò sấy A", operator);
  }

  async startDryingState(orderId: string, operator: string): Promise<void> {
    const order = await this.repository.getOrderById(orderId);
    if (!order) throw new Error("Không tìm thấy lệnh sấy.");

    const card = await this.getOrCreateBatchCard(orderId, order.initial_weight_kg, order.initial_moisture_percent);
    card.status = DryingStateMachine.transition(card.status as DryingState, "DRYING");
    await db.table("drying_batch_cards").put(card);

    await this.addOperationLog(orderId, "Điều chỉnh nhiệt", "Bắt đầu đốt lò sấy nhiệt lượng", operator);
  }

  async startCoolingState(orderId: string, operator: string): Promise<void> {
    const order = await this.repository.getOrderById(orderId);
    if (!order) throw new Error("Không tìm thấy lệnh sấy.");

    const card = await this.getOrCreateBatchCard(orderId, order.initial_weight_kg, order.initial_moisture_percent);
    card.status = DryingStateMachine.transition(card.status as DryingState, "COOLING");
    await db.table("drying_batch_cards").put(card);

    await this.addOperationLog(orderId, "Điều chỉnh nhiệt", "Ngắt gia nhiệt, thổi gió mát làm nguội lò sấy", operator);
  }

  async qualityCheckState(orderId: string, operator: string): Promise<void> {
    const order = await this.repository.getOrderById(orderId);
    if (!order) throw new Error("Không tìm thấy lệnh sấy.");

    const card = await this.getOrCreateBatchCard(orderId, order.initial_weight_kg, order.initial_moisture_percent);
    card.status = DryingStateMachine.transition(card.status as DryingState, "QUALITY_CHECK");
    await db.table("drying_batch_cards").put(card);

    await this.addOperationLog(orderId, "Vệ sinh lò", "Đo độ ẩm lúa khô thành phẩm đạt chuẩn lưu trữ", operator);
  }

  // 4. Hoàn tất mẻ sấy lúa & Kết nối Kho Silo + Hạch toán Kế toán (Inventory & Accounting Bridge)
  async completeDryingState(
    orderId: string,
    outputWeight: number,
    outputMoisture: number,
    runHours: number,
    operator: string
  ): Promise<void> {
    const order = await this.repository.getOrderById(orderId);
    if (!order) throw new Error("Không tìm thấy lệnh sấy.");

    // Kiểm tra chốt chặn máy trạng thái trước
    const card = await this.getOrCreateBatchCard(orderId, order.initial_weight_kg, order.initial_moisture_percent);
    card.status = DryingStateMachine.transition(card.status as DryingState, "COMPLETED");

    // Kiểm định chốt chặn độ ẩm lúa khô
    DryingRulesEngine.validateTargetMoisture(outputMoisture);

    // Yêu cầu bắt buộc đầy đủ số liệu vận hành lò sấy
    if (!order.initial_weight_kg || !outputWeight || runHours <= 0) {
      throw new Error("Không cho phép đóng mẻ sấy: Thiếu khối lượng tươi, khối lượng khô hoặc số giờ chạy lò.");
    }

    const lossKg = order.initial_weight_kg - outputWeight;
    const waterLiters = DryingCalculationEngine.calculateWaterEvaporated(order.initial_weight_kg, outputWeight);
    const costs = DryingCalculationEngine.calculateOperationCosts(runHours);

    // Lưu phiếu sấy kết quả
    const result: DryingResult = {
      id: crypto.randomUUID(),
      order_id: orderId,
      final_weight_kg: outputWeight,
      final_moisture_percent: outputMoisture,
      drying_loss_kg: lossKg,
      water_evaporated_liters: waterLiters,
      total_fuel_cost: costs.totalFuel,
      total_electricity_cost: costs.totalElectricity,
      total_labor_cost: costs.totalLabor,
      total_drying_cost: costs.totalCost,
      completed_at: new Date().toISOString()
    };
    await this.repository.saveResult(result);

    // Cập nhật card mẻ sấy
    card.outputWeight = outputWeight;
    card.outputMoisture = outputMoisture;
    card.cost = costs.totalCost;
    await db.table("drying_batch_cards").put(card);

    // Cập nhật trạng thái lệnh sấy gốc
    order.status = "completed";
    order.end_time = new Date().toISOString();
    await this.repository.saveOrder(order);

    // 5. Cập nhật tồn kho Silo vật lý (Inventory Movement)
    const silo = await db.table("silos").get(order.silo_id);
    if (silo) {
      silo.current_stock_kg = outputWeight;
      silo.status = "completed";
      silo.current_moisture_percent = outputMoisture;
      await db.table("silos").put(silo);
    }

    const batch = await db.table("rice_batches").get(order.batch_id);
    if (batch) {
      batch.status = "dry";
      batch.quantity_kg = outputWeight;
      await db.table("rice_batches").put(batch);
    }

    // Ghi nhật ký di chuyển kho hao hụt và sấy hoàn tất
    await db.table("inventory_movements").bulkPut([
      {
        id: crypto.randomUUID(),
        silo_id: order.silo_id,
        batch_id: order.batch_id,
        movement_type: "out_loss",
        quantity_kg: lossKg,
        operator,
        created_at: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        silo_id: order.silo_id,
        batch_id: order.batch_id,
        movement_type: "out_dry",
        quantity_kg: outputWeight,
        operator,
        created_at: new Date().toISOString()
      }
    ]);

    // 6. Định khoản tự động (Accounting Bridge)
    // Nợ TK 1522 (Lúa sấy khô): costs.totalCost
    // Có TK 154 (Chi phí sấy dở dang): costs.totalCost
    const entryDebit: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: orderId,
      account_code: "1522",
      entry_type: "debit",
      amount: costs.totalCost,
      description: `Ket chuyen chi phi say vao gia tri lua kho phieu ${orderId}`,
      created_at: new Date().toISOString()
    };
    const entryCredit: LedgerEntry = {
      id: crypto.randomUUID(),
      settlement_id: orderId,
      account_code: "154",
      entry_type: "credit",
      amount: costs.totalCost,
      description: `Ghi co ket chuyen lo say phieu ${orderId}`,
      created_at: new Date().toISOString()
    };

    await db.table("ledger_entries").bulkPut([entryDebit, entryCredit]);
    await this.addOperationLog(orderId, "Bàn giao ca", `Hoàn tất sấy mẻ ${orderId}. Sản lượng lúa khô: ${outputWeight} kg.`, operator);
  }

  async closeBatchState(orderId: string, operator: string): Promise<void> {
    const order = await this.repository.getOrderById(orderId);
    if (!order) throw new Error("Không tìm thấy lệnh sấy.");

    const card = await this.getOrCreateBatchCard(orderId, order.initial_weight_kg, order.initial_moisture_percent);
    card.status = DryingStateMachine.transition(card.status as DryingState, "CLOSED");
    await db.table("drying_batch_cards").put(card);

    await this.addOperationLog(orderId, "Bàn giao ca", "Khóa sổ mẻ sấy hoàn toàn (CLOSED), không cho phép chỉnh sửa thêm.", operator);
  }

  // 5. Thêm nhật ký vận hành thủ công
  async addOperationLog(
    orderId: string, 
    action: DryingActionType, 
    note: string, 
    operator: string
  ): Promise<void> {
    const card = await db.table("drying_batch_cards").get({ dryingOrderId: orderId });
    if (card && card.status === "CLOSED") {
      throw new Error("Không thể ghi thêm nhật ký thao tác do mẻ sấy đã CLOSED.");
    }

    const log: DryingOperationLog = {
      id: crypto.randomUUID(),
      dryingOrderId: orderId,
      operator,
      action,
      note,
      createdAt: new Date().toISOString()
    };
    await db.table("drying_operation_logs").add(log);
  }
}
