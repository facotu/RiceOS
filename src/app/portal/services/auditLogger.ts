// Audit Logger Abstraction for RiceOS Portal
// File: src/app/portal/services/auditLogger.ts

export interface AuditLogPayload {
  action: string;
  module: 'auth' | 'weighing' | 'accounting' | 'warehouse' | 'reports';
  details: Record<string, any>;
  userId?: string;
  organizationId?: string;
}

export class AuditLogger {
  private static instance: AuditLogger;

  private constructor() {}

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  // Ghi nhật ký kiểm toán (Audit log)
  public log(payload: AuditLogPayload) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      ...payload,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Server-Side"
    };

    // 1. In log ra console phục vụ kiểm tra phát triển
    console.log(`[AUDIT LOG] [${timestamp}] [${payload.module.toUpperCase()}] ${payload.action}`, logEntry);

    // 2. Có thể đẩy trực tiếp vào bảng audit_logs trong IndexedDB để đồng bộ offline
    // (Đây là kiến trúc offline-first bền vững)
  }
}

export const auditLogger = AuditLogger.getInstance();
export default auditLogger;
