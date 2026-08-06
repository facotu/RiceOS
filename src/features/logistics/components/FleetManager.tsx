// Fleet and Drivers Management Component
// File: src/features/logistics/components/FleetManager.tsx

import React from "react";
import { Vehicle, Driver } from "../domain/logisticsTypes.ts";
import { Truck, UserCheck, ShieldCheck, Wrench, AlertCircle } from "lucide-react";

interface FleetManagerProps {
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const FleetManager: React.FC<FleetManagerProps> = ({ vehicles, drivers }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* VEHICLES LIST */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
            <Truck className="w-4 h-4 text-primary" />
            <span>Danh sách Đội xe thu mua ({vehicles.length} xe)</span>
          </h4>
        </div>

        <div className="space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-gray-900">{v.plateNumber}</span>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[9px] font-black rounded-md">{v.type}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-semibold space-x-3">
                  <span>Tải trọng: <b>{v.capacityTons} Tấn</b></span>
                  <span>Định mức: <b>{v.fuelConsumptionRate} L/100km</b></span>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase ${
                  v.status === "available"
                    ? "bg-emerald-100 text-emerald-800"
                    : v.status === "in_transit"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {v.status === "available" ? "Sẵn sàng" : v.status === "in_transit" ? "Đang đi chuyến" : "Bảo dưỡng"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DRIVERS LIST */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Danh sách Tài xế ({drivers.length} tài xế)</span>
          </h4>
        </div>

        <div className="space-y-3">
          {drivers.map((d) => (
            <div key={d.id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-gray-900">{d.fullName}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-md">Bằng {d.licenseClass}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-semibold space-x-3">
                  <span>SĐT: <b>{d.phone}</b></span>
                  <span>Kinh nghiệm: <b>{d.experienceYears} năm</b></span>
                </div>
              </div>

              <div>
                <span className={`px-2.5 py-1 text-[10px] font-black rounded-full uppercase ${
                  d.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : d.status === "busy"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {d.status === "active" ? "Rảnh tay" : d.status === "busy" ? "Đang lái xe" : "Nghỉ"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FleetManager;
