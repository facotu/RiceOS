import React, { useState } from 'react';
import { WeighingSession } from '../types';
import { History } from 'lucide-react';

interface HistoryViewProps {
  sessions: WeighingSession[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ sessions }) => {
  const [farmerFilter, setFarmerFilter] = useState('');
  const [varietyFilter, setVarietyFilter] = useState('ALL');

  const filteredSessions = sessions.filter(s => {
    const matchFarmer = !farmerFilter || s.farmer_name.toLowerCase().includes(farmerFilter.toLowerCase());
    const matchVariety = varietyFilter === 'ALL' || s.variety_code === varietyFilter;
    return matchFarmer && matchVariety;
  });

  const totalFresh = filteredSessions.reduce((sum, s) => sum + s.total_fresh_kg, 0);
  const totalAmount = filteredSessions.reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <div className="panel-grid-container">
      <div className="panel-header">
        <div className="panel-title">
          <History size={20} color="#0b6bbf" />
          <span>LỊCH SỬ CÂN LÚA & TRA CỨU ĐA TIÊU CHÍ</span>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Tìm tên Chủ Lúa / Hộ dân</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên chủ lúa..."
            value={farmerFilter}
            onChange={(e) => setFarmerFilter(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Lọc theo Giống Lúa</label>
          <select
            className="form-control"
            value={varietyFilter}
            onChange={(e) => setVarietyFilter(e.target.value)}
          >
            <option value="ALL">Tất cả giống lúa</option>
            <option value="HT1">Giống HT1</option>
            <option value="HG12">Giống HG12</option>
            <option value="HG244">Giống HG244</option>
            <option value="ĐT100">Giống ĐT100</option>
            <option value="J02">Giống J02</option>
          </select>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <table className="datagrid">
          <thead>
            <tr>
              <th>Mã phiên</th>
              <th>Thời gian</th>
              <th>Chủ lúa</th>
              <th>Xứ đồng</th>
              <th>Giống lúa</th>
              <th>Số bao</th>
              <th>Kg Tươi</th>
              <th>Kg Khô</th>
              <th>Thành tiền (VNĐ)</th>
              <th>Cán bộ cân</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map(s => (
              <tr key={s.id}>
                <td><strong style={{ color: '#0b6bbf' }}>{s.code}</strong></td>
                <td>{new Date(s.session_date).toLocaleDateString('vi-VN')}</td>
                <td><strong>{s.farmer_name}</strong></td>
                <td>{s.field_name} - {s.plot_no}</td>
                <td><span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{s.variety_code}</span></td>
                <td>{s.total_bags} bao</td>
                <td>{s.total_fresh_kg.toLocaleString()} kg</td>
                <td><strong style={{ color: '#0284c7' }}>{s.total_dry_kg.toFixed(1)} kg</strong></td>
                <td><strong style={{ color: '#059669' }}>{s.total_amount.toLocaleString()} đ</strong></td>
                <td>{s.officer_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid-footer-status">
        <span>Kết quả lọc: {filteredSessions.length} phiên cân</span>
        <span>Tổng Kg Tươi: <strong>{totalFresh.toLocaleString()} kg</strong> | Doanh thu: <strong style={{ color: '#059669' }}>{totalAmount.toLocaleString()} VNĐ</strong></span>
      </div>
    </div>
  );
};
