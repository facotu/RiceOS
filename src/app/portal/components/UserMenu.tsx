import React, { useState } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import { PortalUser } from "../../../types/portal.ts";

interface UserMenuProps {
  user: PortalUser;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin: "Quản trị viên",
      weighing_officer: "Cán bộ cân lúa",
      warehouse_keeper: "Thủ kho sấy",
      accountant: "Kế toán trưởng",
      director: "Ban Giám đốc",
      viewer: "Người xem"
    };
    return roles[role] || "Cán bộ";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition focus:outline-none"
      >
        <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
          {user.full_name.charAt(0)}
        </div>
        <div className="text-left hidden md:block">
          <div className="text-sm font-bold text-gray-800 leading-tight">{user.full_name}</div>
          <div className="text-xs text-gray-400 font-semibold">{getRoleLabel(user.role)}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-premium py-1 z-20">
            <button
              onClick={() => { setIsOpen(false); alert("Xem hồ sơ"); }}
              className="w-full h-10 px-4 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Hồ sơ cá nhân</span>
            </button>
            <button
              onClick={() => { setIsOpen(false); onLogout(); }}
              className="w-full h-10 px-4 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-gray-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
