// Timeline workflow status tracker
// File: src/features/accounting/components/ApprovalTimeline.tsx

import React from "react";
import { Settlement } from "../domain/types.ts";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface ApprovalTimelineProps {
  settlement: Settlement;
}

export default function ApprovalTimeline({ settlement }: ApprovalTimelineProps) {
  const steps = [
    { key: "draft", label: "Lập phiếu quyết toán", desc: `Nhân viên lập: ${settlement.created_by}` },
    { key: "pending_approval", label: "Gửi duyệt chi", desc: "Kế toán trưởng ký duyệt đối soát" },
    { key: "approved", label: "Giám đốc ký duyệt", desc: settlement.approved_by ? `Duyệt bởi: ${settlement.approved_by}` : "Đang chờ ký duyệt" },
    { key: "completed", label: "Chi tiền hoàn tất", desc: settlement.state === "completed" ? "Đã giao dịch quỹ" : "Chờ thủ quỹ xuất tiền" }
  ];

  const getStepIcon = (idx: number, stepKey: string) => {
    // Nếu bị từ chối
    if (settlement.state === "rejected" && stepKey === "approved") {
      return <AlertCircle className="w-5 h-5 text-red-500 bg-white z-10" />;
    }

    const stateOrder: Record<string, number> = {
      draft: 0,
      pending_approval: 1,
      approved: 2,
      completed: 3
    };

    const currentOrder = stateOrder[settlement.state] ?? 0;
    const stepOrder = stateOrder[stepKey] ?? 0;

    if (stepOrder <= currentOrder) {
      return <CheckCircle2 className="w-5 h-5 text-primary bg-white z-10" />;
    }
    return <Circle className="w-5 h-5 text-gray-300 bg-white z-10" />;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tiến trình phê duyệt quyết toán</h4>
      
      <div className="relative pl-6 space-y-6 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
        {steps.map((step, idx) => (
          <div key={step.key} className="relative flex items-start space-x-3 text-xs">
            <div className="absolute -left-6 transform -translate-x-0.5">
              {getStepIcon(idx, step.key)}
            </div>
            <div>
              <div className="font-bold text-gray-800">{step.label}</div>
              <div className="text-gray-400 font-semibold mt-0.5">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
