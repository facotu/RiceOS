'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  LogOut,
  X,
  CheckCircle2,
  Phone,
  Mail,
  Lock,
  ChevronDown,
  Wheat,
  ShieldCheck,
  User,
  Settings,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SyncStatusBadge from '@/components/SyncStatusBadge';
import { UserRole } from '@/types/database.types';

export default function Header() {
  const router = useRouter();
  const { currentUser, switchRole, notifications, markNotificationRead, isAdmin, logoutUser } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const roleTitles: Record<UserRole, { label: string; color: string }> = {
    admin: { label: 'Admin (Quản trị)', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
    editor: { label: 'Editor (Biên tập)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    staff: { label: 'Cán bộ cân', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    viewer: { label: 'Người xem', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40' }
  };

  const currentRole = roleTitles[currentUser?.role || 'staff'];

  return (
    <>
      <header className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-emerald-800/40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl">

        {/* Left App Context / Scope Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-gold-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
              <Wheat className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
              RiceOS <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30 font-mono">v1.0 Pro</span>
            </h2>
            <p className="text-[10px] text-slate-400 hidden sm:block">Hệ Thống Thu Mua & Quản Lý Cân Lúa</p>
          </div>
        </div>

        {/* Right Horizontal Toolbar: Supabase Sync | Notifications | Unified User Profile Menu */}
        <div className="flex items-center gap-3">

          {/* 1. Supabase Cloud Sync Status Badge */}
          <div className="hidden md:block">
            <SyncStatusBadge />
          </div>

          {/* 2. Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserDropdown(false);
              }}
              className="relative p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-slate-200 transition-all shadow"
              title="Thông báo"
            >
              <Bell className="w-4.5 h-4.5 text-emerald-400" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce shadow">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-brand-dark/95 backdrop-blur-2xl border border-emerald-700/60 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2.5 mb-2.5">
                  <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-gold-400" /> Thông Báo ({notifications.length})
                  </h3>
                  <button onClick={() => setShowNotifMenu(false)} className="text-slate-400 hover:text-white text-xs">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">Chưa có thông báo nào</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          !n.read
                            ? 'bg-emerald-950/90 border-emerald-600 text-white font-medium'
                            : 'bg-emerald-950/30 border-emerald-900/40 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gold-300">{n.title}</span>
                          <span className="text-[9px] text-slate-500">{new Date(n.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. UNIFIED USER PROFILE MENU (CLEAN, NO TRUNCATION, NO SEPARATE LOGOUT BUTTON) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2.5 p-2 px-3 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-700/60 transition-all shadow"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-gold-400 to-emerald-300 p-0.5 shadow flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full bg-brand-dark rounded-[9px] flex items-center justify-center text-gold-300 font-extrabold text-xs uppercase">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
              </div>

              <div className="flex flex-col text-left whitespace-nowrap">
                <span className="text-xs font-extrabold text-white leading-tight">{currentUser?.full_name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${currentRole.color} w-max mt-0.5`}>
                  {currentRole.label}
                </span>
              </div>

              <ChevronDown className="w-4 h-4 text-slate-400 ml-1 flex-shrink-0" />
            </button>

            {/* Premium Integrated User Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-brand-dark/95 backdrop-blur-2xl border border-emerald-700/60 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-2">
                
                {/* Header User Card */}
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-gold-400 p-0.5 shadow flex-shrink-0">
                    <div className="w-full h-full bg-brand-dark rounded-[9px] flex items-center justify-center text-gold-300 font-extrabold text-sm">
                      {currentUser?.full_name?.charAt(0)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.full_name}</p>
                    <p className="text-[10px] text-emerald-300 font-mono truncate">{currentUser?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t border-emerald-900/60 my-1" />

                {/* Actions */}
                <div className="space-y-1 text-xs font-bold">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-xl text-slate-200 hover:bg-emerald-900/60 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4 text-gold-400" />
                    <span>Hồ sơ cá nhân & Đổi SĐT</span>
                  </button>

                  {isAdmin && (
                    <Link
                      href="/system"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full text-left p-2 rounded-xl text-slate-200 hover:bg-emerald-900/60 flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-emerald-400" />
                      <span>Quản trị Hệ Thống</span>
                    </Link>
                  )}
                </div>

                {/* Role Simulation Switcher */}
                <div className="border-t border-emerald-900/60 my-1 pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-1">Chuyển vai trò nhanh (Demo)</p>
                  <div className="grid grid-cols-2 gap-1">
                    {(['admin', 'editor', 'staff', 'viewer'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setShowUserDropdown(false);
                        }}
                        className={`p-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                          currentUser?.role === r
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-emerald-950/40 border-emerald-900/60 text-slate-300 hover:bg-emerald-900/60'
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-emerald-900/60 pt-1">
                  <button
                    onClick={() => {
                      logoutUser();
                      setShowUserDropdown(false);
                      router.push('/');
                    }}
                    className="w-full text-left p-2 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </header>

      {/* User Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-emerald-700/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">

            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-emerald-950/60 border border-emerald-800/40"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 border-b border-emerald-900/60 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-gold-400 to-emerald-300 p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center text-gold-300 font-extrabold text-xl">
                  {currentUser?.full_name?.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">{currentUser?.full_name}</h3>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${currentRole.color} mt-1`}>
                  {currentRole.label}
                </span>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Đã cập nhật hồ sơ cá nhân thành công!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    disabled
                    value={currentUser?.email || 'chua_cap_nhat@riceos.vn'}
                    className="w-full pl-9 pr-3 py-2 bg-emerald-950/50 border border-emerald-900 rounded-xl text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Số điện thoại liên hệ</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gold-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="0905 xxx xxx"
                    className="w-full pl-9 pr-3 py-2 bg-brand-dark border border-emerald-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-slate-950 font-extrabold text-xs shadow-lg hover:from-gold-300 hover:to-gold-400 transition-all"
                >
                  Lưu Thay Đổi
                </button>
                <Link
                  href="/forgot-password"
                  onClick={() => setShowProfileModal(false)}
                  className="px-3 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 font-semibold text-xs flex items-center justify-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" /> Đổi Mật Khẩu
                </Link>
              </div>
            </form>

            <div className="border-t border-emerald-900/60 pt-3 flex justify-between items-center">
              <button
                onClick={() => {
                  logoutUser();
                  setShowProfileModal(false);
                  router.push('/');
                }}
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 p-2 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <LogOut className="w-4 h-4" /> Đăng Xuất Tài Khoản
              </button>
              {isAdmin && (
                <Link
                  href="/system"
                  onClick={() => setShowProfileModal(false)}
                  className="text-xs text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1.5"
                >
                  Cấu Hình Hệ Thống
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
