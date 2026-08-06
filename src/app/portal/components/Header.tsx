import React from "react";
import { PortalUser } from "../../../types/portal.ts";
import Breadcrumb from "./Breadcrumb.tsx";
import UserMenu from "./UserMenu.tsx";
import { Bell } from "lucide-react";

interface HeaderProps {
  user: PortalUser;
  currentPath: string;
  onLogout: () => void;
}

export default function Header({ user, currentPath, onLogout }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shadow-sm z-10">
      {/* TRÁI: BREADCRUMBS */}
      <Breadcrumb currentPath={currentPath} />

      {/* PHẢI: BÁO CÁO & USER PROFILES */}
      <div className="flex items-center space-x-4">
        {/* NÚT THÔNG BÁO */}
        <button className="h-10 w-10 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl flex items-center justify-center relative transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* PROFILE DROP DOWN */}
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}
