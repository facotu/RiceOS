// Electronic operating batch card matching HTX paper record
// File: src/features/drying/components/DryingBatchCard.tsx

import React from "react";
import { FileText, Cpu, Scale, Thermometer } from "lucide-react";

interface DryingBatchCardProps {
  orderCode: string;
  varietyName: string;
  dryerName: string;
  inputWeight: number;
  inputMoisture: number;
  startTime: string;
  operatorName: string;
  outputWeight?: number;
  outputMoisture?: number;
  cost?: number;
}

export const DryingBatchCard: React.FC<DryingBatchCardProps> = ({
  orderCode,
  varietyName,
  dryerName,
  inputWeight,
  inputMoisture,
  startTime,
  operatorName,
  outputWeight,
  outputMoisture,
  cost
}) => {
  const lossKg = outputWeight ? inputWeight - outputWeight : undefined;

  return (
    <div className="bg-amber-50/60 border border-amber-200/60 p-5 rounded-2xl space-y-4 max-w-sm w-full font-mono text-gray-800 text-xs shadow-sm relative overflow-hidden">
      {/* MOCK PAPER EDGE */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200"></div>

      <div className="text-center border-b border-dashed border-amber-300/60 pb-3">
        <span className="block text-sm font-black tracking-widest text-amber-800 flex items-center justify-center space-x-1.5">
          <FileText className="w-4 h-4" />
          <span>PHIẾU SẤY LÚA ĐIỆN TỬ</span>
        </span>
        <span className="text-[10px] font-bold text-gray-500 mt-1 block">Mã mẻ: {orderCode}</span>
      </div>

      {/* BODY INFO */}
      <div className="space-y-2 text-[11px] font-semibold text-gray-700">
        <div className="flex justify-between">
          <span>Giống lúa:</span>
          <span className="font-extrabold text-gray-900">{varietyName}</span>
        </div>
        <div className="flex justify-between">
          <span>Lò sấy:</span>
          <span className="font-extrabold text-gray-900">{dryerName}</span>
        </div>
        <div className="flex justify-between">
          <span>Khối lượng đầu vào:</span>
          <span className="font-extrabold text-gray-900">{inputWeight.toLocaleString()} kg</span>
        </div>
        <div className="flex justify-between">
          <span>Ẩm độ đầu:</span>
          <span className="font-extrabold text-amber-700">{inputMoisture}%</span>
        </div>
        <div className="flex justify-between">
          <span>Thời gian bắt đầu:</span>
          <span className="font-extrabold text-gray-900">{startTime}</span>
        </div>
        <div className="flex justify-between">
          <span>Người vận hành:</span>
          <span className="font-extrabold text-gray-900">{operatorName}</span>
        </div>
      </div>

      {/* RESULTS SECT */}
      {outputWeight !== undefined && (
        <div className="border-t border-dashed border-amber-300/60 pt-3 space-y-2 text-[11px]">
          <span className="block text-center font-black text-amber-800 tracking-wider">KẾT QUẢ SẤY LÒ</span>
          
          <div className="space-y-1.5 font-semibold text-gray-700">
            <div className="flex justify-between">
              <span>Khối lượng sau sấy:</span>
              <span className="font-extrabold text-emerald-700">{outputWeight.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between">
              <span>Ẩm độ cuối:</span>
              <span className="font-extrabold text-emerald-700">{outputMoisture}%</span>
            </div>
            {lossKg !== undefined && (
              <div className="flex justify-between">
                <span>Hao hụt bốc hơi:</span>
                <span className="font-extrabold text-red-600">-{lossKg.toLocaleString()} kg</span>
              </div>
            )}
            {cost !== undefined && (
              <div className="flex justify-between border-t border-amber-200/30 pt-1.5">
                <span>Chi phí sấy lò:</span>
                <span className="font-black text-primary">{cost.toLocaleString()} VNĐ</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default DryingBatchCard;
