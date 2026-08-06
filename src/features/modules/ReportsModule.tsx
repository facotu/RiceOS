// Reports Module fulfilling exact user specification
// File: src/features/modules/ReportsModule.tsx

import React, { useState } from "react";
import { LocalReceipt, LocalFarmer, LocalOfficer, LocalTruck } from "../../db/index.ts";
import { BarChart3, Calendar, Filter, FileSpreadsheet, Printer } from "lucide-react";

interface ReportsModuleProps {
  receipts: LocalReceipt[];
  farmers: LocalFarmer[];
  officers: LocalOfficer[];
  trucks: LocalTruck[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  receipts,
  farmers,
  officers,
  trucks
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'date' | 'variety'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedVarietyCode, setSelectedVarietyCode] = useState<string>("J02");

  // Lọc dữ liệu báo cáo
  const filteredReceipts = receipts.filter(r => {
    if (filterMode === 'date') {
      return r.created_at.slice(0, 10) === selectedDate;
    }
    if (filterMode === 'variety') {
      return r.variety_code === selectedVarietyCode;
    }
    return true;
  });

  // 1. Tổng số hộ cân
  const uniqueFarmersCount = new Set(filteredReceipts.map(r => r.farmer_id || r.farmer_name)).size;
  // 2. Tổng số bao
  const totalBags = filteredReceipts.reduce((sum, r) => sum + r.total_bags, 0);
  // 3. Tổng sản lượng tươi
  const totalFreshKg = filteredReceipts.reduce((sum, r) => sum + r.total_fresh_kg, 0);
  // 4. Tổng sản lượng khô
  const totalDryKg = filteredReceipts.reduce((sum, r) => sum + r.total_dry_kg, 0);
  // 5. Doanh thu
  const totalRevenue = filteredReceipts.reduce((sum, r) => sum + r.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* 1. KHỐI TÙY CHỌN HIỂN THỊ (TẤT CẢ, THEO NGÀY, THEO GIỐNG LÚA) */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Báo Cáo Tổng Hợp Thu Mua Lúa Gạo</span>
            </h2>
            <p className="text-xs text-slate-500">Tùy chọn hiển thị báo cáo Tất cả, Theo ngày hoặc Theo loại giống lúa</p>
          </div>

          {/* BỘ CHỌN CHẾ ĐỘ LỌC */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${filterMode === 'all' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600'}`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setFilterMode('date')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${filterMode === 'date' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600'}`}
            >
              Theo Ngày
            </button>
            <button
              onClick={() => setFilterMode('variety')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${filterMode === 'variety' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600'}`}
            >
              Theo Giống Lúa
            </button>
          </div>
        </div>

        {/* INPUT PHỤ THEO NĂM/NGÀY HOẶC GIỐNG LÚA */}
        {filterMode === 'date' && (
          <div className="flex items-center space-x-3 pt-2">
            <label className="text-xs font-bold text-slate-700">Chọn ngày báo cáo:</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
            />
          </div>
        )}

        {filterMode === 'variety' && (
          <div className="flex items-center space-x-3 pt-2">
            <label className="text-xs font-bold text-slate-700">Chọn loại giống lúa:</label>
            <select
              value={selectedVarietyCode}
              onChange={(e) => setSelectedVarietyCode(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
            >
              {["HG12", "HG244", "HT1", "ĐT100", "J02"].map(code => (
                <option key={code} value={code}>Lúa giống {code}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. CÁC TIÊU CHÍ BÁO CÁO CỐT LÕI (8 CHỈ SỐ) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">1. Tổng Số Hộ Cân</p>
          <p className="text-2xl font-black text-white mt-1">{uniqueFarmersCount} hộ</p>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">2. Tổng Số Bao Lúa</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{totalBags.toLocaleString()} bao</p>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">3. Sản Lượng Tươi</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{totalFreshKg.toLocaleString()} kg</p>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">4. Sản Lượng Khô</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{totalDryKg.toLocaleString()} kg</p>
        </div>
      </div>

      {/* 3. BẢNG CHI TIẾT DOANH THU, CÁN BỘ CÂN & XE NHẬN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DOANH THU THEO GIỐNG LÚA */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-3">
          <h3 className="text-base font-bold text-slate-800">5. Doanh Thu Theo Loại Giống Lúa</h3>

          <div className="space-y-2">
            {["HG12", "HG244", "HT1", "ĐT100", "J02"].map(code => {
              const vList = filteredReceipts.filter(r => r.variety_code === code);
              const vRevenue = vList.reduce((sum, r) => sum + r.total_amount, 0);
              const vDryKg = vList.reduce((sum, r) => sum + r.total_dry_kg, 0);
              return (
                <div key={code} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold text-xs">{code}</span>
                    <span className="text-xs text-slate-500 ml-2">({vDryKg.toLocaleString()} kg khô)</span>
                  </div>
                  <span className="font-black text-emerald-700 text-sm">{vRevenue.toLocaleString()} đ</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TỔNG DOANH THU & NÚT IN BÁO CÁO */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">6 & 7 & 8. Tổng Hợp Cán Bộ Cân & Xe Nhận</h3>
            <div className="mt-4 p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <p className="text-xs text-slate-400 uppercase font-bold">TỔNG DOANH THU TOÀN PHÂN HỆ</p>
              <p className="text-3xl font-black text-emerald-400">{totalRevenue.toLocaleString()} ĐỒNG</p>
              <p className="text-xs text-slate-300">
                Phục vụ bởi <strong>{officers.length} cán bộ cân</strong> và <strong>{trucks.length} xe nhận lúa</strong>
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={() => window.print()}
              className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow flex items-center justify-center space-x-2 transition"
            >
              <Printer className="w-5 h-5" />
              <span>IN BÁO CÁO TỔNG HỢP</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ReportsModule;
