// Control panel to lock/unlock Accounting Periods
// File: src/features/accounting/components/PeriodLockControl.tsx

import React, { useState } from "react";
import { AccountingPeriod } from "../domain/types.ts";
import { Lock, Unlock, ShieldAlert } from "lucide-react";

interface PeriodLockControlProps {
  periods: AccountingPeriod[];
  onLock: (id: string) => Promise<boolean>;
  userRole: string;
}

export default function PeriodLockControl({ periods, onLock, userRole }: PeriodLockControlProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLock = async (id: string) => {
    if (userRole !== "director") {
      alert("Chỉ Giám đốc hợp tác xã mới có quyền khóa sổ kỳ kế toán vụ mùa.");
      return;
    }
    if (confirm("Bạn có chắc chắn muốn KHÓA SỔ kỳ kế toán này? Sau khi khóa sổ, toàn bộ dữ liệu tài chính của kỳ sẽ bị đóng băng và không thể chỉnh sửa.")) {
      setIsSubmitting(true);
      await onLock(id);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex items-center space-x-2 border-b border-gray-50 pb-2.5">
        <ShieldAlert className="w-5 h-5 text-primary" />
        <h4 className="text-sm font-bold text-gray-800 tracking-tight">Kỳ kế toán & Khóa sổ niên độ</h4>
      </div>

      <div className="space-y-3">
        {periods.map((p) => (
          <div key={p.id} className="p-3.5 bg-gray-50 rounded-xl flex justify-between items-center text-xs">
            <div className="space-y-1">
              <span className="font-extrabold text-gray-800 block">{p.name}</span>
              <span className="text-[10px] text-gray-400 block font-semibold">Thời gian: {p.start_date} tới {p.end_date}</span>
              {p.is_locked && (
                <span className="text-[9px] text-red-600 font-extrabold block">Đã khóa sổ bởi {p.locked_by}</span>
              )}
            </div>

            {p.is_locked ? (
              <span className="h-8 px-3 bg-red-50 text-red-700 font-bold rounded-lg flex items-center space-x-1 select-none">
                <Lock className="w-3.5 h-3.5" />
                <span>ĐÃ KHÓA</span>
              </span>
            ) : (
              <button
                disabled={isSubmitting || userRole !== "director"}
                onClick={() => handleLock(p.id)}
                className="h-8 px-3 bg-primary hover:bg-primary-light text-white font-bold rounded-lg flex items-center space-x-1 transition shadow-sm disabled:opacity-50"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>MỞ (KÝ KHÓA)</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
