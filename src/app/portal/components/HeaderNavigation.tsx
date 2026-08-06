// Top Horizontal Navigation Header
// File: src/app/portal/components/HeaderNavigation.tsx

import React from "react";
import { 
  LayoutDashboard, 
  Scale, 
  Receipt, 
  Truck, 
  History, 
  BarChart3, 
  Users, 
  Camera, 
  Settings, 
  LogOut, 
  UserCheck, 
  Bell 
} from "lucide-react";

interface HeaderNavigationProps {
  user: {
    id: string;
    full_name: string;
    role: string;
    phone_number?: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  unreadCount?: number;
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  unreadCount = 0
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "weighing", label: "Phiên Cân", icon: Scale },
    { id: "settlement", label: "Quyết Toán", icon: Receipt },
    { id: "trucks", label: "Xe Nhận", icon: Truck },
    { id: "history", label: "Lịch Sử Cân", icon: History },
    { id: "reports", label: "Báo Cáo", icon: BarChart3 },
    ...(user.role === "admin" ? [{ id: "master", label: "Quản Lý (Admin)", icon: Users }] : []),
    { id: "aicamera", label: "AI Camera", icon: Camera },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      {/* 1. TOP BAR: THÔNG TIN ĐĂNG NHẬP & TÊN HỆ THỐNG */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-xl shadow-emerald-500/20 shadow-lg">
            🌾
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              RiceOS <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">Hòa Tiến 2</span>
            </h1>
            <p className="text-xs text-slate-400">Hệ thống Quản lý Thu mua & Phiên cân Lúa gạo</p>
          </div>
        </div>

        {/* THÔNG TIN NGƯỜI DÙNG VÀ NÚT ĐĂNG XUẤT */}
        <div className="flex items-center space-x-4">
          <div className="bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left text-xs">
              <p className="font-bold text-white leading-tight">{user.full_name}</p>
              <p className="text-[10px] text-slate-400 capitalize">
                {user.role === "admin" ? "👑 Quản trị viên (Admin)" : user.role === "editor" ? "✍️ Cán bộ cân" : "👁️ Quyền xem"}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="h-9 px-3 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* 2. BOTTOM MENU NGANG HÀNG TRUY CẬP */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <nav className="flex space-x-1 py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
export default HeaderNavigation;
