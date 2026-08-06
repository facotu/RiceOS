// AI Camera Scan Module fulfilling exact user specification
// File: src/features/modules/AICameraModule.tsx

import React, { useState } from "react";
import { Camera, CheckCircle2, Scan, RefreshCw } from "lucide-react";

export const AICameraModule: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult("Đã nhận dạng thành công: Biển số 43C-098.12 (Khối lượng 3 bao: 155.0 kg - Lúa giống J02)");
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <span>AI Camera Quét Tự Động Biển Số Xe & Khối Lượng Cân</span>
          </h2>
          <p className="text-xs text-slate-500">Ứng dụng trí tuệ nhân tạo nhận dạng tự động ngoài trường cân lúa</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-12 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
        <div className={`h-24 w-24 rounded-full border-4 flex items-center justify-center transition ${isScanning ? 'border-amber-400 animate-pulse bg-amber-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
          <Scan className={`w-12 h-12 ${isScanning ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
        </div>

        <p className="text-sm font-bold text-slate-300">
          {isScanning ? "Đang quét dữ liệu hình ảnh từ Camera..." : "Sẵn sàng quét tự động ngoài ruộng cân lúa"}
        </p>

        <button
          onClick={handleStartScan}
          disabled={isScanning}
          className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center space-x-2 transition"
        >
          <Camera className="w-5 h-5" />
          <span>{isScanning ? "ĐANG NHẬN DẠNG..." : "BẮT ĐẦU QUÉT AI CAMERA"}</span>
        </button>
      </div>

      {scanResult && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-center space-x-3 font-bold text-sm border border-emerald-200">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <span>{scanResult}</span>
        </div>
      )}
    </div>
  );
};
export default AICameraModule;
