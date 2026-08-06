// Executive Logistics Dashboard summary widget component
// File: src/features/logistics/components/LogisticsDashboardWidget.tsx

import React from "react";
import { Vehicle, Trip, ProofOfDelivery } from "../domain/logisticsTypes.ts";
import { Truck, Navigation, Scale, DollarSign } from "lucide-react";

interface LogisticsDashboardWidgetProps {
  vehicles: Vehicle[];
  trips: Trip[];
  pods: ProofOfDelivery[];
}

export const LogisticsDashboardWidget: React.FC<LogisticsDashboardWidgetProps> = ({
  vehicles,
  trips,
  pods
}) => {
  const activeVehicles = vehicles.filter(v => v.status === "in_transit").length;
  const availableVehicles = vehicles.filter(v => v.status === "available").length;
  const completedTrips = trips.filter(t => t.status === "completed" || t.status === "delivered").length;
  const totalWeightKg = trips.reduce((acc, t) => acc + (t.payloadWeightKg || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* KPI 1: VEHICLE FLEET STATUS */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400 font-black uppercase">Trạng thái Đội xe</span>
          <span className="text-xl font-black text-gray-800">{activeVehicles} đang chạy / {availableVehicles} rảnh</span>
          <span className="text-[10px] text-emerald-600 font-bold block">Tổng cộng {vehicles.length} xe tải</span>
        </div>
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Truck className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* KPI 2: TRIPS PROGRESS */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400 font-black uppercase">Chuyến hôm nay</span>
          <span className="text-xl font-black text-blue-800">{trips.length} chuyến</span>
          <span className="text-[10px] text-blue-600 font-bold block">{completedTrips} chuyến đã hoàn thành POD</span>
        </div>
        <div className="p-3 bg-blue-100 rounded-2xl">
          <Navigation className="w-5 h-5 text-blue-700" />
        </div>
      </div>

      {/* KPI 3: TRANSPORTED WEIGHT */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400 font-black uppercase">Sản lượng đã chở</span>
          <span className="text-xl font-black text-emerald-800">{(totalWeightKg / 1000).toFixed(1)} Tấn</span>
          <span className="text-[10px] text-emerald-600 font-bold block">Lúa tươi thu mua ruộng</span>
        </div>
        <div className="p-3 bg-emerald-100 rounded-2xl">
          <Scale className="w-5 h-5 text-emerald-700" />
        </div>
      </div>

      {/* KPI 4: TRANSPORT COST PER KG */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-[10px] text-gray-400 font-black uppercase">Chi phí vận tải/kg</span>
          <span className="text-xl font-black text-indigo-800">145 VNĐ/kg</span>
          <span className="text-[10px] text-indigo-600 font-bold block">Đạt định mức tiết kiệm 5%</span>
        </div>
        <div className="p-3 bg-indigo-100 rounded-2xl">
          <DollarSign className="w-5 h-5 text-indigo-700" />
        </div>
      </div>
    </div>
  );
};
export default LogisticsDashboardWidget;
