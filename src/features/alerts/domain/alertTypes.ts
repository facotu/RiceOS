// Alerts System Type Definitions
// File: src/features/alerts/domain/alertTypes.ts

export interface SmartAlert {
  id: string;
  category: 'inventory' | 'drying' | 'finance' | 'operation';
  message: string;
  severity: 'critical' | 'warning' | 'info';
  resolved: boolean;
  created_at: string;
}
