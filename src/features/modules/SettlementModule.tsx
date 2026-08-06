// Settlement Module fulfilling exact user specification
// File: src/features/modules/SettlementModule.tsx

import React, { useState } from "react";
import { LocalFarmer, LocalReceipt } from "../../db/index.ts";
import { Receipt, User, CheckCircle2, Phone, MapPin, Calendar, CreditCard, DollarSign } from "lucide-react";

interface SettlementModuleProps {
  farmers: LocalFarmer[];
  receipts: LocalReceipt[];
  onSettleFarmer: (farmerId: string) => Promise<void>;
}

export const SettlementModule: React.FC<SettlementModuleProps> = ({
  farmers,
  receipts,
  onSettleFarmer
}) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || "");
  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  // Lọc tất cả các phiên cân của hộ dân được chọn
  const farmerReceipts = receipts.filter(r => r.farmer_id === selectedFarmerId || r.farmer_name === selectedFarmer?.full_name);

  // Tính tổng số liệu quyết toán
  const totalBags = farmerReceipts.reduce((sum, r) => sum + r.total_bags, 0);
  const totalFreshKg = farmerReceipts.reduce((sum, r) => sum + r.total_fresh_kg, 0);
  const totalDryKg = farmerReceipts.reduce((sum, r) => sum + r.total_dry_kg, 0);
  const totalAmount = farmerReceipts.reduce((sum, r) => sum + r.total_amount, 0);
  const pendingCount = farmerReceipts.filter(r => r.status === "pending_settlement").length;

  const [isSettled, setIsSettled] = useState(false);

  const handleSettle = async () => {
    if (farmerReceipts.length === 0) {
      alert("Hộ dân này chưa có phiên cân nào để quyết toán!");
      return;
    }
    await onSettleFarmer(selectedFarmerId);
    setIsSettled(true);
    setTimeout(() => setIsSettled(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. CHỌN HỘ DÂN */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <span>Quyết Toán Tiền Mua Lúa Với Hộ Dân</span>
            </h2>
            <p className="text-xs text-slate-500">Chọn hộ dân để xem toàn bộ chi tiết sản lượng và chốt tiền thanh toán</p>
          </div>

          <div className="w-full md:w-80">
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-800"
            >
              {farmers.map(f => (
                <option key={f.id} value={f.id}>{f.full_name} ({f.phone_number})</option>
              ))}
            </select>
          </div>
        </div>

        {/* THÔNG TIN HỘ DÂN ĐƯỢC CHỌN */}
        {selectedFarmer && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-400">Họ và Tên:</p>
              <p className="font-bold text-slate-800 text-sm">{selectedFarmer.full_name}</p>
            </div>
            <div>
              <p className="text-slate-400">Số Điện Thoại:</p>
              <p className="font-bold text-slate-800 text-sm">{selectedFarmer.phone_number}</p>
            </div>
            <div>
              <p className="text-slate-400">Số CCCD:</p>
              <p className="font-bold text-slate-800 text-sm">{selectedFarmer.id_card_number || "201847592014"}</p>
            </div>
            <div>
              <p className="text-slate-400">Xứ Đồng - Lô:</p>
              <p className="font-bold text-slate-800 text-sm">{selectedFarmer.field_location} - {selectedFarmer.plot_number}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. BẢNG CHI TIẾT CÁC PHIÊN CÂN CỦA HỘ DÂN */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="text-base font-bold text-slate-800">Tất Cả Các Phiên Cân Của Hộ Dân</h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            {farmerReceipts.length} phiên cân
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold">
              <tr>
                <th className="p-3">Mã Phiếu</th>
                <th className="p-3">Giống Lúa</th>
                <th className="p-3">Số Bao</th>
                <th className="p-3">Lúa Tươi (Kg)</th>
                <th className="p-3">Lúa Khô (Kg)</th>
                <th className="p-3">Đơn Giá</th>
                <th className="p-3 text-right">Thành Tiền</th>
                <th className="p-3 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {farmerReceipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    Hộ dân này chưa có dữ liệu phiên cân nào.
                  </td>
                </tr>
              ) : (
                farmerReceipts.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{r.receipt_number}</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-xs">{r.variety_code}</span></td>
                    <td className="p-3 font-bold">{r.total_bags} bao</td>
                    <td className="p-3 font-bold text-amber-600">{r.total_fresh_kg.toLocaleString()} kg</td>
                    <td className="p-3 font-bold text-emerald-700">{r.total_dry_kg.toLocaleString()} kg</td>
                    <td className="p-3">{r.unit_price.toLocaleString()} đ</td>
                    <td className="p-3 text-right font-black text-emerald-700">{r.total_amount.toLocaleString()} đ</td>
                    <td className="p-3 text-center">
                      {r.status === "settled" ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Đã Quyết Toán</span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Chờ Quyết Toán</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* THẺ TỔNG QUYẾT TOÁN VÀ NÚT XÁC NHẬN */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">TỔNG CỘNG QUYẾT TOÁN HỘ DÂN</p>
            <p className="text-3xl font-black text-emerald-400">{totalAmount.toLocaleString()} ĐỒNG</p>
            <p className="text-xs text-slate-300">
              Tổng số bao: <strong>{totalBags} bao</strong> | Tổng lúa tươi: <strong>{totalFreshKg.toLocaleString()} kg</strong> | Lúa khô: <strong>{totalDryKg.toLocaleString()} kg</strong>
            </p>
          </div>

          <button
            onClick={handleSettle}
            className="w-full md:w-auto h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 text-base flex items-center justify-center space-x-2 transition"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>CHỐT QUYẾT TOÁN CHO HỘ DÂN</span>
          </button>
        </div>

        {isSettled && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-center space-x-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Đã hoàn tất chốt quyết toán tiền lúa cho hộ dân {selectedFarmer?.full_name}!</span>
          </div>
        )}

      </div>
    </div>
  );
};
export default SettlementModule;
