'use client';

import React, { useState, useMemo, useRef } from 'react';
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
  X,
  FileImage,
  CreditCard,
  Building2,
  Banknote,
  Filter,
  Check,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Settlement, Farmer, WeighingSession } from '@/types/database.types';
import { toPng } from 'html-to-image';

export default function SettlementPage() {
  const { farmers, sessions, createSettlement, updateSettlement, deleteSettlement, settlements } = useApp();

  // Search & Filter state for Farmer sidebar
  const [farmerSearch, setFarmerSearch] = useState('');
  const [selectedXuDongFilter, setSelectedXuDongFilter] = useState<string>('all');
  const [settlementStatusFilter, setSettlementStatusFilter] = useState<'has_sessions' | 'settled' | 'all'>('has_sessions');
  const [farmerPage, setFarmerPage] = useState(1);
  const itemsPerPage = 15;

  // Selected Farmer
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'banking' | 'cash'>('banking');
  const [paidInput, setPaidInput] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('Thanh toán chuyển khoản ngân hàng');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Settlement Modal
  const [editingSettlement, setEditingSettlement] = useState<Settlement | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  const receiptRef = useRef<HTMLDivElement>(null);

  // Current selected Farmer object
  const currentFarmer = useMemo(() => {
    return farmers.find(f => f.id === selectedFarmerId) || farmers[0];
  }, [farmers, selectedFarmerId]);

  // All weighing sessions for current selected farmer
  const farmerSessions = useMemo(() => {
    return sessions.filter(s => s.farmer_id === selectedFarmerId);
  }, [sessions, selectedFarmerId]);

  // Calculation metrics for selected farmer
  const totalBags = useMemo(() => farmerSessions.reduce((sum, s) => sum + s.total_bags, 0), [farmerSessions]);
  const totalFresh = useMemo(() => farmerSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0), [farmerSessions]);
  const totalTare = useMemo(() => farmerSessions.reduce((sum, s) => sum + s.total_tare_weight, 0), [farmerSessions]);
  const totalDry = useMemo(() => farmerSessions.reduce((sum, s) => sum + s.total_dry_weight, 0), [farmerSessions]);
  const totalAmount = useMemo(() => farmerSessions.reduce((sum, s) => sum + s.total_amount, 0), [farmerSessions]);

  // Existing settlements for selected farmer
  const farmerSettlements = useMemo(() => {
    return settlements.filter(st => st.farmer_id === selectedFarmerId);
  }, [settlements, selectedFarmerId]);

  const totalPaidSoFar = useMemo(() => {
    return farmerSettlements.reduce((sum, st) => sum + st.paid_amount, 0);
  }, [farmerSettlements]);

  const remainingBalance = Math.max(0, totalAmount - totalPaidSoFar);

  // System-wide Global KPIs
  const globalStats = useMemo(() => {
    const totalSystemFresh = sessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
    const totalSystemDry = sessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
    const totalSystemAmount = sessions.reduce((sum, s) => sum + s.total_amount, 0);
    const totalSystemPaid = settlements.reduce((sum, st) => sum + st.paid_amount, 0);
    const totalSystemPending = Math.max(0, totalSystemAmount - totalSystemPaid);

    return {
      totalSystemFresh,
      totalSystemDry,
      totalSystemAmount,
      totalSystemPaid,
      totalSystemPending,
      totalSettlementsCount: settlements.length
    };
  }, [sessions, settlements]);

  // Filtered farmers list
  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const matchSearch =
        f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
        f.phone.includes(farmerSearch) ||
        (f.landowner_name && f.landowner_name.toLowerCase().includes(farmerSearch.toLowerCase())) ||
        f.field_region.toLowerCase().includes(farmerSearch.toLowerCase()) ||
        f.lot.toLowerCase().includes(farmerSearch.toLowerCase());

      const matchXuDong = selectedXuDongFilter === 'all' || f.field_region === selectedXuDongFilter;

      const fSessions = sessions.filter(s => s.farmer_id === f.id);
      const fSettlements = settlements.filter(st => st.farmer_id === f.id);

      if (settlementStatusFilter === 'has_sessions') {
        return matchSearch && matchXuDong && fSessions.length > 0;
      }
      if (settlementStatusFilter === 'settled') {
        return matchSearch && matchXuDong && fSettlements.length > 0;
      }

      return matchSearch && matchXuDong;
    });
  }, [farmers, farmerSearch, selectedXuDongFilter, settlementStatusFilter, sessions, settlements]);

  // Farmers Pagination
  const totalFarmerPages = Math.ceil(filteredFarmers.length / itemsPerPage) || 1;
  const paginatedFarmers = useMemo(() => {
    const start = (farmerPage - 1) * itemsPerPage;
    return filteredFarmers.slice(start, start + itemsPerPage);
  }, [filteredFarmers, farmerPage]);

  // Unique Xứ Đồng list
  const uniqueXuDongList = useMemo(() => {
    return Array.from(new Set(farmers.map(f => f.field_region))).sort();
  }, [farmers]);

  // Handlers
  const handleProcessSettlement = () => {
    if (farmerSessions.length === 0) {
      alert('Hộ sản xuất này chưa có phiên cân lúa nào để quyết toán!');
      return;
    }
    const amountToPay = paidInput !== '' ? parseFloat(paidInput) : remainingBalance;
    if (amountToPay <= 0) {
      alert('Vui lòng nhập số tiền quyết toán hợp lệ lớn hơn 0 VNĐ!');
      return;
    }

    const noteWithMethod = `[${paymentMethod === 'banking' ? 'Chuyển khoản Ngân hàng' : 'Tiền mặt'}] ${paymentNotes}`;
    createSettlement(selectedFarmerId, amountToPay, noteWithMethod);

    setSuccessMsg(`Đã lập phiếu quyết toán ${amountToPay.toLocaleString('vi-VN')} VNĐ cho hộ ${currentFarmer?.name}!`);
    setPaidInput('');
    setTimeout(() => setSuccessMsg(''), 4000);
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
    const text = `🌾 PHIẾU QUYẾT TOÁN THU MUA LÚA - RICE OS
--------------------------------
Hộ sản xuất: ${currentFarmer?.name} ${currentFarmer?.landowner_name ? `(Chủ: ${currentFarmer.landowner_name})` : ''}
Số điện thoại: ${currentFarmer?.phone}
Số CCCD: ${currentFarmer?.cccd || 'Đã đối chứng'}
Vùng trồng: ${currentFarmer?.field_region} - ${currentFarmer?.lot} (${currentFarmer?.area.toLocaleString('vi-VN')} m²)
--------------------------------
• Tổng số phiên cân: ${farmerSessions.length} phiên
• Tổng số bao lúa: ${totalBags} bao
• Sản lượng lúa tươi: ${totalFresh.toLocaleString('vi-VN')} kg
• Tổng trừ bì %: ${totalTare.toLocaleString('vi-VN')} kg
• Sản lượng khô thực tính: ${totalDry.toLocaleString('vi-VN')} kg
================================
TỔNG GIÁ TRỊ THU MUA: ${totalAmount.toLocaleString('vi-VN')} VNĐ
ĐÃ THANH TOÁN: ${totalPaidSoFar.toLocaleString('vi-VN')} VNĐ
CÒN NỢ HỘ DÂN: ${remainingBalance.toLocaleString('vi-VN')} VNĐ
================================
Hình thức: ${paymentMethod === 'banking' ? 'Chuyển khoản Ngân hàng' : 'Tiền mặt'}
Trạng thái: ${remainingBalance === 0 ? 'ĐÃ HOÀN THÀNH TẤT TOÁN 100%' : 'ĐANG THANH TOÁN TỪNG ĐỢT'}`;

    navigator.clipboard.writeText(text);
    setSuccessMsg('Đã sao chép nội dung quyết toán gửi Zalo thành công!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleExportPNG = async () => {
    if (!receiptRef.current) return;
    try {
      const dataUrl = await toPng(receiptRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `QuyetToan_${currentFarmer?.name}_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Lỗi tạo ảnh PNG:', err);
      alert('Không thể tạo ảnh phiếu quyết toán. Vui lòng thử lại!');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* Header & KPI Summary */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              Phân Hệ Quản Lý Quyết Toán Nông Dân
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[10px] font-bold">
              {globalStats.totalSettlementsCount} Phiếu Đã Lập
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-gold-400" />
            Quyết Toán Tiền Lúa Khoa Học & Cho Hộ Dân
          </h1>
          <p className="text-xs text-slate-300">
            Minh bạch hóa tổng sản lượng, tỷ lệ trừ bì %, giá mua và dòng tiền chi trả nông dân.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}
      </div>

      {/* System KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 rounded-2xl border border-emerald-800/40">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">TỔNG GIÁ TRỊ THU MUA</span>
          <p className="text-xl font-black text-gold-300 mt-1">{globalStats.totalSystemAmount.toLocaleString('vi-VN')} đ</p>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">{globalStats.totalSystemDry.toLocaleString('vi-VN')} kg lúa khô</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-800/40">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">ĐÃ CHI TRẢ HỘ DÂN</span>
          <p className="text-xl font-black text-emerald-400 mt-1">{globalStats.totalSystemPaid.toLocaleString('vi-VN')} đ</p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Đã đối soát ngân hàng</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-800/40">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">CÒN NỢ NÔNG DÂN</span>
          <p className="text-xl font-black text-amber-400 mt-1">{globalStats.totalSystemPending.toLocaleString('vi-VN')} đ</p>
          <span className="text-[10px] text-amber-300/80 mt-0.5 block">Cần quyết toán thêm</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-800/40">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">SẢN LƯỢNG TƯƠI ĐÃ CÂN</span>
          <p className="text-xl font-black text-white mt-1">{globalStats.totalSystemFresh.toLocaleString('vi-VN')} kg</p>
          <span className="text-[10px] text-sky-400 mt-0.5 block">Tổng từ các phiên cân</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Sidebar: Farmer Selector with Scientific Filters */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl space-y-4">
          <div className="border-b border-emerald-800/40 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Search className="w-4 h-4 text-gold-400" /> Danh Sách Hộ Nông Dân
              </span>
              <span className="text-xs font-bold text-gold-300 px-2 py-0.5 bg-emerald-950 rounded-full border border-emerald-800">
                {filteredFarmers.length} hộ
              </span>
            </h3>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex bg-emerald-950 p-1 rounded-xl border border-emerald-800/60 text-[11px] font-bold">
            <button
              onClick={() => { setSettlementStatusFilter('has_sessions'); setFarmerPage(1); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                settlementStatusFilter === 'has_sessions'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Có Phiên Cân
            </button>
            <button
              onClick={() => { setSettlementStatusFilter('settled'); setFarmerPage(1); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                settlementStatusFilter === 'settled'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đã Quyết Toán
            </button>
            <button
              onClick={() => { setSettlementStatusFilter('all'); setFarmerPage(1); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                settlementStatusFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất Cả (199)
            </button>
          </div>

          {/* Search Input & Xứ Đồng Filter */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Tìm theo tên hộ sản xuất, SĐT, Lô..."
              value={farmerSearch}
              onChange={e => { setFarmerSearch(e.target.value); setFarmerPage(1); }}
              className="w-full p-2.5 bg-brand-dark/90 border border-emerald-800/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
            />

            <select
              value={selectedXuDongFilter}
              onChange={e => { setSelectedXuDongFilter(e.target.value); setFarmerPage(1); }}
              className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-xl text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">Tất cả Xứ Đồng (4 xứ)</option>
              {uniqueXuDongList.map(xd => (
                <option key={xd} value={xd}>{xd}</option>
              ))}
            </select>
          </div>

          {/* Farmers List */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {paginatedFarmers.map(f => {
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
                    <div>
                      <p className="font-bold text-xs text-gold-300">{f.name}</p>
                      {f.landowner_name && (
                        <p className="text-[10px] text-slate-400 font-normal">Chủ: {f.landowner_name}</p>
                      )}
                    </div>
                    <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-800 font-mono font-bold">
                      {fSessions.length} phiên
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px]">
                    <span className="text-slate-400">{f.field_region} ({f.lo})</span>
                    <span className="font-extrabold text-emerald-300 font-mono">
                      {fAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </button>
              );
            })}

            {paginatedFarmers.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                Không tìm thấy nông hộ nào phù hợp với bộ lọc.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalFarmerPages > 1 && (
            <div className="flex justify-between items-center pt-2 border-t border-emerald-900/60 text-xs">
              <span className="text-slate-400 text-[11px]">
                Trang {farmerPage} / {totalFarmerPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={farmerPage === 1}
                  onClick={() => setFarmerPage(p => Math.max(1, p - 1))}
                  className="p-1 rounded-lg bg-emerald-950 border border-emerald-800 disabled:opacity-40 hover:bg-emerald-900 text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={farmerPage === totalFarmerPages}
                  onClick={() => setFarmerPage(p => Math.min(totalFarmerPages, p + 1))}
                  className="p-1 rounded-lg bg-emerald-950 border border-emerald-800 disabled:opacity-40 hover:bg-emerald-900 text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Scientific Settlement Sheet & Detailed Breakdown */}
        <div className="lg:col-span-8 space-y-4">

          {/* STEP 1: Farmer Profile Banner & Master Calculations */}
          <div className="glass-card-gold p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-gold-500/30 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block">
                  BẢNG QUYẾT TOÁN THU MUA HỘ NÔNG DÂN
                </span>
                <h2 className="text-2xl font-black text-gold-300 flex items-center gap-2 mt-0.5">
                  {currentFarmer?.name}
                  {currentFarmer?.landowner_name && (
                    <span className="text-xs font-normal text-slate-300">(Chủ đất: {currentFarmer.landowner_name})</span>
                  )}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  SĐT: <strong className="text-emerald-300">{currentFarmer?.phone}</strong> • CCCD: <strong className="text-white">{currentFarmer?.cccd || '048092001122'}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gold-400 font-bold block uppercase">VÙNG TRỒNG LÚA</span>
                <span className="text-sm font-extrabold text-white">{currentFarmer?.field_region} - {currentFarmer?.lot}</span>
                <span className="text-[11px] text-emerald-300 block font-semibold mt-0.5">
                  Diện tích m²: {currentFarmer?.area.toLocaleString('vi-VN')} m²
                </span>
              </div>
            </div>

            {/* 4 Core Financial Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-800/80">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">TỔNG SỐ BAO</span>
                <span className="text-xl font-black text-white font-mono">{totalBags} bao</span>
                <span className="text-[10px] text-slate-400 block">{farmerSessions.length} phiên cân</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-800/80">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">SẢN LƯỢNG KHÔ</span>
                <span className="text-xl font-black text-emerald-400 font-mono">{totalDry.toLocaleString('vi-VN')} kg</span>
                <span className="text-[10px] text-slate-400 block">Tươi: {totalFresh.toLocaleString('vi-VN')} kg</span>
              </div>

              <div className="p-3 rounded-xl bg-gold-500/20 border border-gold-500/40">
                <span className="text-[10px] text-gold-400 font-bold uppercase block">TỔNG TIỀN MUA</span>
                <span className="text-xl font-black text-gold-300 font-mono">{totalAmount.toLocaleString('vi-VN')} đ</span>
                <span className="text-[10px] text-gold-300/80 block">Giá mua trung bình</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-800/80">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">CÒN PHẢI TRẢ</span>
                <span className={`text-xl font-black font-mono ${remainingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {remainingBalance.toLocaleString('vi-VN')} đ
                </span>
                <span className="text-[10px] text-slate-400 block">Đã trả: {totalPaidSoFar.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          {/* STEP 2: Weighing Sessions Breakdown Table */}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wheat className="w-4 h-4 text-gold-400" /> Bảng Chi Tiết {farmerSessions.length} Phiên Cân Thu Mua
              </h3>
              <span className="text-xs text-emerald-400 font-bold font-mono">
                {totalDry.toLocaleString('vi-VN')} kg khô
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-emerald-900/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-2.5">Mã phiên</th>
                    <th className="p-2.5">Giống lúa</th>
                    <th className="p-2.5 text-right">Số bao</th>
                    <th className="p-2.5 text-right">Cân tươi</th>
                    <th className="p-2.5 text-right">Trừ bì %</th>
                    <th className="p-2.5 text-right">Cân khô (kg)</th>
                    <th className="p-2.5 text-right">Đơn giá</th>
                    <th className="p-2.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {farmerSessions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        Chưa có phiên cân lúa nào cho hộ này.
                      </td>
                    </tr>
                  ) : (
                    farmerSessions.map(s => (
                      <tr key={s.id} className="hover:bg-emerald-900/30 transition-colors">
                        <td className="p-2.5 font-bold text-gold-300 font-mono">{s.session_code}</td>
                        <td className="p-2.5 font-medium text-white">{s.variety?.name || 'HG244'}</td>
                        <td className="p-2.5 text-right font-bold text-slate-200">{s.total_bags} bao</td>
                        <td className="p-2.5 text-right font-mono text-slate-300">{s.total_fresh_weight.toLocaleString('vi-VN')} kg</td>
                        <td className="p-2.5 text-right text-gold-400">{s.total_tare_weight.toLocaleString('vi-VN')} kg</td>
                        <td className="p-2.5 text-right font-bold text-emerald-400 font-mono">{s.total_dry_weight.toLocaleString('vi-VN')} kg</td>
                        <td className="p-2.5 text-right text-slate-400 font-mono">{s.unit_price.toLocaleString('vi-VN')} đ</td>
                        <td className="p-2.5 text-right font-extrabold text-gold-300 font-mono">{s.total_amount.toLocaleString('vi-VN')} đ</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* STEP 3: Existing Settlements List for this farmer */}
          {farmerSettlements.length > 0 && (
            <div className="glass-card p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-gold-400" />
                Lịch Sử Chi Trả Tiền Quyết Toán ({farmerSettlements.length} Đợt)
              </h3>
              <div className="space-y-2">
                {farmerSettlements.map(st => (
                  <div key={st.id} className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gold-300 font-mono">{st.settlement_code}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${st.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                          {st.status === 'completed' ? 'Hoàn tất' : 'Đang trả đợt'}
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1">
                        Số tiền đợt này: <strong className="text-emerald-400 font-mono">{st.paid_amount.toLocaleString('vi-VN')} VNĐ</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">{st.notes}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditSettlement(st)}
                        className="p-1.5 text-gold-400 hover:bg-gold-500/20 rounded transition-colors"
                        title="Sửa phiếu quyết toán"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSettlement(st.id, st.settlement_code)}
                        className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        title="Xóa phiếu quyết toán"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Payment Action & Payment Voucher Creation */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-emerald-800/40 pb-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Tạo Lập Phiếu Quyết Toán Chi Trả Mới
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Phương thức thanh toán:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('banking')}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border flex items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'banking'
                        ? 'bg-sky-600 text-white border-sky-400 shadow'
                        : 'bg-emerald-950 border-emerald-800 text-slate-400'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Chuyển Khoản
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border flex items-center justify-center gap-1 transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                        : 'bg-emerald-950 border-emerald-800 text-slate-400'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" /> Tiền Mặt
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Số tiền chi trả đợt này (VNĐ):</label>
                <input
                  type="number"
                  placeholder={remainingBalance.toString()}
                  value={paidInput}
                  onChange={e => setPaidInput(e.target.value)}
                  className="w-full p-2.5 bg-brand-dark border border-gold-500/60 rounded-xl text-gold-300 font-extrabold text-sm focus:outline-none font-mono"
                />
              </div>

              {/* Payment Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ghi chú thanh toán:</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  placeholder="Ghi chú đợt chi trả..."
                  className="w-full p-2.5 bg-brand-dark border border-emerald-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="pt-2 flex flex-wrap sm:flex-nowrap gap-2 justify-end">
              <button
                onClick={handleShareZaloSettlement}
                className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> Gửi Zalo Quyết Toán
              </button>

              <button
                onClick={handleExportPNG}
                className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <FileImage className="w-4 h-4" /> Xuất Ảnh PNG
              </button>

              <button
                onClick={handlePrintReceipt}
                className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gold-400" /> In Biên Bản A5
              </button>

              <button
                onClick={handleProcessSettlement}
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:brightness-110 text-brand-dark font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Tạo Quyết Toán
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Printable / PNG Export Voucher Sheet (A5/Receipt format) */}
      <div className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 mb-2">Xem Trước Biên Bản Quyết Toán Mua Lúa (A5 Voucher Preview):</h3>

        <div
          ref={receiptRef}
          id="printable-receipt"
          className="max-w-lg mx-auto bg-white text-black p-6 rounded-2xl shadow-2xl font-serif text-xs space-y-4 border border-slate-300"
        >
          {/* Header Voucher */}
          <div className="text-center border-b-2 border-black pb-3 space-y-1">
            <h1 className="font-extrabold text-lg uppercase tracking-wider">HỢP TÁC XÃ NÔNG NGHIỆP RICE OS</h1>
            <p className="text-xs font-bold uppercase">BIÊN BẢN QUYẾT TOÁN TIỀN MUA LÚA TẠI RUỘNG</p>
            <p className="text-[11px] font-mono">Mã số: QT-{new Date().toISOString().slice(0, 10).replace(/-/g, '')}-{currentFarmer?.id}</p>
          </div>

          {/* Farmer Master Metadata */}
          <div className="grid grid-cols-2 gap-2 text-xs border-b border-gray-300 pb-3">
            <div>
              <p><strong>Hộ sản xuất:</strong> {currentFarmer?.name}</p>
              {currentFarmer?.landowner_name && <p><strong>Chủ ruộng:</strong> {currentFarmer.landowner_name}</p>}
              <p><strong>Số điện thoại:</strong> {currentFarmer?.phone}</p>
              <p><strong>Số CCCD:</strong> {currentFarmer?.cccd || '048092001122'}</p>
            </div>
            <div>
              <p><strong>Xứ đồng:</strong> {currentFarmer?.field_region}</p>
              <p><strong>Lô ruộng:</strong> {currentFarmer?.lot}</p>
              <p><strong>Diện tích:</strong> {currentFarmer?.area.toLocaleString('vi-VN')} m²</p>
              <p><strong>Ngày lập:</strong> {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          {/* Sessions Summary Table */}
          <table className="w-full border-t border-b border-black text-[11px] text-left">
            <thead>
              <tr className="border-b border-black font-bold bg-gray-100">
                <th className="py-1 px-1">Phiên</th>
                <th className="py-1 px-1">Giống lúa</th>
                <th className="py-1 px-1 text-right">Số bao</th>
                <th className="py-1 px-1 text-right">Lúa khô</th>
                <th className="py-1 px-1 text-right">Đơn giá</th>
                <th className="py-1 px-1 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {farmerSessions.map(s => (
                <tr key={s.id} className="border-b border-gray-200">
                  <td className="py-1 px-1 font-mono">{s.session_code}</td>
                  <td className="py-1 px-1">{s.variety?.name || 'HG244'}</td>
                  <td className="py-1 px-1 text-right">{s.total_bags}</td>
                  <td className="py-1 px-1 text-right">{s.total_dry_weight.toLocaleString('vi-VN')} kg</td>
                  <td className="py-1 px-1 text-right">{s.unit_price.toLocaleString('vi-VN')} đ</td>
                  <td className="py-1 px-1 text-right font-bold">{s.total_amount.toLocaleString('vi-VN')} đ</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Settlement Totals */}
          <div className="space-y-1.5 text-right text-xs">
            <p>TỔNG SẢN LƯỢNG LÚA TƯƠI: <strong>{totalFresh.toLocaleString('vi-VN')} kg</strong></p>
            <p>TỔNG SẢN LƯỢNG LÚA KHÔ: <strong className="text-sm underline">{totalDry.toLocaleString('vi-VN')} kg</strong> ({totalBags} bao)</p>
            <p className="text-sm font-extrabold text-black">TỔNG GIÁ TRỊ THU MUA: {totalAmount.toLocaleString('vi-VN')} VNĐ</p>
            <p>ĐÃ THANH TOÁN: <strong>{totalPaidSoFar.toLocaleString('vi-VN')} VNĐ</strong></p>
            <div className="border-t-2 border-black pt-1 mt-1 text-base font-black">
              CÒN THANH TOÁN ĐỢT NÀY: {remainingBalance.toLocaleString('vi-VN')} VNĐ
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 text-center pt-6 text-[11px] font-sans">
            <div>
              <p className="font-bold">ĐẠI DIỆN HỘ NÔNG DÂN</p>
              <p className="text-[10px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
              <div className="h-14"></div>
              <p className="font-bold">{currentFarmer?.name}</p>
            </div>
            <div>
              <p className="font-bold">ĐẠI DIỆN BÊN THU MUA (RICE OS)</p>
              <p className="text-[10px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
              <div className="h-14"></div>
              <p className="font-bold">Hợp Tác Xã Nông Nghiệp</p>
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
                Chỉnh Sửa Phiếu Quyết Toán {editingSettlement.settlement_code}
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
