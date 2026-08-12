'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Scale,
  Search,
  Plus,
  Trash2,
  Printer,
  Share2,
  FileImage,
  Save,
  CheckCircle2,
  Wheat,
  Truck,
  UserCheck,
  MapPin,
  Coins,
  Package,
  RotateCcw,
  Sparkles,
  Camera,
  Percent
} from 'lucide-react';
import Link from 'next/link';
import { toPng } from 'html-to-image';

export default function WeighingPage() {
  const {
    farmers,
    staffMembers,
    trucks,
    varieties,
    growingAreas,
    createSession,
    completeSession,
    currentUser
  } = useApp();

  // Search & Form Selections
  const [farmerSearch, setFarmerSearch] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(staffMembers[0]?.id || '');
  const [selectedTruckId, setSelectedTruckId] = useState(trucks[0]?.id || '');
  const [selectedVarietyId, setSelectedVarietyId] = useState(varieties[0]?.id || '');
  const [selectedAreaId, setSelectedAreaId] = useState(growingAreas[0]?.id || '');
  const [fieldRegion, setFieldRegion] = useState(farmers[0]?.field_region || growingAreas[0]?.field_region || 'Xứ đồng An Trạch 1');
  const [lot, setLot] = useState(farmers[0]?.lot || growingAreas[0]?.lot || 'Lô A1');
  const [unitPrice, setUnitPrice] = useState<number>(varieties[0]?.default_price || 9500);

  // Active Session State
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState<string>('');

  // Mobile Weigh Entry State: 1 bao, 2 bao, 3 bao & Tare Deduction Percentage (Mặc định 12%)
  const [bagCount, setBagCount] = useState<number>(2); // 1, 2, hoặc 3 bao
  const [grossWeightInput, setGrossWeightInput] = useState<string>('150'); // Kg lúa tươi lượt này
  const [tarePercentInput, setTarePercentInput] = useState<string>('12'); // Trừ bì % mặc định 12%

  // Calculate current item tare weight & net weight
  const currentGross = parseFloat(grossWeightInput) || 0;
  const currentTarePercent = parseFloat(tarePercentInput) || 12;
  const currentTareKg = Math.round((currentGross * (currentTarePercent / 100)) * 100) / 100;
  const currentNetKg = Math.max(0, Math.round((currentGross - currentTareKg) * 100) / 100);

  // Items table for current weighing
  const [items, setItems] = useState<Array<{ id: string; sequence: number; bag_count: number; gross_weight: number; tare_percent: number; tare_weight: number; net_weight: number }>>([
    { id: '1', sequence: 1, bag_count: 3, gross_weight: 150, tare_percent: 12, tare_weight: 18, net_weight: 132 },
    { id: '2', sequence: 2, bag_count: 3, gross_weight: 152, tare_percent: 12, tare_weight: 18.24, net_weight: 133.76 },
    { id: '3', sequence: 3, bag_count: 2, gross_weight: 98, tare_percent: 12, tare_weight: 11.76, net_weight: 86.24 }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [zaloSuccessMsg, setZaloSuccessMsg] = useState('');
  const [zaloMsg, setZaloMsg] = useState('');
  const ticketRef = useRef<HTMLDivElement>(null);

  // Auto update fields when Farmer changes
  const handleFarmerChange = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    const f = farmers.find(item => item.id === farmerId);
    if (f) {
      setFieldRegion(f.field_region);
      setLot(f.lot);
      const matchingArea = growingAreas.find(a => a.field_region === f.field_region && a.lot === f.lot);
      if (matchingArea) {
        setSelectedAreaId(matchingArea.id);
      }
    }
  };

  // Auto update when Growing Area dropdown changes
  const handleAreaSelectChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    const area = growingAreas.find(a => a.id === areaId);
    if (area) {
      setFieldRegion(area.field_region);
      setLot(area.lot);
    }
  };

  // Auto update price when Variety changes
  const handleVarietyChange = (varId: string) => {
    setSelectedVarietyId(varId);
    const v = varieties.find(item => item.id === varId);
    if (v) {
      setUnitPrice(v.default_price);
    }
  };

  // Numpad button clicks
  const handleNumpadPress = (val: string) => {
    if (val === 'C') {
      setGrossWeightInput('0');
    } else if (val === 'DEL') {
      setGrossWeightInput(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setGrossWeightInput(prev => prev === '0' ? val : prev + val);
    }
  };

  // Add Weighing Entry (1, 2, hoặc 3 bao)
  const handleAddWeighEntry = () => {
    const gross = parseFloat(grossWeightInput) || 0;
    const tarePercent = parseFloat(tarePercentInput) || 12;
    if (gross <= 0) {
      alert('Vui lòng nhập sản lượng tươi lớn hơn 0 kg!');
      return;
    }
    const tareKg = Math.round((gross * (tarePercent / 100)) * 100) / 100;
    const netKg = Math.max(0, Math.round((gross - tareKg) * 100) / 100);

    const newItem = {
      id: Date.now().toString(),
      sequence: items.length + 1,
      bag_count: bagCount,
      gross_weight: gross,
      tare_percent: tarePercent,
      tare_weight: tareKg,
      net_weight: netKg
    };

    setItems(prev => [...prev, newItem]);
    setGrossWeightInput('150'); // reset default for fast repeat
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id).map((item, idx) => ({ ...item, sequence: idx + 1 })));
  };

  // Cumulative Totals
  const totalBags = items.reduce((sum, item) => sum + item.bag_count, 0);
  const totalFreshWeight = Math.round(items.reduce((sum, item) => sum + item.gross_weight, 0) * 100) / 100;
  const totalTareWeight = Math.round(items.reduce((sum, item) => sum + item.tare_weight, 0) * 100) / 100;
  const totalDryWeight = Math.max(0, Math.round((totalFreshWeight - totalTareWeight) * 100) / 100);
  const totalAmount = Math.round(totalDryWeight * unitPrice);

  // Selected entities info
  const currentFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];
  const currentStaff = staffMembers.find(s => s.id === selectedStaffId) || staffMembers[0];
  const currentTruck = trucks.find(t => t.id === selectedTruckId) || trucks[0];
  const currentVariety = varieties.find(v => v.id === selectedVarietyId) || varieties[0];

  // Save / Record Session
  const handleSaveSession = () => {
    if (items.length === 0) {
      alert('Chưa có lượt cân nào để lưu!');
      return;
    }

    const sessionData = {
      farmer_id: selectedFarmerId,
      staff_id: selectedStaffId,
      truck_id: selectedTruckId,
      variety_id: selectedVarietyId,
      field_region: fieldRegion,
      lot,
      unit_price: unitPrice,
    };

    const newSes = createSession(sessionData);
    setActiveSessionId(newSes.id);
    setSessionCode(newSes.session_code);
    completeSession(newSes.id);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Zalo Text Export & Web Share
  const handleShareZalo = () => {
    const text = `🌾 PHIẾU CÂN LÚA RICE OS
--------------------------------
Mã phiên: ${sessionCode || 'PC-MỚI'}
Chủ lúa: ${currentFarmer?.name} (SĐT: ${currentFarmer?.phone})
Cán bộ cân: ${currentStaff?.full_name}
Xe nhận: ${currentTruck?.license_plate} (${currentTruck?.driver_name})
Giống lúa: ${currentVariety?.name}
Xứ đồng: ${fieldRegion} - ${lot}
Trừ bì cài đặt: ${tarePercentInput}%
--------------------------------
• Tổng số bao: ${totalBags} bao
• Sản lượng tươi: ${totalFreshWeight.toLocaleString('vi-VN')} kg
• Tổng trừ bì (${tarePercentInput}%): ${totalTareWeight.toLocaleString('vi-VN')} kg
• Sản lượng khô thực tính: ${totalDryWeight.toLocaleString('vi-VN')} kg
• Đơn giá mua: ${unitPrice.toLocaleString('vi-VN')} VNĐ/kg
================================
TỔNG THÀNH TIỀN: ${totalAmount.toLocaleString('vi-VN')} VNĐ
================================`;

    navigator.clipboard.writeText(text);
    setZaloSuccessMsg('Đã sao chép thông tin phiếu cân gửi Zalo thành công!');
    setTimeout(() => setZaloSuccessMsg(''), 3500);
  };

  // Image Export for Zalo
  const handleExportImage = async () => {
    if (!ticketRef.current) return;
    try {
      const dataUrl = await toPng(ticketRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `PhieuCan_${sessionCode || 'New'}_${currentFarmer?.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Lỗi kết xuất ảnh:', err);
      alert('Không thể tạo ảnh phiếu cân. Vui lòng thử lại!');
    }
  };

  // Thermal Print
  const handlePrint = () => {
    window.print();
  };

  // Filtered farmers list
  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
    f.phone.includes(farmerSearch) ||
    f.field_region.toLowerCase().includes(farmerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gold-400 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
              <Scale className="w-6 h-6 text-gold-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              Phiên Cân Lúa Trực Tiếp
              {savedSuccess && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã Lưu!
                </span>
              )}
              {zaloSuccessMsg && (
                <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã Sao Chép Zalo!
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-300">
              Nhập liệu 1 bao, 2 bao, 3 bao • Trừ bì theo % (Mặc định {tarePercentInput}%) • Tính tự động
            </p>
          </div>
        </div>

        {/* Quick OCR AI Camera shortcut */}
        <Link
          href="/ai-camera"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-700/60 hover:bg-emerald-900 text-gold-300 font-bold text-xs shadow-md transition-colors"
        >
          <Camera className="w-4 h-4 text-gold-400" />
          <span>AI Camera Đọc Cân</span>
        </Link>
      </div>

      {/* Form Selection Section (Chủ ruộng, Cán bộ, Xe, Giống lúa, Xứ đồng, Lô) */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2 border-b border-emerald-800/40 pb-2">
          <Wheat className="w-4 h-4 text-gold-400" /> Thông Tin Thu Mua Phiên Cân
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Search & Select Farmer (Hộ sản xuất / Chủ ruộng) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-gold-400" /> Chọn Hộ Sản Xuất (Chủ Ruộng) *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm tên, SĐT chủ ruộng..."
                value={farmerSearch}
                onChange={(e) => setFarmerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-brand-dark/90 border border-emerald-800/60 rounded-lg text-white text-xs mb-1 focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <select
              value={selectedFarmerId}
              onChange={(e) => handleFarmerChange(e.target.value)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {filteredFarmers.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} - {f.phone} ({f.field_region})
                </option>
              ))}
            </select>
          </div>

          {/* Select Staff (Cán bộ cân) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-teal-400" /> Cán Bộ Phụ Trách Cân *
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {staffMembers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Select Truck (Xe nhận) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-400" /> Xe Vận Chuyển Nhận Lúa *
            </label>
            <select
              value={selectedTruckId}
              onChange={(e) => setSelectedTruckId(e.target.value)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {trucks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.license_plate} - Tài xế {t.driver_name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Variety (Giống lúa) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5 text-gold-400" /> Chọn Giống Lúa *
            </label>
            <select
              value={selectedVarietyId}
              onChange={(e) => handleVarietyChange(e.target.value)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {varieties.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.code}) - {v.default_price.toLocaleString('vi-VN')}đ/kg
                </option>
              ))}
            </select>
          </div>

          {/* Select & Override Xứ đồng & Lô (Dropdown từ Vùng Trồng) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Lựa Chọn Vùng Trồng (Xứ Đồng & Lô) *
            </label>
            <select
              value={selectedAreaId}
              onChange={(e) => handleAreaSelectChange(e.target.value)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {growingAreas.map(a => (
                <option key={a.id} value={a.id}>
                  {a.field_region} - {a.lot} ({a.area.toLocaleString('vi-VN')} m²)
                </option>
              ))}
            </select>
          </div>

          {/* Unit Price (Giá mua) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-gold-400" /> Đơn Giá Mua (VNĐ / kg) *
            </label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-gold-300 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

        </div>
      </div>

      {/* Main Weighing Execution Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Mobile Numpad Data Entry Panel (5 Columns) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" /> Nhập Lượt Cân (Tươi & Trừ Bì %)
            </h3>
            <span className="text-[10px] text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/30 font-bold">
              Lần cân thứ {items.length + 1}
            </span>
          </div>

          {/* Select Bag Count Option (1 bao, 2 bao, hoặc 3 bao) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Chọn số bao lượt này:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setBagCount(count)}
                  className={`py-2.5 px-2 rounded-xl font-extrabold text-xs border flex items-center justify-center gap-1 transition-all ${
                    bagCount === count
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg scale-105'
                      : 'bg-emerald-950/60 border-emerald-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" /> {count} Bao
                </button>
              ))}
            </div>
          </div>

          {/* Tare Percentage (%) Setting (Mặc định 12% tùy chỉnh) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gold-300 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-gold-400" /> Tỉ lệ trừ bì (%) * (Mặc định 12%):
              </label>
              <span className="text-[11px] text-emerald-400 font-bold">
                = {currentTareKg} kg trừ bì
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {['10', '11', '12', '13', '15'].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTarePercentInput(pct)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    tarePercentInput === pct
                      ? 'bg-gold-500/30 border-gold-400 text-gold-300'
                      : 'bg-emerald-950 border-emerald-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="number"
              step="0.1"
              value={tarePercentInput}
              onChange={(e) => setTarePercentInput(e.target.value)}
              placeholder="12"
              className="w-full mt-1.5 p-2 bg-brand-dark border border-gold-500/50 rounded-xl text-right font-bold text-gold-300 text-xs focus:outline-none"
            />
          </div>

          {/* Gross Weight Display & Calculation Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Sản lượng tươi (kg)
              </label>
              <div className="p-3 rounded-xl bg-brand-dark border-2 border-emerald-500/60 text-right">
                <span className="text-2xl font-black text-emerald-400 tracking-wider">
                  {grossWeightInput || '0'}
                </span>
                <span className="text-xs text-slate-400 ml-1">kg</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Lúa khô tính toán ({100 - currentTarePercent}%)
              </label>
              <div className="p-3 rounded-xl bg-brand-dark border border-gold-500/60 text-right">
                <span className="text-2xl font-black text-gold-300 tracking-wider">
                  {currentNetKg}
                </span>
                <span className="text-xs text-gold-400 ml-1">kg</span>
              </div>
            </div>
          </div>

          {/* Quick Add Kg Preset Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['50', '100', '120', '135', '150', '160'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setGrossWeightInput(preset)}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 hover:border-emerald-500 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
              >
                +{preset}kg
              </button>
            ))}
          </div>

          {/* Mobile Friendly Numpad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((btn) => (
              <button
                key={btn}
                type="button"
                onClick={() => handleNumpadPress(btn)}
                className={`py-3 rounded-xl font-black text-lg transition-transform active:scale-95 shadow-md ${
                  btn === 'C'
                    ? 'bg-red-950/80 text-red-400 border border-red-800/60 hover:bg-red-900'
                    : btn === 'DEL'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60 hover:bg-amber-900'
                    : 'bg-emerald-950/80 text-white border border-emerald-800/60 hover:bg-emerald-900'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Add Entry Button */}
          <button
            type="button"
            onClick={handleAddWeighEntry}
            className="w-full py-3.5 rounded-xl font-extrabold text-sm text-brand-dark bg-gradient-to-r from-emerald-400 via-emerald-300 to-gold-400 hover:brightness-110 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-5 h-5" /> Thêm Lượt Cân Này (+{bagCount} Bao • Trừ bì {tarePercentInput}%)
          </button>
        </div>

        {/* Session Items Table & Cumulative Calculation Panel (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">

          {/* Real-time Summary Cards Header */}
          <div className="glass-card-gold p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-400/80">TỔNG SỐ BAO</span>
              <p className="text-xl font-black text-gold-300">{totalBags} bao</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-400/80">SẢN LƯỢNG TƯƠI</span>
              <p className="text-xl font-black text-white">{totalFreshWeight.toLocaleString('vi-VN')} kg</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-400/80">SẢN LƯỢNG KHÔ</span>
              <p className="text-xl font-black text-emerald-400">{totalDryWeight.toLocaleString('vi-VN')} kg</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-400/80">THÀNH TIỀN</span>
              <p className="text-lg font-black text-gold-300">{totalAmount.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="glass-card p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Danh Sách Chi Tiết {items.length} Lượt Cân
              </h3>
              <span className="text-[11px] text-gold-400 font-semibold">Trừ bì % tự động</span>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-950/80 text-emerald-400 uppercase text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="p-2">Lượt</th>
                    <th className="p-2">Số bao</th>
                    <th className="p-2 text-right">Cân tươi (kg)</th>
                    <th className="p-2 text-right">Trừ bì (%)</th>
                    <th className="p-2 text-right">Trừ bì (kg)</th>
                    <th className="p-2 text-right">Cân khô (kg)</th>
                    <th className="p-2 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-400 text-xs">
                        Chưa có lượt cân nào. Hãy bấm nút Thêm Lượt Cân ở bên trái.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-emerald-900/30">
                        <td className="p-2 font-bold text-gold-300">#{item.sequence}</td>
                        <td className="p-2 font-semibold text-white">{item.bag_count} bao</td>
                        <td className="p-2 text-right font-bold text-emerald-300">{item.gross_weight} kg</td>
                        <td className="p-2 text-right font-bold text-gold-400">{item.tare_percent}%</td>
                        <td className="p-2 text-right text-slate-300">{item.tare_weight} kg</td>
                        <td className="p-2 text-right font-extrabold text-white">{item.net_weight} kg</td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleSaveSession}
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-gold-400" />
              <span>Ghi Nhập</span>
            </button>

            <button
              onClick={handleShareZalo}
              className="py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Gửi Zalo</span>
            </button>

            <button
              onClick={handleExportImage}
              className="py-3 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <FileImage className="w-4 h-4" />
              <span>Xuất Ảnh</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-dark font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu</span>
            </button>
          </div>

        </div>

      </div>

      {/* Hidden Printable Thermal Receipt Ticket */}
      <div className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 mb-2">Xem Trước Phiếu Cân Nhiệt (Receipt Preview):</h3>

        <div
          ref={ticketRef}
          id="printable-ticket"
          className="max-w-sm mx-auto bg-white text-black p-4 rounded-xl shadow-2xl font-mono text-xs space-y-3 border border-slate-300"
        >
          <div className="text-center border-b border-black pb-2">
            <h2 className="font-extrabold text-base tracking-wider">HỢP TÁC XÃ NÔNG NGHIỆP RICE OS</h2>
            <p className="text-[10px]">PHIẾU CÂN LÚA THU MUA TẠI RUỘNG</p>
            <p className="text-[10px] font-bold mt-0.5">Mã: {sessionCode || 'PC-20260812-DEMO'}</p>
          </div>

          <div className="space-y-1 text-[11px]">
            <p><strong>Chủ lúa:</strong> {currentFarmer?.name}</p>
            <p><strong>SĐT:</strong> {currentFarmer?.phone}</p>
            <p><strong>Cán bộ cân:</strong> {currentStaff?.full_name}</p>
            <p><strong>Xe nhận:</strong> {currentTruck?.license_plate} ({currentTruck?.driver_name})</p>
            <p><strong>Giống lúa:</strong> {currentVariety?.name}</p>
            <p><strong>Xứ đồng:</strong> {fieldRegion} - {lot}</p>
            <p><strong>Ngày cân:</strong> {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')}</p>
          </div>

          <table className="w-full border-t border-b border-black text-[10px] my-2 text-left">
            <thead>
              <tr className="border-b border-black">
                <th className="py-1">Lượt</th>
                <th className="py-1">Bao</th>
                <th className="py-1 text-right">Tươi</th>
                <th className="py-1 text-right">Trừ bì %</th>
                <th className="py-1 text-right">Trừ bì kg</th>
                <th className="py-1 text-right">Khô</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id}>
                  <td className="py-0.5">#{it.sequence}</td>
                  <td className="py-0.5">{it.bag_count}</td>
                  <td className="py-0.5 text-right">{it.gross_weight}</td>
                  <td className="py-0.5 text-right">{it.tare_percent}%</td>
                  <td className="py-0.5 text-right">{it.tare_weight}</td>
                  <td className="py-0.5 text-right font-bold">{it.net_weight}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1 text-right font-bold text-[11px]">
            <p>TỔNG SỐ BAO: <span className="text-sm">{totalBags} bao</span></p>
            <p>SẢN LƯỢNG TƯƠI: {totalFreshWeight.toLocaleString('vi-VN')} kg</p>
            <p>TỔNG TRỪ BÌ: {totalTareWeight.toLocaleString('vi-VN')} kg</p>
            <p>SẢN LƯỢNG KHÔ: <span className="text-sm underline">{totalDryWeight.toLocaleString('vi-VN')} kg</span></p>
            <p>ĐƠN GIÁ MUA: {unitPrice.toLocaleString('vi-VN')} VNĐ/kg</p>
            <div className="border-t-2 border-black pt-1 mt-1 text-sm font-black">
              THÀNH TIỀN: {totalAmount.toLocaleString('vi-VN')} VNĐ
            </div>
          </div>

          <div className="text-center text-[9px] pt-2 border-t border-dashed border-black">
            <p>Cảm ơn bà con nông dân đã tin tưởng hợp tác!</p>
            <p>Cán bộ cân & Chủ lúa ký xác nhận</p>
          </div>
        </div>
      </div>

    </div>
  );
}
