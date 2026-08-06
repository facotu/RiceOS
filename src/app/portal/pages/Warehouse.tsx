// Warehouse & Drying Operations Portal Command Center
// File: src/app/portal/pages/Warehouse.tsx

import React, { useState } from "react";
import { usePortal } from "../context/PortalContext.tsx";
import useWarehouse from "../../../features/warehouse/hooks/useWarehouse.ts";
import useDrying from "../../../features/drying/hooks/useDrying.ts";
import DryingWorkspace from "../../../features/drying/components/DryingWorkspace.tsx";
import { Thermometer, Layers, RefreshCw, Play, AlertCircle, Flame, Cpu, CheckSquare } from "lucide-react";

export default function WarehousePage() {
  const { user } = usePortal();
  
  // 1. Core hooks cho Silo và Lệnh sấy lò
  const {
    silos,
    movements,
    isLoading: isWhLoading,
    error: whError,
    refresh: refreshWh
  } = useWarehouse(user?.organization_id || "org-default");

  const {
    orders,
    results,
    isLoading: isDryLoading,
    error: dryError,
    startDryingOrder,
    logSensors,
    completeDryingOrder,
    refresh: refreshDry
  } = useDrying();

  const isLoading = isWhLoading || isDryLoading;
  const error = whError || dryError;

  // 2. State điều khiển Form mô phỏng
  const [activeTab, setActiveTab] = useState<'silos' | 'dryingOrders' | 'costResults' | 'movements'>('silos');
  const [selectedSiloId, setSelectedSiloId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Dữ liệu nhập lò sấy
  const [sensorTemp, setSensorTemp] = useState<string>("38");
  const [sensorMoisture, setSensorMoisture] = useState<string>("14.5");
  const [runHours, setRunHours] = useState<string>("16");

  const handleStartDrying = async (siloId: string) => {
    // Tạo giả lập Batch ID và khởi động lò sấy lúa tươi
    const batchId = crypto.randomUUID();
    // Tạo giả lập lô lúa tươi trong DB trước
    await db.table("rice_batches").put({
      id: batchId,
      silo_id: siloId,
      rice_variety_id: "OM18",
      farmer_id: "farmer-hoatien",
      quantity_kg: 80000, // 80 Tấn lúa tươi nhập lò
      initial_moisture_percent: 22.5,
      target_moisture_percent: 14.0,
      status: "raw",
      created_at: new Date().toISOString()
    });

    const oId = await startDryingOrder(siloId, batchId, user?.full_name || "Thủ kho Hòa Tiến");
    if (oId) {
      alert("Đã bắt đầu chu kỳ sấy lúa cho Silo! Trạng thái chuyển sang Đang sấy nóng.");
      refreshWh();
    }
  };

  const handleUpdateSensors = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    const ok = await logSensors(selectedOrderId, parseFloat(sensorTemp), parseFloat(sensorMoisture));
    if (ok) {
      alert("Đã log dữ liệu cảm biến lò sấy thời gian thực!");
      setSelectedOrderId(null);
      refreshWh();
    }
  };

  const handleCompleteDrying = async (orderId: string) => {
    const ok = await completeDryingOrder(orderId, parseFloat(runHours));
    if (ok) {
      alert("Đã hoàn tất lệnh sấy! Đã tự động hạch toán chi phí sấy lò vào Sổ cái kế toán.");
      refreshWh();
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Điều hành Kho sấy & Lò sấy lúa</h1>
          <p className="text-sm text-gray-500 mt-1">Vận hành quy trình lò sấy lúa công nghệ cao, tự động hóa hạch toán chi phí sấy</p>
        </div>
        
        <button
          onClick={() => { refreshWh(); refreshDry(); }}
          className="h-10 px-3 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-bold border border-gray-200 flex items-center space-x-1.5 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Đồng bộ</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center space-x-2">
          <CircleAlert className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* TABS CHỌN CHỨC NĂNG */}
      <div className="flex space-x-2 border-b border-gray-100 pb-px">
        <button
          onClick={() => setActiveTab('silos')}
          className={`pb-3 text-xs font-extrabold border-b-2 px-1 transition ${activeTab === 'silos' ? "border-primary text-primary" : "border-transparent text-gray-400"}`}
        >
          TRẠM SILO SẤY ({silos.length})
        </button>
        <button
          onClick={() => setActiveTab('dryingOrders')}
          className={`pb-3 text-xs font-extrabold border-b-2 px-1 transition ${activeTab === 'dryingOrders' ? "border-primary text-primary" : "border-transparent text-gray-400"}`}
        >
          LỆNH SẤY ĐANG CHẠY ({orders.filter(o => o.status === "active").length})
        </button>
        <button
          onClick={() => setActiveTab('costResults')}
          className={`pb-3 text-xs font-extrabold border-b-2 px-1 transition ${activeTab === 'costResults' ? "border-primary text-primary" : "border-transparent text-gray-400"}`}
        >
          KẾT QUẢ & CHI PHÍ ({results.length})
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`pb-3 text-xs font-extrabold border-b-2 px-1 transition ${activeTab === 'movements' ? "border-primary text-primary" : "border-transparent text-gray-400"}`}
        >
          NHẬT KÝ DI CHUYỂN KHO
        </button>
      </div>

      {/* CORE WORKSPACE */}
      {activeTab === 'silos' && (
        <div className="space-y-6">
          {/* SILO METRICS OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Tổng trữ lượng bảo quản</span>
              <span className="text-base font-black text-gray-800">
                {(silos.reduce((acc, s) => acc + s.current_stock_kg, 0) / 1000).toFixed(1)} Tấn lúa khô
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Ẩm độ lưu trữ trung bình</span>
              <span className="text-base font-black text-emerald-700">14.1%</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Cảnh báo tồn lâu (&gt;60 ngày)</span>
              <span className="text-base font-black text-red-600">0 Lò</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Nhiệt độ an toàn bình quân</span>
              <span className="text-base font-black text-gray-800">32.5°C</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {silos.map((silo) => {
              const fillPercent = (silo.current_stock_kg / silo.capacity_kg) * 100;
              // Giả lập số ngày lưu kho (Storage Days) cho từng Silo
              const storageDays = silo.id === "silo-001" ? 35 : silo.id === "silo-002" ? 15 : 65;
              
              // Hệ thống cảnh báo tồn lâu (Inventory Aging Rules)
              let agingStatus: 'NORMAL' | 'WARNING' | 'QUALITY_CHECK' = 'NORMAL';
              let agingBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
              if (storageDays >= 30 && storageDays <= 60) {
                agingStatus = 'WARNING';
                agingBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
              } else if (storageDays > 60) {
                agingStatus = 'QUALITY_CHECK';
                agingBadgeClass = 'bg-red-50 text-red-800 border-red-200 animate-pulse';
              }

              return (
                <div key={silo.id} className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 space-y-4">
                  <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-black text-gray-800">{silo.name} ({silo.id.toUpperCase()})</h3>
                        <span className={`px-2 py-0.5 border rounded text-[8px] font-black ${agingBadgeClass}`}>
                          {agingStatus} ({storageDays} ngày)
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Sức chứa: {(silo.capacity_kg / 1000).toFixed(0)} Tấn</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${silo.status === "drying" ? "text-amber-800 bg-amber-50" : silo.status === "completed" ? "text-emerald-800 bg-emerald-50" : "text-gray-600 bg-gray-100"}`}>
                      {silo.status === "drying" ? "Đang sấy nóng" : silo.status === "completed" ? "Sấy hoàn tất" : "Trống"}
                    </span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>Trữ lượng thực tế</span>
                      <span>{(silo.current_stock_kg / 1000).toFixed(1)} Tấn ({fillPercent.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${fillPercent}%` }}></div>
                    </div>
                  </div>

                  {/* SENSOR DATA */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-700">
                    <div className="flex items-center space-x-1.5 p-2.5 bg-gray-50 rounded-lg">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span>Nhiệt độ: {silo.current_temp_celsius || 32}°C</span>
                    </div>
                    <div className="flex items-center space-x-1.5 p-2.5 bg-gray-50 rounded-lg">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>Độ ẩm lúa: {silo.current_moisture_percent || 14.0}%</span>
                    </div>
                  </div>

                  {/* KHỞI ĐỘNG SẤY LÒ */}
                  {silo.status === "idle" && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleStartDrying(silo.id)}
                        className="h-9 px-4 bg-primary text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow transition hover:opacity-90"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>KÍCH HOẠT SẤY LÒ</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'dryingOrders' && (
        <DryingWorkspace operatorName={user?.full_name || "Thủ kho Hòa Tiến"} />
      )}

      {activeTab === 'costResults' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/20">
            <h3 className="text-sm font-bold text-gray-800">Kết quả sấy lúa & Chi phí vận hành lò</h3>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 font-semibold">
              Chưa ghi nhận kết quả sấy lò nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Ngày sấy xong</th>
                    <th className="py-3 px-6 text-right">Sản lượng lúa khô</th>
                    <th className="py-3 px-6 text-right">Lúa tươi hao hụt</th>
                    <th className="py-3 px-6 text-right">Nước bốc hơi</th>
                    <th className="py-3 px-6 text-right">Chi phí lò sấy (trấu/điện)</th>
                    <th className="py-3 px-6 text-right">Chi phí nhân công trực</th>
                    <th className="py-3 px-6 text-right">Tổng chi phí sấy lò</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {results.map((res) => (
                    <tr key={res.id}>
                      <td className="py-3 px-6 text-gray-400">{new Date(res.completed_at).toLocaleDateString("vi-VN")}</td>
                      <td className="py-3 px-6 text-right font-extrabold text-gray-800">{res.final_weight_kg.toLocaleString()} kg</td>
                      <td className="py-3 px-6 text-right font-bold text-red-600">-{res.drying_loss_kg.toLocaleString()} kg</td>
                      <td className="py-3 px-6 text-right text-blue-600 font-extrabold">{res.water_evaporated_liters.toLocaleString()} Lít</td>
                      <td className="py-3 px-6 text-right text-gray-500">{(res.total_fuel_cost + res.total_electricity_cost).toLocaleString()} đ</td>
                      <td className="py-3 px-6 text-right text-gray-500">{res.total_labor_cost.toLocaleString()} đ</td>
                      <td className="py-3 px-6 text-right text-primary font-black">{(res.total_drying_cost).toLocaleString()} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/20">
            <h3 className="text-sm font-bold text-gray-800">Nhật ký di chuyển kho Silo sấy lúa</h3>
          </div>

          {movements.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 font-semibold">
              Chưa có giao dịch di chuyển kho nào.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Thời gian</th>
                    <th className="py-3 px-6">Silo nguồn</th>
                    <th className="py-3 px-6">Mã lô lúa</th>
                    <th className="py-3 px-6">Phân loại</th>
                    <th className="py-3 px-6 text-right">Khối lượng di chuyển</th>
                    <th className="py-3 px-6">Thủ kho vận hành</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {movements.map((move) => (
                    <tr key={move.id}>
                      <td className="py-3 px-6 text-gray-400">{new Date(move.created_at).toLocaleString("vi-VN")}</td>
                      <td className="py-3 px-6 font-bold text-gray-800">{move.silo_id === "silo-001" ? "Silo A" : "Silo B"}</td>
                      <td className="py-3 px-6 text-gray-500">{move.batch_id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${move.movement_type === "in_raw" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                          {move.movement_type === "in_raw" ? "Nhập lúa tươi" : "Kết chuyển lúa sấy"}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right font-extrabold">{move.quantity_kg.toLocaleString()} kg</td>
                      <td className="py-3 px-6 text-gray-600">{move.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// Giả lập db cục bộ để hỗ trợ batch lưu tạm lúa tươi trước khi bắt đầu sấy lò
const db = (window as any).db || { table: (name: string) => ({ put: async () => {} }) };
