import React, { useState } from 'react';
import { UserProfile, WeighingSession, SystemSettings, AppNotification } from './types';
import { DEMO_USERS, DEFAULT_SETTINGS, INITIAL_NOTIFICATIONS } from './supabaseClient';
import { AuthView } from './components/AuthView';
import { MainLayout } from './components/MainLayout';
import { DashboardView } from './components/DashboardView';
import { WeighingView } from './components/WeighingView';
import { SettlementView } from './components/SettlementView';
import { VehicleView } from './components/VehicleView';
import { HistoryView } from './components/HistoryView';
import { ReportsView } from './components/ReportsView';
import { AICameraView } from './components/AICameraView';
import { SettingsView } from './components/SettingsView';
import { UserManagementView } from './components/UserManagementView';
import { FieldMapView } from './components/FieldMapView';

const INITIAL_SESSIONS: WeighingSession[] = [
  {
    id: 's-1',
    code: 'PC-2026-088',
    session_date: '2026-08-08T11:15:00Z',
    farmer_id: 'f-01',
    farmer_name: 'Nguyễn Văn Bình',
    farmer_phone: '0914.123.456',
    field_name: 'An Trạch 1',
    plot_no: 'Lô A2',
    officer_id: 'usr-admin-01',
    officer_name: 'Đoàn Thị Ngọc Phương',
    vehicle_id: 'v-01',
    vehicle_plate: '43C-123.45',
    variety_code: 'HT1',
    variety_name: 'Giống lúa HT1',
    rows: [],
    total_bags: 140,
    total_fresh_kg: 7000,
    tare_formula: 'percent',
    tare_value: 5.0,
    total_tare_kg: 350,
    total_dry_kg: 6650,
    price_per_kg: 8000,
    total_amount: 53200000,
    advance_payment: 20000000,
    remaining_payment: 33200000,
    status: 'completed'
  },
  {
    id: 's-2',
    code: 'PC-2026-087',
    session_date: '2026-08-08T10:40:00Z',
    farmer_id: 'f-02',
    farmer_name: 'Trần Văn Cường',
    farmer_phone: '0988.765.432',
    field_name: 'Hòa Tiến',
    plot_no: 'Lô B',
    officer_id: 'usr-admin-01',
    officer_name: 'Đoàn Thị Ngọc Phương',
    vehicle_id: 'v-02',
    vehicle_plate: '92H-987.65',
    variety_code: 'J02',
    variety_name: 'Giống lúa J02',
    rows: [],
    total_bags: 210,
    total_fresh_kg: 10500,
    tare_formula: 'percent',
    tare_value: 5.0,
    total_tare_kg: 525,
    total_dry_kg: 9975,
    price_per_kg: 8500,
    total_amount: 84787500,
    advance_payment: 0,
    remaining_payment: 84787500,
    status: 'completed'
  },
  {
    id: 's-3',
    code: 'PC-2026-086',
    session_date: '2026-08-08T09:50:00Z',
    farmer_id: 'f-03',
    farmer_name: 'Lê Thị Mai',
    farmer_phone: '0905.888.999',
    field_name: 'Đa Phước 3',
    plot_no: 'Lô C',
    officer_id: 'usr-editor-01',
    officer_name: 'Trần Văn Nam',
    vehicle_id: 'v-01',
    vehicle_plate: '43C-123.45',
    variety_code: 'HG12',
    variety_name: 'Giống lúa HG12',
    rows: [],
    total_bags: 180,
    total_fresh_kg: 9000,
    tare_formula: 'percent',
    tare_value: 5.0,
    total_tare_kg: 450,
    total_dry_kg: 8550,
    price_per_kg: 7500,
    total_amount: 64125000,
    advance_payment: 0,
    remaining_payment: 64125000,
    status: 'completed'
  }
];

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS[0]);
  const [sessions, setSessions] = useState<WeighingSession[]>(INITIAL_SESSIONS);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const handleSaveSession = (newSession: WeighingSession) => {
    setSessions([newSession, ...sessions]);

    // Push new real-time notification
    const newNotif: AppNotification = {
      id: 'n-' + Date.now(),
      title: 'Phiên cân mới ghi nhập',
      message: `Cán bộ ${newSession.officer_name} vừa tạo phiên cân ${newSession.code} cho chủ hộ ${newSession.farmer_name} (${newSession.total_bags} bao - ${newSession.total_fresh_kg.toLocaleString()}kg).`,
      timestamp: 'Vừa xong',
      read: false,
      type: 'weighing'
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!currentUser) {
    return <AuthView onLoginSuccess={setCurrentUser} />;
  }

  return (
    <MainLayout
      currentUser={currentUser}
      notifications={notifications}
      onMarkNotificationRead={handleMarkNotificationRead}
    >
      {({ activeTab, onTabChange }) => {
        const visibleSessions = currentUser.role === 'admin'
          ? sessions
          : sessions.filter(s => s.officer_id === currentUser.id || s.officer_name === currentUser.full_name);

        switch (activeTab) {
          case 'dashboard':
            return (
              <DashboardView
                currentUser={currentUser}
                sessions={visibleSessions}
                onNavigateTab={onTabChange}
              />
            );

          case 'fieldmap':
            return (
              <FieldMapView
                currentUser={currentUser}
                plots={settings.fields_plots}
                onNavigateWeighing={() => onTabChange('weighing')}
              />
            );

          case 'weighing':
            return (
              <WeighingView
                currentUser={currentUser}
                settings={settings}
                onSaveSession={(session) => {
                  handleSaveSession(session);
                  onTabChange('dashboard');
                }}
              />
            );

          case 'settlement':
            return <SettlementView sessions={visibleSessions} />;

          case 'vehicles':
            return <VehicleView currentUser={currentUser} />;

          case 'history':
            return <HistoryView sessions={visibleSessions} />;

          case 'reports':
            return <ReportsView sessions={visibleSessions} />;

          case 'aicamera':
            return <AICameraView />;

          case 'settings':
            return (
              <div>
                <SettingsView
                  settings={settings}
                  onSaveSettings={setSettings}
                />
                <div style={{ marginTop: 16 }}>
                  <UserManagementView currentUser={currentUser} />
                </div>
              </div>
            );

          default:
            return <div>Chưa tìm thấy phân hệ này.</div>;
        }
      }}
    </MainLayout>
  );
};
