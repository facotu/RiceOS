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
  Phone,
  Lock,
  FileJson,
  Check
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
    sessions,
    growingAreas
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [systemLocked, setSystemLocked] = useState(false);

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

  // User assignment mapping (e.g., Assigned Growing Area)
  const [assignedAreas, setAssignedAreas] = useState<Record<string, string>>({});

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
      triggerToast(`Đã cập nhật thông tin thành viên "${userForm.full_name}" thành công!`);
    } else {
      addUser({
        full_name: userForm.full_name,
        email: userForm.email,
        phone: userForm.phone,
        role: userForm.role,
        status: userForm.status,
        is_active: userForm.status === 'active'
      });
      triggerToast(`Đã thêm thành viên mới "${userForm.full_name}" vào hệ thống!`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProfile = (profile: Profile) => {
    if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${profile.full_name}"?`)) {
      deleteUser(profile.id);
      triggerToast(`Đã xóa tài khoản "${profile.full_name}".`);
    }
  };

  const handleApproveAndEmail = (profile: Profile) => {
    approveUser(profile.id);
    sendActivationEmail(profile.id);
    triggerToast(`Đã duyệt & gửi email thông báo kích hoạt tới ${profile.full_name} (${profile.email})`);
  };

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Filter pending vs active users
  const pendingUsers = profiles.filter(
    p =>
      (!p.is_active || p.status === 'pending') &&
      (p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery))
  );

  const activeUsers = profiles.filter(
    p =>
      p.is_active &&
      p.status !== 'pending' &&
      (p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery))
  );

  // Backup JSON download handler
  const handleDownloadBackup = () => {
    const backupData = {
      export_date: new Date().toISOString(),
      system: 'RiceOS v1.0 Pro',
      profiles,
      farmers,
      sessions
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RiceOS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Đã tải tệp sao lưu JSON dữ liệu hệ thống thành công!');
  };

  const roleBadges: Record<UserRole, { label: string; color: string }> = {
    admin: { label: 'ADMIN', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
    editor: { label: 'EDITOR', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    staff: { label: 'STAFF (Cán bộ)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    viewer: { label: 'VIEWER', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' }
  };

  return (
    <div className="space-y-8 pb-10">

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold flex items-center justify-between shadow-xl animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: DANH SÁCH YÊU CẦU ĐĂNG KÝ TÀI KHOẢN CHỜ DUYỆT - Matching Screenshot */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-800/50 space-y-4 shadow-xl">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                DANH SÁCH YÊU CẦU ĐĂNG KÝ TÀI KHOẢN CHỜ DUYỆT ({pendingUsers.length})
              </h2>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold font-mono">
            Duyệt ➔ Tự động phát Mail kích hoạt
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-semibold">
            Không có yêu cầu đăng ký tài khoản nào đang chờ duyệt.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-900/60 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider bg-emerald-950/40">
                  <th className="py-3 px-4">HỌ VÀ TÊN</th>
                  <th className="py-3 px-4">EMAIL NHẬN THÔNG BÁO</th>
                  <th className="py-3 px-4">ĐIỆN THOẠI</th>
                  <th className="py-3 px-4">PHÂN CÔNG QUYỀN HẠN</th>
                  <th className="py-3 px-4">CẤP PHỤ TRÁCH VÙNG TRỒNG</th>
                  <th className="py-3 px-4 text-center">THAO TÁC PHÊ DUYỆT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40">
                {pendingUsers.map(u => (
                  <tr key={u.id} className="hover:bg-emerald-950/40 transition-colors">
                    
                    {/* Full Name */}
                    <td className="py-3.5 px-4 font-black text-white uppercase">
                      {u.full_name}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 font-mono text-sky-400">
                      {u.email || 'N/A'}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {u.phone || '0900000000'}
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                        className="bg-emerald-950 border border-emerald-700 rounded-xl px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="admin">ADMIN (Quản trị)</option>
                        <option value="editor">EDITOR (Biên tập)</option>
                        <option value="staff">STAFF (Cán bộ cân)</option>
                        <option value="viewer">VIEWER (Người xem)</option>
                      </select>
                    </td>

                    {/* Assigned Region Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={assignedAreas[u.id] || 'all'}
                        onChange={e => setAssignedAreas(prev => ({ ...prev, [u.id]: e.target.value }))}
                        className="bg-emerald-950 border border-emerald-700 rounded-xl px-2.5 py-1 text-xs font-bold text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="all">🌐 Tất cả Vùng trồng</option>
                        <option value="an_trach">🌾 Vùng Xứ Đồng An Trạch</option>
                        <option value="hoa_tien">🌾 Vùng Xứ Đồng Hòa Tiến</option>
                        <option value="dien_ban">🌾 Vùng Xứ Đồng Điện Bàn</option>
                      </select>
                    </td>

                    {/* Approve Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApproveAndEmail(u)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow flex items-center gap-1 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-300 hover:bg-blue-900 transition-colors"
                          title="Sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProfile(u)}
                          className="p-1.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* SECTION 2: DANH SÁCH TÀI KHOẢN ĐÃ KÍCH HOẠT TRÊN HỆ THỐNG - Matching Screenshot */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-800/50 space-y-4 shadow-xl">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                DANH SÁCH TÀI KHOẢN ĐÃ KÍCH HOẠT TRÊN HỆ THỐNG ({activeUsers.length})
              </h2>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-600 hover:from-sky-400 hover:to-emerald-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" /> + Thêm tài khoản
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-900/60 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider bg-emerald-950/40">
                <th className="py-3 px-4">HỌ VÀ TÊN</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">ĐIỆN THOẠI</th>
                <th className="py-3 px-4">QUYỀN HẠN</th>
                <th className="py-3 px-4">CẤP PHỤ TRÁCH VÙNG TRỒNG</th>
                <th className="py-3 px-4">TRẠNG THÁI</th>
                <th className="py-3 px-4 text-center">THAO TÁC ADMIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40">
              {activeUsers.map(u => {
                const roleBadge = roleBadges[u.role];
                return (
                  <tr key={u.id} className="hover:bg-emerald-950/40 transition-colors">
                    
                    {/* Name */}
                    <td className="py-3.5 px-4 font-black text-white uppercase">
                      {u.full_name}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 font-mono text-sky-400">
                      {u.email || 'N/A'}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {u.phone || '0900000000'}
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    </td>

                    {/* Assigned Region Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={assignedAreas[u.id] || 'all'}
                        onChange={e => setAssignedAreas(prev => ({ ...prev, [u.id]: e.target.value }))}
                        className="bg-emerald-950 border border-emerald-800 rounded-xl px-2.5 py-1 text-xs font-bold text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="all">🌐 Tất cả Vùng trồng</option>
                        <option value="an_trach">🌾 Vùng Xứ Đồng An Trạch</option>
                        <option value="hoa_tien">🌾 Vùng Xứ Đồng Hòa Tiến</option>
                        <option value="dien_ban">🌾 Vùng Xứ Đồng Điện Bàn</option>
                      </select>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1 w-max">
                        <Check className="w-3 h-3 text-emerald-400" /> Đã kích hoạt
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-300 hover:bg-blue-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProfile(u)}
                          className="p-1.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900 transition-colors"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* SECTION 3: BOTTOM ROW (2 COLUMN CARDS) - Matching Screenshot Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card Left: KHÓA HỆ THỐNG CÂN LÚA (SYSTEM LOCK) */}
        <div className="glass-card rounded-3xl p-6 border border-emerald-800/50 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                KHÓA HỆ THỐNG CÂN LÚA
              </h3>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              systemLocked
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {systemLocked ? 'ĐÃ KHÓA' : 'HOẠT ĐỘNG'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Khi bật tính năng Khóa hệ thống, tất cả dữ liệu nông dân, phiên cân, số kg lúa và cấu hình sẽ ngừng chỉnh sửa để phục vụ chốt sổ quyết toán vụ mùa.
          </p>

          <button
            onClick={() => {
              setSystemLocked(!systemLocked);
              triggerToast(systemLocked ? 'Đã MỞ KHÓA hệ thống cân lúa.' : 'Đã KHÓA CHỐT DỮ LIỆU hệ thống cân lúa!');
            }}
            className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 ${
              systemLocked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            {systemLocked ? 'MỞ KHÓA HỆ THỐNG' : 'KÍCH HOẠT KHÓA CHỐT DỮ LIỆU'}
          </button>
        </div>

        {/* Card Right: SAO LƯU DỮ LIỆU (BACKUP & RESTORE) */}
        <div className="glass-card rounded-3xl p-6 border border-emerald-800/50 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              SAO LƯU DỮ LIỆU (BACKUP & RESTORE)
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tải xuống tệp sao lưu định dạng JSON để dự phòng và phục hồi dữ liệu hệ thống RiceOS bất kỳ lúc nào.
          </p>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-600 hover:brightness-110 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Tải sao lưu (.json)
          </button>
        </div>

      </div>

      {/* USER CRUD MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-emerald-700/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-emerald-950/60 border border-emerald-800/40"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {editingProfile ? 'Chỉnh Sửa Thông Tin Thành Viên' : 'Thêm Thành Viên Mới'}
                </h3>
                <p className="text-xs text-slate-400">Cấu hình vai trò và phân quyền trên hệ thống</p>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Họ và Tên thành viên *</label>
                <input
                  type="text"
                  required
                  value={userForm.full_name}
                  onChange={e => setUserForm({ ...userForm, full_name: e.target.value })}
                  placeholder="Nguyễn Hiếu Nghĩa"
                  className="w-full p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className="w-full p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={userForm.phone}
                    onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Quyền Hạn Hệ Thống *</label>
                <select
                  value={userForm.role}
                  onChange={e => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                  className="w-full p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white font-bold"
                >
                  <option value="admin">ADMIN (Quản trị viên)</option>
                  <option value="editor">EDITOR (Biên tập viên)</option>
                  <option value="staff">STAFF (Cán bộ cân lúa)</option>
                  <option value="viewer">VIEWER (Người xem)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Trạng Thái Kích Hoạt</label>
                <select
                  value={userForm.status}
                  onChange={e => setUserForm({ ...userForm, status: e.target.value as UserStatus })}
                  className="w-full p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-white font-bold"
                >
                  <option value="active">🟢 Đã kích hoạt (Active)</option>
                  <option value="pending">⏳ Chờ duyệt (Pending)</option>
                  <option value="inactive">🔴 Ngừng hoạt động (Inactive)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-brand-600 text-white font-extrabold text-xs shadow-lg transition-all"
                >
                  {editingProfile ? 'Lưu Cập Nhật' : 'Thêm Mới Thành Viên'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
