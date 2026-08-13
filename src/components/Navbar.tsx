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
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import SyncStatusBadge from '@/components/SyncStatusBadge';
import { UserRole } from '@/types/database.types';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchRole, notifications, markNotificationRead, isAdmin } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/weighing', label: 'Phiên Cân Lúa', icon: Scale, highlight: true },
    { href: '/system', label: 'Hệ Thống', icon: Settings, adminOnly: true },
    { href: '/master-data', label: 'Danh Mục', icon: Database, adminOnly: true },
    { href: '/settlement', label: 'Quyết Toán', icon: Receipt },
    { href: '/trucks', label: 'Xe Nhận', icon: Truck },
    { href: '/history', label: 'Lịch Sử', icon: History },
    { href: '/reports', label: 'Báo Cáo', icon: BarChart3 },
    { href: '/ai-camera', label: 'AI Camera', icon: Camera },
  ];

  const roleLabels: Record<UserRole, { title: string; badgeColor: string }> = {
    admin: { title: 'Admin (Quản trị)', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40' },
    editor: { title: 'Editor (Biên tập)', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    viewer: { title: 'Viewer (Người xem)', badgeColor: 'bg-gray-500/20 text-gray-300 border-gray-500/40' },
    staff: { title: 'Staff (Cán bộ cân)', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  };

  const currentRoleInfo = roleLabels[currentUser?.role || 'staff'];

  return (
    <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-xl border-b border-emerald-800/40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-gold-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
                <Wheat className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-wide block">
                Rice<span className="text-gold-400">OS</span>
              </span>
              <span className="text-[10px] text-slate-400 -mt-1 block font-medium">Hệ Thống Cân Lúa</span>
            </div>
          </Link>

          {/* Desktop Horizontal Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.adminOnly && !isAdmin) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-brand-600 text-white shadow-lg border border-emerald-400/30'
                      : link.highlight
                      ? 'bg-gold-500/10 text-gold-300 border border-gold-500/30 hover:bg-gold-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.highlight ? 'text-gold-400' : 'text-emerald-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Sync Status, Notifications & Profile */}
          <div className="hidden sm:flex items-center gap-2">

            {/* Supabase Sync Badge */}
            <div className="scale-90 transform-gpu">
              <SyncStatusBadge />
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-800/50 text-slate-200 transition-colors"
                title="Thông báo"
              >
                <Bell className="w-4 h-4 text-emerald-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce shadow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-brand-dark/95 backdrop-blur-2xl border border-emerald-700/60 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2.5 mb-2.5">
                    <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-gold-400" /> Thông Báo ({notifications.length})
                    </h3>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white text-xs">
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

            {/* Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-800/60 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-gold-400 p-0.5 flex items-center justify-center shadow">
                  <div className="w-full h-full bg-brand-dark rounded-[7px] flex items-center justify-center text-gold-300 font-black text-xs uppercase">
                    {currentUser?.full_name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">{currentUser?.full_name}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full border ${currentRoleInfo.badgeColor} w-max mt-0.5`}>
                    {currentRoleInfo.title}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-56 bg-brand-dark/95 backdrop-blur-2xl border border-emerald-700/60 rounded-2xl shadow-2xl p-2 z-50 animate-in zoom-in-95">
                  <div className="border-t border-emerald-800/50 mt-1 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setShowRoleSwitcher(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-slate-200 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-emerald-900/60 bg-brand-dark/95 backdrop-blur-2xl p-4 space-y-3 animate-in slide-in-from-top-2">

          {/* Mobile Sync Badge */}
          <SyncStatusBadge />

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => {
              if (link.adminOnly && !isAdmin) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-brand-600 text-white shadow-md'
                      : link.highlight
                      ? 'bg-gold-500/10 text-gold-300 border border-gold-500/30'
                      : 'bg-emerald-950/40 text-slate-300 hover:bg-emerald-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

        </div>
      )}
    </header>
  );
}
