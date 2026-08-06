// Enterprise Domain Events Definitions (Immutable)
// File: src/core/events/domainEvents.ts

export interface DomainEvent<T = any> {
  readonly eventId: string;
  readonly eventType: string;
  readonly timestamp: string;
  readonly payload: Readonly<T>;
}

export type DomainEventType =
  | "PurchaseCompleted"
  | "PurchaseUpdated"
  | "DryingCompleted"
  | "WarehouseInventoryChanged"
  | "FinanceTransactionCreated"
  | "KPIUpdated"
  | "BusinessInsightGenerated"
  | "AlertGenerated"
  | "AlertResolved"
  | "AIContextUpdated"
  | "CalendarDeadlineTriggered"
  | "TripCreated"
  | "TripStarted"
  | "TripCompleted"
  | "FuelUpdated"
  | "VehicleMaintenanceDue"
  | "DeliveryCompleted"
  | "PODCreated";

export class BaseDomainEvent<T> implements DomainEvent<T> {
  public readonly eventId: string;
  public readonly timestamp: string;

  constructor(
    public readonly eventType: DomainEventType,
    public readonly payload: Readonly<T>
  ) {
    this.eventId = crypto.randomUUID();
    this.timestamp = new Date().toISOString();
    Object.freeze(this);
    Object.freeze(this.payload);
  }
}

export class PurchaseCompletedEvent extends BaseDomainEvent<{
  receiptId: string;
  farmerId: string;
  weightKg: number;
  totalAmount: number;
}> {
  constructor(payload: { receiptId: string; farmerId: string; weightKg: number; totalAmount: number }) {
    super("PurchaseCompleted", payload);
  }
}

export class DryingCompletedEvent extends BaseDomainEvent<{
  orderId: string;
  siloId: string;
  dryWeightKg: number;
  totalCost: number;
}> {
  constructor(payload: { orderId: string; siloId: string; dryWeightKg: number; totalCost: number }) {
    super("DryingCompleted", payload);
  }
}

export class WarehouseInventoryChangedEvent extends BaseDomainEvent<{
  siloId: string;
  movementType: string;
  quantityKg: number;
}> {
  constructor(payload: { siloId: string; movementType: string; quantityKg: number }) {
    super("WarehouseInventoryChanged", payload);
  }
}

export class FinanceTransactionCreatedEvent extends BaseDomainEvent<{
  settlementId: string;
  amount: number;
  paymentMethod: string;
}> {
  constructor(payload: { settlementId: string; amount: number; paymentMethod: string }) {
    super("FinanceTransactionCreated", payload);
  }
}

export class KPIUpdatedEvent extends BaseDomainEvent<{
  totalWeightRaw: number;
  expectedProfit: number;
}> {
  constructor(payload: { totalWeightRaw: number; expectedProfit: number }) {
    super("KPIUpdated", payload);
  }
}

export class BusinessInsightGeneratedEvent extends BaseDomainEvent<{
  category: string;
  message: string;
  severity: string;
}> {
  constructor(payload: { category: string; message: string; severity: string }) {
    super("BusinessInsightGenerated", payload);
  }
}

export class AlertGeneratedEvent extends BaseDomainEvent<{
  alertId: string;
  message: string;
  severity: string;
}> {
  constructor(payload: { alertId: string; message: string; severity: string }) {
    super("AlertGenerated", payload);
  }
}

export class AlertResolvedEvent extends BaseDomainEvent<{
  alertId: string;
}> {
  constructor(payload: { alertId: string }) {
    super("AlertResolved", payload);
  }
}

export class AIContextUpdatedEvent extends BaseDomainEvent<{
  updatedAt: string;
}> {
  constructor(payload: { updatedAt: string }) {
    super("AIContextUpdated", payload);
  }
}
