// Weighing Session Module fulfilling exact user specification
// File: src/features/modules/WeighingSessionModule.tsx

import React, { useState, useRef } from "react";
import { LocalFarmer, LocalOfficer, LocalTruck, LocalVariety, LocalReceipt, WeighEntry } from "../../db/index.ts";
import { Plus, Trash2, Printer, Share2, Save, Scale, CheckCircle2, User, Truck as TruckIcon, MapPin } from "lucide-react";

interface WeighingSessionModuleProps {
  farmers: LocalFarmer[];
  officers: LocalOfficer[];
  trucks: LocalTruck[];
  varieties: LocalVariety[];
  currentUser: {
    id: string;
    full_name: string;
    phone_number?: string;
  };
  onSaveReceipt: (receipt: LocalReceipt) => Promise<void>;
  tareType: 'kg' | 'percent';
  defaultTareValue: number;
}

export const WeighingSessionModule: React.FC<WeighingSessionModuleProps> = ({
  farmers,
  officers,
  trucks,
  varieties,
  currentUser,
  onSaveReceipt,
  tareType,
  defaultTareValue
}) => {
  // 1. CHỌN CHỦ RUỘNG
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || "");
  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  // 2. CHỌN CÁN BỘ CÂN
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(currentUser.id);
  const selectedOfficer = officers.find(o => o.id === selectedOfficerId) || {
    id: currentUser.id,
    full_name: currentUser.full_name,
    phone_number: currentUser.phone_number || "0905222222"
  };

  // 3. CHỌN XE NHẬN
  const [selectedTruckId, setSelectedTruckId] = useState<string>(trucks[0]?.id || "");
  const selectedTruck = trucks.find(t => t.id === selectedTruckId) || trucks[0];

  // 4. CHỌN GIỐNG LÚA (HG12, HG244, HT1, ĐT100, J02)
  const [selectedVarietyCode, setSelectedVarietyCode] = useState<string>("J02");
  const selectedVariety = varieties.find(v => v.code === selectedVarietyCode) || varieties[0];

  // 5. CÁC LẦN CÂN TƯƠI (MỖI LẦN CÂN 2-3 BAO)
  const [entries, setEntries] = useState<WeighEntry[]>([
    { bags_count: 3, gross_weight_kg: 155.0 },
    { bags_count: 3, gross_weight_kg: 152.5 },
    { bags_count: 2, gross_weight_kg: 104.0 }
  ]);

  // Dữ liệu nhập lần cân mới
  const [newBags, setNewBags] = useState<string>("3");
  const [newWeight, setNewWeight] = useState<string>("");

  // Thêm lần cân mới vào bảng
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || parseFloat(newWeight) <= 0) return;
    setEntries([
      ...entries,
      {
        bags_count: parseInt(newBags) || 1,
        gross_weight_kg: parseFloat(newWeight)
      }
    ]);
    setNewWeight("");
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // 6. TÍNH TOÁN SẢN LƯỢNG VÀ THÀNH TIỀN
  const totalBags = entries.reduce((sum, e) => sum + e.bags_count, 0);
  const totalFreshKg = entries.reduce((sum, e) => sum + e.gross_weight_kg, 0);

  // Trừ bì
  const [currentTareType, setCurrentTareType] = useState<'kg' | 'percent'>(tareType);
  const [currentTareValue, setCurrentTareValue] = useState<number>(defaultTareValue);

  const tareKgDeduction = currentTareType === 'percent' 
    ? (totalFreshKg * currentTareValue) / 100 
    : currentTareValue;

  const totalDryKg = Math.max(0, totalFreshKg - tareKgDeduction);
  const unitPrice = selectedVariety?.unit_price || 8500;
  const totalAmount = Math.round(totalDryKg * unitPrice);

  // 7. GHI NHẬP PHIÊN CÂN
  const [isSaved, setIsSaved] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    if (entries.length === 0) {
      alert("Vui lòng nhập ít nhất 1 lần cân lúa tươi!");
      return;
    }

    const receipt: LocalReceipt = {
      id: crypto.randomUUID(),
      receipt_number: `PC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`,
      farmer_id: selectedFarmer.id,
      farmer_name: selectedFarmer.full_name,
      farmer_phone: selectedFarmer.phone_number,
      field_location: selectedFarmer.field_location || "Xứ đồng Đồng Hát",
      plot_number: selectedFarmer.plot_number || "Lô A1",
      officer_id: selectedOfficer.id,
      officer_name: selectedOfficer.full_name,
      truck_id: selectedTruck.id,
      truck_plate: selectedTruck.plate_number,
      driver_name: selectedTruck.driver_name,
      variety_code: selectedVarietyCode,
      variety_name: selectedVariety.name,
      entries,
      total_bags: totalBags,
      total_fresh_kg: totalFreshKg,
      tare_type: currentTareType,
      tare_value: currentTareValue,
      total_dry_kg: Math.round(totalDryKg * 100) / 100,
      unit_price: unitPrice,
      total_amount: totalAmount,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      status: "pending_settlement",
      created_at: new Date().toISOString(),
      synced: 0
    };

    await onSaveReceipt(receipt);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // IN PHIẾU CÂN
  const handlePrint = () => {
    window.print();
  };

  // GỬI QUA ZALO
  const handleShareZalo = () => {
    const text = `🌾 PHIẾU CÂN LÚA HTX HÒA TIẾN 2\nChủ ruộng: ${selectedFarmer.full_name} (${selectedFarmer.phone_number})\nXứ đồng: ${selectedFarmer.field_location} - Lô: ${selectedFarmer.plot_number}\nGiống lúa: ${selectedVarietyCode}\n--------------------\nTổng số bao: ${totalBags} bao\nTổng lúa tươi: ${totalFreshKg.toLocaleString()} kg\nTrừ bì: ${currentTareValue}${currentTareType === 'percent' ? '%' : 'kg'}\nLúa khô: ${totalDryKg.toFixed(2)} kg\nĐơn giá: ${unitPrice.toLocaleString()} đ/kg\nTHÀNH TIỀN: ${totalAmount.toLocaleString()} ĐỒNG\nCán bộ cân: ${selectedOfficer.full_name}`;
    navigator.clipboard.writeText(text);
    alert("Đã sao chép nội dung phiếu cân! Bạn có thể dán (Paste) để gửi trực tiếp qua Zalo cho nông dân.");
  };

  return (
    <div className="space-y-6">
      {/* 1. THÔNG TIN CHÍNH CỦA PHIÊN CÂN (4 KHỐI CHỌN) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* CHỦ RUỘNG */}
        <div className="bg-white p-4 rounded-2xl shadow-card border border-slate-100 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            <span>1. Thông tin Chủ ruộng</span>
          </label>
          <select 
            value={selectedFarmerId}
            onChange={(e) => setSelectedFarmerId(e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
          >
            {farmers.map(f => (
              <option key={f.id} value={f.id}>{f.full_name} ({f.phone_number})</option>
            ))}
          </select>
          <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
            <p><strong>CCCD:</strong> {selectedFarmer?.id_card_number || "201847592014"}</p>
            <p><strong>Xứ đồng:</strong> {selectedFarmer?.field_location} - <strong>Lô:</strong> {selectedFarmer?.plot_number}</p>
            <p><strong>Diện tích:</strong> {selectedFarmer?.area_size} sào</p>
          </div>
        </div>

        {/* CÁN BỘ CÂN */}
        <div className="bg-white p-4 rounded-2xl shadow-card border border-slate-100 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <User className="w-4 h-4 text-purple-600" />
            <span>2. Cán bộ cân</span>
          </label>
          <select
            value={selectedOfficerId}
            onChange={(e) => setSelectedOfficerId(e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
          >
            {officers.map(o => (
              <option key={o.id} value={o.id}>{o.full_name}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 pt-1">SĐT Cán bộ: {selectedOfficer?.phone_number}</p>
        </div>

        {/* XE NHẬN */}
        <div className="bg-white p-4 rounded-2xl shadow-card border border-slate-100 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <TruckIcon className="w-4 h-4 text-blue-600" />
            <span>3. Xe nhận lúa</span>
          </label>
          <select
            value={selectedTruckId}
            onChange={(e) => setSelectedTruckId(e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
          >
            {trucks.map(t => (
              <option key={t.id} value={t.id}>{t.plate_number} (TX: {t.driver_name})</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 pt-1">Tài xế: {selectedTruck?.driver_name} - {selectedTruck?.phone_number}</p>
        </div>

        {/* GIỐNG LÚA */}
        <div className="bg-white p-4 rounded-2xl shadow-card border border-slate-100 space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>4. Giống lúa thu mua</span>
          </label>
          <select
            value={selectedVarietyCode}
            onChange={(e) => setSelectedVarietyCode(e.target.value)}
            className="w-full h-11 px-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-emerald-700 uppercase"
          >
            {["HG12", "HG244", "HT1", "ĐT100", "J02"].map(code => (
              <option key={code} value={code}>Lúa giống {code}</option>
            ))}
          </select>
          <p className="text-xs font-bold text-emerald-600 pt-1">Đơn giá: {unitPrice.toLocaleString()} đ/kg</p>
        </div>

      </div>

      {/* 2. KHỐI NHẬP SẢN LƯỢNG TƯƠI VÀ BẢNG CỘNG DỒN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FORM NHẬP LẦN CÂN TƯƠI (MỖI LẦN CÂN 2-3 BAO) */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Ghi Nhập Sản Lượng Tươi</span>
          </h3>

          <form onSubmit={handleAddEntry} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Số bao lượt cân này (thường 2 - 3 bao):</label>
              <input 
                type="number"
                min="1"
                max="10"
                value={newBags}
                onChange={(e) => setNewBags(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 font-bold text-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Cân nặng thực tế (Kg):</label>
              <input 
                type="number"
                step="0.1"
                placeholder="Ví dụ: 155.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 font-bold text-xl text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
            >
              <Plus className="w-5 h-5" />
              <span>+ THÊM LẦN CÂN NÀY</span>
            </button>
          </form>

          {/* CÀI ĐẶT TRỪ BÌ BẬC CAO */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Công thức Trừ Bì:</span>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setCurrentTareType('percent')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${currentTareType === 'percent' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  %
                </button>
                <button 
                  onClick={() => setCurrentTareType('kg')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${currentTareType === 'kg' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  Kg
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                step="0.1"
                value={currentTareValue} 
                onChange={(e) => setCurrentTareValue(parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold text-slate-800"
              />
              <span className="text-xs font-bold text-slate-500">{currentTareType === 'percent' ? '%' : 'Kg'}</span>
            </div>
          </div>
        </div>

        {/* BẢNG CHI TIẾT CÁC LẦN CÂN & KẾT XUẤT */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4" ref={printRef}>
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">Danh Sách Các Lần Cân Lúa Tươi</h3>
              <p className="text-xs text-slate-500">Tự động cộng dồn tổng bao và sản lượng khô</p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                {entries.length} lần cân
              </span>
            </div>
          </div>

          {/* TABLE LẦN CÂN */}
          <div className="overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold sticky top-0">
                <tr>
                  <th className="p-2.5"># Lần</th>
                  <th className="p-2.5">Số Bao</th>
                  <th className="p-2.5">Trọng Lượng Tươi (Kg)</th>
                  <th className="p-2.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-500">Lần {idx + 1}</td>
                    <td className="p-2.5 font-bold text-slate-800">{entry.bags_count} bao</td>
                    <td className="p-2.5 font-black text-emerald-700">{entry.gross_weight_kg.toFixed(1)} kg</td>
                    <td className="p-2.5 text-right">
                      <button 
                        onClick={() => handleRemoveEntry(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Xóa lần cân này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* KHỐI TỔNG CỘNG THÀNH TIỀN */}
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs border-b border-slate-800 pb-2">
              <div>
                <p className="text-slate-400">Tổng Số Bao</p>
                <p className="text-lg font-black text-white">{totalBags} bao</p>
              </div>
              <div>
                <p className="text-slate-400">Tổng Lúa Tươi</p>
                <p className="text-lg font-black text-amber-400">{totalFreshKg.toLocaleString()} kg</p>
              </div>
              <div>
                <p className="text-slate-400">Khấu Trừ Bì</p>
                <p className="text-lg font-black text-red-400">-{tareKgDeduction.toFixed(1)} kg</p>
              </div>
              <div>
                <p className="text-slate-400">Lúa Khô Tính Tiền</p>
                <p className="text-lg font-black text-emerald-400">{totalDryKg.toFixed(1)} kg</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <div>
                <span className="text-xs text-slate-400">Đơn giá ({selectedVarietyCode}): </span>
                <span className="text-sm font-bold text-emerald-300">{unitPrice.toLocaleString()} đ/kg</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">THÀNH TIỀN THANH TOÁN</p>
                <p className="text-2xl font-black text-emerald-400">{totalAmount.toLocaleString()} ĐỒNG</p>
              </div>
            </div>
          </div>

          {/* BỘ NÚT CHỨC NĂNG (GHI NHẬP, IN PHIẾU, GỬI ZALO) */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
            >
              <Save className="w-5 h-5" />
              <span>GHI NHẬP PHIÊN CÂN</span>
            </button>

            <button
              onClick={handlePrint}
              className="h-12 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow flex items-center justify-center space-x-2 transition"
            >
              <Printer className="w-5 h-5" />
              <span>IN PHIẾU</span>
            </button>

            <button
              onClick={handleShareZalo}
              className="h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow flex items-center justify-center space-x-2 transition"
            >
              <Share2 className="w-5 h-5" />
              <span>GỬI ZALO</span>
            </button>
          </div>

          {isSaved && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl flex items-center space-x-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Đã lưu thành công phiên cân lúa vào hệ thống!</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
export default WeighingSessionModule;
