'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  BarChart3,
  Calendar,
  Wheat,
  Users,
  Package,
  TrendingUp,
  Coins,
  Truck,
  UserCheck,
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function ReportsPage() {
  const { sessions, farmers, staffMembers, trucks, varieties } = useApp();

  const [displayOption, setDisplayOption] = useState<'all' | 'date' | 'variety'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-12');
  const [selectedVarietyId, setSelectedVarietyId] = useState<string>('all');

  // Filter sessions based on display option
  const reportSessions = sessions.filter(s => {
    if (displayOption === 'date') {
      return s.started_at.startsWith(selectedDate);
    }
    if (displayOption === 'variety') {
      return selectedVarietyId === 'all' || s.variety_id === selectedVarietyId;
    }
    return true;
  });

  // Calculate 8 Required Metrics:
  // 1. Tổng số hộ cân (Unique farmers count)
  const uniqueFarmerIds = Array.from(new Set(reportSessions.map(s => s.farmer_id)));
  const totalFarmersCount = uniqueFarmerIds.length;

  // 2. Tổng số bao
  const totalBags = reportSessions.reduce((sum, s) => sum + s.total_bags, 0);

  // 3. Tổng sản lượng tươi
  const totalFreshWeight = reportSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);

  // 4. Tổng sản lượng khô
  const totalDryWeight = reportSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);

  // 5. Doanh thu (Tổng thành tiền)
  const totalRevenue = reportSessions.reduce((sum, s) => sum + s.total_amount, 0);

  // 6. Giống lúa Breakdown
  const varietyBreakdown: Record<string, { name: string; dry: number; bags: number; amount: number }> = {};
  reportSessions.forEach(s => {
    const vName = s.variety?.name || 'Chưa rõ';
    if (!varietyBreakdown[vName]) {
      varietyBreakdown[vName] = { name: vName, dry: 0, bags: 0, amount: 0 };
    }
    varietyBreakdown[vName].dry += s.total_dry_weight;
    varietyBreakdown[vName].bags += s.total_bags;
    varietyBreakdown[vName].amount += s.total_amount;
  });
  const varietyDataList = Object.values(varietyBreakdown);

  // 7. Cán bộ cân Breakdown
  const staffBreakdown: Record<string, { name: string; count: number; fresh: number; dry: number }> = {};
  reportSessions.forEach(s => {
    const stName = s.staff?.full_name || 'Cán bộ';
    if (!staffBreakdown[stName]) {
      staffBreakdown[stName] = { name: stName, count: 0, fresh: 0, dry: 0 };
    }
    staffBreakdown[stName].count += 1;
    staffBreakdown[stName].fresh += s.total_fresh_weight;
    staffBreakdown[stName].dry += s.total_dry_weight;
  });
  const staffDataList = Object.values(staffBreakdown);

  // 8. Xe nhận Breakdown
  const truckBreakdown: Record<string, { plate: string; driver: string; fresh: number; bags: number }> = {};
  reportSessions.forEach(s => {
    const plate = s.truck?.license_plate || 'Chưa gán xe';
    const driver = s.truck?.driver_name || 'Tài xế';
    if (!truckBreakdown[plate]) {
      truckBreakdown[plate] = { plate, driver, fresh: 0, bags: 0 };
    }
    truckBreakdown[plate].fresh += s.total_fresh_weight;
    truckBreakdown[plate].bags += s.total_bags;
  });
  const truckDataList = Object.values(truckBreakdown);

  const COLORS = ['#22c55e', '#facc15', '#3b82f6', '#ec4899', '#8b5cf6'];

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "MaPhien,ChuLua,GiongLua,SoBao,SanLuongTuoi,SanLuongKho,DonGia,ThanhTien\n";
    reportSessions.forEach(s => {
      csvContent += `${s.session_code},"${s.farmer?.name}","${s.variety?.name}",${s.total_bags},${s.total_fresh_weight},${s.total_dry_weight},${s.unit_price},${s.total_amount}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BaoCao_RiceOS_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
            Báo Cáo Tổng Hợp Vụ Mùa
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gold-400" />
            Báo Cáo & Thống Kê Chi Tiết
          </h1>
          <p className="text-xs text-slate-300">
            Tùy chọn hiển thị: Tất cả, Theo ngày và theo Giống lúa • Xuất dữ liệu Excel/CSV
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg"
        >
          <Download className="w-4 h-4" /> Xuất File CSV / Excel
        </button>
      </div>

      {/* Display Options Filter Bar (Tất cả, Theo ngày, Theo giống lúa) */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setDisplayOption('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              displayOption === 'all'
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                : 'bg-emerald-950/60 border-emerald-900 text-slate-400 hover:text-white'
            }`}
          >
            Tất Cả Số Liệu
          </button>

          <button
            onClick={() => setDisplayOption('date')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
              displayOption === 'date'
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                : 'bg-emerald-950/60 border-emerald-900 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Theo Ngày
          </button>

          <button
            onClick={() => setDisplayOption('variety')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
              displayOption === 'variety'
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg'
                : 'bg-emerald-950/60 border-emerald-900 text-slate-400 hover:text-white'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" /> Theo Giống Lúa
          </button>
        </div>

        {/* Option specific selectors */}
        {displayOption === 'date' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-300 font-semibold">Chọn ngày:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="p-2 bg-emerald-950 border border-emerald-700 rounded-xl text-white text-xs font-bold"
            />
          </div>
        )}

        {displayOption === 'variety' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-300 font-semibold">Chọn giống:</span>
            <select
              value={selectedVarietyId}
              onChange={e => setSelectedVarietyId(e.target.value)}
              className="p-2 bg-emerald-950 border border-emerald-700 rounded-xl text-white text-xs font-bold"
            >
              <option value="all">Tất cả giống lúa</option>
              {varieties.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* 8 Required Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* 1. Tổng số hộ cân */}
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 block">1. Tổng Số Hộ Cân</span>
          <p className="text-2xl font-black text-white mt-1">
            {totalFarmersCount} <span className="text-xs font-medium text-emerald-400">hộ dân</span>
          </p>
        </div>

        {/* 2. Tổng số bao */}
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 block">2. Tổng Số Bao Lúa</span>
          <p className="text-2xl font-black text-purple-300 mt-1">
            {totalBags.toLocaleString('vi-VN')} <span className="text-xs font-medium text-purple-400">bao</span>
          </p>
        </div>

        {/* 3. Tổng sản lượng tươi */}
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 block">3. Tổng Sản Lượng Tươi</span>
          <p className="text-2xl font-black text-blue-300 mt-1">
            {totalFreshWeight.toLocaleString('vi-VN')} <span className="text-xs font-medium text-blue-400">kg</span>
          </p>
        </div>

        {/* 4. Tổng sản lượng khô */}
        <div className="glass-card-gold p-4 rounded-xl">
          <span className="text-xs font-semibold text-gold-300 block">4. Tổng Sản Lượng Khô</span>
          <p className="text-2xl font-black text-gold-300 mt-1">
            {totalDryWeight.toLocaleString('vi-VN')} <span className="text-xs font-medium text-gold-400">kg</span>
          </p>
        </div>

        {/* 5. Giống lúa */}
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 block">5. Số Loại Giống Lúa</span>
          <p className="text-2xl font-black text-rose-400 mt-1">
            {varietyDataList.length} <span className="text-xs font-medium text-rose-300">chủng loại</span>
          </p>
        </div>

        {/* 6. Doanh thu */}
        <div className="glass-card-gold p-4 rounded-xl">
          <span className="text-xs font-semibold text-gold-300 block">6. Tổng Doanh Thu (Giá Mua)</span>
          <p className="text-xl font-black text-gold-300 mt-1">
            {totalRevenue.toLocaleString('vi-VN')} <span className="text-xs font-medium text-gold-400">đ</span>
          </p>
        </div>

        {/* 7. Cán bộ cân */}
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 block">7. Cán Bộ Cân Phụ Trách</span>
          <p className="text-2xl font-black text-teal-300 mt-1">
            {staffDataList.length} <span className="text-xs font-medium text-teal-400">cán bộ</span>
          </p>
        </div>

        {/* 8. Xe nhận */}
        <div className="glass-card p-4 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 block">8. Xe Nhận Vận Chuyển</span>
          <p className="text-2xl font-black text-amber-300 mt-1">
            {truckDataList.length} <span className="text-xs font-medium text-amber-400">xe</span>
          </p>
        </div>

      </div>

      {/* Detailed Tables Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Breakdown by Rice Variety */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-emerald-800/40 pb-2">
            <Wheat className="w-4 h-4 text-gold-400" /> Báo Cáo Theo Giống Lúa
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Giống lúa</th>
                  <th className="p-2.5 text-right">Số bao</th>
                  <th className="p-2.5 text-right">Sản lượng khô</th>
                  <th className="p-2.5 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40">
                {varietyDataList.map((v, i) => (
                  <tr key={i} className="hover:bg-emerald-900/30">
                    <td className="p-2.5 font-bold text-white">{v.name}</td>
                    <td className="p-2.5 text-right font-bold text-purple-300">{v.bags} bao</td>
                    <td className="p-2.5 text-right font-extrabold text-gold-400">{v.dry.toLocaleString('vi-VN')} kg</td>
                    <td className="p-2.5 text-right font-extrabold text-emerald-300">{v.amount.toLocaleString('vi-VN')} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown by Staff & Trucks */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-emerald-800/40 pb-2">
            <UserCheck className="w-4 h-4 text-teal-400" /> Báo Cáo Theo Cán Bộ Cân & Xe Nhận
          </h3>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase">1. Theo Cán bộ cân:</p>
            <div className="space-y-2">
              {staffDataList.map((st, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{st.name} ({st.count} phiên)</span>
                  <span className="font-extrabold text-emerald-400">{st.dry.toLocaleString('vi-VN')} kg khô</span>
                </div>
              ))}
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase pt-2">2. Theo Xe nhận vận chuyển:</p>
            <div className="space-y-2">
              {truckDataList.map((tk, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 flex justify-between items-center text-xs">
                  <span className="font-semibold text-amber-300">{tk.plate} (Tài xế: {tk.driver})</span>
                  <span className="font-extrabold text-gold-300">{tk.fresh.toLocaleString('vi-VN')} kg tươi ({tk.bags} bao)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
