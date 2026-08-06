// Fuel consumption and maintenance schedules tracker component
// File: src/features/logistics/components/FuelMaintenanceTracker.tsx

import React from "react";
import { FuelLog, MaintenanceLog, Vehicle } from "../domain/logisticsTypes.ts";
import { Fuel, Wrench, AlertTriangle, CheckCircle } from "lucide-react";

interface FuelMaintenanceTrackerProps {
  vehicles: Vehicle[];
  fuelLogs: FuelLog[];
  maintenanceLogs: MaintenanceLog[];
}

export const FuelMaintenanceTracker: React.FC<FuelMaintenanceTrackerProps> = ({
  vehicles,
  fuelLogs,
  maintenanceLogs
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* FUEL LOGS */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
            <Fuel className="w-4 h-4 text-amber-600" />
            <span>Quản lý Nhiên liệu & Tiêu hao Xăng dầu</span>
          </h4>
        </div>

        <div className="space-y-2.5">
          {fuelLogs.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-900 font-semibold space-y-1">
              <p>Định mức dầu diezel trung bình toàn đội xe: <b>18 - 22 Lít/100km</b>.</p>
              <span className="text-[10px] text-amber-700 block">Ngân sách chi nhiên liệu tuần này: 12.500.000 VNĐ.</span>
            </div>
          ) : (
            fuelLogs.map((f) => (
              <div key={f.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs">
                <span>Xe: <b>{f.vehicleId}</b></span>
                <span><b>{f.liters} Lít</b> ({f.amountVnd.toLocaleString()} VNĐ)</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAINTENANCE SCHEDULES */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
            <Wrench className="w-4 h-4 text-indigo-600" />
            <span>Lịch nhắc Bảo dưỡng & Kiểm định Xe</span>
          </h4>
        </div>

        <div className="space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <span className="font-extrabold text-gray-900">{v.plateNumber}</span>
                <span className="block text-[10px] text-gray-500">Đăng kiểm đến: {v.inspectionDate}</span>
              </div>

              <div className="flex items-center space-x-1.5 text-[10px] font-bold">
                {v.plateNumber === "43C-145.89" ? (
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    <span>Cần bảo dưỡng</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Tốt</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FuelMaintenanceTracker;
