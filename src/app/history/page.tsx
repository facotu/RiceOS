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
  Edit2,
  Trash2,
  X,
  Save,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { WeighingSession } from '@/types/database.types';

export default function HistoryPage() {
  const {
    currentUser,
    sessions,
    farmers,
    varieties,
    staffMembers,
    trucks,
    updateSession,
    deleteSession,
    isAdmin
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('all');
  const [selectedVarietyId, setSelectedVarietyId] = useState<string>('all');

  // Edit Modal State
  const [editingSession, setEditingSession] = useState<WeighingSession | null>(null);
  const [editForm, setEditForm] = useState({
    farmer_id: '',
    staff_id: '',
    truck_id: '',
    variety_id: '',
    unit_price: 9500,
    field_region: '',
    lot: '',
    notes: ''
  });

  const openEditModal = (session: WeighingSession) => {
    setEditingSession(session);
    setEditForm({
      farmer_id: session.farmer_id,
      staff_id: session.staff_id,
      truck_id: session.truck_id,
      variety_id: session.variety_id,
      unit_price: session.unit_price,
      field_region: session.field_region,
      lot: session.lot,
      notes: session.notes || ''
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    updateSession(editingSession.id, editForm);
    setEditingSession(null);
  };

  const handleDeleteSession = (id: string, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn XÓA phiên cân ${code}?`)) {
      deleteSession(id);
    }
  };

  // Filtered list
  const filteredSessions = sessions.filter(s => {
    const matchesSearch =
      s.session_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.farmer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.field_region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMember = isAdmin || s.created_by === currentUser?.id || s.staff?.user_id === currentUser?.id || s.staff?.full_name.includes(currentUser?.full_name || '');

    return matchesSearch && matchesFarmer && matchesVariety && matchesMember;
  });

  const totalFresh = filteredSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
  const totalDry = filteredSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
  const totalRevenue = filteredSessions.reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
            Tra Cứu & Quản Lý Lịch Sử Cân
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <History className="w-6 h-6 text-gold-400" />
            Lịch Sử Các Phiên Cân Lúa
          </h1>
          <p className="text-xs text-slate-300">
            Hỗ trợ Thêm mới, Sửa thông tin phiên cân, Xóa và tìm kiếm nâng cao
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

      {/* History Data Table with Edit & Delete */}
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
                <th className="p-3 text-right">Doanh thu</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Không tìm thấy phiên cân nào phù hợp.
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
                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-gold-400 hover:bg-gold-500/20 rounded transition-colors"
                          title="Sửa phiên cân"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSession(s.id, s.session_code)}
                          className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          title="Xóa phiên cân"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Session Modal */}
      {editingSession && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-emerald-700/60 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-emerald-800/50 pb-3">
              <h3 className="text-base font-bold text-gold-300">
                Sửa Thông Tin Phiên Cân {editingSession.session_code}
              </h3>
              <button onClick={() => setEditingSession(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Chủ lúa (Hộ sản xuất)</label>
                <select
                  value={editForm.farmer_id}
                  onChange={e => setEditForm({ ...editForm, farmer_id: e.target.value })}
                  className="w-full p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
                >
                  {farmers.map(f => (
                    <option key={f.id} value={f.id}>{f.name} - {f.phone}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Cán bộ cân</label>
                  <select
                    value={editForm.staff_id}
                    onChange={e => setEditForm({ ...editForm, staff_id: e.target.value })}
                    className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
                  >
                    {staffMembers.map(st => (
                      <option key={st.id} value={st.id}>{st.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Xe nhận</label>
                  <select
                    value={editForm.truck_id}
                    onChange={e => setEditForm({ ...editForm, truck_id: e.target.value })}
                    className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
                  >
                    {trucks.map(t => (
                      <option key={t.id} value={t.id}>{t.license_plate} ({t.driver_name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Giống lúa</label>
                  <select
                    value={editForm.variety_id}
                    onChange={e => setEditForm({ ...editForm, variety_id: e.target.value })}
                    className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
                  >
                    {varieties.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Đơn giá mua (đ/kg)</label>
                  <input
                    type="number"
                    value={editForm.unit_price}
                    onChange={e => setEditForm({ ...editForm, unit_price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-gold-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Xứ đồng</label>
                  <input
                    type="text"
                    value={editForm.field_region}
                    onChange={e => setEditForm({ ...editForm, field_region: e.target.value })}
                    className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Lô</label>
                  <input
                    type="text"
                    value={editForm.lot}
                    onChange={e => setEditForm({ ...editForm, lot: e.target.value })}
                    className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-brand-dark bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg mt-3"
              >
                Lưu Cập Nhật Phiên Cân
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
