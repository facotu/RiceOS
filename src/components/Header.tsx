import React, { useState } from 'react';
import { UserProfile, AppNotification } from '../types';
import { Sparkles, Video, Bell, Settings, Building2, ChevronDown, X } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  activeBranch: string;
  onBranchChange: (branch: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeBranch,
  searchQuery,
  onSearchChange,
  notifications,
  onMarkNotificationRead
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  return (
    <header className="misa-header">
      <div className="misa-header-left">
        <div className="misa-logo">
          <div className="misa-logo-icon">🌾</div>
          <span>RiceOS</span>
        </div>

        <div className="misa-branch-picker" title="Đổi chi nhánh / cầu cân">
          <Building2 size={13} color="#0b6bbf" />
          <span>{activeBranch}</span>
          <ChevronDown size={10} />
        </div>
      </div>

      <div className="misa-header-center">
        <div className="misa-search-wrapper">
          <input
            type="text"
            className="misa-search-input"
            placeholder="Tìm kiếm thông minh chủ ruộng, giống lúa, xe nhận..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="misa-ai-tag">
            <Sparkles size={10} style={{ display: 'inline', marginRight: 2 }} /> AI
          </span>
        </div>
      </div>

      <div className="misa-header-right">
        <button className="misa-icon-btn" title="Hướng dẫn sử dụng" onClick={() => alert('🎬 Đã mở Video Hướng dẫn sử dụng Quy trình Cân Lúa RiceOS!')}>
          <Video size={17} color="#10b981" />
        </button>

        {/* Notifications Dropdown Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            className="misa-icon-btn"
            title="Thông báo hệ thống"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={17} />
            {unreadCount > 0 && <span className="misa-badge">{unreadCount}</span>}
          </button>

          {/* Real-time Notification Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: -10,
              top: 36,
              width: 320,
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 12,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              zIndex: 200,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: 13,
                color: '#0e1e25'
              }}>
                <span>🔔 THÔNG BÁO TỨC THỜI ({unreadCount} MỚI)</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowNotifications(false)}>
                  <X size={14} />
                </button>
              </div>

              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {notifications && notifications.map(n => (
                  <div
                    key={n.id}
                    style={{
                      padding: 12,
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: n.read ? '#ffffff' : '#f0f9ff',
                      cursor: 'pointer'
                    }}
                    onClick={() => onMarkNotificationRead(n.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: n.read ? '#475569' : '#0b6bbf' }}>{n.title}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{n.timestamp}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.4 }}>{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="misa-user-profile">
          <div className="misa-avatar">
            {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600 }}>{currentUser.full_name}</span>
        </div>
      </div>
    </header>
  );
};
