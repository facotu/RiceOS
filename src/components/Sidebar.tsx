'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Wheat,
  LayoutDashboard,
  Scale,
  Database,
  Receipt,
  Truck,
  History,
  BarChart3,
  Camera,
  Bell,
  UserCheck,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '@/types/database.types';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, switchRole, notifications, markNotificationRead, isAdmin } = useApp();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/weighing', label: 'Phiên Cân Lúa', icon: Scale, highlight: true },
    { href: '/users', label: 'Duyệt Thành Viên', icon: UserCheck, adminOnly: true },
    { href: '/master-data', label: 'Dữ Liệu Danh Mục', icon: Database, adminOnly: true },
    { href: '/settlement', label: 'Quyết Toán Tiền', icon: Receipt },
    { href: '/trucks', label: 'Xe Nhận Vận Chuyển', icon: Truck },
    { href: '/history', label: 'Lịch Sử Phiên Cân', icon: History },
    { href: '/reports', label: 'Báo Cáo Vụ Mùa', icon: BarChart3 },
    { href: '/ai-camera', label: 'AI Camera Đọc Cân', icon: Camera },
  ];

  const roleLabels: Record<UserRole, { title: string; badgeColor: string }> = {
    admin: { title: 'Admin (Quản trị)', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40' },
    editor: { title: 'Editor (Biên tập)', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    viewer: { title: 'Viewer (Người xem)', badgeColor: 'bg-gray-500/20 text-gray-300 border-gray-500/40' },
    staff: { title: 'Staff (Cán bộ cân)', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-dark/95 backdrop-blur-2xl border-r border-emerald-800/40 text-slate-100 p-4 justify-between select-none">

      <div className="space-y-6">

        {/* Brand Header Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-gold-400 p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
              <Wheat className="w-6 h-6 text-gold-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-gold-400 to-emerald-100">
              RICE<span className="text-gold-400">OS</span>
            </span>
            <span className="text-[9px] text-emerald-400/90 font-bold tracking-widest uppercase">
              Cân Lúa Thông Minh
            </span>
          </div>
        </Link>

        {/* Quick New Session Button */}
        <Link
          href="/weighing"
          onClick={() => setMobileOpen(false)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-emerald-500 hover:brightness-110 text-brand-dark font-extrabold text-xs shadow-xl shadow-gold-500/15 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          <span>Phiên Cân Mới</span>
        </Link>

        {/* Navigation Vertical Menu */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Phân Hệ Chức Năng
          </p>

          {navLinks.map((link) => {
            if (link.adminOnly && !isAdmin) return null;
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/40 to-emerald-800/30 text-emerald-200 border border-emerald-500/50 shadow-inner'
                    : link.highlight
                    ? 'bg-gold-500/10 text-gold-300 hover:bg-gold-500/20 border border-gold-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-emerald-400' : link.highlight ? 'text-gold-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-400" />}
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Bottom User Info & Role Controls */}
      <div className="space-y-3 pt-4 border-t border-emerald-800/40">

        {/* Notification Bell Box */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 text-xs font-medium text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span>Thông báo đẩy</span>
          </div>
          {unreadCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-bounce">
              {unreadCount}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">{notifications.length}</span>
          )}
        </button>

        {/* Notifications Drawer Modal */}
        {showNotifications && (
          <div className="absolute bottom-20 left-4 right-4 bg-brand-dark/95 backdrop-blur-xl border border-emerald-700/60 rounded-xl shadow-2xl p-3 z-50 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-emerald-800/50 pb-2 mb-2">
              <h3 className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-gold-400" /> Notifications
              </h3>
              <button onClick={() => setShowNotifications(false)} className="text-slate-400 text-xs">Đóng</button>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-2 rounded-lg text-[11px] cursor-pointer border ${
                    n.read ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-emerald-950 border-emerald-700 text-emerald-200 font-medium'
                  }`}
                >
                  <p className="font-bold text-gold-300">{n.title}</p>
                  <p>{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Logged in User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="w-full flex items-center gap-3 p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/60 text-left transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-emerald-600 flex items-center justify-center text-brand-dark font-extrabold text-sm shadow-md">
              {currentUser?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-emerald-100 truncate">{currentUser?.full_name}</p>
              <span className={`inline-block px-1.5 py-0.2 text-[9px] font-bold rounded border ${currentUser ? roleLabels[currentUser.role]?.badgeColor : ''}`}>
                {currentUser ? roleLabels[currentUser.role]?.title : ''}
              </span>
            </div>
          </button>

          {/* Role selector dropdown */}
          {showRoleSelector && (
            <div className="absolute bottom-14 left-0 right-0 bg-brand-dark/95 backdrop-blur-xl border border-emerald-700/60 rounded-xl shadow-2xl p-3 z-50 animate-in slide-in-from-bottom-2 text-white">
              <p className="text-[11px] font-bold text-slate-300 mb-2">Đổi quyền kiểm thử (Simulate Role):</p>
              <div className="space-y-1">
                {(['admin', 'editor', 'staff', 'viewer'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => { switchRole(r); setShowRoleSelector(false); }}
                    className={`w-full text-left p-1.5 px-2.5 rounded-lg text-xs font-semibold border flex items-center justify-between ${
                      currentUser?.role === r ? 'bg-emerald-600/40 border-emerald-500 text-emerald-200' : 'bg-emerald-950/40 border-emerald-900 text-slate-300'
                    }`}
                  >
                    <span>{roleLabels[r].title}</span>
                    {currentUser?.role === r && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs px-2 py-1 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Thoát / Đăng nhập lại
        </Link>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Top Header with Hamburger toggle */}
      <header className="lg:hidden sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-md border-b border-emerald-800/40 px-4 py-3 flex items-center justify-between text-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-gold-400 flex items-center justify-center shadow-md">
            <Wheat className="w-5 h-5 text-gold-400" />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-gold-400 to-emerald-100">
            RICE<span className="text-gold-400">OS</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/weighing"
            className="px-3 py-1.5 rounded-lg bg-gold-400 text-brand-dark font-extrabold text-xs shadow"
          >
            + Cân Mới
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sliding Drawer Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-full h-full z-10 animate-in slide-in-from-left">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
