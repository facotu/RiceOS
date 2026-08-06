// IoT Device Registry Repository (Dexie Offline First)
// File: src/features/iot/repository/iotRepository.ts

import { db } from "../../../db/index.ts";
import { IoTDevice } from "../domain/iotTypes.ts";

export class IoTRepository {
  async getDevices(): Promise<IoTDevice[]> {
    return await db.table("iot_devices").toArray();
  }

  async getDeviceById(id: string): Promise<IoTDevice | undefined> {
    return await db.table("iot_devices").get(id);
  }

  async registerDevice(device: IoTDevice): Promise<void> {
    await db.table("iot_devices").put(device);
  }

  async deleteDevice(id: string): Promise<void> {
    await db.table("iot_devices").delete(id);
  }
}
export default IoTRepository;
