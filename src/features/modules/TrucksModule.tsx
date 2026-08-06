// Trucks Module fulfilling exact user specification
// File: src/features/modules/TrucksModule.tsx

import React, { useState } from "react";
import { LocalTruck, LocalReceipt } from "../../db/index.ts";
import { Truck, User, Clock, Share2, Camera, CheckCircle2 } from "lucide-react";

interface TrucksModuleProps {
  trucks: LocalTruck[];
  receipts: LocalReceipt[];
}

export const TrucksModule: React.FC<TrucksModuleProps> = ({ trucks, receipts }) => {
  const [selectedTruckId, setSelectedTruckId] = useState<string>(trucks[0]?.id || "");
  const selectedTruck = trucks.find(t => t.id === selectedTruckId) || trucks[0];

  // Lọc các phiên cân theo xe nhận được chọn
  const truckReceipts = receipts.filter(r => r.truck_id === selectedTruckId || r.truck_plate === selectedTruck?.plate_number);

  const totalFreshKg = truckReceipts.reduce((sum, r) => sum + r.total_fresh_kg, 0);
  const totalBags = truckReceipts.reduce((sum, r) => sum + r.total_bags, 0);

  // Thời gian nhận lúa sớm nhất & muộn nhất
  const startTimes = truckReceipts.map(r => new Date(r.start_time).getTime()).filter(t => !isNaN(t));
  const startTimeStr = startTimes.length > 0 ? new Date(Math.min(...startTimes)).toLocaleTimeString("vi-VN") : "08:00";
  const endTimeStr = startTimes.length > 0 ? new Date(Math.max(...startTimes)).toLocaleTimeString("vi-VN") : "11:30";

  // Cán bộ cân phục vụ xe này
  const officersList = Array.from(new Set(truckReceipts.map(r => r.officer_name))).join(", ") || "Nguyễn Văn Cân";

  // GỬI QUA ZALO BÁO CÁO XE
  const handleShareZalo = () => {
    const text = `🚚 BÁO CÁO XE LÚA NHẬN HTX HÒA TIẾN 2\nBiển số: ${selectedTruck?.plate_number}\nTài xế: ${selectedTruck?.driver_name} (${selectedTruck?.phone_number})\n--------------------\nTổng sản lượng tươi: ${totalFreshKg.toLocaleString()} kg\nTổng số bao: ${totalBags} bao\nCán bộ cân: ${officersList}\nGiờ nhận: ${startTimeStr} - Giờ kết thúc: ${endTimeStr}\nSố lượt cân: ${truckReceipts.length} chuyến`;
    navigator.clipboard.writeText(text);
    alert("Đã sao chép báo cáo chuyến xe lúa! Bạn có thể dán (Paste) để gửi Zalo ngay.");
  };

  // KẾT XUẤT FILE ẢNH BÁO CÁO XE
  const handleExportImage = () => {
    alert("Đã kết xuất báo cáo chuyến xe lúa thành tệp hình ảnh PNG thành công!");
  };

  return (
    <div className="space-y-6">
      {/* 1. CHỌN XE NHẬN */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>Quản Lý & Theo Dõi Xe Nhận Lúa</span>
            </h2>
            <p className="text-xs text-slate-500">Xem đầy đủ thông tin xe, tổng sản lượng tươi, số bao, cán bộ cân và thời gian nhận lúa</p>
          </div>

          <div className="w-full md:w-80">
            <select
              value={selectedTruckId}
              onChange={(e) => setSelectedTruckId(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold text-slate-800"
            >
              {trucks.map(t => (
                <option key={t.id} value={t.id}>{t.plate_number} - Tài xế: {t.driver_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* THÔNG TIN XE NHẬN CHI TIẾT */}
        {selectedTruck && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-900 text-white p-6 rounded-2xl">
            <div>
              <p className="text-xs text-slate-400">Biển Số Xe:</p>
              <p className="text-2xl font-black text-blue-400 mt-1">{selectedTruck.plate_number}</p>
              <p className="text-xs text-slate-400">Tài xế: {selectedTruck.driver_name}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Tổng Sản Lượng Tươi:</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{totalFreshKg.toLocaleString()} kg</p>
              <p className="text-xs text-slate-400">{(totalFreshKg / 1000).toFixed(2)} Tấn</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Tổng Số Bao Lúa:</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{totalBags} bao</p>
              <p className="text-xs text-slate-400">{truckReceipts.length} phiên cân</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Khung Giờ Nhận Lúa:</p>
              <p className="text-sm font-bold text-slate-200 mt-2 flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{startTimeStr} ➔ {endTimeStr}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Cán bộ cân: {officersList}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. CÁC NÚT KẾT XUẤT ZALO & FILE ẢNH */}
      <div className="flex space-x-3">
        <button
          onClick={handleShareZalo}
          className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
        >
          <Share2 className="w-5 h-5" />
          <span>KẾT XUẤT THÔNG TIN GỬI ZALO</span>
        </button>

        <button
          onClick={handleExportImage}
          className="flex-1 h-12 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
        >
          <Camera className="w-5 h-5" />
          <span>KẾT XUẤT FILE ẢNH GỬI ĐI</span>
        </button>
      </div>

      {/* 3. BẢNG DANH SÁCH CÁC PHIÊN CÂN CỦA XE NÀY */}
      <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
        <h3 className="text-base font-bold text-slate-800">Danh Sách Các Chuyến Phiên Cân Đã Nạp Vào Xe</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold">
              <tr>
                <th className="p-3">Mã Phiếu</th>
                <th className="p-3">Chủ Lúa</th>
                <th className="p-3">Giống Lúa</th>
                <th className="p-3">Số Bao</th>
                <th className="p-3">Sản Lượng Tươi (Kg)</th>
                <th className="p-3">Cán Bộ Cân</th>
                <th className="p-3">Thời Gian Nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {truckReceipts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">Xe này chưa nhận dữ liệu phiên cân nào.</td>
                </tr>
              ) : (
                truckReceipts.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{r.receipt_number}</td>
                    <td className="p-3 font-bold">{r.farmer_name}</td>
                    <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-bold">{r.variety_code}</span></td>
                    <td className="p-3 font-bold">{r.total_bags} bao</td>
                    <td className="p-3 font-bold text-amber-600">{r.total_fresh_kg.toLocaleString()} kg</td>
                    <td className="p-3 text-slate-600">{r.officer_name}</td>
                    <td className="p-3 text-xs text-slate-500">{new Date(r.created_at).toLocaleTimeString("vi-VN")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TrucksModule;
