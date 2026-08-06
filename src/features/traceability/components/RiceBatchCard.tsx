// Rice Batch traceability detailed information card
// File: src/features/traceability/components/RiceBatchCard.tsx

import React from "react";
import { RiceTraceBatch } from "../domain/types.ts";
import { ShieldCheck, Tag, Info, ArrowRight } from "lucide-react";

interface RiceBatchCardProps {
  batch: RiceTraceBatch;
  farmerName: string;
}

export const RiceBatchCard: React.FC<RiceBatchCardProps> = ({ batch, farmerName }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4 max-w-sm w-full">
      <div className="flex justify-between items-start border-b border-gray-50 pb-3">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Mã lô lúa</span>
          <span className="text-xs font-black text-gray-800 tracking-tight">{batch.batchCode}</span>
        </div>
        <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase ${
          batch.qualityGrade === "A" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
        }`}>
          Cấp Hạt: {batch.qualityGrade}
        </span>
      </div>

      <div className="space-y-2 text-xs font-bold text-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-400 font-normal">Hộ nông dân:</span>
          <span>{farmerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-normal">Giống lúa hạt:</span>
          <span>{batch.riceVariety}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-normal">Sản lượng quy đổi:</span>
          <span className="flex items-center space-x-1">
            <span>{batch.freshWeightKg.toLocaleString()} kg (tươi)</span>
            {batch.dryWeightKg !== undefined && batch.dryWeightKg > 0 && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-emerald-700">{batch.dryWeightKg.toLocaleString()} kg (khô)</span>
              </>
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-normal">Ẩm độ gặt ruộng:</span>
          <span className="text-amber-600">{batch.moistureInput}%</span>
        </div>
        {batch.siloId && (
          <div className="flex justify-between">
            <span className="text-gray-400 font-normal">Silo lưu chứa:</span>
            <span className="text-primary uppercase">{batch.siloId === "silo-001" ? "Silo sấy A" : "Silo sấy B"}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-50 flex items-center space-x-1.5 text-[10px] text-gray-400 font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Nguồn gốc đã được kiểm chứng an toàn HTX Hòa Tiến 2</span>
      </div>
    </div>
  );
};
export default RiceBatchCard;
