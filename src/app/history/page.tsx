'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  History,
  Search,
  Wheat,
  Users,
  Coins,
  Scale,
  Calendar,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { sessions, farmers, varieties } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('all');
  const [selectedVarietyId, setSelectedVarietyId] = useState<string>('all');

  // Filtered list
  const filteredSessions = sessions.filter(s => {
    const matchesSearch =
      s.session_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.farmer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.field_region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFarmer = selectedFarmerId === 'all' || s.farmer_id === selectedFarmerId;
    const matchesVariety = selectedVarietyId === 'all' || s.variety_id === selectedVarietyId;

    return matchesSearch && matchesFarmer && matchesVariety;
  });

  const totalFresh = filteredSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
  const totalDry = filteredSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
  const totalRevenue = filteredSessions.reduce((sum, s) => sum + s.total_amount, 0);
  const totalBags = filteredSessions.reduce((sum, s) => sum + s.total_bags, 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
            Tra Cứu Lịch Sử Cân
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <History className="w-6 h-6 text-gold-400" />
            Lịch Sử Các Phiên Cân Lúa
          </h1>
          <p className="text-xs text-slate-300">
            Tìm kiếm, lọc theo chủ lúa, giống lúa và xem tổng hợp sản lượng & doanh thu
          </p>
        </div>

        <Link
          href="/weighing"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-brand-dark font-extrabold text-xs shadow-lg"
        >
          <Scale className="w-4 h-4" /> Cân Lúa Mới
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo mã phiên, tên chủ lúa, xứ đồng..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-emerald-950/80 border border-emerald-800 rounded-xl text-white text-xs placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
        </div>

        {/* Select Farmer */}
        <div>
          <select
            value={selectedFarmerId}
            onChange={e => setSelectedFarmerId(e.target.value)}
            className="w-full p-2 bg-emerald-950/80 border border-emerald-800 rounded-xl text-white text-xs font-semibold"
          >
            <option value="all"> Tất cả Chủ Lúa / Hộ Sản Xuất</option>
            {farmers.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.phone})</option>
            ))}
          </select>
        </div>

        {/* Select Variety */}
        <div>
          <select
            value={selectedVarietyId}
            onChange={e => setSelectedVarietyId(e.target.value)}
            className="w-full p-2 bg-emerald-950/80 border border-emerald-800 rounded-xl text-white text-xs font-semibold"
          >
            <option value="all"> Tất cả Giống Lúa (ST25, OM18...)</option>
            {varieties.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.code})</option>
            ))}
          </select>
        </div>

      </div>

      {/* Aggregated Totals Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="glass-card p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">KẾT QUẢ TÌM KIẾM</span>
          <span className="text-xl font-black text-white">{filteredSessions.length} phiên</span>
        </div>
        <div className="glass-card p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">SẢN LƯỢNG TƯƠI</span>
          <span className="text-xl font-black text-blue-400">{totalFresh.toLocaleString('vi-VN')} kg</span>
        </div>
        <div className="glass-card p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">SẢN LƯỢNG KHÔ</span>
          <span className="text-xl font-black text-emerald-400">{totalDry.toLocaleString('vi-VN')} kg</span>
        </div>
        <div className="glass-card-gold p-3 rounded-xl">
          <span className="text-[10px] text-gold-400 font-bold block uppercase">TỔNG DOANH THU</span>
          <span className="text-xl font-black text-gold-300">{totalRevenue.toLocaleString('vi-VN')} đ</span>
        </div>
      </div>

      {/* History Data Table */}
      <div className="glass-card p-5 rounded-2xl space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Mã phiên</th>
                <th className="p-3">Ngày cân</th>
                <th className="p-3">Chủ lúa</th>
                <th className="p-3">Giống lúa</th>
                <th className="p-3">Cán bộ cân</th>
                <th className="p-3">Xe nhận</th>
                <th className="p-3 text-right">Số bao</th>
                <th className="p-3 text-right">Lúa khô (kg)</th>
                <th className="p-3 text-right">Doanh thu (VNĐ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Không tìm thấy phiên cân nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredSessions.map(s => (
                  <tr key={s.id} className="hover:bg-emerald-900/30">
                    <td className="p-3 font-extrabold text-gold-300">{s.session_code}</td>
                    <td className="p-3 text-slate-400">{new Date(s.started_at).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 font-bold text-white">{s.farmer?.name}</td>
                    <td className="p-3 text-emerald-300">{s.variety?.name}</td>
                    <td className="p-3 text-slate-300">{s.staff?.full_name}</td>
                    <td className="p-3 text-amber-400 font-semibold">{s.truck?.license_plate}</td>
                    <td className="p-3 text-right font-bold">{s.total_bags} bao</td>
                    <td className="p-3 text-right font-extrabold text-emerald-400">{s.total_dry_weight.toLocaleString('vi-VN')} kg</td>
                    <td className="p-3 text-right font-extrabold text-gold-300">{s.total_amount.toLocaleString('vi-VN')} đ</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
