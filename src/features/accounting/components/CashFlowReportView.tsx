// Cash flow statement summary widget
// File: src/features/accounting/components/CashFlowReportView.tsx

import React from "react";
import { CashFlowReportSummary } from "../domain/reportingTypes.ts";
import { Coins, TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface CashFlowReportViewProps {
  summary: CashFlowReportSummary | null;
}

export default function CashFlowReportView({ summary }: CashFlowReportViewProps) {
  if (!summary) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <h3 className="text-sm font-bold text-gray-800 tracking-tight flex items-center space-x-1.5">
        <Coins className="w-5 h-5 text-primary" />
        <span>Báo cáo dòng tiền mặt trạm cân (Cash Flow)</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Số dư đầu kỳ */}
        <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Số dư đầu kỳ</span>
            <span className="text-base font-black text-gray-700 block mt-1">
              {summary.beginningBalance.toLocaleString()} đ
            </span>
          </div>
          <Wallet className="w-5 h-5 text-gray-400" />
        </div>

        {/* Dòng tiền vào */}
        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-950 font-bold uppercase block">Dòng tiền vào (Thu)</span>
            <span className="text-base font-black text-emerald-700 block mt-1">
              {summary.inflow.toLocaleString()} đ
            </span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>

        {/* Dòng tiền ra */}
        <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-red-950 font-bold uppercase block">Dòng tiền ra (Chi)</span>
            <span className="text-base font-black text-red-600 block mt-1">
              -{summary.outflow.toLocaleString()} đ
            </span>
          </div>
          <TrendingDown className="w-5 h-5 text-red-500" />
        </div>

        {/* Số dư cuối kỳ */}
        <div className="p-4 bg-primary/10 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-primary font-bold uppercase block">Số dư cuối kỳ thực tế</span>
            <span className="text-base font-black text-primary block mt-1">
              {summary.endingBalance.toLocaleString()} đ
            </span>
          </div>
          <Coins className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
