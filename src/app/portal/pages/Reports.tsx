// Reporting and Traceability Command Center Page for RiceOS Portal
// File: src/app/portal/pages/Reports.tsx

import React, { useState } from "react";
import { usePortal } from "../context/PortalContext.tsx";
import useAccountingReports from "../../../features/accounting/hooks/useAccountingReports.ts";
import FarmerPayableReport from "../../../features/accounting/components/FarmerPayableReport.tsx";
import GeneralLedgerView from "../../../features/accounting/components/GeneralLedgerView.tsx";
import CashFlowReportView from "../../../features/accounting/components/CashFlowReportView.tsx";
import FarmerTraceView from "../../../features/traceability/components/FarmerTraceView.tsx";
import E2ETestConsole from "../../../features/traceability/components/E2ETestConsole.tsx";
import { FileBarChart, Calendar, ArrowUpRight, Scale, RefreshCw } from "lucide-react";

export default function ReportsPage() {
  const { user } = usePortal();
  const [activeTab, setActiveTab] = useState<'financial' | 'traceability' | 'e2e'>('financial');
  
  // Custom hook nạp dữ liệu báo cáo kế toán
  const {
    payableReport,
    purchaseReport,
    cashFlow,
    journal,
    isLoading,
    error,
    downloadPayableCSV,
    downloadJournalCSV,
    refresh
  } = useAccountingReports(user?.organization_id || "org-default");

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Tích hợp Nghiệp vụ</h1>
          <p className="text-sm text-gray-500 mt-1">Hệ thống báo cáo tài chính, truy xuất nguồn gốc lúa J02 và môi trường chạy thử nghiệm chuỗi giá trị</p>
        </div>
        
        <button
          onClick={() => refresh()}
          className="h-10 px-3 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-bold border border-gray-200 flex items-center space-x-1.5 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm mới</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* TABS CHỌN PHÂN HỆ */}
      <div className="flex space-x-2 border-b border-gray-100 pb-px">
        <button
          onClick={() => setActiveTab('financial')}
          className={`pb-3 text-xs font-extrabold border-b-2 px-1 transition ${activeTab === 'financial' ? "border-primary text-primary" : "border-transparent text-gray-400"}`}
        >
          BÁO CÁO TÀI CHÍNH
        </button>
        <button
          onClick={() => setActiveTab('traceability')}
          className={`pb-3 text-xs font-extrabold border-b-2 px-1 transition ${activeTab === 'traceability' ? "border-primary text-primary" : "border-transparent text-gray-400"}`}
        >
          TRUY XUẤT NGUỒN GỐC
        </button>
        <button
          onClick={() => setActiveTab('e2e')}
          className={`pb-3 text-xs font-extrabold border-b-2 px-1 transition ${activeTab === 'e2e' ? "border-primary text-primary" : "border-transparent text-gray-400"}`}
        >
          ERP E2E TESTING
        </button>
      </div>

      {/* CORE SECTIONS */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* TỔNG HỢP KPIs THU MUA LÚA (KPI Reporting Widgets) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Tổng lúa tươi nhận</span>
                <span className="text-lg font-black text-gray-800 block mt-1">
                  {(purchaseReport?.totalRawWeightKg || 0).toLocaleString()} kg
                </span>
              </div>
              <Scale className="w-5 h-5 text-gray-400" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Sản lượng khô sấy</span>
                <span className="text-lg font-black text-primary block mt-1">
                  {(purchaseReport?.totalDryWeightKg || 0).toLocaleString()} kg
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Đơn giá thu mua bình quân</span>
                <span className="text-lg font-black text-emerald-700 block mt-1">
                  {(purchaseReport?.averagePricePerKg || 0).toLocaleString()} đ/kg
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Giá vốn lúa sấy thu mua</span>
                <span className="text-lg font-black text-primary block mt-1">
                  {(purchaseReport?.totalCost || 0).toLocaleString()} đ
                </span>
              </div>
              <FileBarChart className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* BÁO CÁO DÒNG TIỀN MẶT */}
          <CashFlowReportView summary={cashFlow} />

          {/* CHI TIẾT BÁO CÁO CÔNG NỢ NÔNG DÂN */}
          <FarmerPayableReport 
            data={payableReport}
            onExport={downloadPayableCSV}
          />

          {/* SỔ CÁI BÚT TOÁN KẾ TOÁN CHUNG */}
          <GeneralLedgerView
            data={journal}
            onExport={downloadJournalCSV}
          />
        </div>
      )}

      {activeTab === 'traceability' && (
        <FarmerTraceView />
      )}

      {activeTab === 'e2e' && (
        <E2ETestConsole />
      )}
    </div>
  );
}
