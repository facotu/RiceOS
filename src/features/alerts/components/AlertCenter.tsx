// Alert Center displaying active operational alerts with resolve buttons
// File: src/features/alerts/components/AlertCenter.tsx

import React, { useState, useEffect } from "react";
import { SmartAlert } from "../domain/alertTypes.ts";
import { AlertEngine } from "../services/alertEngine.ts";
import { BellRing, Check, ShieldAlert } from "lucide-react";

export const AlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);

  const loadAlerts = async () => {
    const activeAlerts = await AlertEngine.runDiagnostics();
    setAlerts(activeAlerts);
  };

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (id: string) => {
    await AlertEngine.resolveAlert(id);
    await loadAlerts();
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
          <BellRing className="w-4 h-4 text-primary animate-swing" />
          <span>Trung tâm cảnh báo điều hành HTX</span>
        </h4>
        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-black rounded-full">
          {alerts.length} CHƯA XỬ LÝ
        </span>
      </div>

      {/* ALERTS LIST */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 font-semibold space-y-1.5">
            <ShieldAlert className="w-6 h-6 text-gray-200 mx-auto" />
            <p>Trạm sấy và trạm tài chính hoạt động tối ưu.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-3.5 rounded-xl border flex justify-between items-start space-x-3 text-xs font-bold ${
                alert.severity === "critical"
                  ? "bg-red-50 border-red-200 text-red-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="space-y-0.5">
                <span className="block text-[8px] text-gray-400 uppercase font-black">{alert.category}</span>
                <span>{alert.message}</span>
                <span className="block text-[8px] text-gray-400 font-semibold">
                  Ghi nhận lúc: {new Date(alert.created_at).toLocaleTimeString()}
                </span>
              </div>

              <button
                onClick={() => handleResolve(alert.id)}
                className="h-7 w-7 rounded-lg bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 flex items-center justify-center transition shrink-0 shadow-sm"
                title="Tắt cảnh báo"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default AlertCenter;
