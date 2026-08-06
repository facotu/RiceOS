import React from "react";
import { UserRole } from "../../../types/portal.ts";
import { navigationConfig } from "../navConfig.ts";
import * as Icons from "lucide-react";

interface SidebarProps {
  userRole: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Sidebar({ userRole, currentPath, onNavigate }: SidebarProps) {
  // Lọc menu hiển thị dựa trên vai trò
  const filteredNav = navigationConfig.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-full border-r border-primary-dark">
      {/* LOGO & BRAND */}
      <div className="h-16 flex items-center px-6 border-b border-primary-dark/50">
        <Icons.Sprout className="w-6 h-6 text-accent mr-2" />
        <span className="text-xl font-bold tracking-wider font-sans">RiceOS Portal</span>
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {filteredNav.map((item) => {
          // Lấy Icon tương ứng từ Lucide React
          const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full h-11 px-4 rounded-xl flex items-center space-x-3 text-sm font-semibold transition-all ${
                isActive 
                  ? "bg-accent text-primary-dark shadow-premium" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-primary-dark/50 text-center text-[10px] text-white/50">
        <p>HTX Nông nghiệp Hòa Tiến 2</p>
        <p className="mt-0.5">Copyright © 2026 Phạm Tuân</p>
      </div>
    </aside>
  );
}
