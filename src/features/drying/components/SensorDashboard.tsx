// IoT Sensor real-time monitoring gauge board
// File: src/features/drying/components/SensorDashboard.tsx

import React from "react";
import { Thermometer, Layers, Wifi, Cpu } from "lucide-react";

interface SensorDashboardProps {
  temperature: number;
  moisture: number;
  siloName: string;
}

export const SensorDashboard: React.FC<SensorDashboardProps> = ({
  temperature,
  moisture,
  siloName
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
          <Cpu className="w-4 h-4 text-primary" />
          <span>Bảng cảm biến IoT thời gian thực - {siloName}</span>
        </h4>
        <span className="flex items-center space-x-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span>CONNECTED</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* TEMPERATURE GAUGE */}
        <div className="p-4 bg-red-50/40 border border-red-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <Thermometer className="w-7 h-7 text-red-500" />
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase">Nhiệt độ lò</span>
            <span className="text-2xl font-black text-red-600">{temperature}°C</span>
          </div>
          <span className="text-[9px] text-gray-400 font-bold">Giới hạn an toàn: &lt;45°C</span>
        </div>

        {/* MOISTURE GAUGE */}
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
          <Layers className="w-7 h-7 text-primary" />
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase">Độ ẩm lúa sấy</span>
            <span className="text-2xl font-black text-primary">{moisture}%</span>
          </div>
          <span className="text-[9px] text-gray-400 font-bold">Mục tiêu lưu kho: 14%</span>
        </div>
      </div>

      {/* GRAPHIC HEATING CURVE */}
      <div className="space-y-1">
        <span className="block text-[9px] font-bold text-gray-400 uppercase">Biểu đồ đường cong sấy lò (Mô phỏng)</span>
        <div className="h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-end p-2 space-x-1.5 justify-between">
          {[22, 21.5, 20.2, 19.0, 17.5, 16.2, 15.0, 14.5].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center space-y-1">
              <span className="text-[8px] font-bold text-gray-400">{val}%</span>
              <div 
                className="w-full bg-primary/40 rounded-t-sm transition-all duration-500"
                style={{ height: `${(val / 25) * 40}px` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SensorDashboard;
