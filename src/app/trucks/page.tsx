'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Truck,
  Search,
  Share2,
  FileImage,
  Clock,
  UserCheck,
  Package,
  Wheat,
  Calendar,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { Truck as TruckType } from '@/types/database.types';

export default function TruckDetailsPage() {
  const { trucks, addTruck, updateTruck, deleteTruck, sessions, staffMembers, isAdmin } = useApp();
  const [selectedTruckId, setSelectedTruckId] = useState(trucks[0]?.id || '');
  const manifestRef = useRef<HTMLDivElement>(null);

  // Modal Truck State
  const [truckModalOpen, setTruckModalOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<TruckType | null>(null);
  const [truckForm, setTruckForm] = useState({
    license_plate: '',
    driver_name: '',
    phone: ''
  });

  const openAddTruck = () => {
    setEditingTruck(null);
    setTruckForm({ license_plate: '', driver_name: '', phone: '' });
    setTruckModalOpen(true);
  };

  const openEditTruck = (t: TruckType) => {
    setEditingTruck(t);
    setTruckForm({ license_plate: t.license_plate, driver_name: t.driver_name, phone: t.phone });
    setTruckModalOpen(true);
  };

  const handleSaveTruck = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTruck) {
      updateTruck(editingTruck.id, truckForm);
    } else {
      addTruck(truckForm);
    }
    setTruckModalOpen(false);
  };

  const handleDeleteTruck = (id: string, plate: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa xe ${plate}?`)) {
      deleteTruck(id);
    }
  };

  const currentTruck = trucks.find(t => t.id === selectedTruckId) || trucks[0];

  // Sessions assigned to this truck
  const truckSessions = sessions.filter(s => s.truck_id === selectedTruckId);

  const totalFreshWeight = truckSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
  const totalDryWeight = truckSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
  const totalBags = truckSessions.reduce((sum, s) => sum + s.total_bags, 0);

  // Time boundaries
  const startTime = truckSessions.length > 0 ? truckSessions[truckSessions.length - 1].started_at : new Date().toISOString();
  const endTime = truckSessions.length > 0 ? (truckSessions[0].completed_at || truckSessions[0].started_at) : new Date().toISOString();

  // Primary Staff handling this truck
  const primaryStaffName = truckSessions[0]?.staff?.full_name || staffMembers[0]?.full_name || 'Cán bộ cân';

  const handleShareZaloTruck = () => {
    const text = `🚛 THÔNG TIN CHUYẾN XE VẬN CHUYỂN LÚA - RICE OS
--------------------------------
Biển số xe: ${currentTruck?.license_plate}
Tài xế: ${currentTruck?.driver_name} (SĐT: ${currentTruck?.phone})
Cán bộ phụ trách cân: ${primaryStaffName}
--------------------------------
• Giờ bắt đầu nhận: ${new Date(startTime).toLocaleTimeString('vi-VN')} ${new Date(startTime).toLocaleDateString('vi-VN')}
• Giờ kết thúc nhận: ${new Date(endTime).toLocaleTimeString('vi-VN')} ${new Date(endTime).toLocaleDateString('vi-VN')}
• Tổng số bao lúa: ${totalBags} bao
• Tổng sản lượng tươi: ${totalFreshWeight.toLocaleString('vi-VN')} kg
• Tổng sản lượng khô: ${totalDryWeight.toLocaleString('vi-VN')} kg
================================
HÀNG ĐÃ GIAO ĐỦ CHO TÀI XẾ XÁC NHẬN!`;

    navigator.clipboard.writeText(text);
    alert(`Đã sao chép báo cáo chuyến xe ${currentTruck?.license_plate}! Bạn có thể mở Zalo và dán ngay.`);
  };

  const handleExportTruckImage = async () => {
    if (!manifestRef.current) return;
    try {
      const dataUrl = await toPng(manifestRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `XeNhan_${currentTruck?.license_plate}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Không thể kết xuất ảnh chuyến xe!');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
            Phân Hệ Quản Lý Tải Trọng Xe Nhận
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Truck className="w-6 h-6 text-amber-400" />
            Chi Tiết Tải Trọng Xe Nhận Lúa
          </h1>
          <p className="text-xs text-slate-300">
            Thêm mới xe nhận, Sửa thông tin tài xế, Xóa và xem sản lượng vận chuyển
          </p>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <button
              onClick={openAddTruck}
              className="py-2.5 px-4 rounded-xl bg-gold-400 hover:bg-gold-300 text-brand-dark font-extrabold text-xs shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Thêm Xe Mới
            </button>
          )}

          <button
            onClick={handleShareZaloTruck}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" /> Gửi Zalo
          </button>
          <button
            onClick={handleExportTruckImage}
            className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
          >
            <FileImage className="w-4 h-4" /> Xuất Ảnh Xe
          </button>
        </div>
      </div>

      {/* Selector & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Truck Selection List */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" /> Danh Sách Xe Vận Chuyển
            </h3>
          </div>

          <div className="space-y-2">
            {trucks.map(t => {
              const isSelected = t.id === selectedTruckId;
              const tSessions = sessions.filter(s => s.truck_id === t.id);
              const tFresh = tSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTruckId(t.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                      : 'bg-emerald-950/40 border-emerald-900/60 text-slate-300 hover:bg-emerald-900/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-gold-300">{t.license_plate}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 border border-amber-500/40 font-bold mr-1">
                        {tSessions.length} phiên
                      </span>
                      {isAdmin && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditTruck(t); }}
                            className="p-1 text-gold-400 hover:bg-gold-500/20 rounded"
                            title="Sửa thông tin xe"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteTruck(t.id, t.license_plate); }}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                            title="Xóa xe"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Tài xế: {t.driver_name} ({t.phone})</p>
                  <p className="text-xs font-black text-amber-400 mt-1">
                    Tải tươi: {tFresh.toLocaleString('vi-VN')} kg
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Truck Manifest & Session Breakdown */}
        <div className="lg:col-span-8 space-y-4">

          {/* Exportable Manifest Card */}
          <div
            ref={manifestRef}
            className="glass-card-gold p-6 rounded-2xl space-y-4 border-2 border-amber-500/40"
          >
            <div className="flex justify-between items-start border-b border-amber-500/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 font-extrabold flex items-center justify-center text-lg border border-amber-500/40 shadow-inner">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">CHI TIẾT CHUYẾN XE</span>
                  <h2 className="text-2xl font-black text-gold-300">{currentTruck?.license_plate}</h2>
                  <p className="text-xs text-slate-200">Tài xế: {currentTruck?.driver_name} • SĐT: {currentTruck?.phone}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">CÁN BỘ CÂN PHỤ TRÁCH</span>
                <span className="text-xs font-bold text-white">{primaryStaffName}</span>
              </div>
            </div>

            {/* Time windows */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/60">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" /> GIỜ BẮT ĐẦU NHẬN LÚA
                </span>
                <span className="font-extrabold text-emerald-300">
                  {new Date(startTime).toLocaleTimeString('vi-VN')} - {new Date(startTime).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold-400" /> GIỜ KẾT THÚC NHẬN LÚA
                </span>
                <span className="font-extrabold text-gold-300">
                  {new Date(endTime).toLocaleTimeString('vi-VN')} - {new Date(endTime).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Summary metrics for truck */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">TỔNG SỐ BAO</span>
                <span className="text-xl font-black text-white">{totalBags} bao</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40">
                <span className="text-[10px] text-blue-300 font-bold block uppercase">SẢN LƯỢNG TƯƠI</span>
                <span className="text-xl font-black text-blue-300">{totalFreshWeight.toLocaleString('vi-VN')} kg</span>
              </div>
              <div className="p-3 rounded-xl bg-gold-500/20 border border-gold-500/40">
                <span className="text-[10px] text-gold-400 font-bold block uppercase">SẢN LƯỢNG KHÔ</span>
                <span className="text-xl font-black text-gold-300">{totalDryWeight.toLocaleString('vi-VN')} kg</span>
              </div>
            </div>
          </div>

          {/* Table breakdown */}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Danh Sách Lô Hàng Thu Mua Đã Chất Lên Xe {currentTruck?.license_plate}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Mã phiên</th>
                    <th className="p-2.5">Chủ lúa</th>
                    <th className="p-2.5">Xứ đồng - Lô</th>
                    <th className="p-2.5">Giống lúa</th>
                    <th className="p-2.5 text-right">Số bao</th>
                    <th className="p-2.5 text-right">Cân tươi (kg)</th>
                    <th className="p-2.5 text-right">Cân khô (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {truckSessions.map(s => (
                    <tr key={s.id} className="hover:bg-emerald-900/30">
                      <td className="p-2.5 font-bold text-gold-300">{s.session_code}</td>
                      <td className="p-2.5 font-medium text-white">{s.farmer?.name}</td>
                      <td className="p-2.5 text-slate-400">{s.field_region} ({s.lot})</td>
                      <td className="p-2.5 text-emerald-300">{s.variety?.name}</td>
                      <td className="p-2.5 text-right font-bold">{s.total_bags} bao</td>
                      <td className="p-2.5 text-right font-bold text-blue-400">{s.total_fresh_weight.toLocaleString('vi-VN')} kg</td>
                      <td className="p-2.5 text-right font-extrabold text-gold-400">{s.total_dry_weight.toLocaleString('vi-VN')} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* Add / Edit Truck Modal */}
      {truckModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-emerald-700/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-emerald-800/50 pb-3">
              <h3 className="text-base font-bold text-gold-300">
                {editingTruck ? 'Sửa Thông Tin Xe Nhận' : 'Thêm Xe Nhận Vận Chuyển Mới'}
              </h3>
              <button onClick={() => setTruckModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTruck} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Biển số xe *</label>
                <input
                  type="text"
                  required
                  placeholder="92C-123.45"
                  value={truckForm.license_plate}
                  onChange={e => setTruckForm({ ...truckForm, license_plate: e.target.value })}
                  className="w-full p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Họ tên tài xế *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn Tải"
                  value={truckForm.driver_name}
                  onChange={e => setTruckForm({ ...truckForm, driver_name: e.target.value })}
                  className="w-full p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Số điện thoại *</label>
                <input
                  type="text"
                  required
                  placeholder="0905123456"
                  value={truckForm.phone}
                  onChange={e => setTruckForm({ ...truckForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-white"
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
