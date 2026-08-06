// Logistics & Supply Chain Portal Page
// File: src/app/portal/pages/Logistics.tsx

import React, { useState } from "react";
import { useLogistics } from "../../../features/logistics/hooks/useLogistics.ts";
import LogisticsDashboardWidget from "../../../features/logistics/components/LogisticsDashboardWidget.tsx";
import FleetManager from "../../../features/logistics/components/FleetManager.tsx";
import TripDispatcher from "../../../features/logistics/components/TripDispatcher.tsx";
import TripTracker from "../../../features/logistics/components/TripTracker.tsx";
import FuelMaintenanceTracker from "../../../features/logistics/components/FuelMaintenanceTracker.tsx";
import PODModal from "../../../features/logistics/components/PODModal.tsx";
import { Trip } from "../../../features/logistics/domain/logisticsTypes.ts";
import { Truck, Navigation, Fuel, RefreshCw, LayoutDashboard } from "lucide-react";

export default function LogisticsPage() {
  const {
    vehicles,
    drivers,
    trips,
    pickupLocations,
    fuelLogs,
    maintenanceLogs,
    pods,
    isLoading,
    dispatchTrip,
    updateTripStatus,
    submitPOD,
    refresh
  } = useLogistics();

  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'fuel'>('overview');
  const [activePODTrip, setActivePODTrip] = useState<Trip | null>(null);

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center space-x-2">
            <Truck className="w-5 h-5 text-primary" />
            <span>Quản Lý Logistics & Chuỗi Cung Ứng Lúa</span>
          </h1>
          <p className="text-xs text-gray-400 font-semibold">Điều phối đội xe, theo dõi hành trình gặt lúa và giao nhận kho thành phẩm</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => refresh()}
            className="h-8 px-3 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center space-x-1.5 transition text-xs font-extrabold text-gray-600"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex space-x-2 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center space-x-1.5 ${
            activeTab === 'overview' ? "bg-primary text-white shadow" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Điều phối & Tổng quan</span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center space-x-1.5 ${
            activeTab === 'fleet' ? "bg-primary text-white shadow" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Quản lý Đội xe & Tài xế</span>
        </button>

        <button
          onClick={() => setActiveTab('fuel')}
          className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center space-x-1.5 ${
            activeTab === 'fuel' ? "bg-primary text-white shadow" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Fuel className="w-4 h-4" />
          <span>Nhiên liệu & Bảo dưỡng</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & DISPATCHER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <LogisticsDashboardWidget
            vehicles={vehicles}
            trips={trips}
            pods={pods}
          />
          <TripDispatcher
            vehicles={vehicles}
            drivers={drivers}
            pickupLocations={pickupLocations}
            onDispatch={async (params) => { await dispatchTrip(params); }}
          />
          <TripTracker
            trips={trips}
            vehicles={vehicles}
            drivers={drivers}
            pickupLocations={pickupLocations}
            onUpdateStatus={async (id, s) => { await updateTripStatus(id, s); }}
            onOpenPOD={(trip) => setActivePODTrip(trip)}
          />
        </div>
      )}

      {/* TAB 2: FLEET MANAGER */}
      {activeTab === 'fleet' && (
        <FleetManager
          vehicles={vehicles}
          drivers={drivers}
        />
      )}

      {/* TAB 3: FUEL & MAINTENANCE */}
      {activeTab === 'fuel' && (
        <FuelMaintenanceTracker
          vehicles={vehicles}
          fuelLogs={fuelLogs}
          maintenanceLogs={maintenanceLogs}
        />
      )}

      {/* POD MODAL */}
      {activePODTrip && (
        <PODModal
          trip={activePODTrip}
          onClose={() => setActivePODTrip(null)}
          onSubmit={async (pod) => { await submitPOD(pod); }}
        />
      )}
    </div>
  );
}
