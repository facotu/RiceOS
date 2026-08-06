// AI Agent Types & Interface Definitions
// File: src/features/ai/domain/aiTypes.ts

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIExecutionContext {
  totalSilosCount: number;
  totalActiveDryers: number;
  avgMoisturePercent: number;
  totalOwedAmount: number;
  expectedProfit: number;
  activeVariety: string;
}
