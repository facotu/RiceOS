// Dispatching new rice delivery trip component
// File: src/features/logistics/components/TripDispatcher.tsx

import React, { useState } from "react";
import { Vehicle, Driver, PickupLocation } from "../domain/logisticsTypes.ts";
import { Send, MapPin, Scale, Truck, User } from "lucide-react";

interface TripDispatcherProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  pickupLocations: PickupLocation[];
  onDispatch: (params: {
    vehicleId: string;
    driverId: string;
    pickupLocationId: string;
    destinationName: string;
    payloadWeightKg: number;
  }) => Promise<void>;
}

export const TripDispatcher: React.FC<TripDispatcherProps> = ({
  vehicles,
  drivers,
  pickupLocations,
  onDispatch
}) => {
  const availableVehicles = vehicles.filter(v => v.status === "available");
  const availableDrivers = drivers.filter(d => d.status === "active");

  const [selectedVehicle, setSelectedVehicle] = useState(availableVehicles[0]?.id || "");
  const [selectedDriver, setSelectedDriver] = useState(availableDrivers[0]?.id || "");
  const [selectedLocation, setSelectedLocation] = useState(pickupLocations[0]?.id || "");
  const [payloadKg, setPayloadKg] = useState("5000");
  const [destination, setDestination] = useState("Silo sấy lúa HTX Hòa Tiến A01");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedDriver || !selectedLocation) {
      alert("Vui lòng chọn đầy đủ xe, tài xế và điểm gặt lúa!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onDispatch({
        vehicleId: selectedVehicle,
        driverId: selectedDriver,
        pickupLocationId: selectedLocation,
        destinationName: destination,
        payloadWeightKg: Number(payloadKg) || 5000
      });
      alert("Đã khởi tạo lệnh điều phối chuyến xe thu mua lúa thành công!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
          <Send className="w-4 h-4 text-primary" />
          <span>Bảng điều phối chuyến xe thu mua lúa tươi</span>
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
        {/* VEHICLE SELECT */}
        <div className="space-y-1">
          <label className="font-extrabold text-gray-700 flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5 text-primary" />
            <span>Chọn xe vận chuyển:</span>
          </label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full h-9 px-2.5 border border-gray-200 rounded-lg font-semibold text-xs focus:ring-1 focus:ring-primary"
          >
            {availableVehicles.map(v => (
              <option key={v.id} value={v.id}>{v.plateNumber} ({v.capacityTons} Tấn)</option>
            ))}
          </select>
        </div>

        {/* DRIVER SELECT */}
        <div className="space-y-1">
          <label className="font-extrabold text-gray-700 flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chọn tài xế lái xe:</span>
          </label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full h-9 px-2.5 border border-gray-200 rounded-lg font-semibold text-xs focus:ring-1 focus:ring-primary"
          >
            {availableDrivers.map(d => (
              <option key={d.id} value={d.id}>{d.fullName} ({d.phone})</option>
            ))}
          </select>
        </div>

        {/* LOCATION SELECT */}
        <div className="space-y-1">
          <label className="font-extrabold text-gray-700 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Điểm lấy lúa (Nông hộ):</span>
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full h-9 px-2.5 border border-gray-200 rounded-lg font-semibold text-xs focus:ring-1 focus:ring-primary"
          >
            {pickupLocations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.farmerName} - {loc.fieldName}</option>
            ))}
          </select>
        </div>

        {/* PAYLOAD KG */}
        <div className="space-y-1">
          <label className="font-extrabold text-gray-700 flex items-center space-x-1">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sản lượng ước tính (kg):</span>
          </label>
          <input
            type="number"
            value={payloadKg}
            onChange={(e) => setPayloadKg(e.target.value)}
            className="w-full h-9 px-2.5 border border-gray-200 rounded-lg font-semibold text-xs focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting || availableVehicles.length === 0}
            className="w-full h-9 bg-primary text-white font-extrabold rounded-lg shadow hover:opacity-95 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Phát lệnh đi chuyến</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default TripDispatcher;
