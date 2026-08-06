import React, { useState } from "react";
import { Plus, Trash2, Calculator } from "lucide-react";

export interface WeighingItemEntry {
  item_sequence: number;
  gross_weight: number;
  tare_weight: number;
}

interface WeighingItemsProps {
  items: WeighingItemEntry[];
  onChange: (items: WeighingItemEntry[]) => void;
}

export default function WeighingItems({ items, onChange }: WeighingItemsProps) {
  const [grossInput, setGrossInput] = useState("");
  const [tareInput, setTareInput] = useState("2.0"); // Mặc định trừ bì bao/khay lúa 2.0 kg

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = parseFloat(grossInput);
    const tare = parseFloat(tareInput);

    if (isNaN(gross) || isNaN(tare) || gross <= 0 || tare < 0) return;

    const nextSeq = items.length + 1;
    const newItems = [...items, { item_sequence: nextSeq, gross_weight: gross, tare_weight: tare }];
    onChange(newItems);

    setGrossInput(""); // Xóa input để nhập nhanh mã tiếp theo
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      item_sequence: idx + 1 // Cập nhật lại số thứ tự
    }));
    onChange(updated);
  };

  // Tính tổng
  const totalBags = items.length;
  const totalGross = items.reduce((sum, item) => sum + item.gross_weight, 0);
  const totalTare = items.reduce((sum, item) => sum + item.tare_weight, 0);
  const totalNet = totalGross - totalTare;

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
      <h3 className="text-sm font-bold text-gray-700 flex items-center space-x-1.5 border-b border-gray-200 pb-2">
        <Calculator className="w-4 h-4 text-primary" />
        <span>Bảng cân bao lẻ chi tiết</span>
      </h3>

      {/* FORM NHẬP NHANH MÃ CÂN LẺ */}
      <form onSubmit={handleAddItem} className="grid grid-cols-3 gap-2 items-end">
        <div className="col-span-2">
          <label className="block text-[10px] font-bold text-gray-500 mb-1">CÂN TỔNG BAO (GROSS - KG)</label>
          <input
            type="number"
            value={grossInput}
            onChange={(e) => setGrossInput(e.target.value)}
            placeholder="Số kg bao lúa"
            className="w-full h-11 px-3 border border-gray-300 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1">TRỪ BÌ (KG)</label>
          <input
            type="number"
            value={tareInput}
            onChange={(e) => setTareInput(e.target.value)}
            step="0.1"
            className="w-full h-11 border border-gray-300 rounded-xl font-bold text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
            inputMode="decimal"
          />
        </div>
        <button
          type="submit"
          className="col-span-3 h-12 bg-primary hover:bg-primary-light text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM MÃ CÂN ({items.length + 1})</span>
        </button>
      </form>

      {/* THỐNG KÊ TỔNG HỢP CÂN LẺ */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-gray-100 text-center text-xs font-bold shadow-sm">
          <div>
            <span className="text-gray-400 block text-[9px] uppercase">Tổng số bao</span>
            <span className="text-sm text-gray-800">{totalBags} bao</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[9px] uppercase">Tổng trừ bì</span>
            <span className="text-sm text-gray-800">{totalTare.toFixed(1)} kg</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[9px] uppercase">Khối lượng tịnh</span>
            <span className="text-sm text-primary">{totalNet.toFixed(1)} kg</span>
          </div>
        </div>
      )}

      {/* DANH SÁCH MÃ ĐÃ CÂN */}
      {items.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 p-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs py-2 px-1">
              <span className="font-bold text-gray-400">Mã #{item.item_sequence}</span>
              <span className="font-bold text-gray-700">Gross: {item.gross_weight} kg | Bì: {item.tare_weight} kg</span>
              <span className="font-extrabold text-primary">Net: {(item.gross_weight - item.tare_weight).toFixed(1)} kg</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="h-8 w-8 text-red-500 hover:text-red-700 bg-red-50 rounded-lg flex items-center justify-center transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
