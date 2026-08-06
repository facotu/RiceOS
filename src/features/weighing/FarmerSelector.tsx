import React, { useState, useEffect } from "react";
import { Plus, UserPlus } from "lucide-react";
import { db } from "../../db/index.ts";

interface FarmerSelectorProps {
  selectedFarmerId: string;
  onSelect: (farmerId: string) => void;
}

export default function FarmerSelector({ selectedFarmerId, onSelect }: FarmerSelectorProps) {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const loadFarmers = async () => {
    const list = await db.farmers.toArray();
    setFarmers(list);
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const handleAddFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newId = crypto.randomUUID();
    await db.farmers.add({
      id: newId,
      organization_id: "org-hoatien2-uuid-1111-2222-333333333333",
      full_name: name,
      phone_number: phone,
      is_active: 1
    });

    setName("");
    setPhone("");
    setShowAddForm(false);
    await loadFarmers();
    onSelect(newId); // Tự động chọn nông dân mới tạo
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Chọn chủ ruộng / Nông dân</label>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-8 px-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center space-x-1"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{showAddForm ? "HỦY THÊM" : "THÊM MỚI"}</span>
        </button>
      </div>

      {!showAddForm ? (
        <select
          value={selectedFarmerId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full h-12 px-3 border border-gray-300 rounded-xl font-bold bg-white text-lg focus:ring-2 focus:ring-primary focus:outline-none"
        >
          {farmers.map((f) => (
            <option key={f.id} value={f.id}>{f.full_name} ({f.phone_number})</option>
          ))}
        </select>
      ) : (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-gray-700">ĐĂNG KÝ NHANH CHỦ RUỘNG MỚI</h4>
          <div className="grid grid-cols-2 gap-3">
            <input 
              type="text"
              placeholder="Tên chủ ruộng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input 
              type="tel"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="button"
            onClick={handleAddFarmer}
            className="w-full h-10 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-light"
          >
            LƯU VÀ CHỌN CHỦ RUỘNG
          </button>
        </div>
      )}
    </div>
  );
}
