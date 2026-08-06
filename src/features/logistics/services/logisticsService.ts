// Logistics Domain Services & Seeder
// File: src/features/logistics/services/logisticsService.ts

import { LogisticsRepository } from "../repository/logisticsRepository.ts";
import { Vehicle, Driver, Trip, PickupLocation, FuelLog, MaintenanceLog, ProofOfDelivery } from "../domain/logisticsTypes.ts";
import { eventBus } from "../../../core/events/eventBus.ts";
import { BaseDomainEvent } from "../../../core/events/domainEvents.ts";
import { db } from "../../../db/index.ts";

export class LogisticsService {
  private repo: LogisticsRepository;

  constructor(repo: LogisticsRepository) {
    this.repo = repo;
  }

  // Khởi tạo dữ liệu mẫu đội xe, tài xế và điểm gặt lúa nếu chưa có
  async seedInitialData(): Promise<void> {
    const vehicles = await this.repo.getVehicles();
    if (vehicles.length === 0) {
      const sampleVehicles: Vehicle[] = [
        {
          id: "veh-001",
          plateNumber: "43C-098.12",
          type: "Xe tải 8 Tấn",
          capacityTons: 8,
          driverId: "drv-001",
          ownerName: "HTX Hòa Tiến 2",
          status: "available",
          fuelConsumptionRate: 18,
          inspectionDate: "2026-12-31",
          insuranceDate: "2026-10-15",
          lastMaintenanceDate: "2026-07-01"
        },
        {
          id: "veh-002",
          plateNumber: "43C-145.89",
          type: "Xe tải 12 Tấn",
          capacityTons: 12,
          driverId: "drv-002",
          ownerName: "Dịch vụ Vận tải Ba Đèo",
          status: "available",
          fuelConsumptionRate: 22,
          inspectionDate: "2026-11-20",
          insuranceDate: "2026-09-30",
          lastMaintenanceDate: "2026-06-15"
        }
      ];
      for (const v of sampleVehicles) await this.repo.saveVehicle(v);
    }

    const drivers = await this.repo.getDrivers();
    if (drivers.length === 0) {
      const sampleDrivers: Driver[] = [
        {
          id: "drv-001",
          fullName: "Trần Văn Hùng",
          idCardNumber: "048092001122",
          licenseNumber: "480129381928",
          licenseClass: "FC",
          phone: "0905111222",
          experienceYears: 8,
          status: "active"
        },
        {
          id: "drv-002",
          fullName: "Lê Minh Tuấn",
          idCardNumber: "048085003344",
          licenseNumber: "480998877665",
          licenseClass: "C",
          phone: "0905333444",
          experienceYears: 5,
          status: "active"
        }
      ];
      for (const d of sampleDrivers) await this.repo.saveDriver(d);
    }

    const locations = await this.repo.getPickupLocations();
    if (locations.length === 0) {
      const sampleLocations: PickupLocation[] = [
        {
          id: "loc-001",
          farmerName: "Nguyễn Văn A",
          fieldName: "Cánh đồng Đống Cả - Thôn Yến Nê",
          locationLat: 15.987,
          locationLng: 108.192,
          areaHectares: 2.5,
          riceVariety: "J02",
          expectedYieldKg: 15000,
          estimatedMoisture: 26.5,
          harvestDate: "2026-08-07"
        },
        {
          id: "loc-002",
          farmerName: "Trần Thị B",
          fieldName: "Cánh đồng Gò Gạo - Thôn Lệ Sơn",
          locationLat: 15.992,
          locationLng: 108.185,
          areaHectares: 1.8,
          riceVariety: "ST25",
          expectedYieldKg: 11000,
          estimatedMoisture: 24.0,
          harvestDate: "2026-08-08"
        }
      ];
      for (const loc of sampleLocations) await this.repo.savePickupLocation(loc);
    }
  }

  // Tạo lệnh điều phối chuyến xe thu mua lúa
  async dispatchTrip(params: {
    vehicleId: string;
    driverId: string;
    pickupLocationId: string;
    destinationName: string;
    payloadWeightKg: number;
  }): Promise<Trip> {
    const trip: Trip = {
      id: crypto.randomUUID(),
      tripCode: `TRIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId: params.vehicleId,
      driverId: params.driverId,
      pickupLocationId: params.pickupLocationId,
      destinationName: params.destinationName,
      estDistanceKm: 12.5,
      estDurationMins: 35,
      status: "dispatched",
      startTime: new Date().toISOString(),
      payloadWeightKg: params.payloadWeightKg
    };

    await this.repo.saveTrip(trip);

    // Cập nhật trạng thái xe và tài xế
    const vehicle = await db.table("vehicles").get(params.vehicleId);
    if (vehicle) {
      vehicle.status = "in_transit";
      await this.repo.saveVehicle(vehicle);
    }
    const driver = await db.table("drivers").get(params.driverId);
    if (driver) {
      driver.status = "busy";
      await this.repo.saveDriver(driver);
    }

    // Publish Domain Event
    await eventBus.publish(new BaseDomainEvent("TripCreated" as any, {
      tripId: trip.id,
      tripCode: trip.tripCode,
      vehicleId: trip.vehicleId,
      payloadWeightKg: trip.payloadWeightKg
    }));

    return trip;
  }

  // Cập nhật trạng thái chuyến xe
  async updateTripStatus(tripId: string, status: Trip['status']): Promise<Trip> {
    const trip = await this.repo.getTripById(tripId);
    if (!trip) throw new Error("Không tìm thấy chuyến xe");

    trip.status = status;
    if (status === "completed" || status === "delivered") {
      trip.endTime = new Date().toISOString();

      // Giải phóng xe và tài xế
      const vehicle = await db.table("vehicles").get(trip.vehicleId);
      if (vehicle) {
        vehicle.status = "available";
        await this.repo.saveVehicle(vehicle);
      }
      const driver = await db.table("drivers").get(trip.driverId);
      if (driver) {
        driver.status = "active";
        await this.repo.saveDriver(driver);
      }

      await eventBus.publish(new BaseDomainEvent("TripCompleted" as any, {
        tripId: trip.id,
        tripCode: trip.tripCode
      }));
    }

    await this.repo.saveTrip(trip);
    return trip;
  }

  // Nạp bằng chứng giao lúa (POD)
  async submitPOD(pod: Omit<ProofOfDelivery, 'id' | 'timestamp'>): Promise<ProofOfDelivery> {
    const fullPOD: ProofOfDelivery = {
      ...pod,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    await this.repo.savePOD(fullPOD);
    await this.updateTripStatus(pod.tripId, "delivered");

    await eventBus.publish(new BaseDomainEvent("PODCreated" as any, {
      podId: fullPOD.id,
      tripId: fullPOD.tripId,
      deliveredWeightKg: fullPOD.deliveredWeightKg
    }));

    return fullPOD;
  }
}
export default LogisticsService;
