// Notification Center listening to EventBus
// File: src/core/notifications/notificationCenter.ts

import { eventBus } from "../events/eventBus.ts";
import { db } from "../../db/index.ts";

export type NotificationSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  read: boolean;
  hidden: boolean;
  created_at: string;
}

export class NotificationCenter {
  private static instance: NotificationCenter;

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): NotificationCenter {
    if (!NotificationCenter.instance) {
      NotificationCenter.instance = new NotificationCenter();
    }
    return NotificationCenter.instance;
  }

  private setupListeners(): void {
    // 1. Listen for AlertGenerated
    eventBus.subscribe("AlertGenerated", async (evt) => {
      await this.notify(
        "Cảnh báo hệ thống",
        evt.payload.message,
        (evt.payload.severity.toUpperCase() as NotificationSeverity) || "HIGH"
      );
    });

    // 2. Listen for DryingCompleted
    eventBus.subscribe("DryingCompleted", async (evt) => {
      await this.notify(
        "Sấy lò hoàn tất",
        `Lệnh sấy ${evt.payload.orderId} tại ${evt.payload.siloId} đã sấy xong ${evt.payload.dryWeightKg} kg lúa khô.`,
        "INFO"
      );
    });

    // 3. Listen for PurchaseCompleted
    eventBus.subscribe("PurchaseCompleted", async (evt) => {
      await this.notify(
        "Thu mua lúa tươi",
        `Đã chốt phiếu cân mua ${evt.payload.weightKg} kg lúa tươi. Tổng tiền: ${evt.payload.totalAmount.toLocaleString()} VNĐ.`,
        "INFO"
      );
    });
  }

  public async notify(title: string, message: string, severity: NotificationSeverity = "INFO"): Promise<string> {
    const item: SystemNotification = {
      id: crypto.randomUUID(),
      title,
      message,
      severity,
      read: false,
      hidden: false,
      created_at: new Date().toISOString()
    };

    await db.table("notifications").add(item);
    return item.id;
  }

  public async getNotifications(): Promise<SystemNotification[]> {
    const list = await db.table("notifications").toArray();
    return list.filter(n => !n.hidden).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  public async markAsRead(id: string): Promise<void> {
    const item = await db.table("notifications").get(id);
    if (item) {
      item.read = true;
      await db.table("notifications").put(item);
    }
  }

  public async hideNotification(id: string): Promise<void> {
    const item = await db.table("notifications").get(id);
    if (item) {
      item.hidden = true;
      await db.table("notifications").put(item);
    }
  }
}

export const notificationCenter = NotificationCenter.getInstance();
export default notificationCenter;
