'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Scale,
  Wheat,
  Truck,
  Users,
  Package,
  TrendingUp,
  Coins,
  Sparkles,
  UserCheck,
  CheckCircle2,
  LogIn,
  UserPlus,
  KeyRound,
  Send,
  Mail,
  Lock,
  Phone,
  User,
  Check,
  BarChart3,
  X,
  Eye,
  EyeOff,
  Zap,
  Shield,
  FileSpreadsheet,
  MapPin,
  History,
  ArrowRight,
  Database,
  Printer
} from 'lucide-react';

export default function Home() {
  const {
    currentUser,
    loginUser,
    logoutUser,
    registerNewUser,
    sessions,
    farmers,
    growingAreas,
    trucks,
    staffMembers,
    varieties,
    isAdmin
  } = useApp();

  // Auth Modal Popup State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form Inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  // Status Alerts inside Modal
  const [authAlert, setAuthAlert] = useState<{ type: 'success' | 'error' | 'warning'; msg: string } | null>(null);

  // Handlers
  const handleOpenAuth = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setAuthAlert(null);
    setShowAuthModal(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    const res = loginUser(loginEmail);
    if (res.success) {
      setAuthAlert({ type: 'success', msg: res.message });
      setTimeout(() => setShowAuthModal(false), 1200);
    } else {
      setAuthAlert({ type: 'error', msg: res.message });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    registerNewUser(regName, regEmail, regPhone);
    setAuthAlert({
      type: 'warning',
      msg: `🎉 Đăng ký tài khoản "${regName}" thành công! Yêu cầu kích hoạt đã gửi tới Admin. Vui lòng chờ Admin duyệt và cấp quyền.`
    });
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmail('');
    setAuthAlert({
      type: 'success',
      msg: `Đã gửi liên kết khôi phục mật khẩu tới ${forgotEmail}. Vui lòng kiểm tra hộp thư.`
    });
  };

  // Global Operations Aggregations
  const totalBags = sessions.reduce((sum, s) => sum + s.total_bags, 0);
  const totalFreshWeight = sessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
  const totalTareWeight = sessions.reduce((sum, s) => sum + s.total_tare_weight, 0);
  const totalDryWeight = sessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
  const totalValue = sessions.reduce((sum, s) => sum + s.total_amount, 0);

  // Regional breakdown
  const regionalStats = ['Tổ 9', 'Tổ 10', 'Gò ổi', 'LB Tây'].map(region => {
    const regPlots = farmers.filter(f => f.field_region === region);
    const regSessions = sessions.filter(s => s.field_region === region);
    const areaSum = regPlots.reduce((sum, f) => sum + (f.area || 0), 0);
    const drySum = regSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
    const valSum = regSessions.reduce((sum, s) => sum + s.total_amount, 0);
    return { region, plotsCount: regPlots.length, areaSum, drySum, valSum, sessionsCount: regSessions.length };
  });

  return (
    <div className="space-y-8 min-h-screen text-slate-100 pb-12">

      {/* TOP BAR HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand-dark/90 border border-emerald-800/50 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-gold-400 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-wider">CÂN LÚA RICE OS</h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold font-mono">
                577 THỬA ĐẤT • VỤ ĐÔNG XUÂN
              </span>
            </div>
            <p className="text-[11px] text-slate-300">HTX Nông Nghiệp An Trạch - Hòa Tiến, Hòa Vang, Đà Nẵng</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                👤 {currentUser.full_name} ({currentUser.role === 'admin' ? 'Admin' : 'Cán bộ cân'})
              </span>
              <button
                onClick={logoutUser}
                className="px-3.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold transition-all"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <LogIn className="w-4 h-4 text-emerald-400" /> Đăng nhập
              </button>
              <button
                onClick={() => handleOpenAuth('register')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-600 hover:from-sky-400 hover:to-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
              >
                <UserPlus className="w-4 h-4" /> Đăng ký cấp quyền
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DASHBOARD HERO BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-emerald-950/70 via-brand-dark to-brand-dark border border-emerald-800/50 space-y-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>BẢNG ĐIỀU HÀNH & THỐNG KÊ VẬN HÀNH THU MUA THỜI GIAN THỰC</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
              Hệ Thống Thu Mua & Cân Lúa <span className="text-gold-400">RiceOS</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Đồng bộ dữ liệu 577 thửa đất, 199 hộ sản xuất và 4 xứ đồng. Hỗ trợ tạo phiên cân 1-chạm, tự động trừ bì 12%, gộp phiếu quyết toán hộ gia đình và xuất báo cáo Zalo/Excel.
            </p>
          </div>

          <Link
            href="/weighing"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-gold-500/30 flex items-center gap-2 hover:scale-105 transition-transform self-stretch md:self-auto justify-center"
          >
            <Scale className="w-5 h-5" /> Vào Phiên Cân Lúa Ngay
          </Link>
        </div>

        {/* 6 SYSTEM OPERATIONAL METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">THỬA ĐẤT & DIỆN TÍCH</span>
            <p className="text-lg font-black text-white">577 <span className="text-xs font-bold text-emerald-400">thửa</span></p>
            <p className="text-[11px] text-emerald-300 font-bold">39.52 ha (395.200 m²)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HỘ SẢN XUẤT</span>
            <p className="text-lg font-black text-gold-300">199 <span className="text-xs font-bold text-gold-400">hộ</span></p>
            <p className="text-[11px] text-slate-300">4 Xứ đồng canh tác</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PHIÊN CÂN ĐÃ TẠO</span>
            <p className="text-lg font-black text-purple-300">{sessions.length} <span className="text-xs font-bold text-purple-400">phiên</span></p>
            <p className="text-[11px] text-purple-200 font-bold">{totalBags.toLocaleString('vi-VN')} bao lúa</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SẢN LƯỢNG TƯƠI</span>
            <p className="text-lg font-black text-blue-300">{(totalFreshWeight/1000).toFixed(2)} <span className="text-xs font-bold text-blue-400">tấn</span></p>
            <p className="text-[11px] text-blue-200 font-bold">{totalFreshWeight.toLocaleString('vi-VN')} kg tươi</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SẢN LƯỢNG KHÔ (NẾT)</span>
            <p className="text-lg font-black text-emerald-300">{(totalDryWeight/1000).toFixed(2)} <span className="text-xs font-bold text-emerald-400">tấn</span></p>
            <p className="text-[11px] text-emerald-200 font-bold">{totalDryWeight.toLocaleString('vi-VN')} kg khô</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-gold-500/20 border border-gold-500/40 space-y-1">
            <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider block">TỔNG GIÁ TRỊ MUA</span>
            <p className="text-lg font-black text-gold-300">{(totalValue/1000000).toFixed(1)} <span className="text-xs font-bold text-gold-400">trđ</span></p>
            <p className="text-[11px] text-gold-200 font-bold">{totalValue.toLocaleString('vi-VN')} VNĐ</p>
          </div>

        </div>
      </div>

      {/* QUICK NAVIGATION SHORTCUT MATRIX */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        <Link href="/weighing" className="glass-card p-4 rounded-2xl hover:border-gold-400 transition-all space-y-2 block text-center group">
          <div className="w-10 h-10 rounded-xl bg-gold-400/20 text-gold-300 flex items-center justify-center mx-auto border border-gold-400/40 group-hover:scale-110 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-gold-300">1. Phiên Cân Lúa</p>
          <span className="text-[10px] text-slate-400 block">Cân siêu tốc 1-chạm</span>
        </Link>

        <Link href="/master-data" className="glass-card p-4 rounded-2xl hover:border-emerald-400 transition-all space-y-2 block text-center group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-500/40 group-hover:scale-110 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-emerald-300">2. 577 Thửa Đất</p>
          <span className="text-[10px] text-slate-400 block">199 Hộ & 4 Xứ đồng</span>
        </Link>

        <Link href="/settlement" className="glass-card p-4 rounded-2xl hover:border-amber-400 transition-all space-y-2 block text-center group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-500/40 group-hover:scale-110 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-amber-300">3. Quyết Toán Hộ</p>
          <span className="text-[10px] text-slate-400 block">Chi trả & Xuất phiếu A5</span>
        </Link>

        <Link href="/history" className="glass-card p-4 rounded-2xl hover:border-sky-400 transition-all space-y-2 block text-center group">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mx-auto border border-sky-500/40 group-hover:scale-110 transition-transform">
            <History className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-sky-300">4. Lịch Sử Cân</p>
          <span className="text-[10px] text-slate-400 block">Xem & In lại phiếu</span>
        </Link>

        <Link href="/trucks" className="glass-card p-4 rounded-2xl hover:border-purple-400 transition-all space-y-2 block text-center group">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto border border-purple-500/40 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-purple-300">5. Đội Xe Nhận</p>
          <span className="text-[10px] text-slate-400 block">5 Xe tải thu mua</span>
        </Link>

        <Link href="/reports" className="glass-card p-4 rounded-2xl hover:border-rose-400 transition-all space-y-2 block text-center group">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto border border-rose-500/40 group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-rose-300">6. Báo Cáo Excel</p>
          <span className="text-[10px] text-slate-400 block">Thống kê & Xuất CSV</span>
        </Link>

      </div>

      {/* REGIONAL BREAKDOWN & RECENT WEIGHINGS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Regional Matrix (4 Xứ Đồng) */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-400" /> Tiến Độ Canh Tác Theo 4 Xứ Đồng
            </h3>
          </div>

          <div className="space-y-2.5">
            {regionalStats.map(st => (
              <div key={st.region} className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex justify-between items-center">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-[10px] text-sky-300 font-bold">
                    {st.region}
                  </span>
                  <p className="text-xs text-white font-extrabold mt-1">{st.plotsCount} thửa đất ({(st.areaSum/10000).toFixed(2)} ha)</p>
                  <p className="text-[11px] text-slate-400">{st.sessionsCount} phiên cân đã thực hiện</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-emerald-400 font-mono">{st.drySum.toLocaleString('vi-VN')} kg khô</p>
                  <p className="text-[11px] font-extrabold text-gold-300 font-mono">{st.valSum.toLocaleString('vi-VN')} VNĐ</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Weighings Table */}
        <div className="lg:col-span-7 glass-card p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-gold-400" /> Phiên Cân Lúa Vừa Thực Hiện
            </h3>
            <Link href="/history" className="text-xs text-gold-400 hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-emerald-950 text-emerald-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-2.5">Mã phiên</th>
                  <th className="p-2.5">Hộ sản xuất</th>
                  <th className="p-2.5">Xứ đồng</th>
                  <th className="p-2.5 text-right">Số bao</th>
                  <th className="p-2.5 text-right">Lúa khô</th>
                  <th className="p-2.5 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40">
                {sessions.slice(0, 5).map(s => (
                  <tr key={s.id} className="hover:bg-emerald-900/30">
                    <td className="p-2.5 font-extrabold text-gold-300">{s.session_code}</td>
                    <td className="p-2.5 font-bold text-white">{s.farmer?.name}</td>
                    <td className="p-2.5 text-sky-300">{s.field_region} ({s.lot})</td>
                    <td className="p-2.5 text-right font-bold text-purple-300">{s.total_bags} bao</td>
                    <td className="p-2.5 text-right font-extrabold text-emerald-400">{s.total_dry_weight.toLocaleString('vi-VN')} kg</td>
                    <td className="p-2.5 text-right font-extrabold text-gold-300">{s.total_amount.toLocaleString('vi-VN')} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* AUTH MODAL POPUP DIALOG */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark/95 border border-emerald-700/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">

            <div className="text-center relative pt-2">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute -top-2 -right-2 p-2 text-slate-400 hover:text-white rounded-full bg-emerald-950/80 border border-emerald-800/60"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 shadow-xl mx-auto flex items-center justify-center mb-3">
                <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center">
                  <Scale className="w-6 h-6 text-sky-400" />
                </div>
              </div>

              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                {authTab === 'login' ? 'ĐĂNG NHẬP HỆ THỐNG' : authTab === 'register' ? 'ĐĂNG KÝ THÀNH VIÊN MỚI' : 'KHÔI PHỤC MẬT KHẨU'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hệ thống Quản lý Cân lúa Thu mua An Trạch - Hòa Tiến
              </p>
            </div>

            <div className="flex bg-emerald-950/90 p-1 rounded-2xl border border-emerald-800/60">
              <button
                onClick={() => { setAuthTab('login'); setAuthAlert(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  authTab === 'login'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Đăng Nhập
              </button>
              <button
                onClick={() => { setAuthTab('register'); setAuthAlert(null); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  authTab === 'register'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Đăng Ký Mới
              </button>
            </div>

            {authAlert && (
              <div className={`p-3 rounded-xl border text-xs font-bold leading-relaxed animate-in zoom-in-95 ${
                authAlert.type === 'success'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : authAlert.type === 'warning'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
              }`}>
                {authAlert.msg}
              </div>
            )}

            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-extrabold mb-1 tracking-wider uppercase text-[10px]">
                    EMAIL HOẶC SỐ ĐIỆN THOẠI:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="VD: pctuanit@gmail.com hoặc 0916199945..."
                      className="w-full pl-9 pr-3 py-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-extrabold mb-1 tracking-wider uppercase text-[10px]">
                    MẬT KHẨU:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full pl-9 pr-10 py-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-1.5">
                    <button
                      type="button"
                      onClick={() => setAuthTab('forgot')}
                      className="text-sky-400 hover:underline text-[11px] font-bold"
                    >
                      🔑 Quên mật khẩu?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-400 hover:brightness-110 text-white font-black text-xs shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <LogIn className="w-4 h-4" /> XÁC NHẬN ĐĂNG NHẬP
                </button>
              </form>
            )}

            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-extrabold mb-1 tracking-wider uppercase text-[10px]">
                    HỌ VÀ TÊN:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Phạm Công Tuấn"
                      className="w-full pl-9 pr-3 py-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1 tracking-wider uppercase text-[10px]">EMAIL:</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="pctuanit@gmail.com"
                      className="w-full p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1 tracking-wider uppercase text-[10px]">SỐ ĐIỆN THOẠI:</label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="0916199945"
                      className="w-full p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-extrabold mb-1 tracking-wider uppercase text-[10px]">TẠO MẬT KHẨU:</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-white text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-600 hover:brightness-110 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all"
                >
                  <UserPlus className="w-4 h-4" /> TẠO TÀI KHOẢN MỚI
                </button>
              </form>
            )}

            {authTab === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-extrabold mb-1 tracking-wider uppercase text-[10px]">
                    EMAIL ĐÃ ĐĂNG KÝ:
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="pctuanit@gmail.com"
                    className="w-full p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> GỬI YÊU CẦU KHÔI PHỤC
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
