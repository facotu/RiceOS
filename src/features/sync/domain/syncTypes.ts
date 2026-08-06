// Cloud Synchronization Schema definitions
// File: src/features/sync/domain/syncTypes.ts

export interface SyncQueueItem {
  id?: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  tableName: string;
  payload: any;
  timestamp: string;
  attempts: number;
}

export interface SyncConflict {
  id: string;
  tableName: string;
  recordId: string;
  localData: any;
  serverData: any;
  resolved: boolean;
  resolvedAt?: string;
}

export interface ServerSnapshot {
  tableName: string;
  lastSequenceNumber: number;
  updatedAt: string;
}
