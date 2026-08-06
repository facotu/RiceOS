import React, { useState } from "react";
import { Camera, RefreshCw, Check } from "lucide-react";

interface OCRScannerProps {
  onScanComplete: (type: 'plate' | 'receipt' | 'cccd', result: string) => void;
  onClose: () => void;
}

export default function OCRScanner({ onScanComplete, onClose }: OCRScannerProps) {
  const [scanType, setScanType] = useState<'plate' | 'receipt' | 'cccd'>('plate');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");

  const handleScan = () => {
    setIsScanning(true);
    setScanResult("");

    // Giả lập quét AI qua Camera sau 1.5 giây
    setTimeout(() => {
      setIsScanning(false);
      let result = "";
      if (scanType === "plate") {
        result = "43C-123.45"; // Biển số xe quét được
      } else if (scanType === "receipt") {
        result = "PC-20260806-0088"; // Số phiếu cân
      } else {
        result = "040099001234"; // Số CCCD nông dân
      }
      setScanResult(result);
    }, 1500);
  };

  const handleApply = () => {
    onScanComplete(scanType, scanResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center text-white py-2 border-b border-white/10">
        <h3 className="text-lg font-bold">Quét thông minh AI Camera</h3>
        <button 
          onClick={onClose}
          className="h-10 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold"
        >
          ĐÓNG
        </button>
      </div>

      {/* CHỌN CHẾ ĐỘ QUÉT CHẠM TO */}
      <div className="grid grid-cols-3 gap-2 my-4">
        {(['plate', 'receipt', 'cccd'] as const).map((type) => (
          <button
            key={type}
            onClick={() => { setScanType(type); setScanResult(""); }}
            className={`h-12 rounded-xl text-xs font-extrabold border transition ${scanType === type ? "bg-accent border-accent text-primary-dark" : "border-white/20 text-white bg-white/5"}`}
          >
            {type === 'plate' ? "BIỂN SỐ XE" : type === 'receipt' ? "PHIẾU CÂN" : "CCCD CHỦ"}
          </button>
        ))}
      </div>

      {/* VIEW FINDER GIẢ LẬP CAMERA */}
      <div className="flex-1 border-2 border-dashed border-white/30 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center bg-gray-950">
        {/* Khung quét tiêu điểm */}
        <div className="w-72 h-44 border-4 border-accent rounded-xl relative flex items-center justify-center">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-bounce"></div>
          <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Đặt vùng quét vào đây</span>
        </div>

        {isScanning && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white space-y-3">
            <RefreshCw className="w-8 h-8 text-accent animate-spin" />
            <span className="text-sm font-bold animate-pulse">AI đang phân tích hình ảnh...</span>
          </div>
        )}

        {scanResult && (
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-xl p-4 text-center">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Hệ thống nhận diện được</span>
            <span className="text-2xl font-black text-primary block mt-1">{scanResult}</span>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="py-4 space-y-3">
        {!scanResult ? (
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full h-14 bg-primary text-white font-bold rounded-xl text-lg flex items-center justify-center space-x-2 shadow-lg"
          >
            <Camera className="w-5 h-5" />
            <span>KÍCH HOẠT CHỤP QUÉT AI</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleScan}
              className="h-14 border-2 border-white/20 text-white font-bold rounded-xl text-lg"
            >
              QUÉT LẠI
            </button>
            <button
              onClick={handleApply}
              className="h-14 bg-emerald-600 text-white font-bold rounded-xl text-lg flex items-center justify-center space-x-1.5"
            >
              <Check className="w-5 h-5" />
              <span>ÁP DỤNG</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
