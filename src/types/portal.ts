// Extended Portal Types for RiceOS
// File: src/types/portal.ts

export const USER_ROLES = {
  ADMIN: 'admin',
  WEIGHING_OFFICER: 'weighing_officer',
  WAREHOUSE_KEEPER: 'warehouse_keeper',
  ACCOUNTANT: 'accountant',
  DIRECTOR: 'director',
  VIEWER: 'viewer'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Định nghĩa mã quyền chi tiết phục vụ PermissionGuard
export type PortalPermission = 
  | 'weighing:create'
  | 'weighing:read'
  | 'settlement:create'
  | 'settlement:read'
  | 'warehouse:read'
  | 'warehouse:write'
  | 'reports:read'
  | 'admin:settings';

export interface PortalUser {
  id: string;
  organization_id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  role: UserRole;
  permissions: PortalPermission[];
  is_active: boolean;
}

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  roles: UserRole[];
  permissions?: PortalPermission[];
  featureFlag?: string;
  children?: NavigationItem[];
}
