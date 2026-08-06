// Settings Module fulfilling exact user specification
// File: src/features/modules/SettingsModule.tsx

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Sliders, MapPin, DollarSign } from "lucide-react";
import { db } from "../../db/index.ts";

interface SettingsModuleProps {
  tareType: 'kg' | 'percent';
  setTareType: (type: 'kg' | 'percent') => void;
  defaultTareValue: number;
  setDefaultTareValue: (val: number) => void;
  varieties: any[];
  refreshData: () => Promise<void>;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  tareType,
  setTareType,
  defaultTareValue,
  setDefaultTareValue,
  varieties,
  refreshData
}) => {
  const [locationsText, setLocationsText] = useState("Xứ đồng Đồng Hát\nXứ đồng Bàu Tròn\nXứ đồng Cánh Mẫu\nXứ đồng Đồng Tranh");
  const [plotsText, setPlotsText] = useState("Lô A1\nLô A2\nLô B1\nLô B2\nLô C1\nLô C2");
  const [isSaved, setIsSaved] = useState(false);

  // Đơn giá cho từng loại giống lúa
  const [prices, setPrices] = useState<Record<string, number>>({
    "HG12": 7200,
    "HG244": 7500,
    "HT1": 7800,
    "ĐT100": 8000,
    "J02": 8500
  });

  const handlePriceChange = (code: string, val: string) => {
    setPrices({ ...prices, [code]: parseFloat(val) || 0 });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Cập nhật đơn giá vào DB
    for (const v of varieties) {
      if (prices[v.code]) {
        await db.rice_varieties.update(v.id, { unit_price: prices[v.code] });
      }
    }

    // 2. Lưu cài đặt hệ thống
    await db.settings.put({
      id: "global-settings",
      tare_type: tareType,
      default_tare_value: defaultTareValue,
      field_locations: locationsText.split("\n").filter(Boolean),
      plots: plotsText.split("\n").filter(Boolean),
      unit_prices: prices
    });

    await refreshData();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-600" />
          <span>Cấu Hình & Cài Đặt Hệ Thống Thu Mua</span>
        </h2>
        <p className="text-xs text-slate-500">Cài đặt công thức trừ bì, đơn giá giống lúa, xứ đồng và danh mục lô ruộng</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* 1. CÀI ĐẶT SỐ LIỆU TRỪ BÌ (KG HOẶC %) */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <span>1. Cài Đặt Công Thức Trừ Bì</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Loại trừ bì mặc định:</label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setTareType('percent')}
                  className={`flex-1 py-3 font-bold rounded-xl text-sm transition ${tareType === 'percent' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700'}`}
                >
                  Trừ bì theo % (Phần trăm)
                </button>
                <button
                  type="button"
                  onClick={() => setTareType('kg')}
                  className={`flex-1 py-3 font-bold rounded-xl text-sm transition ${tareType === 'kg' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700'}`}
                >
                  Trừ bì theo Kg (Trọng lượng)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Giá trị trừ bì mặc định ({tareType === 'percent' ? '%' : 'Kg'}):</label>
              <input 
                type="number"
                step="0.1"
                value={defaultTareValue}
                onChange={(e) => setDefaultTareValue(parseFloat(e.target.value) || 0)}
                className="w-full h-12 px-4 border border-slate-300 rounded-xl font-bold text-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 2. CÀI ĐẶT ĐƠN GIÁ TỪNG GIỐNG LÚA (HG12, HG244, HT1, ĐT100, J02) */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <span>2. Cài Đặt Đơn Giá Thu Mua Giống Lúa (Đồng/Kg)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {["HG12", "HG244", "HT1", "ĐT100", "J02"].map(code => (
              <div key={code} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-black text-emerald-700 uppercase mb-1">Lúa giống {code}</label>
                <input 
                  type="number"
                  value={prices[code] || 8000}
                  onChange={(e) => handlePriceChange(code, e.target.value)}
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3 & 4. CÀI ĐẶT XỨ ĐỒNG VÀ LÔ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CÀI ĐẶT XỨ ĐỒNG */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <span>3. Cài Đặt Danh Mục Xứ Đồng</span>
            </h3>
            <textarea 
              rows={4}
              value={locationsText}
              onChange={(e) => setLocationsText(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-sm font-semibold"
              placeholder="Nhập danh sách xứ đồng (Mỗi tên 1 dòng)"
            />
          </div>

          {/* CÀI ĐẶT LÔ RUỘNG */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>4. Cài Đặt Danh Mục Lô Ruộng</span>
            </h3>
            <textarea 
              rows={4}
              value={plotsText}
              onChange={(e) => setPlotsText(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-sm font-semibold"
              placeholder="Nhập danh sách lô ruộng (Mỗi lô 1 dòng)"
            />
          </div>

        </div>

        {/* NÚT LƯU CẤU HÌNH */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg text-base flex items-center space-x-2 transition"
          >
            <Save className="w-5 h-5" />
            <span>LƯU CÀI ĐẶT HỆ THỐNG</span>
          </button>
        </div>

        {isSaved && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-center space-x-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Đã lưu thành công toàn bộ cài đặt đơn giá, trừ bì và danh mục xứ đồng!</span>
          </div>
        )}

      </form>
    </div>
  );
};
export default SettingsModule;
