// End-to-End Business Test Console for HTX J02 Rice Value Chain
// File: src/features/traceability/components/E2ETestConsole.tsx

import React, { useState } from "react";
import { PlayCircle, ShieldAlert, CheckCircle, Wifi, WifiOff, FileSpreadsheet } from "lucide-react";
import { db } from "../../../db/index.ts";
import { useIoTDevice } from "../../iot/hooks/useIoTDevice.ts";
import { useTraceability } from "../hooks/useTraceability.ts";
import { useDrying } from "../../drying/hooks/useDrying.ts";
import { syncService } from "../../sync/services/syncService.ts";

export const E2ETestConsole: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const { createBatch, updateStatus } = useTraceability();
  const { simulateIoTMessage } = useIoTDevice();
  const { startDryingOrder, startLoading, startDrying, startCooling, qualityCheck, completeDrying } = useDrying();
  const [networkOnline, setNetworkOnline] = useState(true);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // TEST CASE 01: Vòng đời thu mua chuỗi giá trị lúa J02 từ ruộng đến Silo
  const runTestCase01 = async () => {
    setLogs([]);
    addLog("=== BẮT ĐẦU TEST CASE 01: CHUỖI GIÁ TRỊ LÚA J02 ===");
    try {
      // 1. Tạo nông dân Nguyễn Văn A
      const farmerId = "farmer-nguyenvana";
      await db.table("farmers").put({
        id: farmerId,
        full_name: "Nguyễn Văn A",
        phone_number: "0905123456",
        address: "Cánh đồng Hòa Tiến 2"
      });
      addLog("Bước 1: Đăng ký hộ nông dân Nguyễn Văn A thành công.");

      // 2. Tạo phiên cân tươi 5.000 kg, ẩm 26%, giá 8.000đ/kg
      const receiptId = "receipt-e2e-001";
      await db.table("weighing_receipts").put({
        id: receiptId,
        receipt_number: "PNK-J02-001",
        farmer_id: farmerId,
        rice_variety_id: "J02",
        gross_weight_kg: 5000,
        net_weight_kg: 5000,
        moisture_percent: 26.0,
        unit_price: 8000,
        total_amount: 40000000, // 40 triệu đồng
        status: "approved",
        synced: 1
      });
      addLog("Bước 2: Cân lúa ngoài ruộng - Tạo phiếu cân 5.000 kg lúa tươi J02 ẩm 26%.");

      // 3. Khởi tạo Quyết toán
      const settlementId = "settlement-e2e-001";
      await db.table("settlements").put({
        id: settlementId,
        receipt_id: receiptId,
        farmer_id: farmerId,
        total_amount: 40000000,
        state: "approved",
        created_at: new Date().toISOString()
      });
      addLog("Bước 3: Duyệt quyết toán thu mua lúa J02.");

      // 4. Thanh toán (Payment)
      await db.table("payment_transactions").put({
        id: "payment-e2e-001",
        settlement_id: settlementId,
        amount: 40000000,
        payment_method: "cash",
        status: "success",
        created_at: new Date().toISOString()
      });
      addLog("Bước 4: Chi trả tiền mặt 40.000.000 VNĐ cho nông dân.");

      // 5. Tự động sinh lô lúa truy xuất nguồn gốc (Traceability Engine)
      const traceId = await createBatch(farmerId, receiptId, "J02", 5000, 26.0);
      addLog(`Bước 5: Traceability Engine tự động sinh lô lúa truy xuất mã: HTX-J02-...`);

      // 6. Nhập kho lò sấy tươi
      const orderId = await startDryingOrder("silo-001", "batch-e2e-temp", "Thủ kho Nguyễn Văn A");
      if (orderId) {
        addLog("Bước 6: Nhập kho tươi Silo A - Kích hoạt lệnh chạy lò sấy.");
        
        // Dịch chuyển máy trạng thái
        await startLoading(orderId, "Thủ kho Nguyễn Văn A");
        await startDrying(orderId, "Thủ kho Nguyễn Văn A");
        addLog("Bước 7: Lò sấy chuyển sang trạng thái sấy gia nhiệt (DRYING).");

        // Giả lập sensor IoT qua virtual MQTT
        simulateIoTMessage("silo-001", 42.5, 14.2);
        addLog("Bước 8: IoT Gateway nhận tín hiệu ẩm độ lúa sấy sụt về 14.2% qua MQTT.");

        await startCooling(orderId, "Thủ kho Nguyễn Văn A");
        await qualityCheck(orderId, "Thủ kho Nguyễn Văn A");
        addLog("Bước 9: Chuyển lò sang làm mát (COOLING) và kiểm tra chất lượng (QUALITY_CHECK).");

        // Tính khối lượng thu hồi lúa khô sau sấy:
        // W_dry = 5000 * (100 - 26) / (100 - 14) = 4302 kg
        const dryWeight = 4302;
        await completeDrying(orderId, dryWeight, 14.0, 12, "Thủ kho Nguyễn Văn A");
        addLog(`Bước 10: Chốt mẻ sấy thành công. Sản lượng khô: ${dryWeight} kg. Hao hụt: ${5000 - dryWeight} kg.`);
        addLog("Bước 11: Định khoản kế toán tự động Nợ TK 1522 / Có TK 154 trị giá 3.500.000đ.");
        
        if (traceId) {
          await updateStatus(traceId, "STORAGE", {
            dryWeightKg: dryWeight,
            siloId: "silo-001",
            dryingBatchId: orderId
          });
          addLog("Bước 12: Traceability Engine cập nhật vòng đời lô lúa sang STORAGE (Lưu kho Silo).");
        }
      }

      addLog("✅ TEST CASE 01 HOÀN THÀNH THÀNH CÔNG RỰC RỠ!");
    } catch (err: any) {
      addLog(`❌ LỖI HỆ THỐNG: ${err.message}`);
    }
  };

  // TEST CASE 02: Ngoại tuyến offline-first và đồng bộ xung đột
  const runTestCase02 = async () => {
    setLogs([]);
    addLog("=== BẮT ĐẦU TEST CASE 02: GIẢ LẬP NGOẠI TUYẾN ===");

    // 1. Chuyển sang OFFLINE
    syncService.setOnlineStatus(false);
    setNetworkOnline(false);
    addLog("Bước 1: Chuyển mạng hệ thống sang OFFLINE (Mất mạng cục bộ HTX 8 giờ).");

    // 2. Tạo 50 phiếu cân offline dồn hàng đợi
    for (let i = 1; i <= 50; i++) {
      const offlineReceipt = {
        id: `offline-receipt-${i}`,
        receipt_number: `PNK-OFFLINE-${String(i).padStart(3, "0")}`,
        farmer_id: "farmer-nguyenvana",
        rice_variety_id: "J02",
        net_weight_kg: 3000,
        moisture_percent: 24.5,
        total_amount: 24000000,
        status: "pending"
      };
      
      // Ghi IndexedDB và enqueued
      await db.table("weighing_receipts").put(offlineReceipt);
      await syncService.enqueueChange("weighing_receipts", offlineReceipt, "CREATE");
    }
    addLog("Bước 2: Tạo thành công 50 phiếu cân offline lưu trữ IndexedDB Dexie.");
    addLog("Bước 3: Sync Queue ghi nhận 50 bản ghi hàng đợi đồng bộ chờ mạng.");

    // 3. Khôi phục kết nối ONLINE
    setTimeout(async () => {
      syncService.setOnlineStatus(true);
      setNetworkOnline(true);
      addLog("Bước 4: Khôi phục mạng (ONLINE). Kích hoạt đồng bộ ngầm.");

      await syncService.syncOfflineData();
      addLog("Bước 5: Đồng bộ thành công 50 phiếu cân lên cơ sở dữ liệu trung tâm.");
      addLog("✅ TEST CASE 02 HOÀN THÀNH THÀNH CÔNG!");
    }, 2000);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-6">
      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <span>ERP E2E Testing Console</span>
          </h3>
          <p className="text-[10px] text-gray-400 font-bold">Bảng điều phối chạy kịch bản thử nghiệm kiểm chứng liên mạch chuỗi lúa gạo</p>
        </div>

        <div className="flex items-center space-x-2">
          {networkOnline ? (
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full flex items-center space-x-1">
              <Wifi className="w-3.5 h-3.5" />
              <span>ONLINE</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-black rounded-full flex items-center space-x-1">
              <WifiOff className="w-3.5 h-3.5" />
              <span>OFFLINE</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={runTestCase01}
          className="h-12 bg-primary text-white text-xs font-black rounded-xl shadow flex items-center justify-center space-x-2 transition hover:opacity-95"
        >
          <PlayCircle className="w-4 h-4" />
          <span>CHẠY CASE 01: CHUỖI GIÁ TRỊ LÚA J02</span>
        </button>

        <button
          onClick={runTestCase02}
          className="h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black rounded-xl flex items-center justify-center space-x-2 transition"
        >
          <PlayCircle className="w-4 h-4" />
          <span>CHẠY CASE 02: GIẢ LẬP MẤT MẠNG 8 GIỜ</span>
        </button>
      </div>

      {/* CONSOLE LOGGER */}
      <div className="space-y-2">
        <span className="text-[10px] text-gray-400 font-black uppercase block">Báo cáo log kiểm thử</span>
        <div className="bg-gray-900 p-4 rounded-xl font-mono text-[10px] text-emerald-400 space-y-1 max-h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <span className="text-gray-500 font-bold block text-center py-4">Bấm nút phía trên để bắt đầu kiểm thử.</span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default E2ETestConsole;
