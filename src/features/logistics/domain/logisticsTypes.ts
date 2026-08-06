// Logistics Domain Entities & Types (DDD)
// File: src/features/logistics/domain/logisticsTypes.ts

export type VehicleStatus = 'available' | 'in_transit' | 'maintenance';

export interface Vehicle {
  id: string;
  plateNumber: string;         // Biển số xe (VD: 43C-123.45)
  type: string;                // Loại xe (Xe tải 5 tấn, Xe container, Xe ben)
  capacityTons: number;        // Tải trọng cho phép (Tấn)
  driverId?: string;           // Tài xế phụ trách
  ownerName: string;           // Chủ xe (HTX / Thuê ngoài)
  status: VehicleStatus;
  fuelConsumptionRate: number; // Định mức Lít/100km (VD: 18)
  inspectionDate: string;      // Hạn đăng kiểm
  insuranceDate: string;       // Hạn bảo hiểm
  lastMaintenanceDate: string; // Ngày bảo dưỡng gần nhất
}

export interface Driver {
  id: string;
  fullName: string;
  idCardNumber: string;        // CCCD
  licenseNumber: string;       // Số GPLX
  licenseClass: string;        // Hạng GPLX (C, FC...)
  phone: string;
  experienceYears: number;
  status: 'active' | 'busy' | 'off';
}

export type TripStatus = 'pending' | 'dispatched' | 'loading' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  tripCode: string;            // Mã chuyến (VD: TRIP-2026-001)
  vehicleId: string;
  driverId: string;
  pickupLocationId: string;    // ID Điểm gặt lúa nông hộ
  destinationName: string;     // Điểm giao (Trạm sấy Silo A, Kho B...)
  estDistanceKm: number;       // Khoảng cách ước tính (km)
  estDurationMins: number;     // Thời gian ước tính (phút)
  status: TripStatus;
  startTime?: string;
  endTime?: string;
  payloadWeightKg: number;     // Khối lượng lúa chở (kg)
}

export interface PickupLocation {
  id: string;
  farmerName: string;          // Tên nông hộ
  fieldName: string;           // Tên cánh đồng (VD: Đống Cả - Hòa Tiến)
  locationLat: number;         // Tọa độ Vĩ độ
  locationLng: number;         // Tọa độ Kinh độ
  areaHectares: number;        // Diện tích (ha)
  riceVariety: string;         // Giống lúa (J02, ST25, OM18)
  expectedYieldKg: number;     // Dự kiến sản lượng (kg)
  estimatedMoisture: number;   // Độ ẩm dự kiến (%)
  harvestDate: string;         // Ngày gặt dự kiến
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  amountVnd: number;
  odometerKm: number;
  date: string;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: 'oil' | 'tire' | 'repair' | 'routine';
  costVnd: number;
  date: string;
  notes: string;
}

export interface ProofOfDelivery {
  id: string;
  tripId: string;
  receiptNumber?: string;
  recipientName: string;
  signatureUrl: string;
  photoUrl: string;
  deliveredWeightKg: number;
  timestamp: string;
}
