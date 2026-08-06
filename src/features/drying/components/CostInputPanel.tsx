// Drying costing input panel
// File: src/features/drying/components/CostInputPanel.tsx

import React from "react";
import { DollarSign, Flame, Lightbulb, UserCheck } from "lucide-react";

interface CostInputPanelProps {
  runHours: number;
  onHoursChange: (hours: number) => void;
  fuelRate: number;
  onFuelRateChange: (rate: number) => void;
  laborRate: number;
  onLaborRateChange: (rate: number) => void;
}

export const CostInputPanel: React.FC<CostInputPanelProps> = ({
  runHours,
  onHoursChange,
  fuelRate,
  onFuelRateChange,
  laborRate,
  onLaborRateChange
}) => {
  const electricityRate = 25000; // Điện cố định 25k/giờ quạt gió
  const totalCost = runHours * (fuelRate + electricityRate + laborRate);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1">
        <DollarSign className="w-4 h-4 text-primary" />
        <span>Phân bổ chi phí sấy lò thực tế (Drying Cost Foundation)</span>
      </h4>

      <div className="space-y-3.5 text-xs font-bold text-gray-700">
        {/* HOURS */}
        <div>
          <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">Số giờ chạy sấy lò thực tế</label>
          <input
            type="number"
            value={runHours}
            onChange={(e) => onHoursChange(parseFloat(e.target.value) || 0)}
            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* DETAILS OF RATES */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Giá trấu/dầu sấy/giờ</span>
            </label>
            <input
              type="number"
              value={fuelRate}
              onChange={(e) => onFuelRateChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-extrabold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-primary" />
              <span>Giá nhân công trực/giờ</span>
            </label>
            <input
              type="number"
              value={laborRate}
              onChange={(e) => onLaborRateChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-extrabold focus:outline-none"
            />
          </div>
        </div>

        {/* ELECTRICAL (STATIC WATCHER) */}
        <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-400 border-t border-gray-50 pt-3">
          <span className="flex items-center space-x-1">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
            <span>Điện quạt gió thổi lò (Cố định):</span>
          </span>
          <span>{electricityRate.toLocaleString()} đ/giờ</span>
        </div>

        {/* TOTAL VALUE */}
        <div className="p-3 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100">
          <span className="text-[10px] font-black text-gray-500 uppercase">TỔNG CHI PHÍ SẤY LÒ DỰ KIẾN:</span>
          <span className="text-sm font-black text-primary">{totalCost.toLocaleString()} đ</span>
        </div>
      </div>
    </div>
  );
};
export default CostInputPanel;
