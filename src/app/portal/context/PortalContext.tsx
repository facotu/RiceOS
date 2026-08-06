import React, { createContext, useContext, ReactNode } from "react";
import { PortalUser, PortalPermission } from "../../../types/portal.ts";
import { featureFlags } from "../services/featureFlagService.ts";
import { auditLogger } from "../services/auditLogger.ts";

interface PortalContextType {
  user: PortalUser | null;
  hasPermission: (permission: PortalPermission) => boolean;
  isFeatureEnabled: (flag: string) => boolean;
  logAction: (action: string, module: any, details: any) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

interface PortalProviderProps {
  user: PortalUser | null;
  children: ReactNode;
}

export function PortalProvider({ user, children }: PortalProviderProps) {
  // Kiểm tra phân quyền thực tế của cán bộ
  const hasPermission = (permission: PortalPermission): boolean => {
    if (!user) return false;
    
    // Quản trị viên (admin) hoặc Giám đốc (director) mặc định có toàn bộ quyền
    if (user.role === "admin" || user.role === "director") return true;

    return user.permissions.includes(permission);
  };

  // Kiểm tra cờ tính năng
  const isFeatureEnabled = (flag: string): boolean => {
    return featureFlags.isEnabled(flag);
  };

  // Ghi nhật ký hành động nghiệp vụ
  const logAction = (action: string, module: any, details: any) => {
    auditLogger.log({
      action,
      module,
      details,
      userId: user?.id,
      organizationId: user?.organization_id
    });
  };

  return (
    <PortalContext.Provider value={{ user, hasPermission, isFeatureEnabled, logAction }}>
      {children}
    </PortalContext.Provider>
  );
}

// Hook sử dụng Portal Context an toàn
export function usePortal() {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error("usePortal phải được đặt bên trong PortalProvider");
  }
  return context;
}
