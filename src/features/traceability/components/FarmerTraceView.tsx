// Interface allowing operators or directors to query rice journey by farmer
// File: src/features/traceability/components/FarmerTraceView.tsx

import React, { useState, useEffect } from "react";
import useTraceability from "../hooks/useTraceability.ts";
import TraceabilityTimeline from "./TraceabilityTimeline.tsx";
import RiceBatchCard from "./RiceBatchCard.tsx";
import { Search, MapPin, Sparkles } from "lucide-react";
import { db } from "../../../db/index.ts";

export const FarmerTraceView: React.FC = () => {
  const { batches, isLoading, error } = useTraceability();
  const [searchTerm, setSearchTerm] = useState("");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  useEffect(() => {
    const loadFarmers = async () => {
      const list = await db.table("farmers").toArray();
      setFarmers(list);
    };
    loadFarmers();
  }, []);

  const getFarmerName = (fId: string) => {
    const f = farmers.find(item => item.id === fId);
    return f ? f.full_name : "Hộ Nông Dân Hòa Tiến";
  };

  const filteredBatches = batches.filter(b => {
    const fName = getFarmerName(b.farmerId).toLowerCase();
    const code = b.batchCode.toLowerCase();
    const variety = b.riceVariety.toLowerCase();
    const query = searchTerm.toLowerCase();
    return fName.includes(query) || code.includes(query) || variety.includes(query);
  });

  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-base font-black text-gray-800 tracking-tight flex items-center space-x-1.5">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>Tra cứu Nguồn gốc Lô lúa</span>
          </h3>
          <p className="text-xs text-gray-400 font-semibold">Hành trình truy xuất từ ruộng gặt của nông dân Hòa Tiến đến Silo bảo quản</p>
        </div>
      </div>

      {/* SEARCH AND MAIN DUAL COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: BATCH LIST */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Nhập tên nông dân, giống lúa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredBatches.length === 0 ? (
              <p className="text-xs text-gray-400 font-bold text-center py-8">Không có lô lúa nào khớp từ khóa.</p>
            ) : (
              filteredBatches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`w-full p-4 rounded-xl border text-left transition space-y-1.5 ${
                    selectedBatchId === b.id ? "border-primary bg-primary/5 shadow-sm" : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-extrabold text-gray-800">
                    <span className="truncate max-w-[150px]">{b.batchCode}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 uppercase">{b.status}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                    <span>Nông dân: {getFarmerName(b.farmerId)}</span>
                    <span className="text-primary font-bold">{b.riceVariety}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL TIMELINE & CARD */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBatch ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <RiceBatchCard
                  batch={selectedBatch}
                  farmerName={getFarmerName(selectedBatch.farmerId)}
                />
              </div>

              <div>
                <TraceabilityTimeline currentStatus={selectedBatch.status} />
              </div>
            </div>
          ) : (
            <div className="h-72 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
              <MapPin className="w-8 h-8 text-gray-300" />
              <div>
                <p className="text-xs font-bold">Hãy chọn một lô lúa để truy xuất nguồn gốc</p>
                <p className="text-[10px] mt-0.5">Hiển thị lịch sử quy đổi sinh khối lượng và vị trí silo bảo quản</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FarmerTraceView;
