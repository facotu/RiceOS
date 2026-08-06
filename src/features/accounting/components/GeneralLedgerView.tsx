// Journal general ledger list view
// File: src/features/accounting/components/GeneralLedgerView.tsx

import React from "react";
import { GeneralJournalRow } from "../domain/reportingTypes.ts";
import { Download, BookOpen } from "lucide-react";

interface GeneralLedgerViewProps {
  data: GeneralJournalRow[];
  onExport: () => void;
}

export default function GeneralLedgerView({ data, onExport }: GeneralLedgerViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span>Sổ nhật ký chung & Bút toán sổ cái</span>
        </h3>

        <button
          onClick={onExport}
          className="h-9 px-3 hover:bg-gray-100 text-gray-500 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
          title="Tải báo cáo Excel"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Excel</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/30 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-6">Ngày hạch toán</th>
              <th className="py-3 px-6">Mã bút toán</th>
              <th className="py-3 px-6">Diễn giải</th>
              <th className="py-3 px-6">Mã TK</th>
              <th className="py-3 px-6">Tên tài khoản</th>
              <th className="py-3 px-6 text-right">Nợ (Debit)</th>
              <th className="py-3 px-6 text-right">Có (Credit)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/25">
                <td className="py-3 px-6 font-medium text-gray-500">
                  {new Date(row.date).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-6 font-bold text-gray-800">{row.reference}</td>
                <td className="py-3 px-6 text-gray-500">{row.description}</td>
                <td className="py-3 px-6 font-bold text-gray-900">{row.accountCode}</td>
                <td className="py-3 px-6 text-gray-600">{row.accountName}</td>
                <td className="py-3 px-6 text-right font-extrabold text-primary">
                  {row.debit > 0 ? `${row.debit.toLocaleString()} đ` : "--"}
                </td>
                <td className="py-3 px-6 text-right font-extrabold text-red-600">
                  {row.credit > 0 ? `${row.credit.toLocaleString()} đ` : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
