// BI Intelligence Domain Types
// File: src/features/intelligence/domain/analyticsTypes.ts

export interface ProductionInsight {
  totalWeighedWeightKg: number;
  totalDriedWeightKg: number;
  averageDryingEfficiency: number; // Tỷ lệ hao hụt sấy trung bình
}

export interface FinancialInsight {
  totalAssetsValue: number;
  cashFlowCoverageRatio: number; // Tỷ lệ thanh khoản khả dụng
}

export interface InventoryInsight {
  siloId: string;
  riceVariety: string;
  storageDays: number;
  qualityRisk: 'low' | 'medium' | 'high';
}

export interface RiskInsight {
  id: string;
  category: 'production' | 'finance' | 'inventory';
  message: string;
  severity: 'critical' | 'warning' | 'info';
  createdAt: string;
}
