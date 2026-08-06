// Trip tracking timeline component
// File: src/features/logistics/components/TripTracker.tsx

import React from "react";
import { Trip, Vehicle, Driver, PickupLocation } from "../domain/logisticsTypes.ts";
import { Navigation, Clock, CheckCircle2, MapPin, Truck } from "lucide-react";

interface TripTrackerProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  pickupLocations: PickupLocation[];
  onUpdateStatus: (tripId: string, status: Trip['status']) => Promise<void>;
  onOpenPOD: (trip: Trip) => void;
}

export const TripTracker: React.FC<TripTrackerProps> = ({
  trips,
  vehicles,
  drivers,
  pickupLocations,
  onUpdateStatus,
  onOpenPOD
}) => {
  const getVehiclePlate = (id: string) => vehicles.find(v => v.id === id)?.plateNumber || id;
  const getDriverName = (id: string) => drivers.find(d => d.id === id)?.fullName || id;
  const getLocationName = (id: string) => {
    const loc = pickupLocations.find(l => l.id === id);
    return loc ? `${loc.farmerName} (${loc.fieldName})` : id;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
          <Navigation className="w-4 h-4 text-primary animate-pulse" />
          <span>Nhật ký & Lộ trình các chuyến xe ({trips.length} chuyến)</span>
        </h4>
      </div>

      <div className="space-y-3">
        {trips.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400 font-semibold">Chưa có chuyến xe nào được tạo.</div>
        ) : (
          trips.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-sm text-primary">{t.tripCode}</span>
                    <span className="font-extrabold text-gray-800">{getVehiclePlate(t.vehicleId)}</span>
                    <span className="text-gray-500 font-semibold">({getDriverName(t.driverId)})</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-semibold flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Nguồn: <b>{getLocationName(t.pickupLocationId)}</b> → Đích: <b>{t.destinationName}</b></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase ${
                    t.status === "dispatched" || t.status === "in_transit"
                      ? "bg-blue-100 text-blue-800"
                      : t.status === "delivered" || t.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {t.status === "dispatched" ? "Đã điều phối" : t.status === "in_transit" ? "Đang chạy" : t.status === "delivered" ? "Đã giao lúa" : "Hoàn thành"}
                  </span>

                  {t.status === "dispatched" && (
                    <button
                      onClick={() => onUpdateStatus(t.id, "in_transit")}
                      className="px-2.5 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 transition"
                    >
                      Bắt đầu đi
                    </button>
                  )}

                  {t.status === "in_transit" && (
                    <button
                      onClick={() => onOpenPOD(t)}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700 transition"
                    >
                      Ký giao lúa POD
                    </button>
                  )}
                </div>
              </div>

              {/* TIMELINE PROGRESS BAR */}
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    t.status === "delivered" || t.status === "completed" ? "bg-emerald-500 w-full" : t.status === "in_transit" ? "bg-blue-500 w-2/3" : "bg-amber-500 w-1/3"
                  }`}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default TripTracker;
