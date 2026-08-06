// Domain Events for Accounting Domain
// File: src/features/accounting/domain/events.ts

import { Settlement, PaymentTransaction } from "./types.ts";

export interface IDomainEvent {
  dateTimeOccurred: string;
  eventName: string;
}

export class SettlementCreatedEvent implements IDomainEvent {
  dateTimeOccurred: string = new Date().toISOString();
  eventName: string = "SettlementCreated";
  constructor(public readonly settlement: Settlement) {}
}

export class SettlementApprovedEvent implements IDomainEvent {
  dateTimeOccurred: string = new Date().toISOString();
  eventName: string = "SettlementApproved";
  constructor(public readonly settlement: Settlement) {}
}

export class SettlementPaidEvent implements IDomainEvent {
  dateTimeOccurred: string = new Date().toISOString();
  eventName: string = "SettlementPaid";
  constructor(public readonly payment: PaymentTransaction) {}
}

// Bộ điều phối sự kiện nghiệp vụ (Domain Event Dispatcher)
export class DomainEvents {
  private static handlers: Record<string, Function[]> = {};

  // Đăng ký nhận sự kiện
  public static register(eventName: string, handler: Function) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  // Bắn sự kiện đi các phân hệ khác (ví dụ kho, báo cáo)
  public static dispatch(event: IDomainEvent) {
    const handlers = this.handlers[event.eventName] || [];
    console.log(`[DOMAIN EVENT DISPATCH] Phát sự kiện: ${event.eventName}`, event);
    handlers.forEach(handler => handler(event));
  }
}
