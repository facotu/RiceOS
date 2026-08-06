// Main command center dashboard workspace for Drying Operations with State Machine & Costs
// File: src/features/drying/components/DryingWorkspace.tsx

import React, { useState } from "react";
import useDrying from "../hooks/useDrying.ts";
import useDryingRealtime from "../hooks/useDryingRealtime.ts";
import SensorDashboard from "./SensorDashboard.tsx";
import DryingTimeline from "./DryingTimeline.tsx";
import CostInputPanel from "./CostInputPanel.tsx";
import CompleteDryingModal from "./CompleteDryingModal.tsx";
import DryingAlertPanel from "./DryingAlertPanel.tsx";
import OperationLogPanel from "./OperationLogPanel.tsx";
import DryingBatchCard from "./DryingBatchCard.tsx";
import { Cpu, Settings, CheckSquare, CircleAlert, Flame, Scale, Thermometer, ShieldAlert, Award } from "lucide-react";

interface DryingWorkspaceProps {
  operatorName: string;
}

export const DryingWorkspace: React.FC<DryingWorkspaceProps> = ({ operatorName }) => {
  const {
    orders,
    results,
    batchCards,
    operationLogs,
    isLoading,
    error,
    startDryingOrder,
    startLoading,
    startDrying,
    startCooling,
    qualityCheck,
    completeDrying,
    closeBatch,
    addOperationLog
  } = useDrying();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const activeOrders = orders.filter(o => o.status === "active");
  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  
  // Real-time sensor logs & alerts hook
  const { reading, alerts, logs } = useDryingRealtime(selectedOrderId);

  // Thẻ card trạng thái lò sấy dở dang của mẻ được chọn
  const activeCard = batchCards.find(c => c.dryingOrderId === selectedOrderId);
  const currentLogs = operationLogs.filter(l => l.dryingOrderId === selectedOrderId);

  // Mảng trạng thái máy sấy lò
  const currentStatus = activeCard?.status || "WAITING";

  const handleStartSimulatedDrying = async (siloId: string) => {
    const batchId = crypto.randomUUID();
    const db = (window as any).db || { table: (name: string) => ({ put: async () => {} }) };
    await db.table("rice_batches").put({
      id: batchId,
      silo_id: siloId,
      rice_variety_id: "J02",
      farmer_id: "farmer-hoatien",
      quantity_kg: 25500, // 25.5 Tấn lúa tươi J02 thu hoạch
      initial_moisture_percent: 26.5,
      target_moisture_percent: 14.0,
      status: "raw",
      created_at: new Date().toISOString()
    });

    const oId = await startDryingOrder(siloId, batchId, operatorName);
    if (oId) {
      setSelectedOrderId(oId);
      alert("Đã bắt đầu mẻ sấy lúa tươi J02! Trạng thái mẻ: WAITING.");
    }
  };

  const handleConfirmFinalize = async (outputWeight: number, outputMoisture: number, runHours: number) => {
    if (!selectedOrderId) return;
    const ok = await completeDrying(selectedOrderId, outputWeight, outputMoisture, runHours, operatorName);
    if (ok) {
      alert("Đã sấy hoàn tất mẻ lúa thành công! Tồn kho Silo đã được cập nhật.");
      setIsCompleteOpen(false);
    }
  };

  // Tính toán hiệu suất sấy lò sấy lúa
  const dryLoss = activeCard && activeCard.outputWeight > 0 ? activeCard.inputWeight - activeCard.outputWeight : 0;
  const lossPercent = activeCard && activeCard.outputWeight > 0 ? (dryLoss / activeCard.inputWeight) * 100 : 0;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center space-x-2">
          <CircleAlert className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* DASHBOARD STATS FOR SELECTED ORDER */}
      {selectedOrder && activeCard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: STATUS */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center space-x-4">
            <div className="p-3.5 bg-primary/10 rounded-2xl">
              <Thermometer className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Trạng thái lò sấy</span>
              <span className="text-base font-black text-gray-800">
                {selectedOrder.silo_id === "silo-001" ? "Lò Silo A" : "Lò Silo B"} - {currentStatus}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block">Người chạy lò: {selectedOrder.operator}</span>
            </div>
          </div>

          {/* CARD 2: PRODUCTION YIELD */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center space-x-4">
            <div className="p-3.5 bg-emerald-100 rounded-2xl">
              <Scale className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Sản lượng mẻ lúa sấy</span>
              <span className="text-sm font-black text-gray-800 block">
                Đầu vào: {activeCard.inputWeight.toLocaleString()} kg | Đầu ra: {activeCard.outputWeight > 0 ? `${activeCard.outputWeight.toLocaleString()} kg` : "Đang sấy"}
              </span>
              {dryLoss > 0 && (
                <span className="text-[10px] text-red-600 font-extrabold block">Hao hụt bốc ẩm: -{dryLoss.toLocaleString()} kg ({lossPercent.toFixed(1)}%)</span>
              )}
            </div>
          </div>

          {/* CARD 3: ESTIMATED COSTS */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium flex items-center space-x-4">
            <div className="p-3.5 bg-amber-100 rounded-2xl">
              <Flame className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-0.5">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Chi phí sấy lò dự kiến</span>
              <span className="text-base font-black text-gray-800">
                {activeCard.cost > 0 ? `${activeCard.cost.toLocaleString()} VNĐ` : "Chờ chốt số giờ sấy"}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block">Đầu vào trấu sấy lò và điện quạt gió</span>
            </div>
          </div>
        </div>
      )}

      {/* CORE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: ACTIVE BATCH ORDERS */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Danh sách lò đang hoạt động</h4>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              {activeOrders.length} LÒ CHẠY
            </span>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-gray-400 font-bold">Không có lò sấy nào đang chạy sấy.</p>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleStartSimulatedDrying("silo-001")}
                  className="h-9 px-4 bg-primary text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow transition hover:opacity-90"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Kích sấy Silo A (J02)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.map((o) => {
                const card = batchCards.find(c => c.dryingOrderId === o.id);
                return (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOrderId(o.id)}
                    className={`w-full p-4 rounded-xl text-left border transition space-y-2 ${selectedOrderId === o.id ? "border-primary bg-primary/5 shadow-sm" : "border-gray-100 hover:bg-gray-50"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-800">{o.silo_id === "silo-001" ? "Lò Silo A" : "Lò Silo B"}</span>
                      <span className="text-[9px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-black">{card?.status || "WAITING"}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                      <span>Lượng: {(o.initial_weight_kg / 1000).toFixed(0)} Tấn</span>
                      <span className="text-amber-600 font-bold">Ẩm: {o.initial_moisture_percent}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* MIDDLE & RIGHT COLUMNS: ACTIONS & SENSOR GRAPH */}
        {selectedOrder && activeCard ? (
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* SENSORES AND ALERTS */}
            <div className="space-y-6">
              <SensorDashboard
                temperature={reading?.temperature || 32}
                moisture={reading?.moisture || 22.5}
                siloName={selectedOrder.silo_id === "silo-001" ? "Silo A" : "Silo B"}
              />
              <DryingAlertPanel alerts={alerts} />
              
              {/* ELECTRONIC BATCH CARD VIEW */}
              <DryingBatchCard
                orderCode={selectedOrderId.slice(0, 8).toUpperCase()}
                varietyName="J02 (Lúa Nhật hạt tròn)"
                dryerName={selectedOrder.silo_id === "silo-001" ? "Silo sấy A" : "Silo sấy B"}
                inputWeight={activeCard.inputWeight}
                inputMoisture={activeCard.inputMoisture}
                startTime={new Date(selectedOrder.start_time).toLocaleTimeString()}
                operatorName={selectedOrder.operator}
                outputWeight={activeCard.outputWeight > 0 ? activeCard.outputWeight : undefined}
                outputMoisture={activeCard.outputMoisture > 0 ? activeCard.outputMoisture : undefined}
                cost={activeCard.cost > 0 ? activeCard.cost : undefined}
              />
            </div>

            {/* LIFECYCLE STATE MACHINE CONTROLLER & LOG TIMELINE */}
            <div className="space-y-6">
              {/* STATE MACHINE BUTTON PANEL */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight">Bảng điều tiết trạng thái lò sấy</h4>
                
                {/* STATE BADGE SUMMARY */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs font-bold text-gray-700">
                  <span>Trạng thái hiện tại:</span>
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-black">{currentStatus}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  {currentStatus === "WAITING" && (
                    <button
                      onClick={() => startLoading(selectedOrderId, operatorName)}
                      className="h-11 bg-primary text-white text-xs font-black rounded-xl shadow"
                    >
                      BẮT ĐẦU LOADING (NẠP LÚA VÀO LÒ)
                    </button>
                  )}
                  {currentStatus === "LOADING" && (
                    <button
                      onClick={() => startDrying(selectedOrderId, operatorName)}
                      className="h-11 bg-amber-600 text-white text-xs font-black rounded-xl shadow"
                    >
                      BẮT ĐẦU SẤY GIA NHIỆT (DRYING)
                    </button>
                  )}
                  {currentStatus === "DRYING" && (
                    <button
                      onClick={() => startCooling(selectedOrderId, operatorName)}
                      className="h-11 bg-blue-600 text-white text-xs font-black rounded-xl shadow"
                    >
                      CHUYỂN SANG LÀM MÁT LÒ (COOLING)
                    </button>
                  )}
                  {currentStatus === "COOLING" && (
                    <button
                      onClick={() => qualityCheck(selectedOrderId, operatorName)}
                      className="h-11 bg-indigo-600 text-white text-xs font-black rounded-xl shadow"
                    >
                      KIỂM TRA CHẤT LƯỢNG (QUALITY CHECK)
                    </button>
                  )}
                  {currentStatus === "QUALITY_CHECK" && (
                    <button
                      onClick={() => setIsCompleteOpen(true)}
                      className="h-11 bg-emerald-600 text-white text-xs font-black rounded-xl shadow"
                    >
                      CHỐT HOÀN TẤT MẺ SẤY (COMPLETED)
                    </button>
                  )}
                  {currentStatus === "COMPLETED" && (
                    <button
                      onClick={() => closeBatch(selectedOrderId, operatorName)}
                      className="h-11 bg-gray-800 text-white text-xs font-black rounded-xl shadow"
                    >
                      KHÓA SỔ MẺ SẤY (CLOSED - LOCK EDIT)
                    </button>
                  )}
                  {currentStatus === "CLOSED" && (
                    <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-center text-xs font-bold text-gray-400 flex items-center justify-center space-x-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Mẻ sấy đã khóa sổ đóng hoàn toàn (CLOSED).</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MANUAL LOG PANEL */}
              <OperationLogPanel
                logs={currentLogs}
                onAddLog={async (action, note) => {
                  await addOperationLog(selectedOrderId, action, note, operatorName);
                }}
                disabled={currentStatus === "CLOSED"}
              />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 h-72 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
            <Cpu className="w-8 h-8 animate-pulse text-gray-300" />
            <div>
              <p className="text-xs font-bold">Hãy chọn mẻ sấy đang chạy để xem chi tiết</p>
              <p className="text-[10px] mt-0.5">Giám sát chỉ số cảm biến nhiệt độ & độ ẩm lúa gạo lò sấy thời gian thực</p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL HOÀN TẤT CHỐT SỐ LIỆU */}
      {selectedOrder && (
        <CompleteDryingModal
          isOpen={isCompleteOpen}
          onClose={() => setIsCompleteOpen(false)}
          onConfirm={handleConfirmFinalize}
          initialWeight={selectedOrder.initial_weight_kg}
          initialMoisture={selectedOrder.initial_moisture_percent}
        />
      )}
    </div>
  );
};
export default DryingWorkspace;
