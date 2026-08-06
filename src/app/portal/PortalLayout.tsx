import React, { useState } from "react";
import { PortalUser } from "../../types/portal.ts";
import Sidebar from "./components/Sidebar.tsx";
import Header from "./components/Header.tsx";
import DashboardPage from "./pages/Dashboard.tsx";
import WeighingPage from "./pages/Weighing.tsx";
import AccountingPage from "./pages/Accounting.tsx";
import WarehousePage from "./pages/Warehouse.tsx";
import ReportsPage from "./pages/Reports.tsx";
import MasterDataPage from "./pages/MasterData.tsx";
import LogisticsPage from "./pages/Logistics.tsx";

// Tích hợp hệ thống phân quyền mới
import { PortalProvider } from "./context/PortalContext.tsx";
import AuthGuard from "./components/AuthGuard.tsx";
import PermissionGuard from "./components/PermissionGuard.tsx";

interface PortalLayoutProps {
  user: PortalUser;
  onLogout: () => void;
}

export default function PortalLayout({ user, onLogout }: PortalLayoutProps) {
  const [currentPath, setCurrentPath] = useState("/portal/dashboard");

  // Hàm render nội dung trang có bọc các chốt bảo vệ phân quyền (PermissionGuard)
  const renderContent = () => {
    switch (currentPath) {
      case "/portal/dashboard":
        return (
          <PermissionGuard permission="weighing:read">
            <DashboardPage />
          </PermissionGuard>
        );
      case "/portal/weighing":
        return (
          <PermissionGuard permission="weighing:read">
            <WeighingPage />
          </PermissionGuard>
        );
      case "/portal/accounting":
        return (
          <PermissionGuard permission="settlement:read">
            <AccountingPage />
          </PermissionGuard>
        );
      case "/portal/warehouse":
        return (
          <PermissionGuard permission="warehouse:read">
            <WarehousePage />
          </PermissionGuard>
        );
      case "/portal/logistics":
        return (
          <PermissionGuard permission="weighing:read">
            <LogisticsPage />
          </PermissionGuard>
        );
      case "/portal/reports":
        return (
          <PermissionGuard permission="reports:read">
            <ReportsPage />
          </PermissionGuard>
        );
      case "/portal/master-data":
        return (
          <PermissionGuard permission="admin:settings">
            <MasterDataPage />
          </PermissionGuard>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <PortalProvider user={user}>
      <AuthGuard>
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
          {/* SIDEBAR BÊN TRÁI */}
          <Sidebar 
            userRole={user.role} 
            currentPath={currentPath} 
            onNavigate={setCurrentPath} 
          />

          {/* KHU VỰC NỘI DUNG CHÍNH BÊN PHẢI */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* HEADER */}
            <Header 
              user={user} 
              currentPath={currentPath} 
              onLogout={onLogout} 
            />

            {/* NỘI DUNG TRANG CHỦ YÊU CẦU */}
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </AuthGuard>
    </PortalProvider>
  );
}
