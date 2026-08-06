// React custom hook for Accounting Governance config
// File: src/features/accounting/hooks/useAccountingGovernance.ts

import { useState, useEffect, useCallback } from "react";
import { accountingGovRepo } from "../repository/accountingGovernanceRepository.ts";
import { accountingGovService } from "../services/accountingGovernanceService.ts";
import { AccountNode, CostCenter } from "../domain/governanceTypes.ts";

export function useAccountingGovernance(orgId: string) {
  const [accounts, setAccounts] = useState<AccountNode[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGovernanceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accs = await accountingGovRepo.getAccounts();
      const ccs = await accountingGovRepo.getCostCenters(orgId);
      setAccounts(accs);
      setCostCenters(ccs);
    } catch (err: any) {
      setError(err.message || "Lỗi nạp cấu hình tài chính");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadGovernanceData();
  }, [loadGovernanceData]);

  // Thêm tài khoản mới
  const addAccount = async (code: string, name: string, type: any) => {
    setError(null);
    try {
      await accountingGovService.createAccount(code, name, type);
      await loadGovernanceData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Thêm trung tâm chi phí
  const addCostCenter = async (code: string, name: string, desc?: string) => {
    setError(null);
    try {
      await accountingGovService.createCostCenter(code, name, orgId, desc);
      await loadGovernanceData();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    accounts,
    costCenters,
    isLoading,
    error,
    addAccount,
    addCostCenter,
    refresh: loadGovernanceData
  };
}
export default useAccountingGovernance;
