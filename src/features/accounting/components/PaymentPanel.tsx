// Form panel for executing Cash/Bank transfer payment
// File: src/features/accounting/components/PaymentPanel.tsx

import React, { useState } from "react";
import { PaymentMethod } from "../domain/types.ts";
import { Landmark, Coins, ArrowRight } from "lucide-react";

interface PaymentPanelProps {
  onPay: (method: PaymentMethod, refCode: string) => Promise<boolean>;
  isLoading?: boolean;
}

export default function PaymentPanel({ onPay, isLoading = false }: PaymentPanelProps) {
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [refCode, setRefCode] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    const ok = await onPay(method, method === "bank_transfer" ? refCode : "TIEN_MAT_QUY");
    if (ok) {
      setSuccess(true);
      setRefCode("");
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thực thi chi tiền mặt / chuyển khoản</h4>
      
      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold">
          Thực thi lệnh giao dịch thanh toán thành công!
        </div>
      )}

      {/* CHỌN PHƯƠNG THỨC THANH TOÁN CHẠM LỚN */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMethod("bank_transfer")}
          className={`h-12 rounded-xl text-xs font-extrabold border transition flex items-center justify-center space-x-1.5 ${method === "bank_transfer" ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-700 bg-gray-50"}`}
        >
          <Landmark className="w-4 h-4" />
          <span>CHUYỂN KHOẢN BANK</span>
        </button>
        <button
          type="button"
          onClick={() => setMethod("cash")}
          className={`h-12 rounded-xl text-xs font-extrabold border transition flex items-center justify-center space-x-1.5 ${method === "cash" ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-700 bg-gray-50"}`}
        >
          <Coins className="w-4 h-4" />
          <span>TIỀN MẶT TẠI QUỸ</span>
        </button>
      </div>

      {method === "bank_transfer" && (
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Mã bút toán tham chiếu ngân hàng</label>
          <input
            type="text"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value.toUpperCase())}
            placeholder="Ví dụ: FT26080612345"
            className="w-full h-11 px-3 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 shadow"
      >
        <span>XUẤT QUỸ CHI TRẢ TIỀN</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
