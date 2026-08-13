'use client';

import React, { useState, useMemo } from 'react';
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
  CreditCard,
  Download,
  Upload,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers
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
  const [selectedXuDongFilter, setSelectedXuDongFilter] = useState<string>('all');

  // Pagination for Farmers tab (577 records)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  // Filtered Farmers
  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const matchSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.phone.includes(searchQuery) ||
        (f.cccd && f.cccd.includes(searchQuery)) ||
        f.field_region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.lot.toLowerCase().includes(searchQuery.toLowerCase());

      const matchXuDong = selectedXuDongFilter === 'all' || f.field_region === selectedXuDongFilter;

      return matchSearch && matchXuDong;
    });
  }, [farmers, searchQuery, selectedXuDongFilter]);

  // Unique Xứ Đồng list
  const uniqueXuDongList = useMemo(() => {
    return Array.from(new Set(farmers.map(f => f.field_region))).sort();
  }, [farmers]);

  // Total area calculation
  const totalAreaFiltered = useMemo(() => {
    return filteredFarmers.reduce((sum, f) => sum + (f.area || 0), 0);
  }, [filteredFarmers]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage) || 1;
  const paginatedFarmers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFarmers.slice(start, start + itemsPerPage);
  }, [filteredFarmers, currentPage]);

  const openAddModal = () => {
    setEditId(null);
    setFarmerForm({ name: '', phone: '', cccd: '', cccd_date: '2021-05-10', cccd_place: 'Công an TP. Đà Nẵng', cccd_expiry: '2031-05-10', field_region: 'Tổ 9', lot: 'Lô 1', area: 5000 });
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

  const handleDownloadExcel = () => {
    const a = document.createElement('a');
    a.href = '/Book1.xlsx';
    a.download = 'Book1_RiceOS_MasterData.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              Phân Hệ Quản Trị Master Data
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
              577 Thửa Đất • 39.52 Ha
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Database className="w-6 h-6 text-gold-400" />
            Quản Lý Dữ Liệu Hệ Thống RiceOS
          </h1>
          <p className="text-xs text-slate-300">
            Đồng bộ 100% dữ liệu 577 thửa đất, 199 hộ sản xuất, 4 xứ đồng và danh mục vận hành hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/50 text-emerald-200 font-bold text-xs shadow transition-all cursor-pointer"
            title="Tải file Excel Book1.xlsx chuẩn hóa"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Tải Excel Book1.xlsx
          </button>

          {isAdmin && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:brightness-110 text-brand-dark font-extrabold text-xs shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm Mới
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-emerald-800/40">
        {[
          { id: 'farmers', label: 'Hộ Sản Xuất / Thửa Đất', icon: Users, count: farmers.length },
          { id: 'areas', label: 'Vùng Trồng (Lô/Xứ Đồng)', icon: MapPin, count: growingAreas.length },
          { id: 'staff', label: 'Cán Bộ Cân', icon: UserCheck, count: staffMembers.length },
          { id: 'trucks', label: 'Xe Nhận Vận Chuyển', icon: Truck, count: trucks.length },
          { id: 'varieties', label: 'Giống Lúa', icon: Wheat, count: varieties.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchQuery('');
                setCurrentPage(1);
              }}
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

        {/* Tab 1: Farmers (Chủ ruộng / Hộ sản xuất) */}
        {activeTab === 'farmers' && (
          <div className="space-y-4">

            {/* Filter Bar & Summary */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Tìm theo Tên hộ, Chủ ruộng, SĐT, CCCD, Lô..."
                    className="w-full pl-9 pr-3 py-2 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                  />
                </div>

                {/* Filter Xứ Đồng */}
                <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-800/80 rounded-xl px-2 py-1">
                  <Filter className="w-3.5 h-3.5 text-gold-400" />
                  <select
                    value={selectedXuDongFilter}
                    onChange={e => { setSelectedXuDongFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-transparent text-xs text-slate-200 border-none focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="all" className="bg-brand-dark text-white">Tất cả Xứ Đồng (4)</option>
                    {uniqueXuDongList.map(xd => (
                      <option key={xd} value={xd} className="bg-brand-dark text-white">{xd}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stat Pill */}
              <div className="flex items-center gap-3 text-xs bg-emerald-900/40 border border-emerald-700/50 px-3 py-1.5 rounded-xl self-end sm:self-auto">
                <div>
                  <span className="text-slate-400">Kết quả: </span>
                  <span className="font-extrabold text-gold-300">{filteredFarmers.length} thửa</span>
                </div>
                <div className="h-4 w-[1px] bg-emerald-700/60" />
                <div>
                  <span className="text-slate-400">Diện tích: </span>
                  <span className="font-extrabold text-emerald-300">
                    {totalAreaFiltered.toLocaleString('vi-VN')} m² ({(totalAreaFiltered/10000).toFixed(2)} ha)
                  </span>
                </div>
              </div>
            </div>

            {/* Farmers Table */}
            <div className="overflow-x-auto rounded-xl border border-emerald-900/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3 text-center w-12">STT</th>
                    <th className="p-3">Hộ Sản Xuất / Chủ Ruộng</th>
                    <th className="p-3">Số Điện Thoại</th>
                    <th className="p-3">Số CCCD</th>
                    <th className="p-3">Xứ Đồng</th>
                    <th className="p-3">Lô</th>
                    <th className="p-3 text-right">Diện Tích (m²)</th>
                    {isAdmin && <th className="p-3 text-center">Thao Tác</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {paginatedFarmers.map((f, idx) => (
                    <tr key={f.id} className="hover:bg-emerald-900/30 transition-colors">
                      <td className="p-3 text-center font-mono text-slate-400">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="p-3 font-bold text-white">
                        <div>{f.name}</div>
                        {f.landowner_name && (
                          <div className="text-[10px] text-slate-400 font-normal">Chủ: {f.landowner_name}</div>
                        )}
                      </td>
                      <td className="p-3 text-emerald-300 font-mono">{f.phone}</td>
                      <td className="p-3 font-mono text-slate-300">{f.cccd || '---'}</td>
                      <td className="p-3 font-medium text-sky-300">
                        <span className="px-2 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-[11px]">
                          {f.field_region}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gold-300">{f.lot}</td>
                      <td className="p-3 text-right font-extrabold text-emerald-400 font-mono">
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
                  {paginatedFarmers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        Không tìm thấy thửa đất nào phù hợp với điều kiện tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                <p className="text-xs text-slate-400">
                  Hiển thị <span className="font-bold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> - {' '}
                  <span className="font-bold text-white">{Math.min(currentPage * itemsPerPage, filteredFarmers.length)}</span> trên {' '}
                  <span className="font-bold text-gold-300">{filteredFarmers.length}</span> thửa đất
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-900 text-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold text-emerald-300 px-3 py-1 bg-emerald-950/80 rounded-lg border border-emerald-800">
                    Trang {currentPage} / {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-900 text-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Growing Areas (Vùng trồng - 38 Lô) */}
        {activeTab === 'areas' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                Danh Sách 38 Vùng Trồng Canh Tác (Xứ Đồng & Lô)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {growingAreas.map(a => (
                <div key={a.id} className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex justify-between items-center hover:border-emerald-600 transition-all">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-[10px] text-sky-300 font-bold">
                      {a.field_region}
                    </span>
                    <p className="font-extrabold text-sm text-gold-300 mt-1">{a.lot}</p>
                    <p className="text-xs text-emerald-400 font-semibold">{a.area.toLocaleString('vi-VN')} m²</p>
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

        {/* Tab 3: Staff (Cán bộ cân) */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-gold-400" />
              Danh Sách Cán Bộ Cân Đồng & Quản Trị Viên
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        {/* Tab 4: Trucks (Xe nhận) */}
        {activeTab === 'trucks' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-400" />
              Danh Sách Đội Xe Nhận Vận Chuyển Lúa Tươi
            </h3>
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

        {/* Tab 5: Rice Varieties (Giống lúa) */}
        {activeTab === 'varieties' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wheat className="w-4 h-4 text-gold-400" />
              Danh Mục Giống Lúa & Đơn Giá Thu Mua Mặc Định
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {varieties.map(v => (
                <div key={v.id} className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 space-y-2 hover:border-emerald-600 transition-all">
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
                  <p className="text-xs text-emerald-400 font-bold">
                    {v.default_price.toLocaleString('vi-VN')} VNĐ/kg
                  </p>
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
                    <label className="text-xs font-semibold text-slate-300">Tên hộ sản xuất / Chủ ruộng *</label>
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
                      <label className="text-xs font-semibold text-slate-300">Diện tích (m²)</label>
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
                      className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Tên tài xế *</label>
                      <input
                        type="text" required value={truckForm.driver_name}
                        onChange={e => setTruckForm({ ...truckForm, driver_name: e.target.value })}
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">SĐT tài xế *</label>
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
                        className="w-full p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Đơn giá mặc định (VNĐ/kg) *</label>
                      <input
                        type="number" required value={varietyForm.default_price}
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

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button" onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-emerald-950 text-slate-300 rounded-lg text-xs font-semibold hover:bg-emerald-900"
                >
                  Hủy Thao Tác
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-gold-400 to-gold-500 text-brand-dark rounded-lg text-xs font-extrabold shadow hover:brightness-110"
                >
                  Lưu Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
