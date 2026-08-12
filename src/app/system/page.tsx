'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Settings,
  UserCheck,
  Users,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Search,
  Clock,
  Send,
  AlertTriangle,
  Database,
  Download,
  Percent,
  Plus,
  Edit2,
  Trash2,
  X,
  UserPlus,
  Save,
  Phone
} from 'lucide-react';
import { Profile, UserRole, UserStatus } from '@/types/database.types';

export default function SystemPage() {
  const {
    profiles,
    approveUser,
    updateUserRole,
    sendActivationEmail,
    addUser,
    updateUser,
    deleteUser,
    isAdmin,
    farmers,
    sessions
  } = useApp();

  const [activeTab, setActiveTab] = useState<'members' | 'config' | 'backup'>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // User CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [userForm, setUserForm] = useState<{
    full_name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    is_active: boolean;
  }>({
    full_name: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active',
    is_active: true
  });

  // System Config states
  const [defaultTare, setDefaultTare] = useState(12);
  const [currencyUnit, setCurrencyUnit] = useState('VNĐ');

  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setUserForm({
      full_name: '',
      email: '',
      phone: '',
      role: 'staff',
      status: 'active',
      is_active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (profile: Profile) => {
    setEditingProfile(profile);
    setUserForm({
      full_name: profile.full_name,
      email: profile.email || '',
      phone: profile.phone || '',
      role: profile.role,
      status: profile.status || (profile.is_active ? 'active' : 'pending'),
      is_active: profile.is_active
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProfile) {
      updateUser(editingProfile.id, {
        ...userForm,
        is_active: userForm.status === 'active'
      });
      setSuccessMsg(`Đã cập nhật thông tin thành viên ${userForm.full_name}!`);
    } else {
      addUser({
        ...userForm,
        is_active: userForm.status === 'active'
      });
      setSuccessMsg(`Đã thêm thành viên mới ${userForm.full_name}!`);
    }
    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn XÓA vĩnh viễn tài khoản thành viên "${name}"?`)) {
      deleteUser(id);
      setSuccessMsg(`Đã xóa tài khoản thành viên ${name}!`);
      setTimeout(() => setSuccessMsg(''), 3500);
    }
  };

  const handleApprove = (id: string, name: string) => {
    approveUser(id);
    setSuccessMsg(`Đã duyệt kích hoạt tài khoản và gửi email xác nhận cho ${name}!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleSendMail = (id: string, email: string) => {
    sendActivationEmail(id);
    setSuccessMsg(`Đã gửi lại Mail kích hoạt tới ${email}!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      profiles,
      farmers,
      sessions
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RiceOS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setSuccessMsg('Đã kết xuất file sao lưu dữ liệu toàn bộ hệ thống!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const filteredProfiles = profiles.filter(p =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.phone && p.phone.includes(searchQuery))
  );

  const pendingCount = profiles.filter(p => p.status === 'pending' || !p.is_active).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-semibold">
            Dành Riêng Cho Quản Trị Viên (Admin)
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-gold-400" />
            Quản Trị Hệ Thống RiceOS
          </h1>
          <p className="text-xs text-slate-300">
            Thêm, Sửa, Xóa thành viên, duyệt kích hoạt, phân quyền, cấu hình tham số cân lúa và sao lưu dữ liệu
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {successMsg}
            </div>
          )}

          {isAdmin && activeTab === 'members' && (
            <button
              onClick={handleOpenAddModal}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Thêm Thành Viên Mới
            </button>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-gold-400 flex-shrink-0" />
          <span>Bạn đang ở chế độ xem thử. Hãy chuyển sang vai trò <strong>Admin</strong> trên thanh Sidebar hoặc Header để thực hiện Thêm, Sửa, Xóa thành viên.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-emerald-900/60 gap-2">
        <button
          onClick={() => setActiveTab('members')}
          className={`py-3 px-5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'members'
              ? 'border-gold-400 text-gold-300 bg-emerald-950/60'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Quản Lý Thành Viên ({pendingCount > 0 ? `${pendingCount} chờ duyệt` : profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`py-3 px-5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'config'
              ? 'border-gold-400 text-gold-300 bg-emerald-950/60'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Percent className="w-4 h-4" /> Cấu Hình Tham Số Cân Lúa
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`py-3 px-5 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'backup'
              ? 'border-gold-400 text-gold-300 bg-emerald-950/60'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" /> Sao Lưu & Khôi Phục Dữ Liệu
        </button>
      </div>

      {/* TAB 1: MEMBERS */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card-gold p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gold-400 uppercase">Tài Khoản Đang Chờ Duyệt</span>
                <p className="text-2xl font-black text-gold-300 mt-1">{pendingCount} thành viên</p>
              </div>
              <Clock className="w-8 h-8 text-gold-400 opacity-60" />
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Đã Kích Hoạt Hoạt Động</span>
                <p className="text-2xl font-black text-white mt-1">{profiles.length - pendingCount} thành viên</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-60" />
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Tổng Thành Viên Registered</span>
                <p className="text-2xl font-black text-white mt-1">{profiles.length} người dùng</p>
              </div>
              <Users className="w-8 h-8 text-slate-400 opacity-60" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Danh Sách Thành Viên ({filteredProfiles.length})
              </h3>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, SĐT thành viên..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-brand-dark border border-emerald-800 rounded-xl text-white text-xs"
                />
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Họ và Tên</th>
                    <th className="p-3">Email nhận mail</th>
                    <th className="p-3">Số điện thoại</th>
                    <th className="p-3">Trạng thái kích hoạt</th>
                    <th className="p-3">Cấp quyền hạn (Role)</th>
                    <th className="p-3 text-center">Thao tác Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/40">
                  {filteredProfiles.map(p => (
                    <tr key={p.id} className="hover:bg-emerald-900/30">
                      <td className="p-3 font-bold text-white">{p.full_name}</td>
                      <td className="p-3 text-emerald-300 font-mono">{p.email || 'N/A'}</td>
                      <td className="p-3 text-slate-300">{p.phone || 'Chưa cập nhật'}</td>
                      <td className="p-3">
                        {p.is_active ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> Đã Kích Hoạt
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3" /> Chờ Admin Duyệt
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <select
                          value={p.role}
                          disabled={!isAdmin}
                          onChange={e => updateUserRole(p.id, e.target.value as UserRole)}
                          className="p-1.5 bg-emerald-950 border border-emerald-700 rounded-lg text-white font-bold text-xs"
                        >
                          <option value="admin">Quản trị viên (Admin)</option>
                          <option value="editor">Biên tập viên (Editor)</option>
                          <option value="staff">Cán bộ cân (Staff)</option>
                          <option value="viewer">Người xem (Viewer)</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center gap-1.5">
                          {!p.is_active && (
                            <button
                              onClick={() => handleApprove(p.id, p.full_name)}
                              disabled={!isAdmin}
                              className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Duyệt
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEditModal(p)}
                            disabled={!isAdmin}
                            className="p-1.5 rounded-lg bg-amber-950 border border-amber-700 text-amber-300 hover:bg-amber-900 text-xs font-semibold"
                            title="Sửa thành viên"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteUser(p.id, p.full_name)}
                            disabled={!isAdmin}
                            className="p-1.5 rounded-lg bg-red-950 border border-red-700 text-red-300 hover:bg-red-900 text-xs font-semibold"
                            title="Xóa thành viên"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleSendMail(p.id, p.email || '')}
                            disabled={!isAdmin}
                            className="p-1.5 rounded-lg bg-blue-950 border border-blue-700 text-blue-300 hover:bg-blue-900 text-xs font-semibold"
                            title="Gửi mail xác nhận kích hoạt"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONFIG */}
      {activeTab === 'config' && (
        <div className="glass-card p-6 rounded-2xl max-w-2xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-5 h-5 text-gold-400" /> Cấu Hình Mặc Định Phiên Cân Lúa
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tỉ lệ Trừ bì mặc định (%)</label>
              <input
                type="number"
                value={defaultTare}
                onChange={e => setDefaultTare(Number(e.target.value))}
                className="w-full p-2.5 bg-brand-dark border border-emerald-800 rounded-xl text-white font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">Hệ thống sẽ áp dụng tỉ lệ này khi tạo mới bất kỳ mã/lượt cân nào.</p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Đơn vị tiền tệ hiển thị</label>
              <input
                type="text"
                value={currencyUnit}
                onChange={e => setCurrencyUnit(e.target.value)}
                className="w-full p-2.5 bg-brand-dark border border-emerald-800 rounded-xl text-white font-bold"
              />
            </div>

            <button
              onClick={() => {
                setSuccessMsg('Đã lưu tham số cấu hình hệ thống!');
                setTimeout(() => setSuccessMsg(''), 3000);
              }}
              className="py-2.5 px-5 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 font-extrabold shadow"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP */}
      {activeTab === 'backup' && (
        <div className="glass-card p-6 rounded-2xl max-w-2xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-5 h-5 text-gold-400" /> Sao Lưu & Khôi Phục Dữ Liệu
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Kết xuất toàn bộ danh mục Chủ ruộng, Cán bộ cân, Xe nhận, Giống lúa, Vùng trồng và Lịch sử tất cả các phiên cân thành file JSON bảo mật để lưu trữ dự phòng.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleExportBackup}
              className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Kết Xuất File Sao Lưu (.JSON)
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-emerald-700/60 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">

            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-gold-400" />
                {editingProfile ? 'Chỉnh Sửa Thông Tin Thành Viên' : 'Thêm Thành Viên Mới Hợp Lệ'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-emerald-950/60 border border-emerald-800/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Họ và Tên Thành Viên *</label>
                <input
                  type="text"
                  required
                  value={userForm.full_name}
                  onChange={e => setUserForm({ ...userForm, full_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Địa chỉ Email *</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="nguyenvana@riceos.vn"
                    className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={userForm.phone}
                    onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="0905123456"
                    className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phân Quyền (Role) *</label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                    className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white font-bold"
                  >
                    <option value="admin">Quản trị viên (Admin)</option>
                    <option value="editor">Biên tập viên (Editor)</option>
                    <option value="staff">Cán bộ cân (Staff)</option>
                    <option value="viewer">Người xem (Viewer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trạng Thái Kích Hoạt *</label>
                  <select
                    value={userForm.status}
                    onChange={e => setUserForm({
                      ...userForm,
                      status: e.target.value as UserStatus,
                      is_active: e.target.value === 'active'
                    })}
                    className="w-full p-2.5 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white font-bold"
                  >
                    <option value="active">🟢 Đã kích hoạt (Active)</option>
                    <option value="pending">🟡 Chờ Admin duyệt (Pending)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-slate-300 font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 text-slate-950 font-extrabold shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {editingProfile ? 'Lưu Thay Đổi' : 'Thêm Thành Viên'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
