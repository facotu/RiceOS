// Dashboard custom query hooks for RiceOS
// File: src/features/dashboard/hooks/useDashboardData.ts

import { useState, useEffect } from "react";
import { DashboardRepository } from "../repository/dashboardRepository.ts";
import { DashboardService, FormattedDashboardStats } from "../services/dashboardService.ts";

const repo = new DashboardRepository();
const service = new DashboardService(repo);

export function useDashboardData(orgId: string) {
  const [stats, setStats] = useState<FormattedDashboardStats | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    
    async function loadData() {
      try {
        setIsLoading(true);
        const fetchedStats = await service.getStatsForUI(orgId);
        const fetchedActs = await service.getRecentActivities(orgId);

        if (active) {
          setStats(fetchedStats);
          setActivities(fetchedActs);
          setError(null);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Lỗi tải dữ liệu Dashboard");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [orgId]);

  return { stats, activities, isLoading, error };
}
