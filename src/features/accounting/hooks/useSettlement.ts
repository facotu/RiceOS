// Custom hook for Settlement Workspace with hardening features
// File: src/features/accounting/hooks/useSettlement.ts

import { useState, useEffect, useCallback } from "react";
import { Settlement, PaymentMethod, AccountingPeriod } from "../domain/types.ts";
import { AccountingRepository } from "../repository/accountingRepository.ts";
import { AccountingService } from "../services/accountingService.ts";
import { db } from "../../../db/index.ts";

const repo = new AccountingRepository();
const service = new AccountingService(repo);

export function useSettlement(orgId: string) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load danh sách quyết toán và kỳ kế toán từ IndexedDB
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Seed dữ liệu mẫu nếu bảng settlements đang trống
      let count = await db.table("settlements").count();
      if (count === 0) {
        const seedSettlements: Settlement[] = [
          {
            id: "settle-001",
            receipt_id: "PC-20260806-0001",
            farmer_id: "farmer-nguyena",
            total_raw_weight: 5700,
            deductions_weight: 0,
            total_dry_weight: 5700,
            price_per_kg: 8000,
            total_amount: 45600000,
            state: "draft",
            created_at: new Date().toISOString(),
            created_by: "Nguyễn Văn Cân"
          },
          {
            id: "settle-002",
            receipt_id: "PC-20260806-0002",
            farmer_id: "farmer-tranb",
            total_raw_weight: 6000,
            deductions_weight: 0,
            total_dry_weight: 6000,
            price_per_kg: 8500,
            total_amount: 51000000,
            state: "pending_approval",
            created_at: new Date().toISOString(),
            created_by: "Nguyễn Văn Cân"
          }
        ];
        
        for (const s of seedSettlements) {
          await db.table("settlements").add({
            ...s,
            organization_id: orgId
          });
        }
      }

      const list = await repo.getSettlements(orgId);
      const p = await repo.getAccountingPeriods(orgId);
      setSettlements(list);
      setPeriods(p);
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách quyết toán");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Hành động 1: Gửi duyệt chi (Accountant làm)
  const submitForApproval = async (id: string, actor: string) => {
    setError(null);
    try {
      await service.submitForApproval(id, actor);
      await loadData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Hành động 2: Ký duyệt chi (Director làm)
  const approveSettlement = async (id: string, actor: string) => {
    setError(null);
    try {
      await service.approveSettlement(id, actor);
      await loadData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Giao dịch 3: Thanh toán (Kế toán làm)
  const paySettlement = async (id: string, method: PaymentMethod, refCode: string, actor: string) => {
    setError(null);
    try {
      await service.paySettlement(id, method, refCode, actor);
      await loadData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Nền tảng hardening: 4. Đối soát thanh toán bank statement
  const reconcilePayment = async (paymentId: string, refCode: string, actor: string, notes?: string) => {
    setError(null);
    try {
      await service.reconcilePayment(paymentId, refCode, actor, notes);
      await loadData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Nền tảng hardening: 5. Điều chỉnh tiền lúa quyết toán
  const adjustSettlement = async (settlementId: string, newAmount: number, reason: string, actor: string) => {
    setError(null);
    try {
      await service.adjustSettlement(settlementId, newAmount, reason, actor);
      await loadData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Nền tảng hardening: 6. Khóa sổ kỳ kế toán
  const lockPeriod = async (periodId: string, actor: string) => {
    setError(null);
    try {
      await service.lockPeriod(periodId, actor);
      await loadData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const selectedSettlement = settlements.find(s => s.id === selectedId) || null;

  return {
    settlements,
    periods,
    selectedSettlement,
    isLoading,
    error,
    setSelectedId,
    submitForApproval,
    approveSettlement,
    paySettlement,
    reconcilePayment,
    adjustSettlement,
    lockPeriod,
    refresh: loadData
  };
}
