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
  FileSpreadsheet
} from 'lucide-react';

export default function Home() {
  const {
    currentUser,
    loginUser,
    logoutUser,
    registerNewUser,
    sessions,
    isAdmin,
    profiles
  } = useApp();

  // Auth Modal Popup State (as shown in user screenshot)
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
    setAuthAlert({
      type: 'success',
      msg: `Đã gửi liên kết khôi phục mật khẩu tới ${forgotEmail}. Vui lòng kiểm tra hộp thư.`
    });
    setForgotEmail('');
  };

  // Session stats for logged-in user
  const relevantSessions = !isAdmin
    ? sessions.filter(s => s.created_by === currentUser?.id || s.staff?.user_id === currentUser?.id || s.staff?.full_name.includes(currentUser?.full_name || ''))
    : sessions;

  const totalSessionsCount = relevantSessions.length;
  const totalFreshWeight = relevantSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
  const totalDryWeight = relevantSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
  const totalBags = relevantSessions.reduce((sum, s) => sum + s.total_bags, 0);

  return (
    <div className="space-y-10 min-h-screen text-slate-100">

      {/* TOP NAVBAR HEADER - Matching User Screenshot */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand-dark/80 border border-emerald-800/40 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-gold-400 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-wider">CÂN LÚA RICE OS</h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold font-mono">
                v1.0 OFFICIAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Hệ thống Quản lý Cân lúa & Thu mua Nông sản 3 Cấp</p>
          </div>
        </div>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                👤 {currentUser.full_name}
              </span>
              <button
                onClick={logoutUser}
                className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold transition-all"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <LogIn className="w-4 h-4 text-emerald-400" /> Đăng nhập
              </button>
              <button
                onClick={() => handleOpenAuth('register')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-600 hover:from-sky-400 hover:to-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all"
              >
                <UserPlus className="w-4 h-4" /> Đăng ký cấp quyền
              </button>
            </>
          )}
        </div>
      </div>

      {/* HERO SECTION - Exact Structure from User Screenshot */}
      <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-emerald-950/60 via-brand-dark to-brand-dark border border-emerald-800/40 text-center space-y-6 overflow-hidden shadow-2xl">
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Top Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide shadow">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>ÁP DỤNG THỰC TẾ CHO TẤT CẢ CÁC ĐỒNG RUỘNG & THU MUA LÚA TOÀN QUỐC</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          HỆ THỐNG CÂN LÚA THU MUA NÔNG SẢN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-300 to-gold-400">
            THỜI GIAN THỰC
          </span>
        </h2>

        {/* Sub-headline description */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Giải pháp chuyển đổi số toàn diện cho thương lái, nhà máy và cán bộ cân lúa. Tích hợp AI Camera đọc màn hình cân, Numpad 1-3 bao, % Trừ bì tự động và xuất báo cáo Zalo & Excel (.xlsx).
        </p>

        {/* Feature Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Chính xác tuyệt đối 100%
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-xs font-bold text-gold-300 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-gold-400" /> Xử lý siêu tốc ngoài đồng
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-xs font-bold text-sky-300 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-sky-400" /> Xuất Zalo & Excel (.xlsx)
          </span>
        </div>

        {/* Hero CTA Action Buttons */}
        {!currentUser && (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleOpenAuth('register')}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-600 hover:brightness-110 text-white font-black text-sm shadow-xl shadow-sky-500/25 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-5 h-5" /> Đăng ký cấp quyền
            </button>
            <button
              onClick={() => handleOpenAuth('login')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/60 text-white font-black text-sm shadow-lg flex items-center gap-2 transition-all"
            >
              <LogIn className="w-5 h-5 text-emerald-400" /> Đăng nhập hệ thống
            </button>
          </div>
        )}

        {currentUser && (
          <div className="pt-4 flex justify-center">
            <Link
              href="/weighing"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 text-slate-950 font-black text-sm shadow-2xl shadow-gold-500/30 flex items-center gap-2.5 hover:scale-105 transition-all"
            >
              <Scale className="w-6 h-6" /> Vào Phiên Cân Lúa Ngay
            </Link>
          </div>
        )}

      </div>

      {/* FEATURE CARDS GRID - Matching Screenshot Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-800/40 relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
              Cấp tốc
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white">Kiểm phiếu & Cân lúa siêu tốc Enter x2</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Phím bấm Numpad 1, 2, 3 bao trực quan, tự động tính tổng cân tươi, trừ bì và chuyển mã cân tiếp theo chỉ với phím Enter.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-800/40 relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 text-[10px] font-bold">
              Mới
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white">Nhập theo lô hàng loạt</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tự động lấy tên Vùng Trồng, Lô ruộng và Xứ đồng. Hỗ trợ nhập danh sách bao lúa cùng mã cân nhanh chóng ngoài đồng ruộng.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-800/40 relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Bảo mật
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white">Tự động trừ bì % thời gian thực</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mặc định trừ bì 12% (tùy chỉnh linh hoạt). Tính toán chính xác trọng lượng lúa khô ngay tại chỗ, chống thất thoát.
          </p>
        </div>

      </div>

      {/* METRICS FOR LOGGED-IN USERS */}
      {currentUser && (
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-emerald-800/50">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" /> Thống Kê Sản Lượng Cá Nhân
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/40">
              <span className="text-xs font-bold text-slate-400 block">Số Phiên Cân</span>
              <p className="text-2xl font-black text-white mt-1">{totalSessionsCount}</p>
            </div>
            <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/40">
              <span className="text-xs font-bold text-slate-400 block">Tổng Số Bao</span>
              <p className="text-2xl font-black text-gold-300 mt-1">{totalBags.toLocaleString('vi-VN')} bao</p>
            </div>
            <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/40">
              <span className="text-xs font-bold text-slate-400 block">Lúa Tươi (Kg)</span>
              <p className="text-2xl font-black text-emerald-300 mt-1">{totalFreshWeight.toLocaleString('vi-VN')} kg</p>
            </div>
            <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/40">
              <span className="text-xs font-bold text-slate-400 block">Lúa Khô (Kg)</span>
              <p className="text-2xl font-black text-sky-300 mt-1">{totalDryWeight.toLocaleString('vi-VN')} kg</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE AUTH MODAL POPUP DIALOG - EXACT MATCH TO USER SCREENSHOT      */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark/95 border border-emerald-700/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">

            {/* Modal Header */}
            <div className="text-center relative pt-2">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute -top-2 -right-2 p-2 text-slate-400 hover:text-white rounded-full bg-emerald-950/80 border border-emerald-800/60"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon Badge Top Center */}
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

            {/* Tab Switcher inside Modal - Exact Pill Design */}
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

            {/* Status Alert Box */}
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

            {/* TAB 1: LOGIN FORM */}
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

            {/* TAB 2: REGISTER FORM */}
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
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  * Sau khi đăng ký, thông báo sẽ tự động gửi tới Admin để duyệt và cấp quyền kích hoạt.
                </p>
              </form>
            )}

            {/* TAB 3: FORGOT PASSWORD */}
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
