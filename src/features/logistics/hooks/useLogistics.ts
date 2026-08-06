// React custom hook for Logistics data hydration
// File: src/features/logistics/hooks/useLogistics.ts

import { useState, useEffect, useCallback } from "react";
import { Vehicle, Driver, Trip, PickupLocation, FuelLog, MaintenanceLog, ProofOfDelivery } from "../domain/logisticsTypes.ts";
import { LogisticsRepository } from "../repository/logisticsRepository.ts";
import { LogisticsService } from "../services/logisticsService.ts";

const repo = new LogisticsRepository();
const service = new LogisticsService(repo);

export function useLogistics() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [pods, setPods] = useState<ProofOfDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      await service.seedInitialData();
      const v = await repo.getVehicles();
      const d = await repo.getDrivers();
      const t = await repo.getTrips();
      const loc = await repo.getPickupLocations();
      const f = await repo.getFuelLogs();
      const m = await repo.getMaintenanceLogs();
      const p = await repo.getPODs();

      setVehicles(v);
      setDrivers(d);
      setTrips(t);
      setPickupLocations(loc);
      setFuelLogs(f);
      setMaintenanceLogs(m);
      setPods(p);
    } catch (err) {
      console.error("[USE LOGISTICS] Error loading logistics data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const dispatchTrip = async (params: {
    vehicleId: string;
    driverId: string;
    pickupLocationId: string;
    destinationName: string;
    payloadWeightKg: number;
  }) => {
    const trip = await service.dispatchTrip(params);
    await loadAllData();
    return trip;
  };

  const updateTripStatus = async (tripId: string, status: Trip['status']) => {
    const trip = await service.updateTripStatus(tripId, status);
    await loadAllData();
    return trip;
  };

  const submitPOD = async (pod: Omit<ProofOfDelivery, 'id' | 'timestamp'>) => {
    const res = await service.submitPOD(pod);
    await loadAllData();
    return res;
  };

  return {
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
    refresh: loadAllData
  };
}
export default useLogistics;
