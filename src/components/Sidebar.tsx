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
  PanelLeftOpen 
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
        <button className="misa-btn-quick-add" onClick={onQuickAddWeighing} title="Thêm nhanh phiên cân lúa">
          <PlusCircle size={18} />
          {!collapsed && <span>+ Thêm phiên cân</span>}
        </button>

        {!collapsed && <div className="misa-sidebar-section">Hay Dùng</div>}
        <ul className="misa-nav-menu">
          <li
            className={`misa-nav-item ${activeTab === 'weighing' ? 'active' : ''}`}
            onClick={() => onTabChange('weighing')}
          >
            <Scale size={18} />
            {!collapsed && <span>Phiên Cân Mới</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'settlement' ? 'active' : ''}`}
            onClick={() => onTabChange('settlement')}
          >
            <Receipt size={18} />
            {!collapsed && <span>Quyết Toán Hộ Dân</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => onTabChange('vehicles')}
          >
            <Truck size={18} />
            {!collapsed && <span>Xe Nhận Lúa</span>}
          </li>
        </ul>

        {!collapsed && <div className="misa-sidebar-section">Phân Hệ Management</div>}
        <ul className="misa-nav-menu">
          <li
            className={`misa-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            <LayoutGrid size={18} />
            {!collapsed && <span>Tổng quan (Dashboard)</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'weighing' ? 'active' : ''}`}
            onClick={() => onTabChange('weighing')}
          >
            <Scale size={18} />
            {!collapsed && <span>Phiên Cân (Weighing)</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'settlement' ? 'active' : ''}`}
            onClick={() => onTabChange('settlement')}
          >
            <Receipt size={18} />
            {!collapsed && <span>Quyết Toán (Settlement)</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => onTabChange('vehicles')}
          >
            <Truck size={18} />
            {!collapsed && <span>Quản lý Xe (Logistics)</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => onTabChange('history')}
          >
            <History size={18} />
            {!collapsed && <span>Lịch sử Cân (History)</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => onTabChange('reports')}
          >
            <LineChart size={18} />
            {!collapsed && <span>Báo cáo (Analytics)</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'aicamera' ? 'active' : ''}`}
            onClick={() => onTabChange('aicamera')}
          >
            <Camera size={18} />
            {!collapsed && <span>AI Camera đếm bao</span>}
          </li>
          <li
            className={`misa-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => onTabChange('settings')}
          >
            <Sliders size={18} />
            {!collapsed && <span>Cài đặt Đơn giá & Bì</span>}
          </li>
        </ul>
      </div>

      <div className="misa-sidebar-footer">
        <button className="misa-btn-collapse" onClick={onToggleCollapse}>
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          {!collapsed && <span>Thu gọn Menu</span>}
        </button>
      </div>
    </aside>
  );
};
