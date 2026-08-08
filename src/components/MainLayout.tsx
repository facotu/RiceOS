import React, { useState } from 'react';
import { UserProfile, AppNotification } from '../types';
import { Header } from './Header';
import { Sidebar, NavTabId } from './Sidebar';
import { Toolbar } from './Toolbar';
import '../styles/misa-theme.css';

interface MainLayoutProps {
  currentUser: UserProfile;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  children: (props: { activeTab: NavTabId; onTabChange: (tab: NavTabId) => void }) => React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentUser,
  notifications,
  onMarkNotificationRead,
  children
}) => {
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [activeBranch, setActiveBranch] = useState('Cầu Cân An Trạch (Hòa Tiến)');
  const [searchQuery, setSearchQuery] = useState('');

  const handleQuickAdd = () => {
    setActiveTab('weighing');
  };

  const handleExportZalo = () => {
    alert('📱 Đã mở tính năng kết xuất tin nhắn Zalo!');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleRefreshData = () => {
    alert('🔄 Đã nạp lại dữ liệu thu mua thời gian thực mới nhất!');
  };

  return (
    <div className="riceos-app">
      <Header
        currentUser={currentUser}
        activeBranch={activeBranch}
        onBranchChange={setActiveBranch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onMarkNotificationRead={onMarkNotificationRead}
      />

      <div className="misa-workspace">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onQuickAddWeighing={handleQuickAdd}
        />

        <main className="misa-content-view">
          <Toolbar
            activeTab={activeTab}
            onQuickAdd={handleQuickAdd}
            onExportZalo={handleExportZalo}
            onPrintReport={handlePrintReport}
            onRefreshData={handleRefreshData}
          />

          {children({ activeTab, onTabChange: setActiveTab })}
        </main>
      </div>
    </div>
  );
};
