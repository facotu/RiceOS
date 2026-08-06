import React from "react";
import { useAuthStore } from "../../../store/authStore.ts";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Lớp bảo vệ xác thực (AuthGuard) ngăn truy cập khi chưa đăng nhập
export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-premium border border-gray-100 max-w-sm">
          <h3 className="text-lg font-bold text-red-600">Yêu cầu đăng nhập</h3>
          <p className="text-xs text-gray-500 mt-2">Vui lòng đăng nhập hệ thống để tiếp tục thao tác.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
