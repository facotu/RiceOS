// React Custom Hook for Master Data Management
// File: src/features/master-data/hooks/useMasterData.ts

import { useState, useEffect, useCallback } from "react";
import { masterDataService } from "../services/masterDataService.ts";
import { MasterFarmer, MasterVariety, MasterWarehouse } from "../repository/masterDataRepository.ts";

export function useMasterData(orgId: string) {
  const [farmers, setFarmers] = useState<MasterFarmer[]>([]);
  const [varieties, setVarieties] = useState<MasterVariety[]>([]);
  const [warehouses, setWarehouses] = useState<MasterWarehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const f = await masterDataService.listFarmers();
      const v = await masterDataService.listVarieties();
      const w = await masterDataService.listWarehouses();

      setFarmers(f);
      setVarieties(v);
      setWarehouses(w);
    } catch (err: any) {
      setError(err.message || "Lỗi nạp dữ liệu danh mục hệ thống");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData, orgId]);

  // Hành động Thêm nông dân
  const addFarmer = async (name: string, phone: string, address?: string) => {
    setError(null);
    try {
      await masterDataService.createFarmer({ name, phone, address, orgId });
      await loadAllData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Hành động Thêm giống lúa
  const addVariety = async (name: string, description?: string) => {
    setError(null);
    try {
      await masterDataService.createVariety(name, description);
      await loadAllData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Hành động Thêm kho sấy
  const addWarehouse = async (name: string, capacityKg: number) => {
    setError(null);
    try {
      await masterDataService.createWarehouse(name, capacityKg);
      await loadAllData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    farmers,
    varieties,
    warehouses,
    isLoading,
    error,
    addFarmer,
    addVariety,
    addWarehouse,
    refresh: loadAllData
  };
}
export default useMasterData;
