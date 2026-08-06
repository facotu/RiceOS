// React custom hook for Executive Dashboard data hydration
// File: src/features/executive-dashboard/hooks/useExecutiveDashboard.ts

import { useState, useEffect, useCallback } from "react";
import { ExecutiveKPI } from "../domain/types.ts";
import { ExecutiveDashboardRepository } from "../repository/executiveDashboardRepository.ts";
import { ExecutiveDashboardService } from "../services/executiveDashboardService.ts";

const repo = new ExecutiveDashboardRepository();
const service = new ExecutiveDashboardService(repo);

export function useExecutiveDashboard() {
  const [kpi, setKpi] = useState<ExecutiveKPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.calculateKPIs();
      setKpi(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải chỉ số điều hành");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    kpi,
    isLoading,
    error,
    refresh: loadDashboard
  };
}
export default useExecutiveDashboard;
