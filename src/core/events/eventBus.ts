// Central Event Bus Implementation
// File: src/core/events/eventBus.ts

import { DomainEvent, DomainEventType } from "./domainEvents.ts";

export type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventHandler[]> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T>(eventType: DomainEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);

    // Return unsubscribe callback
    return () => {
      const list = this.handlers.get(eventType) || [];
      this.handlers.set(eventType, list.filter(h => h !== handler));
    };
  }

  public async publish<T>(event: DomainEvent<T>): Promise<void> {
    console.log(`[EVENT BUS] Published: ${event.eventType} (ID: ${event.eventId})`);
    const list = this.handlers.get(event.eventType) || [];
    for (const handler of list) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[EVENT BUS] Handler Error on ${event.eventType}:`, err);
      }
    }
  }
}

export const eventBus = EventBus.getInstance();
export default eventBus;
