'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wheat, Mail, CheckCircle2, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
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
          Khôi Phục Mật Khẩu
        </h2>
        <p className="mt-1 text-center text-sm text-slate-300">
          Nhập Email đã đăng ký tài khoản RiceOS để nhận liên kết đặt lại mật khẩu
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-emerald-950/60 backdrop-blur-xl py-8 px-6 shadow-2xl border border-emerald-800/50 rounded-2xl sm:px-10">

          {sent ? (
            <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-emerald-300">Đã Gửi Email Khôi Phục!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chúng tôi đã gửi một email chứa hướng dẫn tạo mật khẩu mới đến địa chỉ <strong className="text-gold-300">{email}</strong>.
                Vui lòng kiểm tra hộp thư (bao gồm cả thư rác / Spam).
              </p>
              <Link
                href="/login"
                className="inline-flex justify-center items-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-brand-dark bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" /> Quay Lại Đăng Nhập
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Địa chỉ Email đăng ký
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
                    className="block w-full pl-10 pr-3 py-2.5 bg-brand-dark/80 border border-emerald-800/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
              >
                {loading ? 'Đang gửi mail khôi phục...' : 'Gửi Email Khôi Phục'}
                <Send className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng Nhập
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
