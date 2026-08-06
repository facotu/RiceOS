// Comparison charts for harvest weighing vs drying oven production
// File: src/features/executive-dashboard/components/ProductionChart.tsx

import React from "react";
import { BarChart3, LineChart } from "lucide-react";

interface ProductionChartProps {
  totalWeighedKg: number;
  totalDriedKg: number;
}

export const ProductionChart: React.FC<ProductionChartProps> = ({
  totalWeighedKg,
  totalDriedKg
}) => {
  const totalSalesKg = Math.round(totalDriedKg * 0.15); // Giả lập xuất bán 15%

  const maxVal = Math.max(totalWeighedKg, totalDriedKg, totalSalesKg, 1);
  const weighPct = (totalWeighedKg / maxVal) * 100;
  const dryPct = (totalDriedKg / maxVal) * 100;
  const salePct = (totalSalesKg / maxVal) * 100;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span>Biểu đồ so sánh sản lượng chuỗi lúa gạo (kg)</span>
        </h4>
      </div>

      <div className="space-y-4 pt-2">
        {/* WEIGHED RICE BAR */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-gray-600">
            <span>1. Thu mua lúa tươi ngoài ruộng</span>
            <span>{totalWeighedKg.toLocaleString()} kg</span>
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-lg overflow-hidden">
            <div className="bg-amber-500 h-full rounded-lg" style={{ width: `${weighPct}%` }}></div>
          </div>
        </div>

        {/* DRIED RICE BAR */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-gray-600">
            <span>2. Đốt lò sấy khô nhập Silo</span>
            <span>{totalDriedKg.toLocaleString()} kg</span>
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-lg overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-lg" style={{ width: `${dryPct}%` }}></div>
          </div>
        </div>

        {/* SALES RICE BAR */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold text-gray-600">
            <span>3. Xuất bán thương mại</span>
            <span>{totalSalesKg.toLocaleString()} kg</span>
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-lg overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-lg" style={{ width: `${salePct}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductionChart;
