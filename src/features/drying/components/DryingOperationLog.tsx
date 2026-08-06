// Display scrollable list of sensor ticks from drying oven
// File: src/features/drying/components/DryingOperationLog.tsx

import React from "react";
import { History, Thermometer, Layers } from "lucide-react";

interface SensorLogItem {
  id: string;
  timestamp: string;
  temperature_celsius: number;
  moisture_percent: number;
}

interface DryingOperationLogProps {
  logs: SensorLogItem[];
}

export const DryingOperationLog: React.FC<DryingOperationLogProps> = ({ logs }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-3">
      <div className="flex items-center space-x-1.5 border-b border-gray-50 pb-2">
        <History className="w-4 h-4 text-gray-500" />
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Lịch sử cảm biến lò sấy</h4>
      </div>

      <div className="max-h-44 overflow-y-auto divide-y divide-gray-50 pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400 font-semibold">
            Đang chờ dữ liệu cảm biến IoT phát lên...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="py-2 flex justify-between items-center text-xs font-bold text-gray-700">
              <span className="text-gray-400 font-normal">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              
              <div className="flex space-x-4">
                <span className="flex items-center space-x-1">
                  <Thermometer className="w-3.5 h-3.5 text-red-500" />
                  <span>{log.temperature_celsius}°C</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span>{log.moisture_percent}%</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default DryingOperationLog;
