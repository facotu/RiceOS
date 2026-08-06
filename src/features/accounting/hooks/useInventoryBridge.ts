// React custom hook for Inventory Accounting Bridge
// File: src/features/accounting/hooks/useInventoryBridge.ts

import { useState, useEffect, useCallback } from "react";
import { inventoryBridgeRepo } from "../repository/inventoryBridgeRepository.ts";
import { inventoryBridgeService } from "../services/inventoryBridgeService.ts";
import { InventoryTransaction, InventoryAccountMap } from "../domain/bridgeTypes.ts";

export function useInventoryBridge(warehouseId?: string) {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await inventoryBridgeRepo.getTransactions(warehouseId);
      setTransactions(list);
    } catch (err: any) {
      setError(err.message || "Lỗi tải giao dịch kho liên kết");
    } finally {
      setIsLoading(false);
    }
  }, [warehouseId]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Lấy giá vốn bình quân gia quyền cho giống lúa sấy
  const getWeightedCost = async (varietyId: string, whId: string): Promise<number> => {
    try {
      return await inventoryBridgeService.calculateWeightedAverageCost(varietyId, whId);
    } catch {
      return 0;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    getWeightedCost,
    refresh: loadTransactions
  };
}
export default useInventoryBridge;
