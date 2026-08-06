// React custom hook for Warehouse and Silo operations
// File: src/features/warehouse/hooks/useWarehouse.ts

import { useState, useEffect, useCallback } from "react";
import { Silo, RiceBatch, InventoryMovement } from "../domain/types.ts";
import { WarehouseRepository } from "../repository/warehouseRepository.ts";
import { WarehouseService } from "../services/warehouseService.ts";

const repo = new WarehouseRepository();
const service = new WarehouseService(repo);

export function useWarehouse(orgId: string) {
  const [silos, setSilos] = useState<Silo[]>([]);
  const [batches, setBatches] = useState<RiceBatch[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWarehouseData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sList = await repo.getSilos(orgId);
      const bList = await repo.getBatches();
      const mList = await repo.getMovements();

      setSilos(sList);
      setBatches(bList);
      setMovements(mList);
    } catch (err: any) {
      setError(err.message || "Lỗi nạp dữ liệu kho sấy lúa");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadWarehouseData();
  }, [loadWarehouseData]);

  // Hành động Nhập lúa tươi vào lò
  const receiveRawRiceBatch = async (
    siloId: string,
    varietyId: string,
    farmerId: string,
    quantityKg: number,
    moisturePercent: number,
    operator: string
  ) => {
    setError(null);
    try {
      await service.receiveRawRice(siloId, varietyId, farmerId, quantityKg, moisturePercent, operator);
      await loadWarehouseData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Hành động cập nhật cảm biến lò sấy
  const updateSensors = async (siloId: string, temp: number, moisture: number) => {
    setError(null);
    try {
      await service.updateSiloMetrics(siloId, temp, moisture);
      await loadWarehouseData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    silos,
    batches,
    movements,
    isLoading,
    error,
    receiveRawRiceBatch,
    updateSensors,
    refresh: loadWarehouseData
  };
}
export default useWarehouse;
