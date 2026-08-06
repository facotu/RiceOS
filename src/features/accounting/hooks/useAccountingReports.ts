// React custom hook for Accounting Reports workspace
// File: src/features/accounting/hooks/useAccountingReports.ts

import { useState, useEffect, useCallback } from "react";
import { accountingReportingService } from "../services/accountingReportingService.ts";
import { 
  FarmerPayableRow, 
  PurchaseReportSummary, 
  CashFlowReportSummary, 
  GeneralJournalRow 
} from "../domain/reportingTypes.ts";

export function useAccountingReports(orgId: string) {
  const [payableReport, setPayableReport] = useState<FarmerPayableRow[]>([]);
  const [purchaseReport, setPurchaseReport] = useState<PurchaseReportSummary | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlowReportSummary | null>(null);
  const [journal, setJournal] = useState<GeneralJournalRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payables = await accountingReportingService.getFarmerPayableReport(orgId);
      const purchase = await accountingReportingService.getPurchaseReport(orgId);
      const cash = await accountingReportingService.getCashFlowReport(orgId);
      const jnl = await accountingReportingService.getGeneralJournal(orgId);

      setPayableReport(payables);
      setPurchaseReport(purchase);
      setCashFlow(cash);
      setJournal(jnl);
    } catch (err: any) {
      setError(err.message || "Lỗi nạp báo cáo tài chính kế toán");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Hành động xuất file công nợ nông dân
  const downloadPayableCSV = () => {
    const headers = ["Ma Nong Dan", "Ho va Ten", "Tong So Tien Mua", "Tong So Tien Da Tra", "Con No Phai Tra"];
    const rows = payableReport.map(r => [
      r.farmerId,
      r.farmerName,
      r.totalPurchased,
      r.totalPaid,
      r.remainingPayable
    ]);
    const csvContent = accountingReportingService.generateCSV(headers, rows);
    triggerDownload(csvContent, "bao_cao_cong_no_nong_dan.csv");
  };

  // Hành động xuất sổ nhật ký chung
  const downloadJournalCSV = () => {
    const headers = ["Ngay", "But toan", "Dien giai", "Ma tai khoan", "Ten tai khoan", "No (Debit)", "Co (Credit)"];
    const rows = journal.map(r => [
      new Date(r.date).toLocaleDateString("vi-VN"),
      r.reference,
      r.description,
      r.accountCode,
      r.accountName,
      r.debit,
      r.credit
    ]);
    const csvContent = accountingReportingService.generateCSV(headers, rows);
    triggerDownload(csvContent, "so_nhat_ky_chung.csv");
  };

  // Helper kích hoạt tải file trình duyệt
  const triggerDownload = (content: string, filename: string) => {
    const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    payableReport,
    purchaseReport,
    cashFlow,
    journal,
    isLoading,
    error,
    downloadPayableCSV,
    downloadJournalCSV,
    refresh: loadReports
  };
}
export default useAccountingReports;
