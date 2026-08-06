import { NavigationItem } from "../../types/portal.ts";

// Cấu hình danh mục menu mở rộng của Desktop Portal với ID, Permissions và FeatureFlag
export const navigationConfig: NavigationItem[] = [
  {
    id: "nav-dashboard",
    title: "Bảng điều khiển",
    path: "/portal/dashboard",
    icon: "LayoutDashboard",
    roles: ["admin", "accountant", "director", "viewer"],
    permissions: ["weighing:read"]
  },
  {
    id: "nav-weighing",
    title: "Phiếu cân lúa",
    path: "/portal/weighing",
    icon: "Scale",
    roles: ["admin", "weighing_officer", "director", "viewer"],
    permissions: ["weighing:read"],
    children: [
      {
        id: "nav-weighing-list",
        title: "Tất cả phiếu cân",
        path: "/portal/weighing",
        icon: "FileText",
        roles: ["admin", "weighing_officer", "director", "viewer"]
      }
    ]
  },
  {
    id: "nav-accounting",
    title: "Quyết toán tài chính",
    path: "/portal/accounting",
    icon: "BadgeDollarSign",
    roles: ["admin", "accountant", "director"],
    permissions: ["settlement:read"],
    featureFlag: "feature:bulk-sync" // Chỉ hiển thị khi cờ bulk sync bật
  },
  {
    id: "nav-warehouse",
    title: "Quản lý kho sấy",
    path: "/portal/warehouse",
    icon: "Warehouse",
    roles: ["admin", "warehouse_keeper", "director"],
    permissions: ["warehouse:read"]
  },
  {
    id: "nav-logistics",
    title: "Quản lý Logistics",
    path: "/portal/logistics",
    icon: "Truck",
    roles: ["admin", "director", "accountant", "warehouse_keeper"],
    permissions: ["weighing:read"]
  },
  {
    id: "nav-reports",
    title: "Báo cáo vụ mùa",
    path: "/portal/reports",
    icon: "FileBarChart",
    roles: ["admin", "accountant", "director", "viewer"],
    permissions: ["reports:read"]
  },
  {
    id: "nav-master-data",
    title: "Danh mục hệ thống",
    path: "/portal/master-data",
    icon: "Settings",
    roles: ["admin", "accountant", "director"],
    permissions: ["admin:settings"]
  }
];
