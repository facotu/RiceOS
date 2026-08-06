// Electronic Proof of Delivery (POD) modal dialog component
// File: src/features/logistics/components/PODModal.tsx

import React, { useState } from "react";
import { Trip, ProofOfDelivery } from "../domain/logisticsTypes.ts";
import { X, Check, Camera, FileCheck, ShieldCheck } from "lucide-react";

interface PODModalProps {
  trip: Trip;
  onClose: () => void;
  onSubmit: (pod: Omit<ProofOfDelivery, 'id' | 'timestamp'>) => Promise<void>;
}

export const PODModal: React.FC<PODModalProps> = ({ trip, onClose, onSubmit }) => {
  const [recipientName, setRecipientName] = useState("Võ Văn C - Thủ kho Silo A");
  const [deliveredWeightKg, setDeliveredWeightKg] = useState(trip.payloadWeightKg.toString());
  const [signatureUrl] = useState("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='30'><path d='M10 20 Q 30 5, 50 20 T 90 10' stroke='black' fill='none'/></svg>");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        tripId: trip.id,
        receiptNumber: `RECEIPT-${trip.tripCode}`,
        recipientName,
        signatureUrl,
        photoUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
        deliveredWeightKg: Number(deliveredWeightKg) || trip.payloadWeightKg
      });
      alert("Đã ký xác nhận Bằng chứng giao lúa (POD) thành công!");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-primary" />
            <span>Ký Bằng chứng giao lúa điện tử (POD)</span>
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-1">
            <span className="block text-[10px] text-blue-700 font-extrabold uppercase">Thông tin chuyến xe</span>
            <p className="text-blue-900 font-bold">Mã chuyến: {trip.tripCode} - Xe: {trip.vehicleId}</p>
            <p className="text-[11px] text-blue-800">Điểm giao: {trip.destinationName}</p>
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-gray-700">Tên người nhận lúa tại kho:</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-gray-700">Khối lượng lúa thực giao (kg):</label>
            <input
              type="number"
              value={deliveredWeightKg}
              onChange={(e) => setDeliveredWeightKg(e.target.value)}
              className="w-full h-9 px-3 border border-gray-200 rounded-lg text-xs font-bold focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-gray-700 block">Chữ ký điện tử người nhận:</label>
            <div className="h-20 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center">
              <span className="text-gray-400 font-extrabold italic text-sm">[Đã xác thực chữ ký điện tử Võ Văn C]</span>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 border border-gray-200 hover:bg-gray-50 rounded-lg font-extrabold text-gray-600 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-9 bg-primary text-white hover:opacity-95 rounded-lg font-extrabold transition flex items-center justify-center space-x-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận giao lúa POD</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PODModal;
