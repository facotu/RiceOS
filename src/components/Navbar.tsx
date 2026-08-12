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
  User,
  PlusCircle
} from 'lucide-react';
import { UserRole } from '@/types/database.types';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchRole, notifications, markNotificationRead, isAdmin, isStaff } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/weighing', label: 'Phiên Cân', icon: Scale, highlight: true },
    { href: '/master-data', label: 'Dữ Liệu', icon: Database, adminOnly: true },
    { href: '/settlement', label: 'Quyết Toán', icon: Receipt },
    { href: '/trucks', label: 'Xe Nhận', icon: Truck },
    { href: '/history', label: 'Lịch Sử', icon: History },
    { href: '/reports', label: 'Báo Cáo', icon: BarChart3 },
    { href: '/ai-camera', label: 'AI Camera', icon: Camera },
  ];

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    admin: { title: 'Quản trị viên (Admin)', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
    editor: { title: 'Biên tập viên (Editor)', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    viewer: { title: 'Người xem (Viewer)', color: 'bg-gray-500/20 text-gray-300 border-gray-500/40' },
    staff: { title: 'Cán bộ cân (Staff)', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-md border-b border-emerald-800/40 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-gold-400 p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
                  <Wheat className="w-6 h-6 text-gold-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-gold-400 to-emerald-100">
                  RICE<span className="text-gold-400">OS</span>
                </span>
                <span className="text-[10px] text-emerald-400/80 font-medium tracking-widest uppercase">
                  Cân Lúa Thông Minh
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.adminOnly && !isAdmin) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-inner'
                      : link.highlight
                      ? 'bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 border border-gold-500/30 animate-pulse'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : link.highlight ? 'text-gold-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls (Role badge, Notification, Profile dropdown) */}
          <div className="flex items-center gap-3">

            {/* Quick Weighing Button */}
            <Link
              href="/weighing"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-semibold text-xs shadow-md hover:shadow-emerald-500/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Phiên Cân Mới</span>
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-slate-300 hover:text-white border border-emerald-800/40 transition-colors"
                title="Thông báo"
              >
                <Bell className="w-5 h-5 text-emerald-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-brand-dark/95 backdrop-blur-xl border border-emerald-700/50 rounded-xl shadow-2xl p-4 z-50 text-white animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-emerald-800/50 pb-2 mb-3">
                    <h3 className="font-semibold text-sm text-emerald-300 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gold-400" /> Thông báo đẩy
                    </h3>
                    <span className="text-xs text-slate-400">{notifications.length} tin</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">Chưa có thông báo nào</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-lg text-xs cursor-pointer border transition-colors ${
                            n.read
                              ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                              : 'bg-emerald-950/80 border-emerald-700/50 text-emerald-100 font-medium'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gold-300">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Info & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/50 text-left transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-emerald-600 flex items-center justify-center text-brand-dark font-bold text-xs shadow-md">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-semibold text-emerald-100 max-w-[130px] truncate">
                    {currentUser?.full_name || 'Đã đăng nhập'}
                  </span>
                  <span className="text-[10px] text-gold-400 font-medium">
                    {currentUser ? roleLabels[currentUser.role]?.title.split(' ')[0] : 'Role'}
                  </span>
                </div>
              </button>

              {/* Role Switcher Modal Dropdown */}
              {showRoleSelector && (
                <div className="absolute right-0 mt-2 w-72 bg-brand-dark/95 backdrop-blur-xl border border-emerald-700/50 rounded-xl shadow-2xl p-4 z-50 text-white animate-in fade-in slide-in-from-top-2">
                  <div className="border-b border-emerald-800/50 pb-3 mb-3">
                    <p className="text-xs font-medium text-slate-400">Tài khoản hiện tại:</p>
                    <p className="text-sm font-bold text-gold-300">{currentUser?.full_name}</p>
                    <p className="text-xs text-emerald-400 mt-0.5">{currentUser?.email}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-500/30 bg-emerald-950 text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-gold-400" />
                      Quyền hiện tại: {currentUser ? roleLabels[currentUser.role]?.title : ''}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-300 mb-2">Đổi quyền kiểm thử (Simulate Role):</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(['admin', 'editor', 'staff', 'viewer'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setShowRoleSelector(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-between transition-colors ${
                          currentUser?.role === r
                            ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                            : 'bg-emerald-950/40 border-emerald-900/60 text-slate-300 hover:bg-emerald-900/50'
                        }`}
                      >
                        <span>{roleLabels[r].title}</span>
                        {currentUser?.role === r && <UserCheck className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-emerald-800/50 flex justify-between items-center text-xs">
                    <Link
                      href="/login"
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                      onClick={() => setShowRoleSelector(false)}
                    >
                      <LogOut className="w-3.5 h-3.5" /> Trở về Đăng nhập
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-dark/95 border-b border-emerald-800/50 px-4 pt-2 pb-4 space-y-2 text-sm animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            if (link.adminOnly && !isAdmin) return null;
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600/40 text-emerald-200 border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-emerald-900/40 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
