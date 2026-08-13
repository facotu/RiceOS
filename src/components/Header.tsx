'use client';

import React, { useState, useEffect } from 'react';
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
  User,
  HelpCircle,
  Clock,
  Globe,
  Check,
  Settings,
  MapPin,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/database.types';

export default function Header() {
  const router = useRouter();
  const { currentUser, notifications, markNotificationRead, isAdmin, logoutUser } = useApp();
  
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'PT';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const roleConfigs: Record<UserRole, { badgeText: string; modeText: string; badgeColor: string; textColor: string }> = {
    admin: { badgeText: 'ADMIN', modeText: 'ADMIN MODE', badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40', textColor: 'text-sky-400' },
    editor: { badgeText: 'EDITOR', modeText: 'EDITOR MODE', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40', textColor: 'text-blue-400' },
    staff: { badgeText: 'STAFF', modeText: 'STAFF MODE', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', textColor: 'text-emerald-400' },
    viewer: { badgeText: 'VIEWER', modeText: 'VIEWER MODE', badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40', textColor: 'text-slate-400' }
  };

  const currentRoleInfo = roleConfigs[currentUser?.role || 'admin'];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0b132b]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-sm">

        {/* 1. Left Scope Location Pill - Matching Screenshot */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-800/50 text-sky-800 dark:text-sky-300 text-xs font-bold shadow-sm">
          <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span>Vùng trồng lúa số 21 - Xã Hòa Tiến, Thành phố Đà Nẵng</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-200 font-mono">
            KHÓA XVT
          </span>
        </div>

        {/* 2. Center Search Bar - Matching Screenshot */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm cử tri, ứng cử viên (Mã thẻ / Tên)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
            />
          </div>
        </div>

        {/* 3. Right Header Toolbar - Matching Screenshot 100% */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Real-time Clock Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{currentTime || '00:41'}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              title="Thông báo"
            >
              <Bell className="w-4.5 h-4.5 text-slate-700 dark:text-slate-200" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow">
                  {unreadNotifs.length > 9 ? '9+' : unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0b132b]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-2.5">
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-sky-500" /> Thông Báo ({notifications.length})
                  </h3>
                  <button onClick={() => setShowNotifMenu(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs">
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
                            ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-slate-900 dark:text-white font-medium'
                            : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sky-600 dark:text-sky-300">{n.title}</span>
                          <span className="text-[9px] text-slate-400">{new Date(n.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={() => router.push('/')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
            <span>Trợ giúp</span>
          </button>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-800 mx-0.5" />

          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-2xl bg-sky-50/80 dark:bg-slate-900/80 hover:bg-sky-100 dark:hover:bg-slate-800 border border-sky-100 dark:border-slate-800 transition-all shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-teal-500 p-0.5 shadow flex-shrink-0">
                <div className="w-full h-full bg-cyan-600 rounded-full flex items-center justify-center text-white font-black text-xs tracking-wider">
                  {getInitials(currentUser?.full_name)}
                </div>
              </div>

              <div className="flex flex-col text-left whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                    {currentUser?.full_name || 'Phạm Công Tuấn'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[9px] font-black text-sky-600 dark:text-sky-400 tracking-wider uppercase leading-none mt-0.5">
                  {currentRoleInfo.modeText}
                </span>
              </div>
            </button>

            {/* Dropdown Menu Card */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0b132b]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                
                <div className="p-3 rounded-2xl bg-sky-50/80 dark:bg-slate-900/80 border border-sky-100 dark:border-slate-800 space-y-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                    {currentUser?.full_name || 'PHẠM CÔNG TUÂN'}
                  </h4>
                  <p className="text-xs font-mono text-slate-500 dark:text-sky-300">
                    {currentUser?.email || 'pctuanit@gmail.com'}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 text-[10px] font-black uppercase">
                      {currentRoleInfo.badgeText}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500" /> Đã xác thực
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                <div className="space-y-1 text-xs font-bold">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-sky-500" />
                    <span>Hồ sơ cá nhân</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      router.push('/');
                    }}
                    className="w-full text-left p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span>Trang giới thiệu</span>
                  </button>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      logoutUser();
                      setShowUserDropdown(false);
                      router.push('/');
                    }}
                    className="w-full text-left p-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2.5 transition-colors font-extrabold"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
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
          <div className="bg-white dark:bg-[#0b132b] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">

            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600 p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-cyan-700 rounded-[14px] flex items-center justify-center text-white font-black text-xl">
                  {getInitials(currentUser?.full_name)}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{currentUser?.full_name}</h3>
                <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 mt-1">
                  {currentRoleInfo.modeText}
                </span>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Đã cập nhật hồ sơ cá nhân thành công!
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-sky-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    disabled
                    value={currentUser?.email || 'pctuanit@gmail.com'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Số điện thoại liên hệ</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    placeholder="0905 xxx xxx"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-600 text-white font-black text-xs shadow-lg transition-all"
                >
                  Lưu Thay Đổi
                </button>
                <Link
                  href="/forgot-password"
                  onClick={() => setShowProfileModal(false)}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" /> Đổi Mật Khẩu
                </Link>
              </div>
            </form>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center">
              <button
                onClick={() => {
                  logoutUser();
                  setShowProfileModal(false);
                  router.push('/');
                }}
                className="text-xs text-red-600 hover:text-red-500 font-extrabold flex items-center gap-1.5 p-2 rounded-xl bg-red-50 border border-red-200"
              >
                <LogOut className="w-4 h-4" /> Đăng Xuất Tài Khoản
              </button>
              {isAdmin && (
                <Link
                  href="/system"
                  onClick={() => setShowProfileModal(false)}
                  className="text-xs text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1.5"
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
