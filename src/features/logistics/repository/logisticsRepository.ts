// Logistics Repository (Dexie IndexedDB)
// File: src/features/logistics/repository/logisticsRepository.ts

import { db } from "../../../db/index.ts";
import { Vehicle, Driver, Trip, PickupLocation, FuelLog, MaintenanceLog, ProofOfDelivery } from "../domain/logisticsTypes.ts";

export class LogisticsRepository {
  // VEHICLES
  async getVehicles(): Promise<Vehicle[]> {
    return await db.table("vehicles").toArray();
  }
  async saveVehicle(vehicle: Vehicle): Promise<void> {
    await db.table("vehicles").put(vehicle);
  }

  // DRIVERS
  async getDrivers(): Promise<Driver[]> {
    return await db.table("drivers").toArray();
  }
  async saveDriver(driver: Driver): Promise<void> {
    await db.table("drivers").put(driver);
  }

  // TRIPS
  async getTrips(): Promise<Trip[]> {
    return await db.table("trips").toArray();
  }
  async saveTrip(trip: Trip): Promise<void> {
    await db.table("trips").put(trip);
  }
  async getTripById(id: string): Promise<Trip | undefined> {
    return await db.table("trips").get(id);
  }

  // PICKUP LOCATIONS
  async getPickupLocations(): Promise<PickupLocation[]> {
    return await db.table("pickup_locations").toArray();
  }
  async savePickupLocation(loc: PickupLocation): Promise<void> {
    await db.table("pickup_locations").put(loc);
  }

  // FUEL LOGS
  async getFuelLogs(): Promise<FuelLog[]> {
    return await db.table("fuel_logs").toArray();
  }
  async saveFuelLog(log: FuelLog): Promise<void> {
    await db.table("fuel_logs").put(log);
  }

  // MAINTENANCE LOGS
  async getMaintenanceLogs(): Promise<MaintenanceLog[]> {
    return await db.table("maintenance_logs").toArray();
  }
  async saveMaintenanceLog(log: MaintenanceLog): Promise<void> {
    await db.table("maintenance_logs").put(log);
  }

  // PROOF OF DELIVERY
  async getPODs(): Promise<ProofOfDelivery[]> {
    return await db.table("proof_of_delivery").toArray();
  }
  async savePOD(pod: ProofOfDelivery): Promise<void> {
    await db.table("proof_of_delivery").put(pod);
  }
}
export default LogisticsRepository;
