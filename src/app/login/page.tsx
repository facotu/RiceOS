'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Wheat, Mail, Lock, LogIn, Chrome, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types/database.types';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 800);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      switchRole('admin');
      setGoogleLoading(false);
      setSuccessMsg('Đăng nhập thành công qua Google OAuth (Tài khoản Admin)!');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 1200);
  };

  const quickDemoLogin = (role: UserRole) => {
    switchRole(role);
    setSuccessMsg(`Đã đăng nhập thành công với vai trò ${role.toUpperCase()}`);
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark via-emerald-950 to-brand-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-gold-400 p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-brand-dark rounded-[14px] flex items-center justify-center">
              <Wheat className="w-10 h-10 text-gold-400" />
            </div>
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-gold-400 to-emerald-100">
          Đăng Nhập RiceOS
        </h2>
        <p className="mt-1 text-center text-sm text-slate-300">
          Hệ Thống Quản Lý Cân Lúa Thông Minh Tại Ruộng
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-emerald-950/60 backdrop-blur-xl py-8 px-6 shadow-2xl border border-emerald-800/50 rounded-2xl sm:px-10">
          
          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {successMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Địa chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-emerald-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="canbo.canlua@riceos.vn"
                  className="block w-full pl-10 pr-3 py-2.5 bg-brand-dark/80 border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-emerald-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-brand-dark/80 border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-400">
                <input type="checkbox" className="rounded border-emerald-800 bg-brand-dark text-emerald-500 focus:ring-emerald-500 mr-2" defaultChecked />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-gold-400 hover:underline">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-800/60" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-emerald-950 text-slate-400 font-medium">Hoặc đăng nhập nhanh</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-700/60 bg-emerald-900/30 hover:bg-emerald-900/60 text-white font-medium text-xs transition-colors"
              >
                <Chrome className="w-4 h-4 text-red-400" />
                {googleLoading ? 'Đang kết nối Google...' : 'Đăng nhập bằng tài khoản Google'}
              </button>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-4 border-t border-emerald-800/50">
            <p className="text-[11px] font-semibold text-emerald-300 mb-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> Đăng nhập nhanh kiểm thử (Demo Mode):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickDemoLogin('admin')}
                className="py-2 px-2 rounded-lg bg-red-950/60 border border-red-800/50 hover:bg-red-900/60 text-red-300 text-xs font-semibold text-left flex items-center justify-between"
              >
                <span>Quyền Admin</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => quickDemoLogin('staff')}
                className="py-2 px-2 rounded-lg bg-emerald-950/60 border border-emerald-800/50 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold text-left flex items-center justify-between"
              >
                <span>Cán Bộ Cân</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => quickDemoLogin('editor')}
                className="py-2 px-2 rounded-lg bg-blue-950/60 border border-blue-800/50 hover:bg-blue-900/60 text-blue-300 text-xs font-semibold text-left flex items-center justify-between"
              >
                <span>Biên Tập Viên</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => quickDemoLogin('viewer')}
                className="py-2 px-2 rounded-lg bg-slate-900/60 border border-slate-700/50 hover:bg-slate-800/60 text-slate-300 text-xs font-semibold text-left flex items-center justify-between"
              >
                <span>Xem Báo Cáo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-bold underline">
                Đăng ký tài khoản mới
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
