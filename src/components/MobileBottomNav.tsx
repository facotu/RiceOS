import React from 'react';
import { NavTabId } from './Sidebar';
import { LayoutGrid, MapPin, Scale, Truck, Sliders } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => onTabChange('dashboard')}
      >
        <LayoutGrid size={20} />
        <span>Tổng quan</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'fieldmap' ? 'active' : ''}`}
        onClick={() => onTabChange('fieldmap')}
      >
        <MapPin size={20} />
        <span>Vùng trồng</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'weighing' ? 'active' : ''}`}
        onClick={() => onTabChange('weighing')}
        style={{ color: activeTab === 'weighing' ? '#10b981' : '#10b981' }}
      >
        <div style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          backgroundColor: '#10b981',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)',
          marginTop: -16
        }}>
          <Scale size={22} />
        </div>
        <span style={{ fontWeight: 800, color: '#10b981', marginTop: 2 }}>CÂN LÚA</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
        onClick={() => onTabChange('vehicles')}
      >
        <Truck size={20} />
        <span>Xe nhận</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onTabChange('settings')}
      >
        <Sliders size={20} />
        <span>Cài đặt</span>
      </button>
    </nav>
  );
};
