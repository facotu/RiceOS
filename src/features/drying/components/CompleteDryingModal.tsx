// Modal to complete drying operations and validate criteria
// File: src/features/drying/components/CompleteDryingModal.tsx

import React, { useState } from "react";
import { CheckCircle2, DollarSign, Layers, Scale, AlertTriangle } from "lucide-react";
import { DryingCalculationEngine } from "../domain/calculationEngine.ts";

interface CompleteDryingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (outputWeight: number, outputMoisture: number, runHours: number) => void;
  initialWeight: number;
  initialMoisture: number;
}

export const CompleteDryingModal: React.FC<CompleteDryingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialWeight,
  initialMoisture
}) => {
  const [hours, setHours] = useState("16");
  const [moisture, setMoisture] = useState("14.0");
  const [weight, setWeight] = useState("");

  if (!isOpen) return null;

  const runHoursVal = parseFloat(hours) || 0;
  const finalMoistureVal = parseFloat(moisture) || 0;
  const finalWeightVal = parseFloat(weight) || 0;

  const costs = DryingCalculationEngine.calculateOperationCosts(runHoursVal);
  const lossKg = initialWeight - finalWeightVal;

  // Validation Rules check
  const isMoistureOut = finalMoistureVal < 13.0 || finalMoistureVal > 15.5;
  const isDataMissing = !weight.trim() || !hours.trim() || finalWeightVal <= 0 || runHoursVal <= 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 max-w-md w-full space-y-4 shadow-xl">
        <div className="text-center space-y-1">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-black text-gray-800 tracking-tight">Hoàn tất mẻ sấy lúa & Nhập kho Silo</h3>
          <p className="text-xs text-gray-400 font-bold">Hãy nhập các thông số thực tế để chạy định khoản giá thành</p>
        </div>

        {/* WARNING PANEL FOR MOISTURE */}
        {isMoistureOut && finalMoistureVal > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[10px] font-bold flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>CẢNH BÁO: Độ ẩm hạt lúa (${finalMoistureVal}%) nằm ngoài tầm ẩm kho chuẩn sấy (13.0% - 15.5%). Hạt lúa sấy quá ẩm dễ hư hỏng, quá khô dễ vụn vỡ.</span>
          </div>
        )}

        <div className="space-y-3.5 text-xs font-bold text-gray-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">Độ ẩm cuối đo lò (%)</label>
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-extrabold focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">Sản lượng khô ra lò (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ví dụ: 20800"
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-extrabold focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 font-bold mb-1 uppercase">Số giờ chạy sấy lò thực tế</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* DRAFT REVIEW SUMMARY */}
          {finalWeightVal > 0 && (
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-2 text-[10px] font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Hao hụt bốc hơi ẩm:</span>
                <span className="font-extrabold text-red-600">-{lossKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng chi phí vận hành lò:</span>
                <span className="font-extrabold text-primary">{costs.totalCost.toLocaleString()} đ</span>
              </div>
            </div>
          )}
        </div>

        {/* BUTTON ACTIONS */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50"
          >
            HỦY BỎ
          </button>
          <button
            type="button"
            disabled={isDataMissing}
            onClick={() => onConfirm(finalWeightVal, finalMoistureVal, runHoursVal)}
            className={`h-11 font-bold text-xs rounded-xl shadow transition ${isDataMissing ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-dark"}`}
          >
            {isDataMissing ? "THIẾU SỐ LIỆU" : "HOÀN TẤT & KẾT CHUYỂN"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CompleteDryingModal;
