// Graphic representation of Rice Batch lifecycle history
// File: src/features/traceability/components/TraceabilityTimeline.tsx

import React from "react";
import { TraceBatchStatus } from "../domain/types.ts";
import { CheckCircle2, Circle } from "lucide-react";

interface TraceabilityTimelineProps {
  currentStatus: TraceBatchStatus;
}

export const TraceabilityTimeline: React.FC<TraceabilityTimelineProps> = ({ currentStatus }) => {
  const steps: { key: TraceBatchStatus; label: string }[] = [
    { key: "HARVEST", label: "Gặt lúa ruộng" },
    { key: "WEIGHING", label: "Cân tươi ruộng" },
    { key: "SETTLEMENT", label: "Duyệt quyết toán" },
    { key: "DRYING", label: "Sấy lò lúa" },
    { key: "STORAGE", label: "Nhập kho Silo" },
    { key: "SALE", label: "Xuất khẩu/Bán lẻ" }
  ];

  const currentIndex = steps.findIndex(s => s.key === currentStatus);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Hành trình hạt gạo (Traceability)</h4>
      
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center space-y-3 md:space-y-0 md:space-x-2">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex md:flex-col items-center space-x-2 md:space-x-0 md:space-y-1.5 shrink-0">
              {isDone ? (
                <CheckCircle2 className={`w-5 h-5 ${isCurrent ? "text-primary animate-pulse" : "text-emerald-500"}`} />
              ) : (
                <Circle className="w-5 h-5 text-gray-200" />
              )}
              <span className={`text-[10px] font-black uppercase ${isDone ? "text-gray-800" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TraceabilityTimeline;
