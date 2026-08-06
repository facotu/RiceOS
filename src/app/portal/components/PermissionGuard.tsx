import React from "react";
import { PortalPermission } from "../../../types/portal.ts";
import { usePortal } from "../context/PortalContext.tsx";
import { ShieldAlert } from "lucide-react";

interface PermissionGuardProps {
  permission: PortalPermission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Lớp bảo vệ quyền hạn (PermissionGuard) ngăn truy cập khi không đủ quyền hạn nghiệp vụ
export default function PermissionGuard({ permission, children, fallback }: PermissionGuardProps) {
  const { hasPermission } = usePortal();

  if (!hasPermission(permission)) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto my-12 space-y-3">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-red-950">Quyền truy cập bị từ chối</h3>
        <p className="text-xs text-red-600 font-semibold leading-relaxed">
          Tài khoản của bạn không có mã quyền `{permission}`. Vui lòng liên hệ ban quản lý HTX Hòa Tiến 2 để phân quyền bổ sung.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
