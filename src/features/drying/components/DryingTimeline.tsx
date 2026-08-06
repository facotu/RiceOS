// Drying process flow timeline tracker
// File: src/features/drying/components/DryingTimeline.tsx

import React from "react";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";

interface DryingTimelineProps {
  status: 'active' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  initialMoisture: number;
}

export const DryingTimeline: React.FC<DryingTimelineProps> = ({
  status,
  startTime,
  endTime,
  initialMoisture
}) => {
  const steps = [
    { title: "Nạp lúa tươi vào Silo", desc: `Khởi đầu với độ ẩm tươi ${initialMoisture}%`, done: true, time: new Date(startTime).toLocaleTimeString() },
    { title: "Khởi động đốt nóng đầu lò", desc: "Duy trì nhiệt độ sấy ổn định 38°C - 42°C", done: true, time: new Date(startTime).toLocaleTimeString() },
    { title: "Giảm ẩm liên tục", desc: "Khử hơi nước ẩm của hạt lúa gạo", done: status === "completed", current: status === "active" },
    { title: "Hoàn tất chuyển Silo khô", desc: "Chuyển kho đạt độ ẩm chuẩn 14.0% bảo quản", done: status === "completed", time: endTime ? new Date(endTime).toLocaleTimeString() : undefined }
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Quy trình sấy nhiệt hạt lúa</h4>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start space-x-3 text-xs font-semibold">
            <div className="flex flex-col items-center">
              {step.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : step.current ? (
                <Clock className="w-4 h-4 text-amber-500 animate-spin" />
              ) : (
                <PlayCircle className="w-4 h-4 text-gray-300" />
              )}
              {idx < steps.length - 1 && (
                <div className={`w-0.5 h-8 my-1 ${step.done ? "bg-emerald-300" : "bg-gray-100"}`}></div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className={`font-extrabold ${step.done ? "text-gray-800" : "text-gray-400"}`}>{step.title}</span>
                {step.time && <span className="text-[10px] text-gray-400 font-bold">{step.time}</span>}
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DryingTimeline;
