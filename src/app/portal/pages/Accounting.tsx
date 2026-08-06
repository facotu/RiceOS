// Settlement workspace page inside desktop portal
// File: src/app/portal/pages/Accounting.tsx

import React from "react";
import { usePortal } from "../context/PortalContext.tsx";
import { useSettlement } from "../../../features/accounting/hooks/useSettlement.ts";
import SettlementQueue from "../../../features/accounting/components/SettlementQueue.tsx";
import SettlementDetail from "../../../features/accounting/components/SettlementDetail.tsx";
import PeriodLockControl from "../../../features/accounting/components/PeriodLockControl.tsx";
import AdjustmentPanel from "../../../features/accounting/components/AdjustmentPanel.tsx";
import ReconciliationPanel from "../../../features/accounting/components/ReconciliationPanel.tsx";
import { Landmark, Coins, Wallet } from "lucide-react";

export default function AccountingPage() {
  const { user } = usePortal();
  
  // Custom hook nghiệp vụ kế toán mở rộng
  const {
    settlements,
    periods,
    selectedSettlement,
    isLoading,
    error,
    setSelectedId,
    submitForApproval,
    approveSettlement,
    paySettlement,
    reconcilePayment,
    adjustSettlement,
    lockPeriod
  } = useSettlement(user?.organization_id || "org-default");

  // Tính thống kê tóm tắt
  const pendingAmount = settlements
    .filter(s => s.state !== 'completed' && s.state !== 'rejected')
    .reduce((sum, s) => sum + s.total_amount, 0);

  const paidAmount = settlements
    .filter(s => s.state === 'completed')
    .reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quyết toán tài chính nông dân</h1>
        <p className="text-sm text-gray-500 mt-1">Đối soát phiếu cân lúa, kiểm duyệt duyệt chi quỹ và chi trả tiền lúa cho nông dân</p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* TÓM TẮT KPIs TÀI CHÍNH THỰC TẾ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase block">Chờ quyết toán</span>
            <span className="text-2xl font-black text-amber-600 block mt-2">
              {pendingAmount.toLocaleString("vi-VN")} VNĐ
            </span>
            <span className="text-xs text-gray-400 block mt-1">Gồm {settlements.filter(s => s.state !== 'completed').length} phiếu cân</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase block">Đã chi trả hôm nay</span>
            <span className="text-2xl font-black text-emerald-700 block mt-2">
              {paidAmount.toLocaleString("vi-VN")} VNĐ
            </span>
            <span className="text-xs text-emerald-600 font-bold block mt-1">Toàn bộ đã hạch toán sổ cái</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase block">Hạn mức chi duyệt tự động</span>
            <span className="text-2xl font-black text-gray-900 block mt-2">50,000,000 VNĐ</span>
            <span className="text-xs text-gray-400 block mt-1">Phân cấp kế toán HTX tự động</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* PHÂN HỆ LÀM VIỆC CHÍNH (SIDE-BY-SIDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* TRÁI: DANH SÁCH HÀNG ĐỢI & CHỐT KHÓA KỲ */}
        <div className="space-y-6">
          <SettlementQueue
            settlements={settlements}
            selectedId={selectedSettlement?.id || null}
            onSelect={setSelectedId}
            isLoading={isLoading}
          />

          <PeriodLockControl
            periods={periods}
            onLock={async (pid) => lockPeriod(pid, user?.full_name || "Giám đốc")}
            userRole={user?.role || ""}
          />
        </div>

        {/* PHẢI: CHI TIẾT & HÀNH ĐỘNG DUYỆT CHI */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSettlement ? (
            <>
              <SettlementDetail
                settlement={selectedSettlement}
                userRole={user?.role || ""}
                actorName={user?.full_name || ""}
                onSubmitForApproval={submitForApproval}
                onApprove={approveSettlement}
                onPay={paySettlement}
              />

              {/* CHỈ CHO PHÉP ĐIỀU CHỈNH KHI CHƯA CHI TIỀN XONG */}
              {selectedSettlement.state !== "completed" && (
                <AdjustmentPanel
                  settlement={selectedSettlement}
                  onAdjust={async (sid, amt, rsn) => adjustSettlement(sid, amt, rsn, user?.full_name || "")}
                  isLoading={isLoading}
                />
              )}

              {/* CHỈ ĐỐI SOÁT SAO KÊ KHI ĐÃ CHI TIỀN */}
              {selectedSettlement.state === "completed" && (
                <ReconciliationPanel
                  paymentId={selectedSettlement.id}
                  amount={selectedSettlement.total_amount}
                  onReconcile={async (pid, ref, notes) => reconcilePayment(pid, ref, user?.full_name || "", notes)}
                  isLoading={isLoading}
                />
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400 font-semibold shadow-premium">
              Vui lòng chọn một phiếu quyết toán lúa từ hàng đợi bên trái để kiểm duyệt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
