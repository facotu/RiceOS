'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Scale,
  Wheat,
  Truck,
  Users,
  Package,
  TrendingUp,
  Coins,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Calendar
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

export default function DashboardPage() {
  const { currentUser, sessions, staffMembers, trucks, varieties, isAdmin, isStaff } = useApp();

  // Filter sessions based on current logged in user role:
  // If Staff, display metrics belonging to that staff member. If Admin/Editor/Viewer, display all.
  const relevantSessions = !isAdmin
    ? sessions.filter(s => s.created_by === currentUser?.id || s.staff?.user_id === currentUser?.id || s.staff?.full_name.includes(currentUser?.full_name || ''))
    : sessions;

  // Aggregate Metrics
  const totalSessionsCount = relevantSessions.length;
  const totalFreshWeight = relevantSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
  const totalDryWeight = relevantSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
  const totalBags = relevantSessions.reduce((sum, s) => sum + s.total_bags, 0);
  const totalRevenue = relevantSessions.reduce((sum, s) => sum + s.total_amount, 0);

  // Group by Variety
  const varietyStatsMap: Record<string, { name: string; fresh: number; dry: number; bags: number; revenue: number }> = {};
  relevantSessions.forEach(s => {
    const varName = s.variety?.name || s.variety?.code || 'Khác';
    if (!varietyStatsMap[varName]) {
      varietyStatsMap[varName] = { name: varName, fresh: 0, dry: 0, bags: 0, revenue: 0 };
    }
    varietyStatsMap[varName].fresh += s.total_fresh_weight;
    varietyStatsMap[varName].dry += s.total_dry_weight;
    varietyStatsMap[varName].bags += s.total_bags;
    varietyStatsMap[varName].revenue += s.total_amount;
  });
  const varietyChartData = Object.values(varietyStatsMap);

  // Group by Truck
  const truckStatsMap: Record<string, { plate: string; driver: string; fresh: number; bags: number; sessionCount: number }> = {};
  relevantSessions.forEach(s => {
    const plate = s.truck?.license_plate || 'Chưa gán xe';
    const driver = s.truck?.driver_name || 'Tài xế';
    if (!truckStatsMap[plate]) {
      truckStatsMap[plate] = { plate, driver, fresh: 0, bags: 0, sessionCount: 0 };
    }
    truckStatsMap[plate].fresh += s.total_fresh_weight;
    truckStatsMap[plate].bags += s.total_bags;
    truckStatsMap[plate].sessionCount += 1;
  });
  const truckStatsList = Object.values(truckStatsMap);

  // Group by Staff (Admin view)
  const staffStatsMap: Record<string, { name: string; fresh: number; dry: number; bags: number; sessionCount: number }> = {};
  relevantSessions.forEach(s => {
    const staffName = s.staff?.full_name || 'Chưa rõ cán bộ';
    if (!staffStatsMap[staffName]) {
      staffStatsMap[staffName] = { name: staffName, fresh: 0, dry: 0, bags: 0, sessionCount: 0 };
    }
    staffStatsMap[staffName].fresh += s.total_fresh_weight;
    staffStatsMap[staffName].dry += s.total_dry_weight;
    staffStatsMap[staffName].bags += s.total_bags;
    staffStatsMap[staffName].sessionCount += 1;
  });
  const staffStatsList = Object.values(staffStatsMap);

  const COLORS = ['#22c55e', '#facc15', '#3b82f6', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6">

      {/* Header Greeting & Scope Alert */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Chế độ xem: {isAdmin ? 'Quản trị viên (Xem toàn bộ số liệu tổng)' : `Cán bộ cân (${currentUser?.full_name})`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Bảng Thống Kê Sản Lượng & Phiên Cân
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {isStaff
              ? 'Số liệu phiên cân do tài khoản của bạn trực tiếp thực hiện ngoài ruộng.'
              : 'Tổng quan toàn bộ hoạt động cân lúa, xe nhận, cán bộ cân và doanh thu vụ mùa.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/weighing"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:brightness-110 text-brand-dark font-extrabold text-sm shadow-xl shadow-gold-500/20 transition-all"
          >
            <Scale className="w-5 h-5" />
            Cân Lúa Ngay
          </Link>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 8 Primary Dashboard Widget Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Đã Cân */}
        <div className="glass-card p-4 rounded-xl relative overflow-hidden hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Đã Cân (Phiên)</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {totalSessionsCount} <span className="text-xs font-medium text-emerald-400">phiên</span>
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Đã cập nhật hệ thống</span>
        </div>

        {/* Card 2: Sản lượng tươi */}
        <div className="glass-card p-4 rounded-xl relative overflow-hidden hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Sản Lượng Tươi</span>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {totalFreshWeight.toLocaleString('vi-VN')} <span className="text-xs font-medium text-blue-400">kg</span>
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Tổng lúa tươi vừa cân</span>
        </div>

        {/* Card 3: Sản lượng khô */}
        <div className="glass-card-gold p-4 rounded-xl relative overflow-hidden hover:border-gold-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gold-300">Sản Lượng Khô</span>
            <div className="p-2 rounded-lg bg-gold-500/20 text-gold-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gold-300 mt-2">
            {totalDryWeight.toLocaleString('vi-VN')} <span className="text-xs font-medium text-gold-400">kg</span>
          </p>
          <span className="text-[10px] text-gold-400/80 block mt-1">Sau khi đã trừ bì</span>
        </div>

        {/* Card 4: Số bao */}
        <div className="glass-card p-4 rounded-xl relative overflow-hidden hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tổng Số Bao</span>
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {totalBags.toLocaleString('vi-VN')} <span className="text-xs font-medium text-purple-400">bao</span>
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Trung bình ~50kg / bao</span>
        </div>

        {/* Card 5: Xe Cân */}
        <div className="glass-card p-4 rounded-xl relative overflow-hidden hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Xe Nhận Tải</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {truckStatsList.length} <span className="text-xs font-medium text-amber-400">xe</span>
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Đang vận chuyển lúa</span>
        </div>

        {/* Card 6: Cán bộ cân */}
        <div className="glass-card p-4 rounded-xl relative overflow-hidden hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cán Bộ Cân</span>
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {staffStatsList.length} <span className="text-xs font-medium text-teal-400">cán bộ</span>
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Đang làm việc ngoài đồng</span>
        </div>

        {/* Card 7: Giống lúa */}
        <div className="glass-card p-4 rounded-xl relative overflow-hidden hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Chủng Loại Giống</span>
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            {varietyChartData.length} <span className="text-xs font-medium text-rose-400">loại</span>
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">ST25, OM18, DT8,...</span>
        </div>

        {/* Card 8: Tổng Doanh Thu / Thành Tiền */}
        <div className="glass-card-gold p-4 rounded-xl relative overflow-hidden hover:border-gold-500/50 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gold-300">Tổng Thành Tiền</span>
            <div className="p-2 rounded-lg bg-gold-500/20 text-gold-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gold-300 mt-2">
            {totalRevenue.toLocaleString('vi-VN')} <span className="text-xs font-medium text-gold-400">VNĐ</span>
          </p>
          <span className="text-[10px] text-gold-400/80 block mt-1">Giá trị thu mua lúa</span>
        </div>

      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: Sản Lượng Theo Loại Giống Lúa */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800/40 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Wheat className="w-5 h-5 text-gold-400" />
              Sản Lượng Theo Loại Giống Lúa (Kg)
            </h3>
            <span className="text-xs text-emerald-400 font-medium">Lúa Tươi / Khô</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={varietyChartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b2618', borderColor: '#22c55e', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')} kg`, 'Sản lượng']}
                />
                <Bar dataKey="fresh" name="Tươi (Kg)" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="dry" name="Khô (Kg)" fill="#facc15" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sản Lượng Từng Xe Nhận (Sản lượng từng xe) */}
        <div className="glass-card p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800/40 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              Sản Lượng Từng Xe Nhận (Xe Cân)
            </h3>
            <Link href="/trucks" className="text-xs text-gold-400 hover:underline flex items-center gap-1">
              Xem chi tiết xe <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {truckStatsList.map((t, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs border border-amber-500/30">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{t.plate}</p>
                    <p className="text-xs text-slate-400">Tài xế: {t.driver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-sm text-gold-300">
                    {t.fresh.toLocaleString('vi-VN')} kg tươi
                  </p>
                  <p className="text-[11px] text-slate-400">{t.bags} bao • {t.sessionCount} chuyến</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Staff & Recent Sessions Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cán Bộ Cân Overview (Admin view) */}
        <div className="glass-card p-5 rounded-2xl space-y-4 lg:col-span-1">
          <div className="flex justify-between items-center border-b border-emerald-800/40 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-400" />
              Thống Kê Cán Bộ Cân
            </h3>
            {isAdmin && <span className="text-[10px] text-emerald-400 font-semibold uppercase">Admin All View</span>}
          </div>

          <div className="space-y-3">
            {staffStatsList.map((st, i) => (
              <div key={i} className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-slate-200">{st.name}</p>
                    <p className="text-[10px] text-slate-400">{st.sessionCount} phiên cân</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs text-emerald-400">{st.fresh.toLocaleString('vi-VN')} kg</p>
                  <p className="text-[10px] text-gold-400">{st.bags} bao</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phiên Cân Gần Đây */}
        <div className="glass-card p-5 rounded-2xl space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-emerald-800/40 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              Phiên Cân Mới Cập Nhật
            </h3>
            <Link href="/history" className="text-xs text-emerald-400 hover:underline">
              Xem toàn bộ lịch sử →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-emerald-950/80 text-emerald-400 uppercase text-[10px] tracking-wider border-b border-emerald-800/60">
                <tr>
                  <th className="py-2.5 px-3">Mã phiên</th>
                  <th className="py-2.5 px-3">Chủ lúa</th>
                  <th className="py-2.5 px-3">Giống lúa</th>
                  <th className="py-2.5 px-3">Số bao</th>
                  <th className="py-2.5 px-3 text-right">Lúa khô (kg)</th>
                  <th className="py-2.5 px-3 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40">
                {relevantSessions.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-emerald-900/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-gold-300">{s.session_code}</td>
                    <td className="py-3 px-3 font-medium text-white">{s.farmer?.name || 'N/A'}</td>
                    <td className="py-3 px-3 text-emerald-300">{s.variety?.name || s.variety?.code}</td>
                    <td className="py-3 px-3 font-bold">{s.total_bags} bao</td>
                    <td className="py-3 px-3 text-right font-extrabold text-gold-400">
                      {s.total_dry_weight.toLocaleString('vi-VN')} kg
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-400">
                      {s.total_amount.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
