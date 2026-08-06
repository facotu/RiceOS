// IoT Devices and readings definition
// File: src/features/iot/domain/iotTypes.ts

export interface IoTDevice {
  id: string;
  deviceCode: string;
  deviceType: 'temperature_sensor' | 'moisture_sensor' | 'hybrid_sensor';
  location: string; // Silo location, e.g. Silo A, Silo B
  status: 'online' | 'offline' | 'error';
  lastHeartbeat: string;
}

export interface SensorReading {
  deviceId: string;
  temperature: number;
  humidity: number; // For moisture percent
  timestamp: string;
}
