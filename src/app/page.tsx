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
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Calendar,
  LogIn,
  UserPlus,
  KeyRound,
  Shield,
  Send,
  AlertTriangle,
  Mail,
  Lock,
  Phone,
  User,
  ArrowRight,
  Camera,
  Receipt,
  Share2,
  Check,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Home() {
  const {
    currentUser,
    loginUser,
    logoutUser,
    registerNewUser,
    sessions,
    isAdmin,
    isStaff,
    profiles
  } = useApp();

  // Auth Tab State on Landing Page
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');

  // Status Alerts
  const [authAlert, setAuthAlert] = useState<{ type: 'success' | 'error' | 'warning'; msg: string } | null>(null);

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    const res = loginUser(loginEmail);
    if (res.success) {
      setAuthAlert({ type: 'success', msg: res.message });
    } else {
      setAuthAlert({ type: 'error', msg: res.message });
    }
  };

  const handleQuickLogin = (email: string) => {
    setLoginEmail(email);
    const res = loginUser(email);
    if (res.success) {
      setAuthAlert({ type: 'success', msg: res.message });
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
      msg: `🎉 Đăng ký thành công tài khoản "${regName}"! Thông báo kích hoạt đã gửi tới Admin. Vui lòng chờ Admin duyệt và cấp quyền để có thể đăng nhập.`
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

  // Filter sessions based on current logged in user role:
  // Non-admin sees ONLY sessions created by them. Admin sees ALL sessions.
  const relevantSessions = !isAdmin
    ? sessions.filter(s => s.created_by === currentUser?.id || s.staff?.user_id === currentUser?.id || s.staff?.full_name.includes(currentUser?.full_name || ''))
    : sessions;

  // Aggregate Metrics
  const totalSessionsCount = relevantSessions.length;
  const totalFreshWeight = relevantSessions.reduce((sum, s) => sum + s.total_fresh_weight, 0);
  const totalDryWeight = relevantSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
  const totalBags = relevantSessions.reduce((sum, s) => sum + s.total_bags, 0);
  const totalRevenue = relevantSessions.reduce((sum, s) => sum + s.total_amount, 0);

  // Group by Variety
  const varietyStatsMap: Record<string, { name: string; fresh: number; dry: number; bags: number; revenue: number }> = {};
  relevantSessions.forEach(s => {
    const varName = s.variety?.name || s.variety?.code || 'Khác';
    if (!varietyStatsMap[varName]) {
      varietyStatsMap[varName] = { name: varName, fresh: 0, dry: 0, bags: 0, revenue: 0 };
    }
    varietyStatsMap[varName].fresh += s.total_fresh_weight;
    varietyStatsMap[varName].dry += s.total_dry_weight;
    varietyStatsMap[varName].bags += s.total_bags;
    varietyStatsMap[varName].revenue += s.total_amount;
  });
  const varietyChartData = Object.values(varietyStatsMap);

  const pendingUsersCount = profiles.filter(p => p.status === 'pending' || !p.is_active).length;

  return (
    <div className="space-y-8">

      {/* SECTION 1: LANDING PAGE HEADER & AUTH INTEGRATION */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl border border-emerald-800/50">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-gold-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: App Introduction & Value Proposition */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-bold shadow">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Hệ Thống Cân Lúa & Thu Mua Nông Sản Hiện Đại</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Quản Lý Cân Lúa <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-gold-400 to-emerald-100">
                Thông Minh Ngoài Đồng
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Giải pháp số hóa toàn diện quy trình thu mua lúa ngoài đồng ruộng. Tích hợp AI Camera tự động đọc màn hình cân điện tử, phím cân 1-3 bao, trừ bì % mặc định 12%, gửi Zalo 1-chạm, in phiếu nhiệt 80mm và phân quyền duyệt thành viên tạo phiên cân riêng biệt.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-slate-200">
                <Check className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Numpad 1, 2, 3 bao</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-slate-200">
                <Check className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Trừ bì % (Mặc định 12%)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-slate-200">
                <Check className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Admin duyệt & cấp quyền</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-slate-200">
                <Check className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Số liệu riêng thành viên</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-slate-200">
                <Check className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>AI Camera Đọc Cân</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-slate-200">
                <Check className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Copy Zalo & In 80mm</span>
              </div>
            </div>

            {/* Quick Action when Logged In */}
            {currentUser && (
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/weighing"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-gold-500/20 flex items-center gap-2"
                >
                  <Scale className="w-5 h-5" /> Vào Tạo Phiên Cân Lúa Ngay
                </Link>
                {isAdmin && (
                  <Link
                    href="/system"
                    className="px-5 py-3 rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-gold-400" />
                    Duyệt Thành Viên ({pendingUsersCount} Chờ)
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Integrated Auth Container (Login / Register / Forgot Password) */}
          <div className="lg:col-span-5 bg-brand-dark/95 backdrop-blur-2xl border border-emerald-700/60 rounded-3xl p-6 shadow-2xl space-y-4">
            
            {/* Logged-In User Banner */}
            {currentUser ? (
              <div className="space-y-4 py-2 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-gold-400 to-emerald-300 p-0.5 shadow-xl mx-auto flex items-center justify-center">
                  <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center text-gold-300 font-extrabold text-2xl">
                    {currentUser.full_name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{currentUser.full_name}</h3>
                  <p className="text-xs text-emerald-300 font-mono mt-0.5">{currentUser.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    Vai trò: {currentUser.role.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
                  Bạn đang đăng nhập vào workspace cá nhân. Mọi phiên cân lúa bạn tạo sẽ được lưu riêng cho tài khoản này.
                </p>
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/weighing"
                    className="flex-1 py-2.5 rounded-xl bg-gold-400 text-slate-950 font-black text-xs shadow text-center"
                  >
                    Vào Cân Lúa
                  </Link>
                  <button
                    onClick={logoutUser}
                    className="py-2.5 px-4 rounded-xl bg-red-950 border border-red-700 text-red-300 font-bold text-xs"
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            ) : (
              /* Visitor / Auth Tabs */
              <>
                {/* Auth Tab Switcher */}
                <div className="flex bg-emerald-950/80 p-1 rounded-2xl border border-emerald-800/60">
                  <button
                    onClick={() => { setAuthTab('login'); setAuthAlert(null); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      authTab === 'login' ? 'bg-gold-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" /> Đăng Nhập
                  </button>
                  <button
                    onClick={() => { setAuthTab('register'); setAuthAlert(null); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      authTab === 'register' ? 'bg-gold-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Đăng Ký
                  </button>
                  <button
                    onClick={() => { setAuthTab('forgot'); setAuthAlert(null); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      authTab === 'forgot' ? 'bg-gold-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Quên MK
                  </button>
                </div>

                {/* Alert Message Box */}
                {authAlert && (
                  <div className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed animate-in zoom-in-95 ${
                    authAlert.type === 'success'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : authAlert.type === 'warning'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-red-500/20 border-red-500/50 text-red-300'
                  }`}>
                    {authAlert.msg}
                  </div>
                )}

                {/* TAB 1: LOGIN */}
                {authTab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Email đăng ký</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={e => setLoginEmail(e.target.value)}
                          placeholder="hung.canbo@riceos.vn"
                          className="w-full pl-9 pr-3 py-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Mật khẩu</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gold-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-4 h-4" /> Đăng Nhập Hệ Thống
                    </button>

                  </form>
                )}

                {/* TAB 2: REGISTER */}
                {authTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Họ và Tên *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          placeholder="Phạm Văn Mới"
                          className="w-full pl-9 pr-3 py-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          placeholder="canbo@gmail.com"
                          className="w-full p-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Số điện thoại *</label>
                        <input
                          type="text"
                          required
                          value={regPhone}
                          onChange={e => setRegPhone(e.target.value)}
                          placeholder="0905 xxx xxx"
                          className="w-full p-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Tạo mật khẩu *</label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-brand-600 hover:from-emerald-400 hover:to-brand-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" /> Đăng Ký Tài Khoản Mới
                    </button>
                    <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                      * Sau khi đăng ký thành công, thông báo sẽ gửi tới Admin để duyệt & cấp quyền kích hoạt.
                    </p>
                  </form>
                )}

                {/* TAB 3: FORGOT PASSWORD */}
                {authTab === 'forgot' && (
                  <form onSubmit={handleForgotSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Email đã đăng ký</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gold-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={e => setForgotEmail(e.target.value)}
                          placeholder="nhap_email@riceos.vn"
                          className="w-full pl-9 pr-3 py-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-4 h-4" /> Gửi Email Khôi Phục Mật Khẩu
                    </button>
                  </form>
                )}
              </>
            )}

          </div>

        </div>

      </div>

      {/* SECTION 2: METRICS DASHBOARD (PERSISTENT & ISOLATED FOR LOGGED IN MEMBER) */}
      <div className="space-y-6">

        {/* Dashboard Title & Scope */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-card p-4 rounded-2xl">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold-400" />
              Thống Kê Sản Lượng & Doanh Thu
            </h2>
            <p className="text-xs text-slate-300">
              {!isAdmin
                ? `Hiển thị số liệu thuộc quyền quản lý của cán bộ: ${currentUser?.full_name || 'Tài khoản cá nhân'}`
                : 'Hiển thị tổng hợp toàn bộ các phiên cân, cán bộ cân và xe nhận trên toàn hệ thống.'}
            </p>
          </div>

          <Link
            href="/weighing"
            className="px-4 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 font-extrabold text-xs shadow flex items-center gap-1.5"
          >
            <Scale className="w-4 h-4" /> + Tạo Phiên Cân Mới
          </Link>
        </div>

        {/* 8 SUMMARY METRICS WIDGETS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="glass-card p-4 rounded-2xl flex items-center justify-between border border-emerald-800/40">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Phiên Cân</span>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">{totalSessionsCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center justify-between border border-emerald-800/40">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Tổng Số Bao</span>
              <p className="text-xl sm:text-2xl font-black text-gold-300 mt-1">{totalBags.toLocaleString('vi-VN')} bao</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center justify-between border border-emerald-800/40">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Sản Lượng Tươi</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">{totalFreshWeight.toLocaleString('vi-VN')} kg</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Wheat className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center justify-between border border-emerald-800/40">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">Sản Lượng Khô</span>
              <p className="text-xl sm:text-2xl font-black text-blue-300 mt-1">{totalDryWeight.toLocaleString('vi-VN')} kg</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
