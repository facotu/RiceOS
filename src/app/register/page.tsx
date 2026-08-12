'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wheat, Mail, Lock, User, Phone, CheckCircle, MailCheck, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu nhập lại không khớp!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
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
          Đăng Ký Tài Khoản RiceOS
        </h2>
        <p className="mt-1 text-center text-sm text-slate-300">
          Dành Cho Cán Bộ Cân, Chủ Ruộng & Ban Quản Lý
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-emerald-950/60 backdrop-blur-xl py-8 px-6 shadow-2xl border border-emerald-800/50 rounded-2xl sm:px-10">

          {submitted ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <MailCheck className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-emerald-300">Đăng Ký Thành Công!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chúng tôi đã gửi một email xác thực đến địa chỉ <strong className="text-gold-300">{email}</strong>.
                Vui lòng mở hộp thư và nhấn vào liên kết xác nhận.
              </p>
              <div className="p-3 bg-gold-500/10 border border-gold-500/30 rounded-xl text-left text-xs text-gold-300">
                <p className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-gold-400" /> Thông báo kích hoạt:
                </p>
                <p className="text-[11px] mt-1 text-slate-300">
                  Tài khoản của bạn sau khi xác nhận email sẽ tự động gửi thông báo đến Admin để được duyệt quyền Cán Bộ Cân hoặc Editor.
                </p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-brand-dark bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg"
              >
                Quay lại Đăng Nhập
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Họ và tên cán bộ / thành viên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Phạm Văn Hùng"
                    className="block w-full pl-10 pr-3 py-2 bg-brand-dark/80 border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-emerald-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0905123456"
                    className="block w-full pl-10 pr-3 py-2 bg-brand-dark/80 border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Địa chỉ Email nhận xác nhận
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
                    placeholder="hung.canbo@riceos.vn"
                    className="block w-full pl-10 pr-3 py-2 bg-brand-dark/80 border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
                    className="block w-full pl-10 pr-3 py-2 bg-brand-dark/80 border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-emerald-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2 bg-brand-dark/80 border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-brand-dark bg-gradient-to-r from-emerald-400 via-emerald-300 to-gold-400 hover:brightness-110 shadow-lg transition-all cursor-pointer"
              >
                {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản'}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Đã có tài khoản?{' '}
                  <Link href="/login" className="text-gold-400 hover:text-gold-300 font-bold underline">
                    Đăng nhập tại đây
                  </Link>
                </p>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
