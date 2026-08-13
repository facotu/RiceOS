'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Plus,
  Shield,
  Menu,
  X,
  Users
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, currentUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0b132b] text-slate-200 border-r border-slate-800/60 p-4 relative font-sans">
      
      {/* 1. Top Branding Header - Matching Screenshot */}
      <div className="pb-4 border-b border-slate-800/60 space-y-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-[#0b132b] rounded-[14px] flex items-center justify-center">
              <Wheat className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-wide text-white uppercase">CÂN LÚA RICE OS</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold font-mono">
                v1.0 OFFICIAL
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">Hệ thống điện tử 3 Cấp</span>
          </div>
        </Link>

        {/* 2. Quick Action Button (+ Thao tác nhanh) */}
        <button
          onClick={() => {
            router.push('/weighing');
            setMobileOpen(false);
          }}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-600 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Thao tác nhanh
        </button>
      </div>

      {/* 3. Grouped Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto space-y-5 text-xs font-bold">
        
        {/* GROUP 1: DASHBOARD */}
        <div className="space-y-1.5">
          <div className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
            DASHBOARD
          </div>
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === '/'
                ? 'bg-sky-600/30 border border-sky-500/50 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${pathname === '/' ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>DASHBOARD</span>
          </Link>
        </div>

        {/* GROUP 2: NGHIỆP VỤ CÂN LÚA */}
        <div className="space-y-1.5">
          <div className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
            NGHIỆP VỤ CÂN LÚA
          </div>
          
          <Link
            href="/weighing"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === '/weighing'
                ? 'bg-sky-600/30 border border-sky-500/50 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Scale className={`w-4 h-4 ${pathname === '/weighing' ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>KIỂM PHIẾU BẦU CỬ & CÂN LÚA</span>
          </Link>

          {isAdmin && (
            <Link
              href="/master-data"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname === '/master-data'
                  ? 'bg-sky-600/30 border border-sky-500/50 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Database className={`w-4 h-4 ${pathname === '/master-data' ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>DỮ LIỆU CÂN LÚA</span>
            </Link>
          )}

          <Link
            href="/settlement"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === '/settlement'
                ? 'bg-sky-600/30 border border-sky-500/50 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Receipt className={`w-4 h-4 ${pathname === '/settlement' ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>QUYẾT TOÁN & NÔNG DÂN</span>
          </Link>

          <Link
            href="/trucks"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === '/trucks'
                ? 'bg-sky-600/30 border border-sky-500/50 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Truck className={`w-4 h-4 ${pathname === '/trucks' ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>XE NHẬN VẬN CHUYỂN</span>
          </Link>

          <Link
            href="/history"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === '/history'
                ? 'bg-sky-600/30 border border-sky-500/50 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <History className={`w-4 h-4 ${pathname === '/history' ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>LỊCH SỬ PHIÊN CÂN</span>
          </Link>

          <Link
            href="/reports"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === '/reports'
                ? 'bg-sky-600/30 border border-sky-500/50 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className={`w-4 h-4 ${pathname === '/reports' ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>BÁO CÁO & KẾT QUẢ</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
              HOT
            </span>
          </Link>

          <Link
            href="/ai-camera"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
              pathname === '/ai-camera'
                ? 'bg-sky-600/30 border border-sky-500/50 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Camera className={`w-4 h-4 ${pathname === '/ai-camera' ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>AI CAMERA ĐỌC CÂN</span>
          </Link>
        </div>

        {/* GROUP 3: HỆ THỐNG */}
        {isAdmin && (
          <div className="space-y-1.5 pt-2">
            <div className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              HỆ THỐNG
            </div>
            <Link
              href="/system"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                pathname === '/system'
                  ? 'bg-sky-600/40 border border-sky-400/60 text-white font-black shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Settings className={`w-4 h-4 ${pathname === '/system' ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>HỆ THỐNG</span>
            </Link>
          </div>
        )}

      </div>

      {/* 4. Sidebar Footer - Matching Screenshot */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div className="flex flex-col text-[10px] leading-tight">
          <span className="font-extrabold text-white uppercase tracking-wider">
            QUYỀN HẠN: {currentUser?.role?.toUpperCase() || 'ADMIN'}
          </span>
          <span className="text-slate-400 font-medium">Phiên làm việc an toàn</span>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar Header Toggle */}
      <div className="lg:hidden bg-[#0b132b] text-white p-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 font-black text-sm">
          <Wheat className="w-5 h-5 text-sky-400" />
          <span>CÂN LÚA RICE OS</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-200"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="w-64 h-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 z-40">
        <SidebarContent />
      </aside>
    </>
  );
}
