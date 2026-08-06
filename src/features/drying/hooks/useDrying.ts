// React custom hook for Drying Operations lifecycle & state machine
// File: src/features/drying/hooks/useDrying.ts

import { useState, useEffect, useCallback } from "react";
import { DryingOrder, DryingResult } from "../domain/types.ts";
import { DryingOperationLog, DryingBatchCard, DryingActionType } from "../domain/operationLogTypes.ts";
import { DryingRepository } from "../repository/dryingRepository.ts";
import { DryingService } from "../services/dryingService.ts";
import { db } from "../../../db/index.ts";

const repo = new DryingRepository();
const service = new DryingService(repo);

export function useDrying() {
  const [orders, setOrders] = useState<DryingOrder[]>([]);
  const [results, setResults] = useState<DryingResult[]>([]);
  const [batchCards, setBatchCards] = useState<DryingBatchCard[]>([]);
  const [operationLogs, setOperationLogs] = useState<DryingOperationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDryingData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const oList = await repo.getOrders();
      const rList = await repo.getResults();
      const cList = await db.table("drying_batch_cards").toArray();
      const lList = await db.table("drying_operation_logs").toArray();

      setOrders(oList);
      setResults(rList);
      setBatchCards(cList);
      setOperationLogs(lList);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu sấy lò");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDryingData();
  }, [loadDryingData]);

  // Khởi động lệnh sấy lúa mới
  const startDryingOrder = async (siloId: string, batchId: string, operator: string) => {
    setError(null);
    try {
      const orderId = await service.startDrying(siloId, batchId, operator);
      await loadDryingData();
      return orderId;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Các bước chuyển đổi máy trạng thái lò sấy lúa
  const startLoading = async (orderId: string, operator: string) => {
    setError(null);
    try {
      await service.startLoading(orderId, operator);
      await loadDryingData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const startDrying = async (orderId: string, operator: string) => {
    setError(null);
    try {
      await service.startDryingState(orderId, operator);
      await loadDryingData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const startCooling = async (orderId: string, operator: string) => {
    setError(null);
    try {
      await service.startCoolingState(orderId, operator);
      await loadDryingData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const qualityCheck = async (orderId: string, operator: string) => {
    setError(null);
    try {
      await service.qualityCheckState(orderId, operator);
      await loadDryingData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const completeDrying = async (
    orderId: string,
    outputWeight: number,
    outputMoisture: number,
    runHours: number,
    operator: string
  ) => {
    setError(null);
    try {
      await service.completeDryingState(orderId, outputWeight, outputMoisture, runHours, operator);
      await loadDryingData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const closeBatch = async (orderId: string, operator: string) => {
    setError(null);
    try {
      await service.closeBatchState(orderId, operator);
      await loadDryingData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Ghi nhận nhật ký thủ kho vận hành
  const addOperationLog = async (orderId: string, action: DryingActionType, note: string, operator: string) => {
    setError(null);
    try {
      await service.addOperationLog(orderId, action, note, operator);
      await loadDryingData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    orders,
    results,
    batchCards,
    operationLogs,
    isLoading,
    error,
    startDryingOrder,
    startLoading,
    startDrying,
    startCooling,
    qualityCheck,
    completeDrying,
    completeDryingOrder: completeDrying,
    closeBatch,
    addOperationLog,
    logSensors: async (orderId: string, temp: number, moisture: number) => {
      await service.addOperationLog(orderId, "DRYING", `Nhiệt độ: ${temp}°C, Độ ẩm: ${moisture}%`, "SensorGateway");
      return true;
    },
    refresh: loadDryingData
  };
}
export default useDrying;
