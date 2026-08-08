import React from 'react';
import { 
  LayoutGrid, 
  Scale, 
  Receipt, 
  Truck, 
  History, 
  LineChart, 
  Camera, 
  Sliders, 
  PlusCircle, 
  PanelLeftClose, 
  PanelLeftOpen,
  Sparkles,
  Zap
} from 'lucide-react';

export type NavTabId = 'dashboard' | 'weighing' | 'settlement' | 'vehicles' | 'history' | 'reports' | 'aicamera' | 'settings';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onQuickAddWeighing: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  onQuickAddWeighing
}) => {
  return (
    <aside className={`misa-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="misa-sidebar-inner">
        {/* Radiant Quick Add Button */}
        <button 
          className="misa-btn-quick-add" 
          onClick={onQuickAddWeighing} 
          title="Tạo nhanh phiên cân lúa tươi mới"
        >
          <PlusCircle size={18} className="spin-icon-on-hover" />
          {!collapsed && <span>+ Thêm Phiên Cân</span>}
        </button>

        {/* Section 1: Favorite Quick Access */}
        {!collapsed && <div className="misa-sidebar-section">⭐ HAY DÙNG NHẤT</div>}
        <ul className="misa-nav-menu">
          <li
            className={`misa-nav-item ${activeTab === 'weighing' ? 'active' : ''}`}
            onClick={() => onTabChange('weighing')}
            title="Phiên Cân Mới"
          >
            <Scale size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Phiên Cân Mới</span>}
            {!collapsed && <span className="nav-badge emerald">LIVE</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'settlement' ? 'active' : ''}`}
            onClick={() => onTabChange('settlement')}
            title="Quyết Toán Hộ Dân"
          >
            <Receipt size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Quyết Toán Hộ Dân</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => onTabChange('vehicles')}
            title="Xe Nhận Lúa"
          >
            <Truck size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Xe Nhận & Tải Trọng</span>}
            {!collapsed && <span className="nav-badge blue">2 xe</span>}
          </li>
        </ul>

        {/* Section 2: All Business Modules */}
        {!collapsed && <div className="misa-sidebar-section">📂 PHÂN HỆ MANAGEMENT</div>}
        <ul className="misa-nav-menu">
          <li
            className={`misa-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
            title="Tổng quan (Dashboard)"
          >
            <LayoutGrid size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Tổng quan (Dashboard)</span>}
          </li>

          <li
            className={`misa-nav-item ${activeTab === 'weighing' ? 'active' : ''}`}
            onClick={() => onTabChange('weighing')}
            title="Phiên Cân (Weighing)"
          >
            <Scale size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Phiên Cân Lúa Tươi</span>}
          </li>

          <li
            className={`misa-nav-item ${activeTab === 'settlement' ? 'active' : ''}`}
            onClick={() => onTabChange('settlement')}
            title="Quyết Toán (Settlement)"
          >
            <Receipt size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Tài chính & Quyết toán</span>}
          </li>

          <li
            className={`misa-nav-item ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => onTabChange('vehicles')}
            title="Quản lý Xe (Logistics)"
          >
            <Truck size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Quản lý Xe & Vận tải</span>}
          </li>

          <li
            className={`misa-nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => onTabChange('history')}
            title="Lịch sử Cân (History)"
          >
            <History size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Lịch sử Cân Lúa</span>}
          </li>

          <li
            className={`misa-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => onTabChange('reports')}
            title="Báo cáo (Analytics)"
          >
            <LineChart size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Báo cáo & Phân tích</span>}
          </li>

          <li
            className={`misa-nav-item ${activeTab === 'aicamera' ? 'active' : ''}`}
            onClick={() => onTabChange('aicamera')}
            title="AI Camera đếm bao"
          >
            <Camera size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">AI Camera Đếm Bao</span>}
            {!collapsed && <span className="nav-badge purple"><Sparkles size={10} style={{ display: 'inline' }} /> AI</span>}
          </li>

          <li
            className={`misa-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => onTabChange('settings')}
            title="Cài đặt Đơn giá & Bì"
          >
            <Sliders size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Cài đặt Đơn giá & Bì</span>}
          </li>
        </ul>
      </div>

      {/* Footer Area with Station Status & Collapse Toggle */}
      <div className="misa-sidebar-footer">
        {!collapsed && (
          <div className="station-status-box">
            <Zap size={14} color="#10b981" />
            <span>Cầu Cân An Trạch: <strong>ONLINE</strong></span>
          </div>
        )}

        <button className="misa-btn-collapse" onClick={onToggleCollapse} title={collapsed ? 'Mở rộng Menu' : 'Thu gọn Menu'}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Thu gọn Menu</span>}
        </button>
      </div>
    </aside>
  );
};
