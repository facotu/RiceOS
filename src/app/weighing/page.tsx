'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Percent,
  RefreshCw,
  Undo2,
  Volume2,
  VolumeX,
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import FarmerPickerModal from '@/components/FarmerPickerModal';

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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [farmerSearch, setFarmerSearch] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(staffMembers[0]?.id || '');
  const [selectedTruckId, setSelectedTruckId] = useState(trucks[0]?.id || '');
  const [selectedVarietyId, setSelectedVarietyId] = useState(varieties[0]?.id || '');
  const [selectedAreaId, setSelectedAreaId] = useState(growingAreas[0]?.id || '');
  const [fieldRegion, setFieldRegion] = useState(farmers[0]?.field_region || growingAreas[0]?.field_region || 'Tổ 9');
  const [lot, setLot] = useState(farmers[0]?.lot || growingAreas[0]?.lot || 'Lô 1');
  const [unitPrice, setUnitPrice] = useState<number>(varieties[0]?.default_price || 8400);

  // Sound Feedback & Keypad drawer
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showNumpadOverlay, setShowNumpadOverlay] = useState<boolean>(false);

  // Active Session State
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionCode, setSessionCode] = useState<string>('');

  // Mobile Weigh Entry State: 1 bao, 2 bao, 3 bao, 4 bao & Tare Deduction Percentage (Mặc định 12%)
  const [bagCount, setBagCount] = useState<number>(2); // 1, 2, 3, 4 bao
  const [grossWeightInput, setGrossWeightInput] = useState<string>('150'); // Kg lúa tươi lượt này
  const [tarePercentInput, setTarePercentInput] = useState<string>('12'); // Trừ bì % mặc định 12%

  // Items table for current weighing
  const [items, setItems] = useState<Array<{ id: string; sequence: number; bag_count: number; gross_weight: number; tare_percent: number; tare_weight: number; net_weight: number }>>([
    { id: '1', sequence: 1, bag_count: 3, gross_weight: 150, tare_percent: 12, tare_weight: 18, net_weight: 132 },
    { id: '2', sequence: 2, bag_count: 3, gross_weight: 152, tare_percent: 12, tare_weight: 18.24, net_weight: 133.76 },
    { id: '3', sequence: 3, bag_count: 2, gross_weight: 98, tare_percent: 12, tare_weight: 11.76, net_weight: 86.24 }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [zaloSuccessMsg, setZaloSuccessMsg] = useState('');
  const ticketRef = useRef<HTMLDivElement>(null);
  const grossInputRef = useRef<HTMLInputElement>(null);

  // Audio Beep generator using Web Audio API
  const playBeep = useCallback((freq = 800, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio Context blocked or unavailable
    }
  }, [soundEnabled]);

  // Restore session items from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('riceos_active_weighing_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items) && parsed.items.length > 0) {
          setItems(parsed.items);
        }
        if (parsed.farmer_id) setSelectedFarmerId(parsed.farmer_id);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Autosave active items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('riceos_active_weighing_session', JSON.stringify({
        items,
        farmer_id: selectedFarmerId,
        updated_at: new Date().toISOString()
      }));
    } catch (e) {
      // Ignore storage errors
    }
  }, [items, selectedFarmerId]);

  // Calculate current item tare weight & net weight
  const currentGross = parseFloat(grossWeightInput) || 0;
  const currentTarePercent = parseFloat(tarePercentInput) || 12;
  const currentTareKg = Math.round((currentGross * (currentTarePercent / 100)) * 100) / 100;
  const currentNetKg = Math.max(0, Math.round((currentGross - currentTareKg) * 100) / 100);

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
    playBeep(900, 0.04);
    if (val === 'C') {
      setGrossWeightInput('');
    } else if (val === 'DEL') {
      setGrossWeightInput(prev => prev.length > 1 ? prev.slice(0, -1) : '');
    } else {
      setGrossWeightInput(prev => (prev === '0' || prev === '' ? val : prev + val));
    }
  };

  // Add Weighing Entry (1, 2, 3, 4 bao)
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
    playBeep(1000, 0.1); // High beep on successful add
    setGrossWeightInput('150'); // reset default for fast repeat

    // Re-focus input for continuous physical keypad entry
    setTimeout(() => {
      grossInputRef.current?.focus();
    }, 50);
  };

  // Quick Preset Weight Click (+40, +50, +60, +70, +80, +100, +120, +150)
  const handlePresetWeight = (wt: number) => {
    setGrossWeightInput(wt.toString());
    playBeep(850, 0.05);
  };

  // Remove individual item
  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id).map((item, idx) => ({ ...item, sequence: idx + 1 })));
    playBeep(400, 0.1);
  };

  // Undo last added item
  const handleUndoLastItem = () => {
    if (items.length === 0) return;
    setItems(prev => prev.slice(0, -1));
    playBeep(400, 0.1);
  };

  // Reset & Start New Weighing Session
  const handleResetNewSession = () => {
    if (items.length > 0 && !confirm('Bạn có chắc chắn muốn xóa lượt cân hiện tại để mở Phiên Cân Mới?')) {
      return;
    }
    setItems([]);
    setGrossWeightInput('150');
    setActiveSessionId(null);
    setSessionCode('');
    setSavedSuccess(false);
    localStorage.removeItem('riceos_active_weighing_session');
    playBeep(600, 0.15);
  };

  // Save / Record Session & Switch to Next Farmer
  const handleSaveAndNextFarmer = () => {
    handleSaveSession();
    setIsPickerOpen(true);
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
    playBeep(1200, 0.2);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Zalo Text Export & Web Share
  const handleShareZalo = () => {
    const text = `🌾 PHIẾU CÂN LÚA RICE OS
--------------------------------
Mã phiên: ${sessionCode || 'PC-20260813-MỚI'}
Hộ sản xuất: ${currentFarmer?.name} (SĐT: ${currentFarmer?.phone})
Cán bộ cân: ${currentStaff?.full_name}
Xe nhận: ${currentTruck?.license_plate} (${currentTruck?.driver_name})
Giống lúa: ${currentVariety?.name} (${currentVariety?.code})
Xứ đồng: ${fieldRegion} - ${lot}
Trừ bì cài đặt: ${tarePercentInput}%
--------------------------------
• Tổng số bao: ${totalBags} bao (${items.length} lượt cân)
• Sản lượng tươi: ${totalFreshWeight.toLocaleString('vi-VN')} kg
• Tổng trừ bì (${tarePercentInput}%): ${totalTareWeight.toLocaleString('vi-VN')} kg
• Sản lượng khô thực tính: ${totalDryWeight.toLocaleString('vi-VN')} kg
• Đơn giá mua: ${unitPrice.toLocaleString('vi-VN')} VNĐ/kg
================================
TỔNG THÀNH TIỀN: ${totalAmount.toLocaleString('vi-VN')} VNĐ
================================`;

    navigator.clipboard.writeText(text);
    setZaloSuccessMsg('Đã sao chép thông tin phiếu cân gửi Zalo thành công!');
    playBeep(900, 0.1);
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

  // Print Receipt
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">

      {/* Top Banner Header */}
      <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-sky-500 to-gold-400 p-0.5 shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-[#0b132b] rounded-[14px] flex items-center justify-center">
              <Scale className="w-6 h-6 text-gold-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                Nghiệp Vụ Cân Lúa Siêu Tốc Thực Địa
              </span>
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${
                  soundEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-700/40 text-slate-400 border-slate-600'
                }`}
                title="Bật/Tắt âm thanh tít khi gõ cân"
              >
                {soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
                <span>{soundEnabled ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT'}</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              Phiên Cân Lúa Siêu Tốc Ngoài Đồng
              {savedSuccess && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã Lưu Phiên Cân!
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-300">
              Phím Enter nhập liệu siêu tốc • Tự động trừ bì {tarePercentInput}% • Tự động lưu không mất dữ liệu 4G
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleResetNewSession}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-bold text-xs shadow-md transition-colors cursor-pointer"
            title="Xóa danh sách lượt cân để bắt đầu cân cho hộ tiếp theo"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-400" />
            <span>Tạo Phiên Mới</span>
          </button>

          <Link
            href="/ai-camera"
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:brightness-110 text-brand-dark font-extrabold text-xs shadow-md transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>AI Camera Đọc Cân</span>
          </Link>
        </div>
      </div>

      {/* Form Selection Section (Chủ hộ sản xuất, Cán bộ, Xe, Giống lúa, Xứ đồng, Lô) */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2">
          <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
            <Wheat className="w-4 h-4 text-gold-400" /> Thông Tin Nông Hộ & Vùng Trồng Thu Mua
          </h3>
          <span className="text-xs text-slate-400">
            Hộ sản xuất: <strong className="text-gold-300">{currentFarmer?.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Touch-friendly Smart Farmer & Plot Selector */}
          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-gold-400" /> Chọn Hộ Sản Xuất & Thửa Đất *
              </span>
              {currentFarmer?.landowner_name && (
                <span className="text-[10px] text-slate-400 font-normal">Chủ: {currentFarmer.landowner_name}</span>
              )}
            </label>

            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="w-full text-left p-2.5 bg-emerald-950/90 border border-emerald-600/80 hover:border-gold-400 rounded-xl transition-all flex items-center justify-between group shadow-md cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-gold-300 group-hover:text-gold-200">
                    {currentFarmer?.name}
                  </span>
                  {currentFarmer?.landowner_name && (
                    <span className="text-[10px] text-slate-400 font-normal">(Chủ: {currentFarmer.landowner_name})</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
                  {fieldRegion} - <strong className="text-gold-300">{lot}</strong> ({currentFarmer?.area.toLocaleString('vi-VN')} m²) • {currentFarmer?.phone}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600/40 text-emerald-200 text-[11px] font-bold border border-emerald-500/40 group-hover:bg-emerald-500 group-hover:text-white transition-all whitespace-nowrap">
                Đổi Hộ 🔍
              </span>
            </button>
          </div>

          {/* Select Staff (Cán bộ cân) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Cán Bộ Phụ Trách Cân *
            </label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none"
            >
              {staffMembers.map(s => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.phone})</option>
              ))}
            </select>
          </div>

          {/* Select Truck (Xe vận chuyển) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-400" /> Xe Nhận Vận Chuyển *
            </label>
            <select
              value={selectedTruckId}
              onChange={(e) => setSelectedTruckId(e.target.value)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none"
            >
              {trucks.map(t => (
                <option key={t.id} value={t.id}>{t.license_plate} - {t.driver_name} ({t.phone})</option>
              ))}
            </select>
          </div>

          {/* Select Variety & Unit Price */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5 text-gold-400" /> Giống Lúa & Giá Mua (VNĐ/kg) *
            </label>
            <div className="flex gap-2">
              <select
                value={selectedVarietyId}
                onChange={(e) => handleVarietyChange(e.target.value)}
                className="w-1/2 p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none"
              >
                {varieties.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>

              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-1/2 p-2.5 bg-brand-dark border border-gold-500/60 rounded-xl text-gold-300 font-extrabold text-xs focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Tare Percentage Config (Trừ Bì %) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-sky-400" /> Cài Đặt Trừ Bì Bao Lúa (%) *
            </label>
            <div className="flex gap-1.5">
              {['10', '11', '12', '13', '15'].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTarePercentInput(pct)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                    tarePercentInput === pct
                      ? 'bg-sky-600 text-white border-sky-400 shadow'
                      : 'bg-emerald-950/80 border-emerald-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Area & Lot Location */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> Xứ Đồng & Lô *
            </label>
            <select
              value={selectedAreaId}
              onChange={(e) => handleAreaSelectChange(e.target.value)}
              className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-semibold focus:outline-none"
            >
              {growingAreas.map(a => (
                <option key={a.id} value={a.id}>{a.field_region} - {a.lot} ({a.area.toLocaleString('vi-VN')} m²)</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Main Weighing Entry Card (Khối Nhập Liệu Cân Trực Tiếp) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left Input Control Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-2xl space-y-4 border border-emerald-600/50 shadow-xl">
            <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-gold-400" />
                Cân Lượt Tiếp Theo
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LƯỢT THỨ #{items.length + 1}
              </span>
            </div>

            {/* Bag Count Selector (1 bao, 2 bao, 3 bao, 4 bao, 5 bao) */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                1. Chọn Số Bao Lượt Cân Này:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => { setBagCount(count); playBeep(700, 0.04); }}
                    className={`py-3 rounded-xl font-extrabold text-xs sm:text-sm border transition-all cursor-pointer ${
                      bagCount === count
                        ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-brand-dark border-gold-300 shadow-lg scale-105 font-black'
                        : 'bg-emerald-950/80 border-emerald-800/80 text-slate-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    {count} Bao
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Input Box with Keyboard Enter Shortcut */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  2. Nhập Sản Lượng Tươi (Kg):
                </label>
                <button
                  type="button"
                  onClick={() => setShowNumpadOverlay(!showNumpadOverlay)}
                  className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  {showNumpadOverlay ? 'Ẩn Bàn Phím Số' : 'Hiện Bàn Phím Cảm Ứng'}
                </button>
              </div>

              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={grossInputRef}
                    type="number"
                    step="0.1"
                    value={grossWeightInput}
                    onChange={(e) => setGrossWeightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddWeighEntry();
                      }
                    }}
                    placeholder="Gõ kg lúa tươi rồi ấn ENTER..."
                    className="w-full p-3.5 bg-brand-dark/95 border-2 border-emerald-500 rounded-2xl text-white font-black text-2xl tracking-wider focus:outline-none focus:border-gold-400 shadow-inner font-mono text-center"
                  />
                  <span className="absolute right-4 top-4 text-xs font-black text-gold-400">KG TƯƠI</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddWeighEntry}
                  className="px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:brightness-110 text-white font-black text-sm shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" /> THÊM LƯỢT (ENTER)
                </button>
              </div>
            </div>

            {/* Quick Weight Preset Buttons (+40, +50, +60, +70, +80, +100, +120, +150) */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Gợi ý nhanh kg chuẩn ngoài đồng:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[60, 90, 100, 110, 120, 140, 150, 180].map(wt => (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => handlePresetWeight(wt)}
                    className="py-1.5 px-2 rounded-xl bg-emerald-950 border border-emerald-800 hover:border-emerald-600 text-emerald-300 font-bold text-xs font-mono transition-colors"
                  >
                    +{wt} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Live Calculation Preview Box */}
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cân tươi lượt này:</span>
                <strong className="text-white font-mono">{currentGross.toLocaleString('vi-VN')} kg</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tỷ lệ trừ bì bao lúa ({currentTarePercent}%):</span>
                <strong className="text-gold-400 font-mono">-{currentTareKg.toLocaleString('vi-VN')} kg</strong>
              </div>
              <div className="flex justify-between items-center border-t border-emerald-900/60 pt-1.5">
                <span className="font-extrabold text-emerald-300">Lúa khô thực tính lượt này:</span>
                <strong className="text-emerald-400 font-black text-sm font-mono">{currentNetKg.toLocaleString('vi-VN')} kg</strong>
              </div>
            </div>

            {/* Numpad Touch Screen Drawer */}
            {showNumpadOverlay && (
              <div className="p-3 bg-brand-dark/95 border border-emerald-700/60 rounded-2xl space-y-2 animate-in zoom-in-95">
                <div className="grid grid-cols-3 gap-2">
                  {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'C'].map((btn) => (
                    <button
                      key={btn}
                      type="button"
                      onClick={() => handleNumpadPress(btn)}
                      className={`p-3 rounded-xl font-black text-lg shadow border transition-all ${
                        btn === 'C'
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-emerald-950 border-emerald-800 text-white hover:bg-emerald-900'
                      }`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleNumpadPress('DEL')}
                    className="flex-1 py-2 bg-slate-800 border border-slate-700 text-white font-bold rounded-xl text-xs"
                  >
                    ⌫ Xóa Ký Tự
                  </button>
                  <button
                    type="button"
                    onClick={handleAddWeighEntry}
                    className="flex-1 py-2 bg-emerald-600 border border-emerald-500 text-white font-extrabold rounded-xl text-xs"
                  >
                    ✓ Nhập Cân Lượt Này
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Weighing Table & Totals */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 rounded-2xl space-y-4 flex flex-col h-full justify-between">

            <div>
              {/* Header & Undo Toolbar */}
              <div className="flex justify-between items-center border-b border-emerald-800/40 pb-3 mb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-gold-400" />
                    Danh Sách Các Lượt Cân ({items.length} lượt • {totalBags} bao)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Hộ: <strong className="text-gold-300">{currentFarmer?.name}</strong> • Xứ đồng: {fieldRegion} ({lot})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUndoLastItem}
                    disabled={items.length === 0}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer"
                    title="Xóa lượt cân vừa nhập nếu gõ nhầm"
                  >
                    <Undo2 className="w-3.5 h-3.5" /> Xóa Lượt Vừa Nhập (Undo)
                  </button>
                </div>
              </div>

              {/* Table of items */}
              <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-emerald-900/60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px] sticky top-0 font-bold">
                    <tr>
                      <th className="p-2.5">Lượt</th>
                      <th className="p-2.5 text-center">Số bao</th>
                      <th className="p-2.5 text-right">Kg tươi</th>
                      <th className="p-2.5 text-right">Trừ bì ({tarePercentInput}%)</th>
                      <th className="p-2.5 text-right">Kg khô</th>
                      <th className="p-2.5 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/40 font-mono">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          Chưa có lượt cân nào. Hãy gõ kg lúa tươi và ấn ENTER để thêm!
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="hover:bg-emerald-900/30 transition-colors">
                          <td className="p-2.5 font-bold text-gold-300">#{item.sequence}</td>
                          <td className="p-2.5 text-center font-bold text-white">
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              {item.bag_count} bao
                            </span>
                          </td>
                          <td className="p-2.5 text-right text-slate-200">{item.gross_weight.toLocaleString('vi-VN')} kg</td>
                          <td className="p-2.5 text-right text-gold-400">-{item.tare_weight.toLocaleString('vi-VN')} kg</td>
                          <td className="p-2.5 text-right font-extrabold text-emerald-400">{item.net_weight.toLocaleString('vi-VN')} kg</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                              title="Xóa lượt này"
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

            {/* Summary Totals Box */}
            <div className="pt-3 border-t border-emerald-800/40 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">TỔNG BỐI BAO</span>
                  <span className="text-base font-black text-white font-mono">{totalBags} bao</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">TỔNG TƯƠI</span>
                  <span className="text-base font-black text-blue-400 font-mono">{totalFreshWeight.toLocaleString('vi-VN')} kg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">LÚA KHÔ THỰC TÍNH</span>
                  <span className="text-base font-black text-emerald-400 font-mono">{totalDryWeight.toLocaleString('vi-VN')} kg</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gold-500/20 border border-gold-500/40">
                  <span className="text-[10px] text-gold-400 font-bold uppercase block">TỔNG THÀNH TIỀN</span>
                  <span className="text-base font-black text-gold-300 font-mono">{totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end pt-1">
                <button
                  onClick={handleShareZalo}
                  className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" /> Gửi Zalo Phiếu Cân
                </button>

                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-gold-400" /> In Phiếu Nhiệt
                </button>

                <button
                  onClick={handleSaveSession}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:brightness-110 text-brand-dark font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Lưu Phiên Cân
                </button>

                <button
                  onClick={handleSaveAndNextFarmer}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Lưu phiên cân hiện tại và mở modal chọn hộ tiếp theo"
                >
                  <span>Chuyển Hộ Tiếp Theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Thermal Receipt Ticket Preview (Mẫu phiếu in nhiệt 80mm ngoài đồng) */}
      <div className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 mb-2">Mẫu Xem Trước Phiếu In Nhiệt Kính Gửi Hộ Dân (80mm Thermal Receipt):</h3>

        <div
          ref={ticketRef}
          id="printable-ticket"
          className="max-w-xs mx-auto bg-white text-black p-4 rounded-2xl shadow-2xl font-mono text-[11px] space-y-3 border border-slate-300"
        >
          <div className="text-center border-b border-dashed border-black pb-2">
            <h2 className="font-extrabold text-sm uppercase">PHIẾU CÂN LÚA ĐIỆN TỬ</h2>
            <p className="text-[10px]">HỢP TÁC XÃ NÔNG NGHIỆP RICE OS</p>
            <p className="text-[9px] text-gray-600 mt-0.5">Mã phiên: {sessionCode || 'PC-20260813-001'}</p>
          </div>

          <div className="space-y-1 text-[10px]">
            <p><strong>Hộ sản xuất:</strong> {currentFarmer?.name}</p>
            {currentFarmer?.landowner_name && <p><strong>Chủ đất:</strong> {currentFarmer.landowner_name}</p>}
            <p><strong>SĐT:</strong> {currentFarmer?.phone}</p>
            <p><strong>Cán bộ cân:</strong> {currentStaff?.full_name}</p>
            <p><strong>Xe vận chuyển:</strong> {currentTruck?.license_plate}</p>
            <p><strong>Giống lúa:</strong> {currentVariety?.name}</p>
            <p><strong>Xứ đồng:</strong> {fieldRegion} - {lot}</p>
            <p><strong>Thời gian:</strong> {new Date().toLocaleString('vi-VN')}</p>
          </div>

          <table className="w-full border-t border-b border-black text-[10px] text-left">
            <thead>
              <tr className="border-b border-black font-bold">
                <th className="py-1">Lượt</th>
                <th className="py-1 text-center">Bao</th>
                <th className="py-1 text-right">Kg tươi</th>
                <th className="py-1 text-right">Kg khô</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-1">#{item.sequence}</td>
                  <td className="py-1 text-center">{item.bag_count}</td>
                  <td className="py-1 text-right">{item.gross_weight.toLocaleString('vi-VN')}</td>
                  <td className="py-1 text-right font-bold">{item.net_weight.toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1 text-right text-[10px]">
            <p>TỔNG SỐ BAO LÚA: <strong>{totalBags} bao</strong></p>
            <p>SẢN LƯỢNG TƯƠI: {totalFreshWeight.toLocaleString('vi-VN')} kg</p>
            <p>TỔNG TRỪ BÌ ({tarePercentInput}%): {totalTareWeight.toLocaleString('vi-VN')} kg</p>
            <p>SẢN LƯỢNG KHÔ: <span className="text-sm underline">{totalDryWeight.toLocaleString('vi-VN')} kg</span></p>
            <p>ĐƠN GIÁ MUA: {unitPrice.toLocaleString('vi-VN')} VNĐ/kg</p>
            <div className="border-t-2 border-black pt-1 mt-1 text-sm font-black">
              THÀNH TIỀN: {totalAmount.toLocaleString('vi-VN')} VNĐ
            </div>
          </div>

          <div className="text-center text-[9px] pt-2 border-t border-dashed border-black">
            <p>Cảm ơn bà con nông dân đã tin tưởng hợp tác!</p>
            <p>Cán bộ cân & Hộ sản xuất ký xác nhận</p>
          </div>
        </div>
      </div>

      {/* Smart Farmer & Plot Picker Modal */}
      <FarmerPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        farmers={farmers}
        selectedFarmerId={selectedFarmerId}
        onSelectFarmer={(f) => handleFarmerChange(f.id)}
      />

    </div>
  );
}
