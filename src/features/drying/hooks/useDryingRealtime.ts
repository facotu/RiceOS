// React custom hook for real-time sensor updates and alerts
// File: src/features/drying/hooks/useDryingRealtime.ts

import { useState, useEffect, useCallback } from "react";
import { SensorSimulatorService, SensorReading } from "../services/sensorSimulatorService.ts";
import { DryingAlertService, DryingAlert } from "../services/dryingAlertService.ts";
import { dryingRepo } from "../repository/dryingRepository.ts";
import { dryingService } from "../services/dryingService.ts";
import { db } from "../../../db/index.ts";

export function useDryingRealtime(orderId: string | null) {
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [alerts, setAlerts] = useState<DryingAlert[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  // Nạp danh sách cảnh báo và nhật ký cũ từ DB
  const loadDryingLogs = useCallback(async () => {
    if (!orderId) return;
    const aList = await db.table("drying_alerts").toArray();
    const lList = await dryingRepo.getSensorLogs(orderId);
    
    setAlerts(aList.filter(a => a.order_id === orderId));
    setLogs(lList.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
  }, [orderId]);

  useEffect(() => {
    loadDryingLogs();
  }, [loadDryingLogs]);

  useEffect(() => {
    if (!orderId) return;

    // Callback xử lý khi nhận gói tin cảm biến IoT phát lên
    const handleNewReading = async (currentReading: SensorReading) => {
      setReading(currentReading);
      
      // 1. Lưu log cảm biến vào IndexedDB offline thông qua Domain Service
      await dryingService.logSensorData(orderId, currentReading.temperature, currentReading.moisture);

      // 2. Chạy bộ kiểm định cảnh báo tự động
      await DryingAlertService.analyzeReading(orderId, currentReading.temperature, currentReading.moisture);

      // 3. Nạp lại log hiển thị tức thời
      await loadDryingLogs();
    };

    // Khởi động vòng lặp giả lập đẩy gói tin
    SensorSimulatorService.startSimulation(orderId, 22.5, handleNewReading);

    return () => {
      SensorSimulatorService.stopSimulation(orderId);
    };
  }, [orderId, loadDryingLogs]);

  return {
    reading,
    alerts,
    logs,
    refresh: loadDryingLogs
  };
}
export default useDryingRealtime;
