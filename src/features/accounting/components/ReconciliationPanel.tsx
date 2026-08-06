// Reconciliation matching panel for statements
// File: src/features/accounting/components/ReconciliationPanel.tsx

import React, { useState } from "react";
import { Landmark, Search, CheckCircle2 } from "lucide-react";

interface ReconciliationPanelProps {
  paymentId: string;
  amount: number;
  onReconcile: (paymentId: string, refCode: string, notes?: string) => Promise<boolean>;
  isLoading?: boolean;
}

export default function ReconciliationPanel({
  paymentId,
  amount,
  onReconcile,
  isLoading = false
}: ReconciliationPanelProps) {
  const [bankRef, setBankRef] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const ok = await onReconcile(paymentId, bankRef, notes);
    if (ok) {
      setSuccess(true);
      setBankRef("");
      setNotes("");
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
        <Landmark className="w-4 h-4 text-emerald-600" />
        <span>Đối soát ngân quỹ (Reconciliation)</span>
      </h4>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Khớp lệnh đối soát sao kê thành công!</span>
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Mã giao dịch sao kê ngân hàng đối chiếu</label>
        <div className="relative">
          <input
            type="text"
            value={bankRef}
            onChange={(e) => setBankRef(e.target.value.toUpperCase())}
            placeholder="Tìm mã giao dịch đối soát..."
            className="w-full h-11 pl-10 pr-3 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Ghi chú đối soát</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ví dụ: Đã khớp với lệnh UNC số 456..."
          className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow"
      >
        <span>XÁC NHẬN KHỚP SAO KÊ</span>
      </button>
    </form>
  );
}
