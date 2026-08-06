import React, { useState } from "react";
import { Scale, FileText, Camera, Printer, Check, ArrowRight } from "lucide-react";
import { db } from "../../db/index.ts";
import { syncOfflineData } from "../../services/syncService.ts";
import FarmerSelector from "./FarmerSelector.tsx";
import TruckSelector from "./TruckSelector.tsx";
import WeighingItems, { WeighingItemEntry } from "./WeighingItems.tsx";
import ReceiptPreview from "./ReceiptPreview.tsx";
import OCRScanner from "../ai-camera/OCRScanner.tsx";

interface CreateSessionProps {
  userId: string;
  isOnline: boolean;
  onSaveSuccess: () => void;
}

export default function CreateSession({ userId, isOnline, onSaveSuccess }: CreateSessionProps) {
  const [weighMode, setWeighMode] = useState<'truck' | 'bags'>('bags');
  
  // States
  const [farmerId, setFarmerId] = useState("farmer-nguyena");
  const [varietyId, setVarietyId] = useState("variety-om18");
  const [truckId, setTruckId] = useState("");
  const [plate, setPlate] = useState("");
  
  // Cân xe tải states
  const [grossInput, setGrossInput] = useState("");
  const [tareInput, setTareInput] = useState("");

  // Cân bao lẻ states
  const [bagItems, setBagItems] = useState<WeighingItemEntry[]>([]);

  // Chỉ số đo chất lượng lúa
  const [moisture, setMoisture] = useState("15.5");
  const [trash, setTrash] = useState("1.2");

  // Camera AI và In ấn states
  const [showScanner, setShowScanner] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [createdReceipt, setCreatedReceipt] = useState<any | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  // Đọc danh mục nông dân và giống lúa cho hiển thị xem trước
  const [farmerName, setFarmerName] = useState("Nguyen Van An");
  const [varietyName, setVarietyName] = useState("OM18");

  // Tự động tính toán khối lượng
  let totalGross = 0;
  let totalTare = 0;

  if (weighMode === 'truck') {
    totalGross = parseFloat(grossInput) || 0;
    totalTare = parseFloat(tareInput) || 0;
  } else {
    totalGross = bagItems.reduce((sum, item) => sum + item.gross_weight, 0);
    totalTare = bagItems.reduce((sum, item) => sum + item.tare_weight, 0);
  }

  const netWeight = totalGross - totalTare;

  // Tính sản lượng quy đổi sấy khô (khấu trừ) & giá tiền ước tính
  // OM18 chuẩn: 14% ẩm, trừ 1.5% khối lượng cho mỗi % ẩm vượt mức
  // DT8 chuẩn: 14% ẩm, trừ 1.5% cho mỗi % ẩm vượt mức
  // Đơn giá ngày: OM18 = 8,000 VNĐ, DT8 = 8,500 VNĐ
  const moistureStandard = 14.0;
  const moistureRate = 0.015;
  const trashStandard = 1.0;
  const trashRate = 0.01;

  const moisturePct = parseFloat(moisture) || 14.0;
  const trashPct = parseFloat(trash) || 1.0;

  let moistureDeduction = 0;
  if (moisturePct > moistureStandard) {
    moistureDeduction = (moisturePct - moistureStandard) * moistureRate;
  }

  let trashDeduction = 0;
  if (trashPct > trashStandard) {
    trashDeduction = (trashPct - trashStandard) * trashRate;
  }

  const dryWeight = netWeight * (1 - moistureDeduction - trashDeduction);
  const pricePerKg = varietyId === "variety-om18" ? 8000 : 8500;
  const totalAmount = dryWeight * pricePerKg;

  // Đăng ký nhận kết quả từ Camera AI OCR
  const handleOCRComplete = (type: 'plate' | 'receipt' | 'cccd', result: string) => {
    if (type === 'plate') {
      setPlate(result);
      setTruckId("truck-xe1"); // Tự động chọn xe tương ứng nếu tìm thấy
    }
  };

  // Nhấn Lưu phiếu cân
  const handleSave = async () => {
    if (netWeight <= 0) {
      alert("Khối lượng tịnh phải lớn hơn 0 kg.");
      return;
    }

    const receiptId = crypto.randomUUID();
    const receiptNum = `PC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReceipt = {
      id: receiptId,
      receipt_number: receiptNum,
      crop_season_id: "season-dx2026-uuid-1111-2222-333333333333",
      farmer_id: farmerId,
      rice_variety_id: varietyId,
      warehouse_id: undefined,
      weighing_officer_id: userId,
      truck_id: truckId || null,
      truck_plate: plate || "XE_BA_GAC",
      gross_weight: totalGross,
      tare_weight: totalTare,
      moisture_percent: moisturePct,
      trash_percent: trashPct,
      status: "pending_warehouse" as const,
      created_at: new Date().toISOString(),
      synced: 0
    };

    // 1. Lưu vào IndexedDB local
    await db.weighing_receipts.add(newReceipt);

    // 2. Chèn các mã cân bao lẻ nếu có
    if (weighMode === 'bags') {
      for (const item of bagItems) {
        await db.table("weighing_items").add({
          id: crypto.randomUUID(),
          weighing_receipt_id: receiptId,
          item_sequence: item.item_sequence,
          gross_weight: item.gross_weight,
          tare_weight: item.tare_weight,
          created_at: new Date().toISOString()
        });
      }
    }

    // 3. Đưa vào Hàng đợi đồng bộ
    await db.sync_queue.add({
      action: "insert_receipt",
      payload: newReceipt,
      timestamp: new Date().toISOString(),
      retry_count: 0
    });

    // 4. Lấy thông tin nông dân & giống lúa để hiển thị bản in nhiệt
    const fData = await db.farmers.get(farmerId);
    setFarmerName(fData?.full_name || "Nong dan");
    setVarietyName(varietyId === "variety-om18" ? "OM18" : "Dai Thom 8");

    setCreatedReceipt(newReceipt);
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2000);

    // Reset Form
    setBagItems([]);
    setGrossInput("");
    setTareInput("");
    setPlate("");
    
    // Đẩy đồng bộ ngầm
    if (isOnline) {
      syncOfflineData();
    }
    
    onSaveSuccess();
    setShowPreview(true); // Tự động mở xem trước phiếu in nhiệt
  };

  return (
    <div className="space-y-4">
      {/* NÚT CHUYỂN CHẾ ĐỘ CÂN CHẠM TO */}
      <div className="grid grid-cols-2 gap-2 bg-gray-200 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setWeighMode('bags')}
          className={`h-11 rounded-lg text-xs font-extrabold transition ${weighMode === 'bags' ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
        >
          CÂN BAO LẺ TỪNG ĐỢT
        </button>
        <button
          type="button"
          onClick={() => setWeighMode('truck')}
          className={`h-11 rounded-lg text-xs font-extrabold transition ${weighMode === 'truck' ? "bg-white text-primary shadow-sm" : "text-gray-600"}`}
        >
          CÂN XE TẢI LỚN
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 space-y-4">
        {/* CHỌN CHỦ RUỘNG */}
        <FarmerSelector selectedFarmerId={farmerId} onSelect={setFarmerId} />

        {/* CHỌN GIỐNG LÚA */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giống lúa thu mua</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVarietyId("variety-om18")}
              className={`h-12 rounded-xl text-sm font-extrabold border transition ${varietyId === "variety-om18" ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-700 bg-gray-50"}`}
            >
              OM18 (8,000đ)
            </button>
            <button
              type="button"
              onClick={() => setVarietyId("variety-dt8")}
              className={`h-12 rounded-xl text-sm font-extrabold border transition ${varietyId === "variety-dt8" ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-700 bg-gray-50"}`}
            >
              Đài Thơm 8 (8,500đ)
            </button>
          </div>
        </div>

        {/* CHỌN XE & BIỂN SỐ XE */}
        <div className="space-y-3">
          <TruckSelector 
            selectedTruckId={truckId} 
            onSelect={(tid, tplate, dtare) => {
              setTruckId(tid);
              setPlate(tplate);
              if (weighMode === 'truck') {
                setTareInput(String(dtare));
              }
            }} 
          />

          <div className="relative">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="Nhập biển số xe tải chở lúa"
              className="w-full h-12 px-4 border border-gray-300 rounded-xl font-bold text-lg focus:ring-2 focus:ring-primary focus:outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="absolute right-2 top-2 h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center"
              title="Quét biển số bằng AI Camera"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PHÂN HỆ NHẬP CÂN NẶNG */}
        {weighMode === 'truck' ? (
          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">CÂN XE CÓ LÚA (GROSS - KG)</label>
              <input
                type="number"
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                placeholder="Nhập số kg"
                className="w-full h-12 px-3 border border-gray-300 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">CÂN VỎ XE TRỐNG (TARE - KG)</label>
              <input
                type="number"
                value={tareInput}
                onChange={(e) => setTareInput(e.target.value)}
                placeholder="Nhập số kg"
                className="w-full h-12 px-3 border border-gray-300 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                inputMode="decimal"
              />
            </div>
          </div>
        ) : (
          <WeighingItems items={bagItems} onChange={setBagItems} />
        )}

        {/* NHẬP ĐỘ ẨM & TẠP CHẤT */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">ĐỘ ẨM ĐO ĐƯỢC (%)</label>
            <input
              type="number"
              value={moisture}
              onChange={(e) => setMoisture(e.target.value)}
              step="0.1"
              className="w-full h-12 px-3 border border-gray-300 rounded-xl text-center font-bold text-lg"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">TẠP CHẤT (%)</label>
            <input
              type="number"
              value={trash}
              onChange={(e) => setTrash(e.target.value)}
              step="0.1"
              className="w-full h-12 px-3 border border-gray-300 rounded-xl text-center font-bold text-lg"
              inputMode="decimal"
            />
          </div>
        </div>

        {/* BẢNG TÍNH TOÁN KẾT QUẢ NGHIỆP VỤ LÚA THỰC TẾ (REAL-TIME PREVIEW) */}
        {netWeight > 0 && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs space-y-2 font-medium">
            <h4 className="text-emerald-950 font-bold text-sm uppercase">Kết quả quy đổi thực tế</h4>
            <div className="flex justify-between">
              <span>Sản lượng lúa tươi:</span>
              <span className="font-bold text-gray-800">{netWeight.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between">
              <span>Trừ ẩm vượt tiêu chuẩn ({moisture}%):</span>
              <span className="font-bold text-red-600">-{moistureDeduction > 0 ? (moistureDeduction * 100).toFixed(2) : "0.00"}%</span>
            </div>
            <div className="flex justify-between">
              <span>Trừ tạp chất ({trash}%):</span>
              <span className="font-bold text-red-600">-{trashDeduction > 0 ? (trashDeduction * 100).toFixed(2) : "0.00"}%</span>
            </div>
            <div className="flex justify-between border-t border-emerald-100/50 pt-2 text-sm">
              <span className="text-emerald-950 font-bold">Khối lượng khô quyết toán:</span>
              <span className="text-emerald-950 font-extrabold">{dryWeight.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-base font-black border-t border-emerald-100 pt-2">
              <span className="text-primary">Thành tiền ước tính:</span>
              <span className="text-primary">{Math.floor(totalAmount).toLocaleString("vi-VN")} VNĐ</span>
            </div>
          </div>
        )}

        {/* NÚT LƯU PHIẾU CÂN LÀM VIỆC */}
        <button
          type="button"
          onClick={handleSave}
          disabled={netWeight <= 0}
          className="w-full h-14 bg-primary hover:bg-primary-light text-white font-bold text-lg rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
        >
          <span>HOÀN THÀNH & XEM PHIẾU IN</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* MỞ MODALS TƯƠNG TÁC */}
      {showScanner && (
        <OCRScanner 
          onScanComplete={handleOCRComplete} 
          onClose={() => setShowScanner(false)} 
        />
      )}

      {showPreview && createdReceipt && (
        <ReceiptPreview 
          receipt={createdReceipt}
          farmerName={farmerName}
          varietyName={varietyName}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
