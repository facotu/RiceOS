import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Header } from './Header';
import { Sidebar, NavTabId } from './Sidebar';
import { Toolbar } from './Toolbar';
import '../styles/misa-theme.css';

interface MainLayoutProps {
  currentUser: UserProfile;
  children: (props: { activeTab: NavTabId; onTabChange: (tab: NavTabId) => void }) => React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ currentUser, children }) => {
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
    <div class="riceos-app">
      <Header
        currentUser={currentUser}
        activeBranch={activeBranch}
        onBranchChange={setActiveBranch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div class="misa-workspace">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onQuickAddWeighing={handleQuickAdd}
        />

        <main class="misa-content-view">
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
