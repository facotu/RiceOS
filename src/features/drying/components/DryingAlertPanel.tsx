// Panel showing realtime drying alerts & safety warnings
// File: src/features/drying/components/DryingAlertPanel.tsx

import React from "react";
import { AlertTriangle, BellRing } from "lucide-react";
import { DryingAlert } from "../services/dryingAlertService.ts";

interface DryingAlertPanelProps {
  alerts: DryingAlert[];
}

export const DryingAlertPanel: React.FC<DryingAlertPanelProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-premium space-y-3">
      <div className="flex items-center space-x-1.5 border-b border-red-50 pb-2">
        <BellRing className="w-4 h-4 text-red-600 animate-bounce" />
        <h4 className="text-xs font-black text-red-600 uppercase tracking-tight">Cảnh báo hệ thống lò sấy</h4>
      </div>

      <div className="space-y-2">
        {alerts.slice(0, 3).map((alert) => (
          <div 
            key={alert.id} 
            className={`p-3 rounded-xl border flex items-start space-x-2.5 text-xs font-bold ${
              alert.severity === "critical" 
                ? "bg-red-50 border-red-200 text-red-800" 
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div>
              <span>{alert.message}</span>
              <span className="block text-[9px] text-gray-400 mt-0.5">
                Ghi nhận lúc: {new Date(alert.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DryingAlertPanel;
