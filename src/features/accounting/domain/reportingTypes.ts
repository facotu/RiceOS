// Accounting Reporting DTOs and Read Models (Projections)
// File: src/features/accounting/domain/reportingTypes.ts

export interface FarmerPayableRow {
  farmerId: string;
  farmerName: string;
  phone: string;
  totalPurchased: number;
  totalPaid: number;
  remainingPayable: number;
}

export interface PurchaseReportSummary {
  totalRawWeightKg: number;
  totalDryWeightKg: number;
  averagePricePerKg: number;
  totalCost: number;
}

export interface CashFlowReportSummary {
  beginningBalance: number;
  inflow: number;
  outflow: number;
  endingBalance: number;
}

export interface GeneralJournalRow {
  id: string;
  date: string;
  reference: string;
  description: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}
