// Accounting Reporting Service (Domain & Projection Layer)
// File: src/features/accounting/services/accountingReportingService.ts

import { accountingReportingRepo } from "../repository/accountingReportingRepository.ts";
import { 
  FarmerPayableRow, 
  PurchaseReportSummary, 
  CashFlowReportSummary, 
  GeneralJournalRow 
} from "../domain/reportingTypes.ts";

export class AccountingReportingService {
  // 1. Phóng chiếu Báo cáo công nợ phải trả nông dân (Payable Report)
  async getFarmerPayableReport(orgId: string): Promise<FarmerPayableRow[]> {
    const settlements = await accountingReportingRepo.getAllSettlements();
    const payments = await accountingReportingRepo.getAllPayments();
    const farmersMap = await accountingReportingRepo.getFarmersMap();

    const reportMap: Record<string, Omit<FarmerPayableRow, 'farmerName' | 'phone'>> = {};

    settlements.forEach(s => {
      if (!reportMap[s.farmer_id]) {
        reportMap[s.farmer_id] = { farmerId: s.farmer_id, totalPurchased: 0, totalPaid: 0, remainingPayable: 0 };
      }
      reportMap[s.farmer_id].totalPurchased += s.total_amount;
      reportMap[s.farmer_id].remainingPayable += s.total_amount;
    });

    payments.forEach(p => {
      // Tìm farmerId từ settlement
      const settle = settlements.find(s => s.id === p.settlement_id);
      if (settle) {
        const fId = settle.farmer_id;
        if (reportMap[fId]) {
          reportMap[fId].totalPaid += p.amount;
          reportMap[fId].remainingPayable -= p.amount;
        }
      }
    });

    return Object.keys(reportMap).map(fId => ({
      ...reportMap[fId],
      farmerName: farmersMap[fId] || (fId === "farmer-nguyena" ? "Nguyễn Văn An" : "Trần Văn Bình"),
      phone: "0905******"
    }));
  }

  // 2. Phóng chiếu Báo cáo mua hàng lúa vụ mùa (Purchase Report)
  async getPurchaseReport(orgId: string): Promise<PurchaseReportSummary> {
    const settlements = await accountingReportingRepo.getAllSettlements();
    let totalRaw = 0;
    let totalDry = 0;
    let totalCost = 0;

    settlements.forEach(s => {
      totalRaw += s.total_raw_weight;
      totalDry += s.total_dry_weight;
      totalCost += s.total_amount;
    });

    return {
      totalRawWeightKg: totalRaw,
      totalDryWeightKg: totalDry,
      averagePricePerKg: totalDry > 0 ? Math.round(totalCost / totalDry) : 0,
      totalCost
    };
  }

  // 3. Phóng chiếu Báo cáo dòng tiền thu chi (Cash Flow Report)
  async getCashFlowReport(orgId: string): Promise<CashFlowReportSummary> {
    const payments = await accountingReportingRepo.getAllPayments();
    
    // Giả định số dư đầu kỳ quỹ HTX là 500,000,000 đ
    const beginningBalance = 500000000;
    const outflow = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      beginningBalance,
      inflow: 0, // HTX tạm thời chưa tích hợp đầu vào bán lúa gạo sấy thành phẩm
      outflow,
      endingBalance: beginningBalance - outflow
    };
  }

  // 4. Phóng chiếu Sổ Nhật ký chung & Sổ cái (General Journal)
  async getGeneralJournal(orgId: string): Promise<GeneralJournalRow[]> {
    const entries = await accountingReportingRepo.getAllLedgerEntries();
    const accounts: Record<string, string> = {
      "331": "Phải trả cho người bán (Nông dân)",
      "1111": "Tiền mặt tại quỹ HTX",
      "1121": "Tiền gửi ngân hàng (Chuyển khoản)"
    };

    return entries.map(e => ({
      id: e.id,
      date: e.created_at,
      reference: `PC-${e.settlement_id.slice(0, 8).toUpperCase()}`,
      description: e.description,
      accountCode: e.account_code,
      accountName: accounts[e.account_code] || "Tài khoản kế toán",
      debit: e.entry_type === "debit" ? e.amount : 0,
      credit: e.entry_type === "credit" ? e.amount : 0
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // 5. Xuất file Excel/CSV thô (Excel Export Foundation)
  generateCSV(headers: string[], rows: any[][]): string {
    const headerRow = headers.join(",");
    const contentRows = rows.map(r => 
      r.map(val => {
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      }).join(",")
    );
    return [headerRow, ...contentRows].join("\n");
  }
}

export const accountingReportingService = new AccountingReportingService();
export default accountingReportingService;
