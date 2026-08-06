// History Module fulfilling exact user specification
// File: src/features/modules/HistoryModule.tsx

import React, { useState } from "react";
import { LocalReceipt, LocalFarmer } from "../../db/index.ts";
import { History, Search, Filter, Calendar, Scale, DollarSign } from "lucide-react";

interface HistoryModuleProps {
  receipts: LocalReceipt[];
  farmers: LocalFarmer[];
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({ receipts, farmers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmerName, setSelectedFarmerName] = useState("ALL");
  const [selectedVarietyCode, setSelectedVarietyCode] = useState("ALL");

  // Lọc danh sách theo các tiêu chí tìm kiếm
  const filteredReceipts = receipts.filter(r => {
    const matchSearch = searchTerm === "" || 
      r.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.truck_plate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchFarmer = selectedFarmerName === "ALL" || r.farmer_name === selectedFarmerName;
    const matchVariety = selectedVarietyCode === "ALL" || r.variety_code === selectedVarietyCode;

    return matchSearch && matchFarmer && matchVariety;
  });

  // Tổng sản lượng tươi, sản lượng khô và doanh thu của danh sách sau khi lọc
  const totalFreshKg = filteredReceipts.reduce((sum, r) => sum + r.total_fresh_kg, 0);
  const totalDryKg = filteredReceipts.reduce((sum, r) => sum + r.total_dry_kg, 0);
  const totalRevenue = filteredReceipts.reduce((sum, r) => sum + r.total_amount, 0);

  return (
    <div className="space-y-6">
      {/* 1. KHỐI TÌM KIẾM VÀ BỘ LỌC */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-600" />
          <span>Tra Cứu Lịch Sử Phiên Cân Lúa</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Ô TÌM KIẾM */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input 
              type="text"
              placeholder="Tìm theo mã phiếu, tên chủ lúa, biển số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
            />
          </div>

          {/* LỌC CHỦ LÚA */}
          <div>
            <select
              value={selectedFarmerName}
              onChange={(e) => setSelectedFarmerName(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800"
            >
              <option value="ALL">-- Tất cả Chủ lúa --</option>
              {farmers.map(f => (
                <option key={f.id} value={f.full_name}>{f.full_name}</option>
              ))}
            </select>
          </div>

          {/* LỌC GIỐNG LÚA */}
          <div>
            <select
              value={selectedVarietyCode}
              onChange={(e) => setSelectedVarietyCode(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800"
            >
              <option value="ALL">-- Tất cả Giống lúa --</option>
              {["HG12", "HG244", "HT1", "ĐT100", "J02"].map(code => (
                <option key={code} value={code}>Lúa giống {code}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. TỔNG SẢN LƯỢNG VÀ DOANH THU CỦA KẾT QUẢ TÌM KIẾM */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Tổng Sản Lượng Tươi</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{totalFreshKg.toLocaleString()} kg</p>
          <p className="text-xs text-slate-400">{(totalFreshKg / 1000).toFixed(2)} Tấn</p>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Tổng Sản Lượng Khô</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{totalDryKg.toLocaleString()} kg</p>
          <p className="text-xs text-slate-400">{(totalDryKg / 1000).toFixed(2)} Tấn</p>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Tổng Doanh Thu Phí Mua</p>
          <p className="text-2xl font-black text-emerald-300 mt-1">{totalRevenue.toLocaleString()} ĐỒNG</p>
          <p className="text-xs text-slate-400">{filteredReceipts.length} bản ghi khớp</p>
        </div>
      </div>

      {/* 3. BẢNG HIỂN THỊ CHI TIẾT KẾT QUẢ */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold">
              <tr>
                <th className="p-3">Mã Phiếu</th>
                <th className="p-3">Ngày Giờ Cân</th>
                <th className="p-3">Chủ Lúa</th>
                <th className="p-3">Giống Lúa</th>
                <th className="p-3">Xe Cân</th>
                <th className="p-3">Lúa Tươi (Kg)</th>
                <th className="p-3">Lúa Khô (Kg)</th>
                <th className="p-3 text-right">Doanh Thu (Đồng)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">Không tìm thấy lịch sử phiên cân nào khớp với bộ lọc.</td>
                </tr>
              ) : (
                filteredReceipts.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{r.receipt_number}</td>
                    <td className="p-3 text-xs text-slate-500">{new Date(r.created_at).toLocaleString("vi-VN")}</td>
                    <td className="p-3 font-bold text-slate-800">{r.farmer_name}</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-bold">{r.variety_code}</span></td>
                    <td className="p-3 text-slate-700">{r.truck_plate}</td>
                    <td className="p-3 font-bold text-amber-600">{r.total_fresh_kg.toLocaleString()} kg</td>
                    <td className="p-3 font-bold text-emerald-700">{r.total_dry_kg.toLocaleString()} kg</td>
                    <td className="p-3 text-right font-black text-emerald-700">{r.total_amount.toLocaleString()} đ</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default HistoryModule;
