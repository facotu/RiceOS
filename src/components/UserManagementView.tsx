import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../supabaseClient';
import { Users, UserCheck, Shield, Mail, CheckCircle, XCircle } from 'lucide-react';

interface UserManagementViewProps {
  currentUser: UserProfile;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('editor');

  const handleRoleChange = (userId: string, targetRole: UserRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: targetRole } : u));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'disabled' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      email: newEmail,
      full_name: newName,
      role: newRole,
      status: 'active',
      created_at: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    setNewEmail('');
    setNewName('');
    setShowAddModal(false);
    alert('✅ Đã thêm mới và kích hoạt thành viên thành công!');
  };

  return (
    <div class="panel-grid-container">
      <div class="panel-header">
        <div class="panel-title">
          <Users size={18} color="#0b6bbf" />
          <span>QUẢN LÝ THÀNH VIÊN & CẤP QUYỀN TRUY CẬP (RBAC MANAGEMENT)</span>
        </div>
        {currentUser.role === 'admin' && (
          <button class="misa-btn-cmd primary" onClick={() => setShowAddModal(true)}>
            + Thêm thành viên mới
          </button>
        )}
      </div>

      <div style={{ padding: 16 }}>
        <table class="datagrid">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Vai trò (Role)</th>
              <th>Trạng thái tài khoản</th>
              <th>Ngày tham gia</th>
              <th style={{ textAlign: 'center' }}>Tác vụ quản trị Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>{u.full_name}</strong></td>
                <td>{u.email}</td>
                <td>
                  {currentUser.role === 'admin' ? (
                    <select
                      class="form-control"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      style={{ fontSize: 11, height: 26, padding: '2px 6px' }}
                    >
                      <option value="admin">Admin - Quản trị viên</option>
                      <option value="editor">Editor - Cán bộ cân</option>
                      <option value="view">View - Quyền Giám sát</option>
                    </select>
                  ) : (
                    <span style={{ fontWeight: 700, color: u.role === 'admin' ? '#ef4444' : u.role === 'editor' ? '#0b6bbf' : '#64748b' }}>
                      {u.role.toUpperCase()}
                    </span>
                  )}
                </td>
                <td>
                  {u.status === 'active' ? (
                    <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>
                      <UserCheck size={12} style={{ display: 'inline', marginRight: 4 }} /> Đã kích hoạt
                    </span>
                  ) : (
                    <span style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>
                      Tạm khóa
                    </span>
                  )}
                </td>
                <td>{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                <td style={{ textAlign: 'center' }}>
                  {currentUser.role === 'admin' ? (
                    <button
                      class={`misa-btn-cmd ${u.status === 'active' ? '' : 'success'}`}
                      style={{ fontSize: 11, padding: '2px 8px' }}
                      onClick={() => handleToggleStatus(u.id)}
                    >
                      {u.status === 'active' ? <><XCircle size={12} /> Khóa tài khoản</> : <><CheckCircle size={12} /> Kích hoạt lại</>}
                    </button>
                  ) : (
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>Chỉ Admin được thao tác</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div class="modal-overlay active">
          <div class="modal-box" style={{ maxWidth: 440 }}>
            <div class="modal-header">
              <span class="modal-title">THÊM THÀNH VIÊN MỚI VÀO DỰ ÁN</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddMember}>
              <div class="modal-body">
                <div class="form-group" style={{ marginBottom: 12 }}>
                  <label class="form-label">Họ và tên thành viên *</label>
                  <input type="text" class="form-control" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                <div class="form-group" style={{ marginBottom: 12 }}>
                  <label class="form-label">Địa chỉ Email *</label>
                  <input type="email" class="form-control" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                </div>
                <div class="form-group">
                  <label class="form-label">Cấp quyền truy cập *</label>
                  <select class="form-control" value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)}>
                    <option value="editor">Editor - Cán bộ cân lúa thực địa</option>
                    <option value="admin">Admin - Quản trị viên hệ thống</option>
                    <option value="view">View - Quyền giám sát báo cáo</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="misa-btn-cmd" onClick={() => setShowAddModal(false)}>Hủy bỏ</button>
                <button type="submit" class="misa-btn-cmd primary">Thêm & Gửi Email kích hoạt</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
