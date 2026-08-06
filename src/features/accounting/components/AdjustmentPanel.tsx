// Adjustment builder checking 20% limit of original amount
// File: src/features/accounting/components/AdjustmentPanel.tsx

import React, { useState } from "react";
import { Settlement } from "../domain/types.ts";
import { Edit3, Check } from "lucide-react";

interface AdjustmentPanelProps {
  settlement: Settlement;
  onAdjust: (id: string, newAmount: number, reason: string) => Promise<boolean>;
  isLoading?: boolean;
}

export default function AdjustmentPanel({ settlement, onAdjust, isLoading = false }: AdjustmentPanelProps) {
  const [newAmount, setNewAmount] = useState(settlement.total_amount);
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const delta = newAmount - settlement.total_amount;
  const percentChange = (Math.abs(delta) / settlement.total_amount) * 100;
  const isOverLimit = percentChange > 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMsg(null);

    if (isOverLimit) {
      setErrorMsg("Sai lệch điều chỉnh vượt quá hạn mức quy định của HTX (tối đa 20%).");
      return;
    }

    try {
      const ok = await onAdjust(settlement.id, newAmount, reason);
      if (ok) {
        setSuccess(true);
        setReason("");
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
        <Edit3 className="w-4 h-4 text-primary" />
        <span>Điều chỉnh bù trừ quyết toán lúa</span>
      </h4>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
          Đã thực hiện điều chỉnh số tiền quyết toán lúa thành công!
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Số tiền gốc ban đầu</label>
          <div className="h-10 px-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center text-xs font-black text-gray-600">
            {settlement.total_amount.toLocaleString()} đ
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Số tiền sau điều chỉnh</label>
          <input
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      </div>

      {/* TÍNH TOÁN SAI LỆCH THỜI GIAN THỰC */}
      {delta !== 0 && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${isOverLimit ? "bg-red-50 text-red-800 border border-red-100" : "bg-gray-50 text-gray-700"}`}>
          <div className="flex justify-between items-center">
            <span>Sai lệch chênh lệch:</span>
            <span className="font-extrabold">{delta > 0 ? "+" : ""}{delta.toLocaleString()} đ ({percentChange.toFixed(1)}%)</span>
          </div>
          {isOverLimit && (
            <p className="text-[10px] text-red-600 mt-1 font-bold">Cảnh báo: Vượt quá giới hạn điều chỉnh tài chính 20%.</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Lý do điều chỉnh (Kiểm toán)</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ví dụ: Bù trừ chênh lệch ẩm hoặc trừ tạp chất sai..."
          className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || isOverLimit}
        className="w-full h-11 bg-primary hover:bg-primary-light text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow disabled:opacity-50"
      >
        <Check className="w-4 h-4" />
        <span>XÁC NHẬN ĐIỀU CHỈNH</span>
      </button>
    </form>
  );
}
