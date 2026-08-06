// Device Registry Manager for Silos
// File: src/features/iot/services/deviceRegistry.ts

import { IoTRepository } from "../repository/iotRepository.ts";
import { IoTDevice } from "../domain/iotTypes.ts";

export class DeviceRegistry {
  private repository: IoTRepository;

  constructor(repository: IoTRepository) {
    this.repository = repository;
  }

  // Khởi tạo các cảm biến mặc định cho trạm sấy Silo A và Silo B
  async initializeDefaultDevices(): Promise<void> {
    const existing = await this.repository.getDevices();
    if (existing.length > 0) return;

    const devA: IoTDevice = {
      id: "device-silo-a",
      deviceCode: "SEN-SILO-A01",
      deviceType: "hybrid_sensor",
      location: "Silo sấy A",
      status: "online",
      lastHeartbeat: new Date().toISOString()
    };

    const devB: IoTDevice = {
      id: "device-silo-b",
      deviceCode: "SEN-SILO-B01",
      deviceType: "hybrid_sensor",
      location: "Silo sấy B",
      status: "online",
      lastHeartbeat: new Date().toISOString()
    };

    await this.repository.registerDevice(devA);
    await this.repository.registerDevice(devB);
  }
}
export default DeviceRegistry;
