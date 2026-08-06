// Drying Operation Log & Batch Card Entities
// File: src/features/drying/domain/operationLogTypes.ts

export type DryingActionType = 
  | "Nạp lúa" 
  | "Thêm nhiên liệu" 
  | "Điều chỉnh nhiệt" 
  | "Vệ sinh lò" 
  | "Bàn giao ca" 
  | "Xử lý sự cố";

export interface DryingOperationLog {
  id: string;
  dryingOrderId: string;
  operator: string;
  action: DryingActionType;
  note: string;
  createdAt: string;
}

export interface DryingBatchCard {
  id: string;
  dryingOrderId: string;
  inputWeight: number;
  outputWeight: number;
  inputMoisture: number;
  outputMoisture: number;
  cost: number;
  status: string;
}
