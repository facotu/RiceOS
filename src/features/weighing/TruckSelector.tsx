import React, { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import { db } from "../../db/index.ts";

interface TruckSelectorProps {
  selectedTruckId: string;
  onSelect: (truckId: string, plateNumber: string, defaultTare: number) => void;
}

export default function TruckSelector({ selectedTruckId, onSelect }: TruckSelectorProps) {
  const [trucks, setTrucks] = useState<any[]>([]);

  const loadTrucks = async () => {
    // Để mô phỏng mượt mà, nếu IndexedDB chưa có xe nào ta tự động chèn 2 xe mẫu từ seed
    let list = await db.table("trucks").toArray();
    if (list.length === 0) {
      const seedTrucks = [
        { id: "truck-xe1", plate_number: "43C-123.45", tare_weight_default: 3200 },
        { id: "truck-xe2", plate_number: "92H-567.89", tare_weight_default: 4500 }
      ];
      for (const t of seedTrucks) {
        await db.table("trucks").add({
          id: t.id,
          organization_id: "org-hoatien2-uuid-1111-2222-333333333333",
          plate_number: t.plate_number,
          tare_weight_default: t.tare_weight_default,
          created_at: new Date().toISOString()
        });
      }
      list = await db.table("trucks").toArray();
    }
    setTrucks(list);
  };

  useEffect(() => {
    loadTrucks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const truckId = e.target.value;
    const selected = trucks.find(t => t.id === truckId);
    if (selected) {
      onSelect(selected.id, selected.plate_number, Number(selected.tare_weight_default) || 0);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
        <Truck className="w-3.5 h-3.5 text-primary" />
        <span>Chọn Xe tải nhận lúa</span>
      </label>
      <select
        value={selectedTruckId}
        onChange={handleChange}
        className="w-full h-12 px-3 border border-gray-300 rounded-xl font-bold bg-white text-lg focus:ring-2 focus:ring-primary focus:outline-none"
      >
        <option value="">-- Nhập biển số thủ công / Chưa chọn xe --</option>
        {trucks.map((t) => (
          <option key={t.id} value={t.id}>
            {t.plate_number} (Bì mặc định: {t.tare_weight_default} kg)
          </option>
        ))}
      </select>
    </div>
  );
}
