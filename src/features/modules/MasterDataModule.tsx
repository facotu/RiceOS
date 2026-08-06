// Master Data Module fulfilling exact user specification for Admin CRUD
// File: src/features/modules/MasterDataModule.tsx

import React, { useState } from "react";
import { LocalFarmer, LocalOfficer, LocalTruck, LocalVariety, db } from "../../db/index.ts";
import { Users, UserPlus, Truck, Scale, Plus, Edit, Trash2, Shield, Check } from "lucide-react";

interface MasterDataModuleProps {
  farmers: LocalFarmer[];
  officers: LocalOfficer[];
  trucks: LocalTruck[];
  varieties: LocalVariety[];
  refreshData: () => Promise<void>;
}

export const MasterDataModule: React.FC<MasterDataModuleProps> = ({
  farmers,
  officers,
  trucks,
  varieties,
  refreshData
}) => {
  const [activeTab, setActiveTab] = useState<'farmers' | 'officers' | 'trucks' | 'varieties'>('farmers');

  // FORM CHỦ RUỘNG
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [farmerCccd, setFarmerCccd] = useState("");
  const [farmerField, setFarmerField] = useState("Xứ đồng Đồng Hát");
  const [farmerPlot, setFarmerPlot] = useState("Lô A1");
  const [farmerArea, setFarmerArea] = useState("5.0");

  const handleAddFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !farmerPhone) return;
    const newFarmer: LocalFarmer = {
      id: crypto.randomUUID(),
      full_name: farmerName,
      phone_number: farmerPhone,
      id_card_number: farmerCccd || "201847592014",
      field_location: farmerField,
      plot_number: farmerPlot,
      area_size: parseFloat(farmerArea) || 5.0,
      is_active: 1
    };
    await db.farmers.add(newFarmer);
    setFarmerName("");
    setFarmerPhone("");
    setFarmerCccd("");
    await refreshData();
  };

  const handleDeleteFarmer = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chủ ruộng này?")) {
      await db.farmers.delete(id);
      await refreshData();
    }
  };

  // FORM CÁN BỘ CÂN
  const [officerName, setOfficerName] = useState("");
  const [officerPhone, setOfficerPhone] = useState("");
  const [officerRole, setOfficerRole] = useState<'admin' | 'editor' | 'view'>('editor');

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerName || !officerPhone) return;
    const newOfficer: LocalOfficer = {
      id: crypto.randomUUID(),
      full_name: officerName,
      phone_number: officerPhone,
      role: officerRole,
      is_active: 1
    };
    await db.officers.add(newOfficer);
    setOfficerName("");
    setOfficerPhone("");
    await refreshData();
  };

  const handleDeleteOfficer = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa cán bộ cân này?")) {
      await db.officers.delete(id);
      await refreshData();
    }
  };

  // FORM XE NHẬN
  const [truckPlate, setTruckPlate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const handleAddTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!truckPlate || !driverName) return;
    const newTruck: LocalTruck = {
      id: crypto.randomUUID(),
      plate_number: truckPlate,
      driver_name: driverName,
      phone_number: driverPhone || "0914000111",
      is_active: 1
    };
    await db.trucks.add(newTruck);
    setTruckPlate("");
    setDriverName("");
    setDriverPhone("");
    await refreshData();
  };

  const handleDeleteTruck = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa xe nhận này?")) {
      await db.trucks.delete(id);
      await refreshData();
    }
  };

  // FORM GIỐNG LÚA
  const [varietyCode, setVarietyCode] = useState("");
  const [varietyName, setVarietyName] = useState("");
  const [varietyPrice, setVarietyPrice] = useState("8000");

  const handleAddVariety = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!varietyCode || !varietyName) return;
    const newVariety: LocalVariety = {
      id: crypto.randomUUID(),
      code: varietyCode.toUpperCase(),
      name: varietyName,
      unit_price: parseFloat(varietyPrice) || 8000
    };
    await db.rice_varieties.add(newVariety);
    setVarietyCode("");
    setVarietyName("");
    await refreshData();
  };

  const handleDeleteVariety = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa giống lúa này?")) {
      await db.rice_varieties.delete(id);
      await refreshData();
    }
  };

  return (
    <div className="space-y-6">
      {/* CẢNH BÁO QUYỀN ADMIN */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Quản Lý Danh Mục Master & Phân Quyền (Dành riêng Admin)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Quyền Admin: Thêm, Sửa, Xóa và phân quyền cho Chủ ruộng, Cán bộ cân, Xe nhận, Giống lúa</p>
        </div>
      </div>

      {/* TABS CHUYỂN DANH MỤC */}
      <div className="flex bg-white p-2 rounded-2xl shadow-card space-x-2">
        <button
          onClick={() => setActiveTab('farmers')}
          className={`flex-1 py-3 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition ${activeTab === 'farmers' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <UserPlus className="w-4 h-4" />
          <span>1. Chủ Ruộng ({farmers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('officers')}
          className={`flex-1 py-3 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition ${activeTab === 'officers' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Users className="w-4 h-4" />
          <span>2. Cán Bộ Cân ({officers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trucks')}
          className={`flex-1 py-3 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition ${activeTab === 'trucks' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Truck className="w-4 h-4" />
          <span>3. Xe Nhận ({trucks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('varieties')}
          className={`flex-1 py-3 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition ${activeTab === 'varieties' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <Scale className="w-4 h-4" />
          <span>4. Giống Lúa ({varieties.length})</span>
        </button>
      </div>

      {/* TAB 1: THÊM & XÓA CHỦ RUỘNG */}
      {activeTab === 'farmers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleAddFarmer} className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase">+ Thêm Chủ Ruộng Mới</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Họ và Tên:</label>
              <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Số Điện Thoại:</label>
              <input type="tel" value={farmerPhone} onChange={(e) => setFarmerPhone(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Số CCCD:</label>
              <input type="text" value={farmerCccd} onChange={(e) => setFarmerCccd(e.target.value)} placeholder="201847592014" className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Xứ đồng:</label>
                <input type="text" value={farmerField} onChange={(e) => setFarmerField(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600">Lô:</label>
                <input type="text" value={farmerPlot} onChange={(e) => setFarmerPlot(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
              </div>
            </div>
            <button type="submit" className="w-full h-11 bg-emerald-600 text-white font-bold rounded-xl shadow flex items-center justify-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>THÊM CHỦ RUỘNG</span>
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Danh Sách Chủ Ruộng ({farmers.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Họ Tên</th>
                    <th className="p-2.5">SĐT</th>
                    <th className="p-2.5">CCCD</th>
                    <th className="p-2.5">Xứ Đồng - Lô</th>
                    <th className="p-2.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {farmers.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-800">{f.full_name}</td>
                      <td className="p-2.5">{f.phone_number}</td>
                      <td className="p-2.5 text-xs text-slate-500">{f.id_card_number || "201847592014"}</td>
                      <td className="p-2.5 text-xs font-semibold">{f.field_location} - {f.plot_number}</td>
                      <td className="p-2.5 text-right">
                        <button onClick={() => handleDeleteFarmer(f.id)} className="text-red-500 hover:text-red-700 font-bold text-xs p-1">
                          <Trash2 className="w-4 h-4 inline" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THÊM & PHÂN QUYỀN CÁN BỘ CÂN */}
      {activeTab === 'officers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleAddOfficer} className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase">+ Thêm & Phân Quyền Cán Bộ</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Họ và Tên Cán Bộ:</label>
              <input type="text" value={officerName} onChange={(e) => setOfficerName(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Số Điện Thoại:</label>
              <input type="tel" value={officerPhone} onChange={(e) => setOfficerPhone(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Cấp Quyền Thành Viên:</label>
              <select value={officerRole} onChange={(e: any) => setOfficerRole(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold">
                <option value="admin">👑 Admin (Quản trị toàn quyền)</option>
                <option value="editor">✍️ Editor (Cán bộ ghi nhập phiên cân)</option>
                <option value="view">👁️ View (Chỉ xem báo cáo)</option>
              </select>
            </div>
            <button type="submit" className="w-full h-11 bg-emerald-600 text-white font-bold rounded-xl shadow flex items-center justify-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>THÊM CÁN BỘ CÂN</span>
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Danh Sách Cán Bộ Cân ({officers.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Họ Tên Cán Bộ</th>
                    <th className="p-2.5">SĐT</th>
                    <th className="p-2.5">Quyền Truy Cập</th>
                    <th className="p-2.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {officers.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-800">{o.full_name}</td>
                      <td className="p-2.5">{o.phone_number}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${o.role === 'admin' ? 'bg-purple-100 text-purple-800' : o.role === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}`}>
                          {o.role}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button onClick={() => handleDeleteOfficer(o.id)} className="text-red-500 hover:text-red-700 font-bold text-xs p-1">
                          <Trash2 className="w-4 h-4 inline" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THÊM & XÓA XE NHẬN */}
      {activeTab === 'trucks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleAddTruck} className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase">+ Thêm Xe Nhận Mới</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Biển Số Xe:</label>
              <input type="text" placeholder="43C-098.12" value={truckPlate} onChange={(e) => setTruckPlate(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Họ Tên Tài Xế:</label>
              <input type="text" value={driverName} onChange={(e) => setDriverName(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">SĐT Tài Xế:</label>
              <input type="tel" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <button type="submit" className="w-full h-11 bg-emerald-600 text-white font-bold rounded-xl shadow flex items-center justify-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>THÊM XE NHẬN</span>
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Danh Sách Xe Nhận ({trucks.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Biển Số Xe</th>
                    <th className="p-2.5">Họ Tên Tài Xế</th>
                    <th className="p-2.5">SĐT</th>
                    <th className="p-2.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trucks.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-blue-700">{t.plate_number}</td>
                      <td className="p-2.5 font-bold text-slate-800">{t.driver_name}</td>
                      <td className="p-2.5">{t.phone_number}</td>
                      <td className="p-2.5 text-right">
                        <button onClick={() => handleDeleteTruck(t.id)} className="text-red-500 hover:text-red-700 font-bold text-xs p-1">
                          <Trash2 className="w-4 h-4 inline" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: THÊM & XÓA GIỐNG LÚA */}
      {activeTab === 'varieties' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleAddVariety} className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase">+ Thêm Giống Lúa Mới</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Mã Giống Lúa (VD: HG12, J02):</label>
              <input type="text" value={varietyCode} onChange={(e) => setVarietyCode(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold uppercase" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Tên Giống Lúa:</label>
              <input type="text" value={varietyName} onChange={(e) => setVarietyName(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">Đơn Giá Thu Mua Mặc Định (đ/kg):</label>
              <input type="number" value={varietyPrice} onChange={(e) => setVarietyPrice(e.target.value)} required className="w-full h-10 px-3 border border-slate-300 rounded-lg text-sm font-bold" />
            </div>
            <button type="submit" className="w-full h-11 bg-emerald-600 text-white font-bold rounded-xl shadow flex items-center justify-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>THÊM GIỐNG LÚA</span>
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Danh Sách Giống Lúa ({varieties.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Mã Giống</th>
                    <th className="p-2.5">Tên Tên Đầy Đủ</th>
                    <th className="p-2.5">Đơn Giá Thu Mua</th>
                    <th className="p-2.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {varieties.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="p-2.5"><span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5 rounded">{v.code}</span></td>
                      <td className="p-2.5 font-bold text-slate-800">{v.name}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{v.unit_price.toLocaleString()} đ/kg</td>
                      <td className="p-2.5 text-right">
                        <button onClick={() => handleDeleteVariety(v.id)} className="text-red-500 hover:text-red-700 font-bold text-xs p-1">
                          <Trash2 className="w-4 h-4 inline" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MasterDataModule;
