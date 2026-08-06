// Enterprise Audit Logger Service
// File: src/core/audit/auditLogger.ts

import { db } from "../../db/index.ts";

export type AuditAction = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'ROLE_CHANGE';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  operatorName: string;
  userRole: string;
  module: string;
  entity: string;
  action: AuditAction;
  oldValue?: any;
  newValue?: any;
  reason?: string;
}

export class AuditLogger {
  public static async log(
    userId: string,
    operatorName: string,
    userRole: string,
    module: string,
    entity: string,
    action: AuditAction,
    oldValue?: any,
    newValue?: any,
    reason?: string
  ): Promise<string> {
    const item: AuditLogItem = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId,
      operatorName,
      userRole,
      module,
      entity,
      action,
      oldValue,
      newValue,
      reason
    };

    try {
      await db.table("audit_logs").add(item);
      console.log(`[AUDIT LOG] ${action} on ${module}:${entity} by ${operatorName}`);
    } catch (err) {
      console.error("[AUDIT LOG] Failed to record audit log:", err);
    }
    return item.id;
  }

  public static async getLogs(): Promise<AuditLogItem[]> {
    const list = await db.table("audit_logs").toArray();
    return list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }
}
export default AuditLogger;
