// Accounting Reporting Data Layer (Repository)
// File: src/features/accounting/repository/accountingReportingRepository.ts

import { db } from "../../../db/index.ts";
import { Settlement, LedgerEntry, PaymentTransaction } from "../domain/types.ts";

export class AccountingReportingRepository {
  async getAllSettlements(): Promise<Settlement[]> {
    return db.table("settlements").toArray();
  }

  async getAllPayments(): Promise<PaymentTransaction[]> {
    return db.table("payment_transactions").toArray();
  }

  async getAllLedgerEntries(): Promise<LedgerEntry[]> {
    return db.table("ledger_entries").toArray();
  }

  async getFarmersMap(): Promise<Record<string, string>> {
    const list = await db.farmers.toArray();
    const map: Record<string, string> = {};
    list.forEach(f => {
      map[f.id] = f.full_name;
    });
    return map;
  }
}

export const accountingReportingRepo = new AccountingReportingRepository();
export default accountingReportingRepo;
