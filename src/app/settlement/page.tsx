'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Receipt,
  Search,
  CheckCircle2,
  Share2,
  Printer,
  Coins,
  Wheat,
  UserCheck,
  Clock,
  ShieldCheck,
  Trash2,
  Edit2,
  Plus,
  X
} from 'lucide-react';
import { Settlement } from '@/types/database.types';

export default function SettlementPage() {
  const { farmers, sessions, createSettlement, updateSettlement, deleteSettlement, settlements } = useApp();
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [paidInput, setPaidInput] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Settlement Modal State
  const [editingSettlement, setEditingSettlement] = useState<Settlement | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  const currentFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  // Sessions for this farmer
  const farmerSessions = sessions.filter(s => s.farmer_id === selectedFarmerId);

  const totalBags = farmerSessions.reduce((sum, s) => sum + s.total_bags, 0);
  const totalFresh = farmerSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
  const totalTare = farmerSessions.reduce((sum, s) => sum + s.total_tare_weight, 0);
  const totalDry = farmerSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
  const totalAmount = farmerSessions.reduce((sum, s) => sum + s.total_amount, 0);

  const handleProcessSettlement = () => {
    const amountToPay = parseFloat(paidInput) || totalAmount;
    createSettlement(selectedFarmerId, amountToPay, 'Thanh toán chuyển khoản ngân hàng');
    setSuccessMsg(`Đã tạo phiếu quyết toán thành công cho hộ ${currentFarmer?.name}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openEditSettlement = (st: Settlement) => {
    setEditingSettlement(st);
    setEditAmount(st.paid_amount);
    setEditNotes(st.notes || '');
  };

  const handleSaveEditSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSettlement) return;
    updateSettlement(editingSettlement.id, {
      paid_amount: editAmount,
      status: editAmount >= editingSettlement.total_amount ? 'completed' : 'pending',
      notes: editNotes
    });
    setEditingSettlement(null);
  };

  const handleDeleteSettlement = (id: string, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phiếu quyết toán ${code}?`)) {
      deleteSettlement(id);
    }
  };

  const handleShareZaloSettlement = () => {
    const text = `🌾 PHIẾU QUYẾT TOÁN MUA LÚA - RICE OS
--------------------------------
Hộ sản xuất: ${currentFarmer?.name}
Số điện thoại: ${currentFarmer?.phone}
Số CCCD: ${currentFarmer?.cccd || 'Đã đối chứng'}
Xứ đồng: ${currentFarmer?.field_region} - ${currentFarmer?.lot}
--------------------------------
• Tổng số phiên cân: ${farmerSessions.length} phiên
• Tổng số bao: ${totalBags} bao
• Sản lượng tươi: ${totalFresh.toLocaleString('vi-VN')} kg
• Trừ bì: ${totalTare.toLocaleString('vi-VN')} kg
• Sản lượng khô thực tính: ${totalDry.toLocaleString('vi-VN')} kg
================================
TỔNG THÀNH TIỀN QUYẾT TOÁN: ${totalAmount.toLocaleString('vi-VN')} VNĐ
================================
Đã thanh toán đủ cho hộ dân!`;

    navigator.clipboard.writeText(text);
    setSuccessMsg('Đã sao chép nội dung quyết toán gửi Zalo thành công!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(farmerSearch.toLowerCase()) || f.phone.includes(farmerSearch)
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
            Phân Hệ Quyết Toán Thu Mua
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-gold-400" />
            Quyết Toán Tiền Lúa Với Hộ Dân
          </h1>
          <p className="text-xs text-slate-300">
            Tạo mới, xem chi tiết, Sửa thông tin thanh toán & Xóa phiếu quyết toán
          </p>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Farmer Selector */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-emerald-800/40 pb-2">
            <Search className="w-4 h-4 text-gold-400" /> Chọn Hộ Dân Cần Quyết Toán
          </h3>

          <input
            type="text"
            placeholder="Tìm tên, SĐT hộ dân..."
            value={farmerSearch}
            onChange={e => setFarmerSearch(e.target.value)}
            className="w-full p-2.5 bg-brand-dark border border-emerald-800 rounded-xl text-xs text-white"
          />

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredFarmers.map(f => {
              const fSessions = sessions.filter(s => s.farmer_id === f.id);
              const fAmount = fSessions.reduce((sum, s) => sum + s.total_amount, 0);
              const isSelected = f.id === selectedFarmerId;

              return (
                <button
                  key={f.id}
                  onClick={() => { setSelectedFarmerId(f.id); setPaidInput(''); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg'
                      : 'bg-emerald-950/40 border-emerald-900/60 text-slate-300 hover:bg-emerald-900/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-xs text-gold-300">{f.name}</p>
                    <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-800">
                      {fSessions.length} phiên
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{f.field_region} ({f.lot})</p>
                  <p className="text-xs font-extrabold text-emerald-300 mt-1">
                    Tổng: {fAmount.toLocaleString('vi-VN')} VNĐ
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settlement Sheet & Action Panel */}
        <div className="lg:col-span-8 space-y-4">

          {/* Farmer Master Profile */}
          <div className="glass-card-gold p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-start border-b border-gold-500/30 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">Hộ Sản Xuất Được Chọn</span>
                <h2 className="text-xl font-black text-gold-300">{currentFarmer?.name}</h2>
                <p className="text-xs text-slate-300">SĐT: {currentFarmer?.phone} • Số CCCD: {currentFarmer?.cccd || '048092001122'}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gold-400 font-bold block">XỨ ĐỒNG / LÔ</span>
                <span className="text-sm font-extrabold text-white">{currentFarmer?.field_region} - {currentFarmer?.lot}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Diện tích: {currentFarmer?.area.toLocaleString('vi-VN')} m²</span>
              </div>
            </div>

            {/* 4 Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">TỔNG SỐ BAO</span>
                <span className="text-lg font-black text-white">{totalBags} bao</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">SẢN LƯỢNG TƯƠI</span>
                <span className="text-lg font-black text-blue-400">{totalFresh.toLocaleString('vi-VN')} kg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                <span className="text-[10px] text-slate-400 font-semibold block">SẢN LƯỢNG KHÔ</span>
                <span className="text-lg font-black text-emerald-400">{totalDry.toLocaleString('vi-VN')} kg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gold-500/20 border border-gold-500/40">
                <span className="text-[10px] text-gold-400 font-semibold block">TỔNG TIỀN MUA</span>
                <span className="text-lg font-black text-gold-300">{totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          {/* Existing Settlements List for this farmer with Edit & Delete */}
          {settlements.length > 0 && (
            <div className="glass-card p-4 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider">
                Danh Sách Phiếu Quyết Toán Đã Tạo
              </h3>
              <div className="space-y-2">
                {settlements.map(st => (
                  <div key={st.id} className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-gold-300">{st.settlement_code}</p>
                      <p className="text-slate-300">Đã trả: <strong className="text-emerald-400">{st.paid_amount.toLocaleString('vi-VN')} VNĐ</strong> / {st.total_amount.toLocaleString('vi-VN')} VNĐ</p>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${st.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {st.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditSettlement(st)}
                        className="p-1.5 text-gold-400 hover:bg-gold-500/20 rounded"
                        title="Sửa phiếu quyết toán"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSettlement(st.id, st.settlement_code)}
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded"
                        title="Xóa phiếu quyết toán"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sessions breakdown */}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Chi Tiết Phiên Cân Hộ {currentFarmer?.name}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Mã phiên</th>
                    <th className="p-2.5">Giống lúa</th>
                    <th className="p-2.5">Xe nhận</th>
                    <th className="p-2.5 text-right">Số bao</th>
                    <th className="p-2.5 text-right">Lúa khô</th>
                    <th className="p-2.5 text-right">Đơn giá</th>
                    <th className="p-2.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {farmerSessions.map(s => (
                    <tr key={s.id} className="hover:bg-emerald-900/30">
                      <td className="p-2.5 font-bold text-gold-300">{s.session_code}</td>
                      <td className="p-2.5 font-medium text-white">{s.variety?.name || 'ST25'}</td>
                      <td className="p-2.5 text-amber-400">{s.truck?.license_plate || '92C-123.45'}</td>
                      <td className="p-2.5 text-right font-bold">{s.total_bags} bao</td>
                      <td className="p-2.5 text-right font-bold text-emerald-400">{s.total_dry_weight.toLocaleString('vi-VN')} kg</td>
                      <td className="p-2.5 text-right text-slate-400">{s.unit_price.toLocaleString('vi-VN')} đ</td>
                      <td className="p-2.5 text-right font-extrabold text-gold-300">{s.total_amount.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Final Payment Actions */}
            <div className="pt-3 border-t border-emerald-800/40 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="w-full sm:w-auto space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">Số tiền thực thanh toán cho hộ dân:</label>
                <input
                  type="number"
                  placeholder={totalAmount.toString()}
                  value={paidInput}
                  onChange={e => setPaidInput(e.target.value)}
                  className="p-2 bg-brand-dark border border-emerald-700 rounded-xl text-gold-300 font-extrabold text-sm w-full sm:w-64"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleShareZaloSettlement}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" /> Gửi Zalo Quyết Toán
                </button>
                <button
                  onClick={handleProcessSettlement}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:brightness-110 text-brand-dark font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Tạo Quyết Toán Mới
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Settlement Modal */}
      {editingSettlement && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-emerald-700/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-emerald-800/50 pb-3">
              <h3 className="text-base font-bold text-gold-300">
                Sửa Phiếu Quyết Toán {editingSettlement.settlement_code}
              </h3>
              <button onClick={() => setEditingSettlement(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSettlement} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Số tiền đã thanh toán (VNĐ)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-gold-300 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Ghi chú quyết toán</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white text-xs h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-brand-dark bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg mt-3"
              >
                Lưu Thay Đổi
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
