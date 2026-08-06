import React, { useState } from "react";
import { Printer, X, Check } from "lucide-react";
import { printerService } from "../../services/printer/printerService.ts";

interface ReceiptPreviewProps {
  receipt: any;
  farmerName: string;
  varietyName: string;
  onClose: () => void;
}

export default function ReceiptPreview({ receipt, farmerName, varietyName, onClose }: ReceiptPreviewProps) {
  const [paperSize, setPaperSize] = useState<'K57' | 'K80'>('K57');
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    setPrintSuccess(false);

    // Bắn lệnh in qua Bluetooth thực tế
    await printerService.printReceipt(receipt, farmerName, varietyName);
    
    setIsPrinting(false);
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 2000);
  };

  const netWeight = receipt.gross_weight - (receipt.tare_weight || 0);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-t-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-primary">Xem trước & In phiếu</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* CHỌN KHỔ GIẤY IN NHIỆT CHẠM TO */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaperSize('K57')}
            className={`h-11 rounded-xl text-xs font-bold border transition ${paperSize === 'K57' ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-700 bg-gray-50"}`}
          >
            KHỔ K57 (58mm - CẦM TAY)
          </button>
          <button
            type="button"
            onClick={() => setPaperSize('K80')}
            className={`h-11 rounded-xl text-xs font-bold border transition ${paperSize === 'K80' ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-700 bg-gray-50"}`}
          >
            KHỔ K80 (80mm - ĐỂ BÀN)
          </button>
        </div>

        {/* PHIẾU IN NHIỆT MÔ PHỎNG */}
        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 font-mono text-xs text-gray-800 space-y-2 select-text overflow-x-auto shadow-inner">
          <div className="text-center font-bold">
            <p>HTX NONG NGHIEP HOA TIEN 2</p>
            <p>--- RICEOS ---</p>
          </div>
          <div className="border-b border-dashed border-gray-300 py-1">
            <p>Phieu so: {receipt.receipt_number}</p>
            <p>Ngay: {new Date(receipt.created_at).toLocaleString("vi-VN")}</p>
          </div>
          <div className="border-b border-dashed border-gray-300 py-1">
            <p>Bien so xe: {receipt.truck_plate}</p>
            <p>Chu ruong: {farmerName}</p>
            <p>Giong lua: {varietyName}</p>
          </div>
          <div className="border-b border-dashed border-gray-300 py-1 font-bold text-sm">
            <p>Can Tong (Gross): {receipt.gross_weight} kg</p>
            {receipt.tare_weight && <p>Can Vo (Tare):    {receipt.tare_weight} kg</p>}
            {receipt.tare_weight && <p>Can Tinh (Net):   {netWeight} kg</p>}
          </div>
          <div className="text-[10px] text-gray-500 py-1">
            <p>Do am: {receipt.moisture_percent}% | Tạp chất: {receipt.trash_percent}%</p>
            <p>Silo nhap: Silo A (OM18)</p>
          </div>
          <div className="text-center pt-3 flex justify-around">
            <div>
              <p className="font-bold">Can Bo</p>
              <div className="h-10"></div>
              <p>(Ky ten)</p>
            </div>
            <div>
              <p className="font-bold">Chu Ruong</p>
              <div className="h-10"></div>
              <p>(Ky ten)</p>
            </div>
          </div>
        </div>

        {printSuccess && (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>Đã gửi tín hiệu in thành công qua Bluetooth!</span>
          </div>
        )}

        {/* NÚT THAO TÁC CHÍNH */}
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-lg flex items-center justify-center space-x-2 shadow-lg"
        >
          <Printer className="w-5 h-5" />
          <span>{isPrinting ? "Đang truyền lệnh in..." : "BẮN LỆNH IN BLUETOOTH"}</span>
        </button>
      </div>
    </div>
  );
}
