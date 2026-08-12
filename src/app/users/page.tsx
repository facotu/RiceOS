'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Mail,
  UserCheck,
  Search,
  Clock,
  Send,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '@/types/database.types';

export default function UsersApprovalPage() {
  const { profiles, approveUser, updateUserRole, sendActivationEmail, isAdmin } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleApprove = (id: string, name: string) => {
    approveUser(id);
    setSuccessMsg(`Đã duyệt kích hoạt tài khoản và gửi email xác nhận cho ${name}!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleRoleChange = (id: string, role: UserRole, name: string) => {
    updateUserRole(id, role);
    setSuccessMsg(`Đã cấp quyền mới (${role.toUpperCase()}) cho ${name}!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleSendMail = (id: string, email: string) => {
    sendActivationEmail(id);
    setSuccessMsg(`Đã gửi lại Mail kích hoạt tới ${email}!`);
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
            <UserCheck className="w-6 h-6 text-gold-400" />
            Duyệt Kích Hoạt & Phân Quyền Thành Viên
          </h1>
          <p className="text-xs text-slate-300">
            Duyệt thành viên mới đăng ký, gửi mail xác nhận kích hoạt và phân quyền Admin, Editor, Viewer, Staff
          </p>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}
      </div>

      {/* Admin Access Restriction Notice */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-gold-400 flex-shrink-0" />
          <span>Bạn đang ở chế độ xem thử. Hãy chuyển sang vai trò <strong>Admin</strong> trên thanh Sidebar để thực hiện thao tác duyệt và cấp quyền thành viên.</span>
        </div>
      )}

      {/* Pending Approval Summary Bar */}
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
            <span className="text-xs font-bold text-slate-400 uppercase">Tổng Số Thành Viên Registered</span>
            <p className="text-2xl font-black text-white mt-1">{profiles.length} người dùng</p>
          </div>
          <Users className="w-8 h-8 text-slate-400 opacity-60" />
        </div>
      </div>

      {/* Search & Profiles Table */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Danh Sách Đăng Ký Thành Viên ({filteredProfiles.length})
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
                      onChange={e => handleRoleChange(p.id, e.target.value as UserRole, p.full_name)}
                      className="p-1.5 bg-emerald-950 border border-emerald-700 rounded-lg text-white font-bold text-xs"
                    >
                      <option value="admin">Quản trị viên (Admin)</option>
                      <option value="editor">Biên tập viên (Editor)</option>
                      <option value="staff">Cán bộ cân (Staff)</option>
                      <option value="viewer">Người xem (Viewer)</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      {!p.is_active && (
                        <button
                          onClick={() => handleApprove(p.id, p.full_name)}
                          disabled={!isAdmin}
                          className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Duyệt Tài Khoản
                        </button>
                      )}

                      <button
                        onClick={() => handleSendMail(p.id, p.email || '')}
                        disabled={!isAdmin}
                        className="py-1.5 px-2.5 rounded-lg bg-blue-950 border border-blue-700 text-blue-300 hover:bg-blue-900 text-xs font-semibold flex items-center gap-1"
                        title="Gửi mail xác nhận kích hoạt"
                      >
                        <Send className="w-3.5 h-3.5" /> Gửi Mail
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
  );
}
