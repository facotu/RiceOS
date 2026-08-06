// React custom hook for traceability database operations
// File: src/features/traceability/hooks/useTraceability.ts

import { useState, useEffect, useCallback } from "react";
import { RiceTraceBatch, TraceBatchStatus } from "../domain/types.ts";
import { TraceabilityRepository } from "../repository/traceabilityRepository.ts";
import { TraceabilityService } from "../services/traceabilityService.ts";

const repo = new TraceabilityRepository();
const service = new TraceabilityService(repo);

export function useTraceability() {
  const [batches, setBatches] = useState<RiceTraceBatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTraceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await repo.getBatches();
      setBatches(list);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu truy xuất nguồn gốc");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTraceData();
  }, [loadTraceData]);

  const createBatch = async (
    farmerId: string,
    weighingSessionId: string,
    variety: string,
    weightKg: number,
    moisture: number
  ) => {
    setError(null);
    try {
      const id = await service.createTraceBatch(farmerId, weighingSessionId, variety, weightKg, moisture);
      await loadTraceData();
      return id;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateStatus = async (id: string, nextStatus: TraceBatchStatus, data: Partial<RiceTraceBatch>) => {
    setError(null);
    try {
      await service.updateLifecycle(id, nextStatus, data);
      await loadTraceData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    batches,
    isLoading,
    error,
    createBatch,
    updateStatus,
    refresh: loadTraceData
  };
}
export default useTraceability;
