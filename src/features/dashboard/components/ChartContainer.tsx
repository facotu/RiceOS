// Reusable Chart Container Component
// File: src/features/dashboard/components/ChartContainer.tsx

import React from "react";
import { BarChart3, Download } from "lucide-react";

interface ChartContainerProps {
  title: string;
  onExport?: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function ChartContainer({
  title,
  onExport,
  isLoading = false,
  children
}: ChartContainerProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 space-y-4">
      {/* HEADER CHART */}
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h3 className="text-base font-bold text-gray-800 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span>{title}</span>
        </h3>
        
        {onExport && (
          <button
            onClick={onExport}
            className="h-8 px-3 hover:bg-gray-100 text-gray-500 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Tải báo cáo ảnh biểu đồ"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải về</span>
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="relative h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        {isLoading ? (
          <span className="text-xs text-gray-400 font-medium animate-pulse">Đang nạp dữ liệu thống kê biểu đồ...</span>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
