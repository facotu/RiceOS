// Farmer payable report table with export actions
// File: src/features/accounting/components/FarmerPayableReport.tsx

import React from "react";
import { FarmerPayableRow } from "../domain/reportingTypes.ts";
import { Download, Users } from "lucide-react";

interface FarmerPayableReportProps {
  data: FarmerPayableRow[];
  onExport: () => void;
}

export default function FarmerPayableReport({ data, onExport }: FarmerPayableReportProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <span>Báo cáo công nợ phải trả nông dân</span>
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
              <th className="py-3 px-6">Họ và tên</th>
              <th className="py-3 px-6 text-right">Tổng mua</th>
              <th className="py-3 px-6 text-right">Đã thanh toán</th>
              <th className="py-3 px-6 text-right">Còn nợ lại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
            {data.map((row) => (
              <tr key={row.farmerId} className="hover:bg-gray-50/25">
                <td className="py-3 px-6">
                  <span className="font-bold text-gray-900 block">{row.farmerName}</span>
                  <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{row.phone}</span>
                </td>
                <td className="py-3 px-6 text-right">{row.totalPurchased.toLocaleString()} đ</td>
                <td className="py-3 px-6 text-right text-emerald-700">{row.totalPaid.toLocaleString()} đ</td>
                <td className={`py-3 px-6 text-right font-extrabold ${row.remainingPayable > 0 ? "text-red-600" : "text-gray-400"}`}>
                  {row.remainingPayable.toLocaleString()} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
