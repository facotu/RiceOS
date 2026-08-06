import React from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  currentPath: string;
}

export default function Breadcrumb({ currentPath }: BreadcrumbProps) {
  const getBreadcrumbLabel = (path: string) => {
    const paths: Record<string, string> = {
      dashboard: "Bảng điều khiển",
      weighing: "Quản lý Phiếu cân lúa",
      accounting: "Thanh quyết toán tài chính",
      warehouse: "Kiểm kho & Silo sấy",
      reports: "Báo cáo vụ mùa thu mua",
      "master-data": "Danh mục hệ thống"
    };
    const key = path.split("/").pop() || "";
    return paths[key] || "Trang chủ";
  };

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-gray-500 font-semibold">
      <Home className="w-4 h-4 text-gray-400" />
      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
      <span className="text-gray-400">Portal</span>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
      <span className="text-primary font-bold">{getBreadcrumbLabel(currentPath)}</span>
    </nav>
  );
}
