import React from 'react';
import { UserProfile } from '../types';
import { Sparkles, Video, Bell, Settings, Building2, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  activeBranch: string;
  onBranchChange: (branch: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeBranch,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="misa-header">
      <div className="misa-header-left">
        <div className="misa-logo">
          <div className="misa-logo-icon">🌾</div>
          <span>RiceOS <span style={{ fontWeight: 400, fontSize: '13px', color: '#64748b' }}>| KẾ TOÁN & QUẢN LÝ CÂN</span></span>
        </div>

        <div className="misa-branch-picker" title="Đổi chi nhánh / cầu cân">
          <Building2 size={14} color="#0b6bbf" />
          <span>{activeBranch}</span>
          <ChevronDown size={10} />
        </div>
      </div>

      <div className="misa-header-center">
        <div className="misa-search-wrapper">
          <input
            type="text"
            className="misa-search-input"
            placeholder="Tìm kiếm thông minh chủ ruộng, giống lúa, xe nhận hoặc phiên cân..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="misa-ai-tag">
            <Sparkles size={10} style={{ display: 'inline', marginRight: 2 }} /> AI
          </span>
        </div>
      </div>

      <div className="misa-header-right">
        <button className="misa-icon-btn" title="Hướng dẫn sử dụng">
          <Video size={18} color="#10b981" />
          <span style={{ fontSize: '12px', marginLeft: 4, fontWeight: 600, color: '#10b981' }}>Hướng dẫn</span>
        </button>

        <button className="misa-icon-btn" title="Thông báo hệ thống">
          <Bell size={18} />
          <span className="misa-badge">15</span>
        </button>

        <button className="misa-icon-btn" title="Cài đặt">
          <Settings size={18} />
        </button>

        <div className="misa-user-profile">
          <div className="misa-avatar">
            {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.2 }}>{currentUser.full_name}</span>
            <span style={{ fontSize: '10px', color: '#64748b' }}>
              {currentUser.role === 'admin' ? 'Quản trị viên (Admin)' : currentUser.role === 'editor' ? 'Cán bộ cân' : 'Quyền Giám sát (View)'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
