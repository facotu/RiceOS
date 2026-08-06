// KPI cards showing key performance metrics to director
// File: src/features/executive-dashboard/components/ExecutiveKPICard.tsx

import React from "react";
import { Scale, Layers, TrendingUp, DollarSign } from "lucide-react";

interface ExecutiveKPICardProps {
  totalWeightRaw: number;
  totalAmountBuy: number;
  siloStockWeight: number;
  expectedProfit: number;
  isLoading?: boolean;
}

export const ExecutiveKPICard: React.FC<ExecutiveKPICardProps> = ({
  totalWeightRaw,
  totalAmountBuy,
  siloStockWeight,
  expectedProfit,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-100 h-28 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* CARD 1: RAW RICE WEIGHT */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400 font-black uppercase">Sản lượng lúa tươi</span>
          <span className="text-xl font-black text-gray-800">{(totalWeightRaw / 1000).toFixed(1)} Tấn</span>
          <span className="text-[10px] text-gray-400 font-bold block">Tổng nhập ngoài ruộng</span>
        </div>
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Scale className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* CARD 2: TOTAL CASH VALUE */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400 font-black uppercase">Ngân sách đã mua</span>
          <span className="text-xl font-black text-gray-800">{(totalAmountBuy / 1000000).toFixed(1)} Trđ</span>
          <span className="text-[10px] text-gray-400 font-bold block">Quyết toán thu mua</span>
        </div>
        <div className="p-3 bg-amber-100 rounded-2xl">
          <DollarSign className="w-5 h-5 text-amber-700" />
        </div>
      </div>

      {/* CARD 3: SILO STOCK */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400 font-black uppercase">Tồn kho Silo lúa khô</span>
          <span className="text-xl font-black text-emerald-800">{(siloStockWeight / 1000).toFixed(1)} Tấn</span>
          <span className="text-[10px] text-emerald-600 font-bold block">J02 lúa Nhật thành phẩm</span>
        </div>
        <div className="p-3 bg-emerald-100 rounded-2xl">
          <Layers className="w-5 h-5 text-emerald-700" />
        </div>
      </div>

      {/* CARD 4: EXPECTED PROFIT */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400 font-black uppercase">Lợi nhuận dự kiến</span>
          <span className="text-xl font-black text-indigo-800">{(expectedProfit / 1000000).toFixed(1)} Trđ</span>
          <span className="text-[10px] text-indigo-600 font-bold block">Ước tính biên giá xuất</span>
        </div>
        <div className="p-3 bg-indigo-100 rounded-2xl">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};
export default ExecutiveKPICard;
