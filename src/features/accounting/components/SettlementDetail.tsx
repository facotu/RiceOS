// Settlement Details workspace including timeline, ledger preview and actions
// File: src/features/accounting/components/SettlementDetail.tsx

import React, { useState } from "react";
import { Settlement, PaymentMethod } from "../domain/types.ts";
import ApprovalTimeline from "./ApprovalTimeline.tsx";
import PaymentPanel from "./PaymentPanel.tsx";
import LedgerPreview from "./LedgerPreview.tsx";
import { Scale, ShieldCheck, ArrowUpRight, XCircle } from "lucide-react";

interface SettlementDetailProps {
  settlement: Settlement;
  userRole: string;
  actorName: string;
  onSubmitForApproval: (id: string, actor: string) => Promise<boolean>;
  onApprove: (id: string, actor: string) => Promise<boolean>;
  onPay: (id: string, method: PaymentMethod, refCode: string, actor: string) => Promise<boolean>;
}

export default function SettlementDetail({
  settlement,
  userRole,
  actorName,
  onSubmitForApproval,
  onApprove,
  onPay
}: SettlementDetailProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendApproval = async () => {
    setIsSubmitting(true);
    await onSubmitForApproval(settlement.id, actorName);
    setIsSubmitting(false);
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove(settlement.id, actorName);
    setIsSubmitting(false);
  };

  const handlePay = async (method: PaymentMethod, refCode: string): Promise<boolean> => {
    setIsSubmitting(true);
    const ok = await onPay(settlement.id, method, refCode, actorName);
    setIsSubmitting(false);
    return ok;
  };

  return (
    <div className="space-y-6">
      {/* KHỐI CHỈ SỐ KHỐI LƯỢNG & TIỀN TỆ QUYẾT TOÁN */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
        <div className="flex justify-between items-start border-b border-gray-50 pb-3">
          <div>
            <h3 className="text-base font-black text-gray-900">{settlement.receipt_id}</h3>
            <span className="text-[10px] text-gray-400 font-bold block mt-0.5">Ngày lập phiếu: {new Date(settlement.created_at).toLocaleDateString("vi-VN")}</span>
          </div>
          <span className="text-xs font-bold text-gray-500">Người tạo: {settlement.created_by}</span>
        </div>

        {/* THÔNG SỐ KHỐI LƯỢNG */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold block">Tổng lúa tươi</span>
            <span className="text-sm font-black text-gray-700 block mt-1">{settlement.total_raw_weight.toLocaleString()} kg</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold block">Khấu trừ sấy</span>
            <span className="text-sm font-black text-red-600 block mt-1">-{settlement.deductions_weight.toLocaleString()} kg</span>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <span className="text-[10px] text-primary/70 font-bold block">Sản lượng khô</span>
            <span className="text-sm font-black block mt-1">{settlement.total_dry_weight.toLocaleString()} kg</span>
          </div>
        </div>

        {/* THÀNH TIỀN QUYẾT TOÁN */}
        <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div>
            <span className="text-[10px] text-emerald-950 font-bold block">Đơn giá thu mua (ngày)</span>
            <span className="text-sm font-extrabold text-emerald-950 block mt-0.5">{settlement.price_per_kg.toLocaleString()} đ/kg</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-900 font-bold block">Tổng tiền lúa thanh toán</span>
            <span className="text-xl font-black text-primary block mt-0.5">{settlement.total_amount.toLocaleString("vi-VN")} VNĐ</span>
          </div>
        </div>
      </div>

      {/* DÒNG THỜI GIAN TIẾN TRÌNH */}
      <ApprovalTimeline settlement={settlement} />

      {/* XEM TRƯỚC SỔ CÁI BÚT TOÁN */}
      <LedgerPreview settlement={settlement} paymentMethod="bank_transfer" />

      {/* BẢNG ĐIỀU KHIỂN HÀNH ĐỘNG DỰA TRÊN TRẠNG THÁI VÀ VAI TRÒ */}
      <div className="space-y-4">
        {settlement.state === "draft" && userRole === "accountant" && (
          <button
            onClick={handleSendApproval}
            disabled={isSubmitting}
            className="w-full h-13 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow"
          >
            <ArrowUpRight className="w-4.5 h-4.5" />
            <span>{isSubmitting ? "Đang gửi..." : "GỬI TRÌNH DUYỆT CHI TIỀN"}</span>
          </button>
        )}

        {settlement.state === "pending_approval" && userRole === "director" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => alert("Từ chối duyệt chi")}
              disabled={isSubmitting}
              className="h-13 border border-red-200 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 hover:bg-red-50 transition"
            >
              <XCircle className="w-4.5 h-4.5" />
              <span>BÁC BỎ PHIẾU</span>
            </button>
            
            <button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="h-13 bg-primary text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 hover:bg-primary-light transition shadow"
            >
              <ShieldCheck className="w-4.5 h-4.5" />
              <span>{isSubmitting ? "Đang ký..." : "KÝ DUYỆT CHI"}</span>
            </button>
          </div>
        )}

        {settlement.state === "approved" && userRole === "accountant" && (
          <PaymentPanel onPay={handlePay} isLoading={isSubmitting} />
        )}

        {settlement.state === "completed" && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-5 h-5" />
            <span>GIAO DỊCH QUYẾT TOÁN ĐÃ HOÀN TẤT & ĐÓNG PHIẾU</span>
          </div>
        )}
      </div>
    </div>
  );
}
