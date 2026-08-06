// React hook to manage IoT device lists and push mock MQTT telemetry
// File: src/features/iot/hooks/useIoTDevice.ts

import { useState, useEffect, useCallback } from "react";
import { IoTDevice } from "../domain/iotTypes.ts";
import { IoTRepository } from "../repository/iotRepository.ts";
import { DeviceRegistry } from "../services/deviceRegistry.ts";
import { MQTTAdapter } from "../services/mqttAdapter.ts";
import { SensorGateway } from "../services/sensorGateway.ts";

const repo = new IoTRepository();
const registry = new DeviceRegistry(repo);

export function useIoTDevice() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      await registry.initializeDefaultDevices();
      const list = await repo.getDevices();
      setDevices(list);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices();
    MQTTAdapter.connect("mqtt://broker.riceos.vn");
    SensorGateway.initGateway();
  }, [loadDevices]);

  // Đẩy gói tin giả lập qua MQTT Broker ảo
  const simulateIoTMessage = (siloId: string, temp: number, moisture: number) => {
    const payload = JSON.stringify({
      temperature: temp,
      humidity: moisture,
      timestamp: new Date().toISOString()
    });
    MQTTAdapter.publish(`silo/${siloId}/sensor`, payload);
  };

  return {
    devices,
    isLoading,
    simulateIoTMessage,
    refresh: loadDevices
  };
}
export default useIoTDevice;
