// Dashboard Module fulfilling exact user specification
// File: src/features/modules/DashboardModule.tsx

import React from "react";
import { LocalReceipt, LocalVariety, LocalOfficer, LocalTruck } from "../../db/index.ts";
import { Scale, Package, Droplets, Flame, Truck, User, BarChart2 } from "lucide-react";

interface DashboardModuleProps {
  receipts: LocalReceipt[];
  varieties: LocalVariety[];
  officers: LocalOfficer[];
  trucks: LocalTruck[];
  currentUser: {
    id: string;
    full_name: string;
    role: string;
  };
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  receipts,
  varieties,
  officers,
  trucks,
  currentUser
}) => {
  // 1. Phân quyền dữ liệu: Admin xem được tổng, Cán bộ cân chỉ xem số liệu phiên cân của chính mình
  const filteredReceipts = currentUser.role === "admin" 
    ? receipts 
    : receipts.filter(r => r.officer_id === currentUser.id || r.officer_name === currentUser.full_name);

  // 2. Tính toán các thống kê cốt lõi
  const totalSessions = filteredReceipts.length;
  const totalBags = filteredReceipts.reduce((sum, r) => sum + (r.total_bags || 0), 0);
  const totalFreshKg = filteredReceipts.reduce((sum, r) => sum + (r.total_fresh_kg || 0), 0);
  const totalDryKg = filteredReceipts.reduce((sum, r) => sum + (r.total_dry_kg || 0), 0);
  const totalRevenue = filteredReceipts.reduce((sum, r) => sum + (r.total_amount || 0), 0);

  // 3. Thống kê sản lượng theo từng xe cân
  const truckStats = trucks.map(truck => {
    const truckReceipts = filteredReceipts.filter(r => r.truck_plate === truck.plate_number || r.truck_id === truck.id);
    const freshKg = truckReceipts.reduce((sum, r) => sum + r.total_fresh_kg, 0);
    const bags = truckReceipts.reduce((sum, r) => sum + r.total_bags, 0);
    return {
      plate: truck.plate_number,
      driver: truck.driver_name,
      freshKg,
      bags,
      count: truckReceipts.length
    };
  });

  // 4. Thống kê sản lượng theo từng loại giống lúa (HG12, HG244, HT1, ĐT100, J02)
  const varietyCodes = ["HG12", "HG244", "HT1", "ĐT100", "J02"];
  const varietyStats = varietyCodes.map(code => {
    const vReceipts = filteredReceipts.filter(r => r.variety_code === code);
    const freshKg = vReceipts.reduce((sum, r) => sum + r.total_fresh_kg, 0);
    const dryKg = vReceipts.reduce((sum, r) => sum + r.total_dry_kg, 0);
    const bags = vReceipts.reduce((sum, r) => sum + r.total_bags, 0);
    const revenue = vReceipts.reduce((sum, r) => sum + r.total_amount, 0);
    return { code, freshKg, dryKg, bags, revenue, count: vReceipts.length };
  });

  return (
    <div className="space-y-6">
      {/* CẢNH BÁO QUYỀN VIEW PHẠM VI DỮ LIỆU */}
      <div className="bg-slate-800 text-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-card">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📊 Bảng Điều Khiển Tổng Quan Phiên Cân</span>
            {currentUser.role === "admin" ? (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                Quyền Admin (Tổng tất cả cán bộ)
              </span>
            ) : (
              <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                Số liệu của Cán bộ: {currentUser.full_name}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Cập nhật tức thời số liệu lúa tươi, lúa khô, số bao và doanh thu</p>
        </div>
      </div>

      {/* 1. THẺ THỐNG KÊ KPIS CHÍNH (4 CARD HÀNG ĐẦU) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã Cân</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{totalSessions} <span className="text-sm font-semibold text-slate-400">phiên</span></p>
          </div>
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số Bao Lúa</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{totalBags.toLocaleString()} <span className="text-sm font-semibold text-slate-400">bao</span></p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sản Lượng Tươi</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{(totalFreshKg / 1000).toFixed(2)} <span className="text-sm font-semibold text-slate-400">Tấn</span></p>
            <p className="text-[11px] text-slate-400">{totalFreshKg.toLocaleString()} kg</p>
          </div>
          <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sản Lượng Khô</p>
            <p className="text-3xl font-black text-emerald-700 mt-1">{(totalDryKg / 1000).toFixed(2)} <span className="text-sm font-semibold text-slate-400">Tấn</span></p>
            <p className="text-[11px] text-slate-400">{totalDryKg.toLocaleString()} kg (Doanh thu: {totalRevenue.toLocaleString()} đ)</p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. SẢN LƯỢNG TỪNG LOẠI GIỐNG LÚA (HG12, HG244, HT1, ĐT100, J02) */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-emerald-600" />
          <span>Sản Lượng Theo Từng Loại Giống Lúa (HG12, HG244, HT1, ĐT100, J02)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {varietyStats.map(stat => (
            <div key={stat.code} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <span className="text-xs font-black bg-emerald-600 text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
                {stat.code}
              </span>
              <p className="text-xl font-bold text-slate-800 mt-3">{stat.freshKg.toLocaleString()} <span className="text-xs text-slate-500">kg tươi</span></p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Khô: {stat.dryKg.toLocaleString()} kg</p>
              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
                <span>{stat.bags} bao</span>
                <span>{stat.count} lượt</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CHI TIẾT SẢN LƯỢNG TỪNG XE CÂN VÀ CÁN BỘ CÂN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* XE CÂN (SẢN LƯỢNG TỪNG XE) */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-blue-600" />
            <span>Sản Lượng Theo Từng Xe Cân</span>
          </h3>

          <div className="space-y-3">
            {truckStats.map(t => (
              <div key={t.plate} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs">
                    🚚
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t.plate}</p>
                    <p className="text-xs text-slate-500">Tài xế: {t.driver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-blue-700">{t.freshKg.toLocaleString()} kg</p>
                  <p className="text-xs text-slate-500">{t.bags} bao ({t.count} chuyến)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CÁN BỘ CÂN */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-purple-600" />
            <span>Cán Bộ Cân Vận Hành</span>
          </h3>

          <div className="space-y-3">
            {officers.map(o => {
              const oReceipts = filteredReceipts.filter(r => r.officer_id === o.id || r.officer_name === o.full_name);
              const oKg = oReceipts.reduce((sum, r) => sum + r.total_fresh_kg, 0);
              return (
                <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold text-xs">
                      ✍️
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{o.full_name}</p>
                      <p className="text-xs text-slate-500">SĐT: {o.phone_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-purple-700">{oKg.toLocaleString()} kg tươi</p>
                    <p className="text-xs text-slate-500">{oReceipts.length} phiên cân</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardModule;
