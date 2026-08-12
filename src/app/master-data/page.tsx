'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Database,
  Users,
  UserCheck,
  Truck,
  Wheat,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  Save,
  X,
  Search,
  CheckCircle2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { Farmer, StaffMember, Truck as TruckType, RiceVariety, GrowingArea } from '@/types/database.types';

export default function MasterDataPage() {
  const {
    farmers, addFarmer, updateFarmer, deleteFarmer,
    staffMembers, addStaff, updateStaff, deleteStaff,
    trucks, addTruck, updateTruck, deleteTruck,
    varieties, addVariety, updateVariety, deleteVariety,
    growingAreas, addArea, updateArea, deleteArea,
    isAdmin
  } = useApp();

  const [activeTab, setActiveTab] = useState<'farmers' | 'staff' | 'trucks' | 'varieties' | 'areas'>('farmers');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Farmer Form State
  const [farmerForm, setFarmerForm] = useState({
    name: '', phone: '', cccd: '', cccd_date: '', cccd_place: '', cccd_expiry: '', field_region: '', lot: '', area: 5000
  });

  // Staff Form State
  const [staffForm, setStaffForm] = useState({ full_name: '', phone: '' });

  // Truck Form State
  const [truckForm, setTruckForm] = useState({ driver_name: '', license_plate: '', phone: '' });

  // Variety Form State
  const [varietyForm, setVarietyForm] = useState({ code: '', name: '', default_price: 8500 });

  // Area Form State
  const [areaForm, setAreaForm] = useState({ field_region: '', lot: '', area: 5000 });

  const openAddModal = () => {
    setEditId(null);
    setFarmerForm({ name: '', phone: '', cccd: '', cccd_date: '2021-05-10', cccd_place: 'Công an TP. Đà Nẵng', cccd_expiry: '2031-05-10', field_region: 'Xứ đồng An Trạch 1', lot: 'Lô A1', area: 5000 });
    setStaffForm({ full_name: '', phone: '' });
    setTruckForm({ driver_name: '', license_plate: '', phone: '' });
    setVarietyForm({ code: '', name: '', default_price: 8500 });
    setAreaForm({ field_region: '', lot: '', area: 5000 });
    setModalOpen(true);
  };

  const openEditModal = (id: string, item: any) => {
    setEditId(id);
    if (activeTab === 'farmers') {
      setFarmerForm({
        name: item.name, phone: item.phone, cccd: item.cccd || '',
        cccd_date: item.cccd_date || '', cccd_place: item.cccd_place || '',
        cccd_expiry: item.cccd_expiry || '', field_region: item.field_region,
        lot: item.lot, area: item.area || 0
      });
    } else if (activeTab === 'staff') {
      setStaffForm({ full_name: item.full_name, phone: item.phone });
    } else if (activeTab === 'trucks') {
      setTruckForm({ driver_name: item.driver_name, license_plate: item.license_plate, phone: item.phone });
    } else if (activeTab === 'varieties') {
      setVarietyForm({ code: item.code, name: item.name, default_price: item.default_price });
    } else if (activeTab === 'areas') {
      setAreaForm({ field_region: item.field_region, lot: item.lot, area: item.area });
    }
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Chỉ tài khoản Admin có quyền Thêm/Sửa/Xóa dữ liệu!');
      return;
    }

    if (activeTab === 'farmers') {
      if (editId) updateFarmer(editId, farmerForm);
      else addFarmer(farmerForm);
    } else if (activeTab === 'staff') {
      if (editId) updateStaff(editId, staffForm);
      else addStaff(staffForm);
    } else if (activeTab === 'trucks') {
      if (editId) updateTruck(editId, truckForm);
      else addTruck(truckForm);
    } else if (activeTab === 'varieties') {
      if (editId) updateVariety(editId, varietyForm);
      else addVariety(varietyForm);
    } else if (activeTab === 'areas') {
      if (editId) updateArea(editId, areaForm);
      else addArea(areaForm);
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!isAdmin) {
      alert('Chỉ tài khoản Admin mới có quyền xóa dữ liệu!');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      if (activeTab === 'farmers') deleteFarmer(id);
      else if (activeTab === 'staff') deleteStaff(id);
      else if (activeTab === 'trucks') deleteTruck(id);
      else if (activeTab === 'varieties') deleteVariety(id);
      else if (activeTab === 'areas') deleteArea(id);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              Phân Hệ Danh Mục Quản Trị
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Database className="w-6 h-6 text-gold-400" />
            Quản Lý Dữ Liệu Hệ Thống
          </h1>
          <p className="text-xs text-slate-300">
            {isAdmin
              ? 'Quyền Admin: Thêm, Sửa, Xóa Chủ ruộng, Cán bộ cân, Xe nhận, Giống lúa & Vùng trồng.'
              : 'Quyền xem dữ liệu danh mục thu mua.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:brightness-110 text-brand-dark font-extrabold text-xs shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Thêm Bản Ghi Mới
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-emerald-800/40">
        {[
          { id: 'farmers', label: 'Chủ Ruộng', icon: Users, count: farmers.length },
          { id: 'staff', label: 'Cán Bộ Cân', icon: UserCheck, count: staffMembers.length },
          { id: 'trucks', label: 'Xe Nhận', icon: Truck, count: trucks.length },
          { id: 'varieties', label: 'Giống Lúa', icon: Wheat, count: varieties.length },
          { id: 'areas', label: 'Vùng Trồng', icon: MapPin, count: growingAreas.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-emerald-600/40 text-emerald-200 border-emerald-500/50 shadow-inner'
                  : 'bg-emerald-950/40 text-slate-400 border-emerald-900/60 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-500'}`} />
              {tab.label}
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-950 text-gold-300 font-extrabold">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="glass-card p-5 rounded-2xl space-y-4">

        {/* Tab 1: Farmers (Chủ ruộng) */}
        {activeTab === 'farmers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Danh Sách Chủ Ruộng (Hộ Sản Xuất)</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Họ Tên</th>
                    <th className="p-3">SĐT</th>
                    <th className="p-3">Số CCCD</th>
                    <th className="p-3">Ngày Cấp / Nơi Cấp</th>
                    <th className="p-3">Xứ Đồng - Lô</th>
                    <th className="p-3 text-right">Diện Tích (m²)</th>
                    {isAdmin && <th className="p-3 text-center">Thao Tác</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {farmers.map(f => (
                    <tr key={f.id} className="hover:bg-emerald-900/30">
                      <td className="p-3 font-bold text-white">{f.name}</td>
                      <td className="p-3 text-emerald-300">{f.phone}</td>
                      <td className="p-3 font-mono">{f.cccd}</td>
                      <td className="p-3 text-slate-400">
                        {f.cccd_date} • {f.cccd_place}
                      </td>
                      <td className="p-3 font-medium text-gold-300">{f.field_region} ({f.lot})</td>
                      <td className="p-3 text-right font-extrabold text-emerald-400">
                        {f.area.toLocaleString('vi-VN')} m²
                      </td>
                      {isAdmin && (
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => openEditModal(f.id, f)} className="p-1.5 text-gold-400 hover:bg-gold-500/20 rounded">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Staff (Cán bộ cân) */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Danh Sách Cán Bộ Phụ Trách Cân</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {staffMembers.map(s => (
                <div key={s.id} className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center border border-teal-500/30">
                      {s.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{s.full_name}</p>
                      <p className="text-xs text-emerald-400">SĐT: {s.phone}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(s.id, s)} className="p-1.5 text-gold-400 hover:bg-gold-500/20 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Trucks (Xe nhận) */}
        {activeTab === 'trucks' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Danh Sách Xe Nhận Vận Chuyển Lúa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {trucks.map(t => (
                <div key={t.id} className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center border border-amber-500/30">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-gold-300">{t.license_plate}</p>
                      <p className="text-xs text-white">Tài xế: {t.driver_name}</p>
                      <p className="text-[11px] text-slate-400">SĐT: {t.phone}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(t.id, t)} className="p-1.5 text-gold-400 hover:bg-gold-500/20 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Rice Varieties (Giống lúa) */}
        {activeTab === 'varieties' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Danh Mục Giống Lúa Thu Mua</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {varieties.map(v => (
                <div key={v.id} className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-extrabold text-xs border border-gold-500/40">
                      {v.code}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <button onClick={() => openEditModal(v.id, v)} className="p-1 text-gold-400 hover:bg-gold-500/20 rounded">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(v.id)} className="p-1 text-red-400 hover:bg-red-500/20 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-sm text-white">{v.name}</p>
                  <p className="text-xs text-emerald-400 font-semibold">
                    Đơn giá mua: {v.default_price.toLocaleString('vi-VN')} đ/kg
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Growing Areas (Vùng trồng) */}
        {activeTab === 'areas' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Danh Sách Vùng Trồng Lúa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {growingAreas.map(a => (
                <div key={a.id} className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-emerald-300">{a.field_region}</p>
                    <p className="text-xs text-white">Lô: {a.lot}</p>
                    <p className="text-xs text-gold-400 font-semibold">{a.area.toLocaleString('vi-VN')} m²</p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(a.id, a)} className="p-1.5 text-gold-400 hover:bg-gold-500/20 rounded">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-emerald-700/60 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-emerald-800/50 pb-3">
              <h3 className="text-base font-bold text-gold-300">
                {editId ? 'Cập Nhật Bản Ghi' : 'Thêm Bản Ghi Mới'} - {activeTab.toUpperCase()}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">

              {activeTab === 'farmers' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Tên chủ lúa *</label>
                    <input
                      type="text" required value={farmerForm.name}
                      onChange={e => setFarmerForm({ ...farmerForm, name: e.target.value })}
                      className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Số điện thoại *</label>
                      <input
                        type="text" required value={farmerForm.phone}
                        onChange={e => setFarmerForm({ ...farmerForm, phone: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Số CCCD</label>
                      <input
                        type="text" value={farmerForm.cccd}
                        onChange={e => setFarmerForm({ ...farmerForm, cccd: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Ngày cấp</label>
                      <input
                        type="date" value={farmerForm.cccd_date}
                        onChange={e => setFarmerForm({ ...farmerForm, cccd_date: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Nơi cấp</label>
                      <input
                        type="text" value={farmerForm.cccd_place}
                        onChange={e => setFarmerForm({ ...farmerForm, cccd_place: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Xứ đồng</label>
                      <input
                        type="text" value={farmerForm.field_region}
                        onChange={e => setFarmerForm({ ...farmerForm, field_region: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Lô</label>
                      <input
                        type="text" value={farmerForm.lot}
                        onChange={e => setFarmerForm({ ...farmerForm, lot: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Diện tích m²</label>
                      <input
                        type="number" value={farmerForm.area}
                        onChange={e => setFarmerForm({ ...farmerForm, area: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'staff' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Họ và tên cán bộ *</label>
                    <input
                      type="text" required value={staffForm.full_name}
                      onChange={e => setStaffForm({ ...staffForm, full_name: e.target.value })}
                      className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Số điện thoại *</label>
                    <input
                      type="text" required value={staffForm.phone}
                      onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })}
                      className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </>
              )}

              {activeTab === 'trucks' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Biển số xe *</label>
                    <input
                      type="text" required value={truckForm.license_plate}
                      onChange={e => setTruckForm({ ...truckForm, license_plate: e.target.value })}
                      placeholder="92C-123.45"
                      className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Họ tên tài xế *</label>
                      <input
                        type="text" required value={truckForm.driver_name}
                        onChange={e => setTruckForm({ ...truckForm, driver_name: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Số điện thoại *</label>
                      <input
                        type="text" required value={truckForm.phone}
                        onChange={e => setTruckForm({ ...truckForm, phone: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'varieties' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Mã giống *</label>
                      <input
                        type="text" required value={varietyForm.code}
                        onChange={e => setVarietyForm({ ...varietyForm, code: e.target.value })}
                        placeholder="ST25"
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Đơn giá gợi ý (đ/kg)</label>
                      <input
                        type="number" value={varietyForm.default_price}
                        onChange={e => setVarietyForm({ ...varietyForm, default_price: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Tên giống lúa *</label>
                    <input
                      type="text" required value={varietyForm.name}
                      onChange={e => setVarietyForm({ ...varietyForm, name: e.target.value })}
                      placeholder="Lúa ST25 Thượng Hạng"
                      className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </>
              )}

              {activeTab === 'areas' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Xứ đồng *</label>
                      <input
                        type="text" required value={areaForm.field_region}
                        onChange={e => setAreaForm({ ...areaForm, field_region: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Lô *</label>
                      <input
                        type="text" required value={areaForm.lot}
                        onChange={e => setAreaForm({ ...areaForm, lot: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Diện tích (m²)</label>
                    <input
                      type="number" value={areaForm.area}
                      onChange={e => setAreaForm({ ...areaForm, area: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-brand-dark bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg mt-3"
              >
                Lưu Thay Đổi
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
