// Timeline display and log submission for manual drying operations
// File: src/features/drying/components/OperationLogPanel.tsx

import React, { useState } from "react";
import { DryingOperationLog, DryingActionType } from "../domain/operationLogTypes.ts";
import { ClipboardList, PlusCircle } from "lucide-react";

interface OperationLogPanelProps {
  logs: DryingOperationLog[];
  onAddLog: (action: DryingActionType, note: string) => Promise<void>;
  disabled?: boolean;
}

export const OperationLogPanel: React.FC<OperationLogPanelProps> = ({
  logs,
  onAddLog,
  disabled = false
}) => {
  const [action, setAction] = useState<DryingActionType>("Điều chỉnh nhiệt");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || disabled) return;
    setIsSubmitting(true);
    try {
      await onAddLog(action, note);
      setNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex items-center space-x-1.5 border-b border-gray-50 pb-2">
        <ClipboardList className="w-4 h-4 text-primary" />
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Nhật ký vận hành thủ công</h4>
      </div>

      {/* TIMELINE VIEW */}
      <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <p className="text-[11px] text-gray-400 font-bold text-center py-4">Chưa ghi nhận sự kiện lò sấy nào.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="text-xs border-l-2 border-primary/20 pl-3 py-1 space-y-0.5">
              <div className="flex justify-between items-center font-extrabold text-gray-800">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] text-gray-600">{log.action}</span>
                <span className="text-[9px] text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-semibold">{log.note}</p>
              <p className="text-[8px] text-gray-400">Vận hành: {log.operator}</p>
            </div>
          ))
        )}
      </div>

      {/* FORM TO ADD LOG */}
      {!disabled && (
        <form onSubmit={handleSubmit} className="pt-2 border-t border-gray-50 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as DryingActionType)}
              className="col-span-1 h-9 px-2 border border-gray-200 rounded-lg text-[10px] font-bold focus:outline-none"
            >
              <option value="Nạp lúa">Nạp lúa</option>
              <option value="Thêm nhiên liệu">Thêm nhiên liệu</option>
              <option value="Điều chỉnh nhiệt">Điều chỉnh nhiệt</option>
              <option value="Vệ sinh lò">Vệ sinh lò</option>
              <option value="Bàn giao ca">Bàn giao ca</option>
              <option value="Xử lý sự cố">Xử lý sự cố</option>
            </select>

            <input
              type="text"
              placeholder="Ghi chú thao tác..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="col-span-2 h-9 px-3 border border-gray-200 rounded-lg text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-8 bg-primary/10 hover:bg-primary text-primary hover:text-white transition rounded-lg text-[10px] font-black flex items-center justify-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>GHI NHẬT KÝ VẬN HÀNH</span>
          </button>
        </form>
      )}
    </div>
  );
};
export default OperationLogPanel;
