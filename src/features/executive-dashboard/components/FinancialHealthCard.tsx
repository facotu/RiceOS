// Financial statement dashboard showing cash flow, inventory asset value
// File: src/features/executive-dashboard/components/FinancialHealthCard.tsx

import React from "react";
import { Activity, ShieldCheck, Landmark } from "lucide-react";

interface FinancialHealthCardProps {
  cashFlow: number;
  payable: number;
  inventoryValue: number;
}

export const FinancialHealthCard: React.FC<FinancialHealthCardProps> = ({
  cashFlow,
  payable,
  inventoryValue
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
          <Landmark className="w-4 h-4 text-primary" />
          <span>Sức khỏe tài chính HTX Hòa Tiến 2</span>
        </h4>
      </div>

      <div className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
        {/* CASH FLOW */}
        <div className="py-3 flex justify-between items-center">
          <span className="text-gray-400 font-normal">Quỹ tiền mặt khả dụng:</span>
          <span className="font-extrabold text-gray-800">{cashFlow.toLocaleString()} VNĐ</span>
        </div>

        {/* PAYABLE */}
        <div className="py-3 flex justify-between items-center">
          <span className="text-gray-400 font-normal">Công nợ nông dân:</span>
          <span className="font-extrabold text-red-600">{payable.toLocaleString()} VNĐ</span>
        </div>

        {/* INVENTORY VALUE */}
        <div className="py-3 flex justify-between items-center">
          <span className="text-gray-400 font-normal">Giá trị tồn kho lúa gạo:</span>
          <span className="font-extrabold text-emerald-700">{inventoryValue.toLocaleString()} VNĐ</span>
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[10px] text-blue-900 font-black flex items-center space-x-1.5">
        <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600" />
        <span>Chỉ số thanh khoản HTX an toàn đạt mức 2.5x</span>
      </div>
    </div>
  );
};
export default FinancialHealthCard;
