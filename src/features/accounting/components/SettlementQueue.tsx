// Table/list queue for Settlements
// File: src/features/accounting/components/SettlementQueue.tsx

import React from "react";
import { Settlement } from "../domain/types.ts";
import { Scale, Check } from "lucide-react";

interface SettlementQueueProps {
  settlements: Settlement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export default function SettlementQueue({
  settlements,
  selectedId,
  onSelect,
  isLoading = false
}: SettlementQueueProps) {
  const getStateBadge = (state: string) => {
    const states: Record<string, { label: string; class: string }> = {
      draft: { label: "Nháp", class: "bg-gray-100 text-gray-700" },
      pending_approval: { label: "Chờ Duyệt", class: "bg-amber-100 text-amber-800" },
      approved: { label: "Đã Duyệt", class: "bg-blue-100 text-blue-800" },
      completed: { label: "Đã Chi", class: "bg-emerald-100 text-emerald-800" },
      rejected: { label: "Từ Chối", class: "bg-red-100 text-red-800" }
    };
    const current = states[state] || { label: "K xác định", class: "bg-gray-50 text-gray-500" };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${current.class}`}>
        {current.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-gray-400 font-semibold animate-pulse">
        Đang nạp danh sách quyết toán lúa...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight">Hàng đợi quyết toán chi trả</h3>
        <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
          Chờ xử lý: {settlements.filter(s => s.state !== 'completed').length}
        </span>
      </div>

      <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
        {settlements.map((s) => {
          const isSelected = s.id === selectedId;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`w-full p-4 text-left transition-all hover:bg-gray-50/50 flex justify-between items-center ${isSelected ? "bg-primary/5 border-l-4 border-primary" : "border-l-4 border-transparent"}`}
            >
              <div className="space-y-1">
                <div className="text-xs font-black text-gray-800">{s.receipt_id}</div>
                <div className="text-[10px] text-gray-400 font-bold">Chủ ruộng: {s.farmer_id === "farmer-nguyena" ? "Nguyễn Văn An" : "Trần Văn Bình"}</div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="text-xs font-black text-primary">{(s.total_amount).toLocaleString("vi-VN")} đ</div>
                <div>{getStateBadge(s.state)}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
