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
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/weighing', label: 'Phiên Cân Lúa', icon: Scale, highlight: true },
    { href: '/system', label: 'Hệ Thống', icon: Settings, adminOnly: true },
    { href: '/master-data', label: 'Dữ Liệu Danh Mục', icon: Database, adminOnly: true },
    { href: '/settlement', label: 'Quyết Toán Tiền', icon: Receipt },
    { href: '/trucks', label: 'Xe Nhận Vận Chuyển', icon: Truck },
    { href: '/history', label: 'Lịch Sử Phiên Cân', icon: History },
    { href: '/reports', label: 'Báo Cáo Vụ Mùa', icon: BarChart3 },
    { href: '/ai-camera', label: 'AI Camera Đọc Cân', icon: Camera },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-dark/95 backdrop-blur-xl border-r border-emerald-800/40 p-4 relative">
      
      {/* Top Branding Logo - Matching user screenshot */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-800/40">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-gold-400 p-0.5 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center">
              <Wheat className="w-7 h-7 text-gold-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-gold-400 to-emerald-100 block">
              RICE<span className="text-gold-400">OS</span>
            </span>
            <span className="text-xs text-slate-400 font-medium block">Cân Lúa Thông Minh</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links List */}
      <div className="flex-1 py-4 overflow-y-auto space-y-1">
        <div className="px-3 pb-3 text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          PHÂN HỆ QUẢN LÝ
        </div>
        <nav className="space-y-2">
          {navLinks.map((link) => {
            if (link.adminOnly && !isAdmin) return null;
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-brand-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400/40'
                    : link.highlight
                    ? 'bg-gold-500/10 text-gold-300 border border-gold-500/40 hover:bg-gold-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.highlight ? 'text-gold-400' : 'text-emerald-400'}`} />
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-gold-400" />}
              </Link>
            );
          })}
        </nav>
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
