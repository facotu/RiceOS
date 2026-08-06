// Widget showing important risk warnings to executive director
// File: src/features/executive-dashboard/components/RiskAlertWidget.tsx

import React from "react";
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface RiskItem {
  id: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

interface RiskAlertWidgetProps {
  alerts: RiskItem[];
}

export const RiskAlertWidget: React.FC<RiskAlertWidgetProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium text-center py-8 text-xs text-gray-400 font-semibold space-y-1.5">
        <ShieldAlert className="w-6 h-6 text-gray-300 mx-auto" />
        <p>Hệ thống vận hành an toàn. Không phát hiện rủi ro nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
          <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
          <span>Danh sách rủi ro vận hành HTX</span>
        </h4>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-3.5 rounded-xl border flex items-start space-x-2.5 text-xs font-bold ${
              alert.severity === "critical"
                ? "bg-red-50 border-red-200 text-red-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{alert.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RiskAlertWidget;
