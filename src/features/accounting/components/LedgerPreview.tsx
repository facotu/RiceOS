// Visual ledger double-entry auditor
// File: src/features/accounting/components/LedgerPreview.tsx

import React from "react";
import { Settlement, PaymentMethod } from "../domain/types.ts";
import { BookOpen } from "lucide-react";

interface LedgerPreviewProps {
  settlement: Settlement;
  paymentMethod: PaymentMethod;
}

export default function LedgerPreview({ settlement, paymentMethod }: LedgerPreviewProps) {
  const amount = settlement.total_amount;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
        <BookOpen className="w-4 h-4 text-primary" />
        <span>Xem trước hạch toán sổ cái kép (General Ledger)</span>
      </h4>

      <div className="border border-gray-100 rounded-xl overflow-hidden text-xs">
        {/* TABLE DEBIT/CREDIT */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <th className="py-2.5 px-4">Tài khoản</th>
              <th className="py-2.5 px-4 text-right">Nợ (Debit)</th>
              <th className="py-2.5 px-4 text-right">Có (Credit)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            {/* Hàng Nợ (Debit) */}
            <tr>
              <td className="py-3 px-4">
                <span className="font-bold text-gray-900 block">TK 331</span>
                <span className="text-[10px] text-gray-400">Phải trả nông dân</span>
              </td>
              <td className="py-3 px-4 text-right font-extrabold text-primary">{amount.toLocaleString("vi-VN")} đ</td>
              <td className="py-3 px-4 text-right text-gray-300">--</td>
            </tr>
            {/* Hàng Có (Credit) */}
            <tr>
              <td className="py-3 px-4">
                <span className="font-bold text-gray-900 block">
                  {paymentMethod === "cash" ? "TK 1111" : "TK 1121"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {paymentMethod === "cash" ? "Tiền mặt tại quỹ" : "Tiền gửi ngân hàng"}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-gray-300">--</td>
              <td className="py-3 px-4 text-right font-extrabold text-red-600">{amount.toLocaleString("vi-VN")} đ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
