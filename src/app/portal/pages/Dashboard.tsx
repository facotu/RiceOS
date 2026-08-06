// Enterprise role-based executive dashboard with UseCases, Cache & NotificationCenter
// File: src/app/portal/pages/Dashboard.tsx

import React, { useEffect, useState } from "react";
import { usePortal } from "../context/PortalContext.tsx";
import { useExecutiveDashboard } from "../../../features/executive-dashboard/hooks/useExecutiveDashboard.ts";
import ExecutiveKPICard from "../../../features/executive-dashboard/components/ExecutiveKPICard.tsx";
import ProductionChart from "../../../features/executive-dashboard/components/ProductionChart.tsx";
import FinancialHealthCard from "../../../features/executive-dashboard/components/FinancialHealthCard.tsx";
import RiskAlertWidget from "../../../features/executive-dashboard/components/RiskAlertWidget.tsx";
import AlertCenter from "../../../features/alerts/components/AlertCenter.tsx";
import NotificationCenter from "../../../features/alerts/components/NotificationCenter.tsx";
import RiceOSAssistant from "../../../features/ai/components/RiceOSAssistant.tsx";
import IntelligenceEngine from "../../../features/intelligence/services/intelligenceEngine.ts";
import { GetDashboardUseCase, RefreshDashboardUseCase } from "../../../core/usecases/useCases.ts";
import { systemScheduler } from "../../../core/scheduler/systemScheduler.ts";
import { ShieldCheck, RefreshCw, Landmark, Cpu } from "lucide-react";
import { db } from "../../../db/index.ts";

export default function DashboardPage() {
  const { user } = usePortal();
  const role = user?.role || "director";
  
  const { kpi, isLoading, error, refresh } = useExecutiveDashboard();
  const [insights, setInsights] = useState<any[]>([]);

  // Trigger Business Intelligence scans and UseCase cache load
  const runBIAnalysis = async () => {
    const data = await IntelligenceEngine.analyzeBusinessInsights();
    setInsights(data);
  };

  useEffect(() => {
    runBIAnalysis();
    
    // Register ngầm scheduler job refresh KPI 10s/lần
    systemScheduler.registerJob({
      name: "refreshKPI",
      intervalMs: 10000,
      action: async () => {
        const getUseCase = new GetDashboardUseCase();
        await getUseCase.execute();
      }
    });
    systemScheduler.startJob("refreshKPI");

    return () => {
      systemScheduler.stopJob("refreshKPI");
    };
  }, [kpi]);

  const handleSimulateCostSurge = async () => {
    if (kpi) {
      const updated = {
        ...kpi,
        dryingCostPerKg: 384
      };
      await db.table("executive_kpis").put(updated);
      alert("Đã kích hoạt giả lập chi phí sấy lò tăng vọt 20%!");
      const refreshUseCase = new RefreshDashboardUseCase();
      await refreshUseCase.execute();
      refresh();
    }
  };

  const handleSimulateAgingSilo = async () => {
    const silo = await db.table("silos").get("silo-001");
    if (silo) {
      silo.status = "completed";
      silo.current_stock_kg = 20800;
      await db.table("silos").put(silo);
      alert("Đã giả lập Silo A trữ kho lô lúa đạt 90 ngày!");
      runBIAnalysis();
    }
  };

  // --------------------------------------------------
  // RENDER CORRESPONDING DASHBOARDS PER RBAC ROLE
  // --------------------------------------------------

  if (role === "warehouse_keeper") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
              <Cpu className="w-5 h-5 text-primary" />
              <span>Bảng vận hành kho lò sấy (Thủ kho)</span>
            </h1>
            <p className="text-xs text-gray-400 font-semibold">Giám sát hoạt động nạp kho, sensor IoT và cảnh báo an toàn lò sấy lúa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProductionChart
              totalWeighedKg={kpi?.totalWeightRaw || 0}
              totalDriedKg={kpi?.siloStockWeight || 0}
            />
            <NotificationCenter />
          </div>
          <div>
            <AlertCenter />
          </div>
        </div>
      </div>
    );
  }

  if (role === "accountant") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
              <Landmark className="w-5 h-5 text-emerald-600" />
              <span>Bảng đối soát tài chính (Kế toán)</span>
            </h1>
            <p className="text-xs text-gray-400 font-semibold">Theo dõi hạn mức thanh toán công nợ nông dân và giá trị tài sản tồn kho</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FinancialHealthCard
              cashFlow={kpi?.currentCashFlow || 0}
              payable={kpi?.farmerPayable || 0}
              inventoryValue={(kpi?.siloStockWeight || 0) * (kpi?.avgCostPerKg || 0)}
            />
            <NotificationCenter />
          </div>
          <div>
            <AlertCenter />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TITLE HEADER */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>RiceOS Enterprise Bảng Điều Hành Giám Đốc</span>
          </h1>
          <p className="text-xs text-gray-400 font-semibold">HTX Hòa Tiến 2 - Hạ tầng ERP Enterprise hợp nhất</p>
        </div>

        {/* TEST CASES CONTROL FOR DEMO */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateCostSurge}
            className="h-8 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg border border-amber-200"
          >
            Giả lập giá sấy vọt 20%
          </button>
          <button
            onClick={handleSimulateAgingSilo}
            className="h-8 px-2.5 bg-red-50 hover:bg-red-100 text-red-800 text-[10px] font-bold rounded-lg border border-red-200"
          >
            Giả lập Silo 90 ngày
          </button>
          <button
            onClick={() => { refresh(); runBIAnalysis(); }}
            className="h-8 w-8 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center transition"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <ExecutiveKPICard
        totalWeightRaw={kpi?.totalWeightRaw || 0}
        totalAmountBuy={kpi?.totalAmountBuy || 0}
        siloStockWeight={kpi?.siloStockWeight || 0}
        expectedProfit={kpi?.expectedProfit || 0}
        isLoading={isLoading}
      />

      {/* SECOND ROW: CHARTS AND FINANCIAL HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductionChart
            totalWeighedKg={kpi?.totalWeightRaw || 0}
            totalDriedKg={kpi?.siloStockWeight || 0}
          />
        </div>
        <div>
          <FinancialHealthCard
            cashFlow={kpi?.currentCashFlow || 0}
            payable={kpi?.farmerPayable || 0}
            inventoryValue={(kpi?.siloStockWeight || 0) * (kpi?.avgCostPerKg || 0)}
          />
        </div>
      </div>

      {/* THIRD ROW: ALERTS, NOTIFICATIONS AND AI ASSISTANT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <AlertCenter />
        </div>
        <div>
          <NotificationCenter />
        </div>
        <div>
          <RiskAlertWidget 
            alerts={insights.map(item => ({
              id: item.id,
              message: item.message,
              severity: item.severity
            }))} 
          />
        </div>
        <div>
          <RiceOSAssistant />
        </div>
      </div>
    </div>
  );
}
