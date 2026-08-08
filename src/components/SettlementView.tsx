import React, { useState } from 'react';
import { WeighingSession } from '../types';
import { Receipt, Printer } from 'lucide-react';

interface SettlementViewProps {
  sessions: WeighingSession[];
}

export const SettlementView: React.FC<SettlementViewProps> = ({ sessions }) => {
  const [selectedFarmerName, setSelectedFarmerName] = useState<string>('Nguyễn Văn Bình');

  const farmerSessions = sessions.filter(s => s.farmer_name === selectedFarmerName);

  const totalBags = farmerSessions.reduce((sum, s) => sum + s.total_bags, 0);
  const totalFreshKg = farmerSessions.reduce((sum, s) => sum + s.total_fresh_kg, 0);
  const totalTareKg = farmerSessions.reduce((sum, s) => sum + s.total_tare_kg, 0);
  const totalDryKg = farmerSessions.reduce((sum, s) => sum + s.total_dry_kg, 0);
  const totalAmount = farmerSessions.reduce((sum, s) => sum + s.total_amount, 0);
  const advancePayment = 20000000;
  const remainingPayment = Math.max(0, totalAmount - advancePayment);

  return (
    <div className="panel-grid-container">
      <div className="panel-header">
        <div className="panel-title">
          <Receipt size={20} color="#d97706" />
          <span>QUYẾT TOÁN TIỀN LÚA CHO HỘ DÂN (SETTLEMENT PANEL)</span>
        </div>
        <button className="misa-btn-cmd primary" onClick={() => window.print()}>
          <Printer size={14} /> In Bảng Quyết Toán
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Chọn Hộ Dân Quyết Toán *</label>
          <select
            className="form-control"
            value={selectedFarmerName}
            onChange={(e) => setSelectedFarmerName(e.target.value)}
          >
            <option value="Nguyễn Văn Bình">Nguyễn Văn Bình (SĐT: 0914.123.456 - Xứ đồng An Trạch 1)</option>
            <option value="Trần Văn Cường">Trần Văn Cường (SĐT: 0988.765.432 - Xứ đồng Hòa Tiến)</option>
            <option value="Lê Thị Mai">Lê Thị Mai (SĐT: 0905.888.999 - Xứ đồng Đa Phước 3)</option>
          </select>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#0b6bbf' }}>
            THÔNG TIN QUYẾT TOÁN TỔNG HỢP - CHỦ HỘ: {selectedFarmerName.toUpperCase()}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, fontSize: 13 }}>
            <div>• Số CCCD: <strong>048092001234</strong></div>
            <div>• Xứ đồng / Lô: <strong>An Trạch 1 - Lô A2</strong></div>
            <div>• Tổng số phiên cân: <strong>{farmerSessions.length} phiên</strong></div>
            <div>• Tổng số bao cân: <strong>{totalBags} bao</strong></div>
            <div>• Tổng sản lượng tươi: <strong>{totalFreshKg.toLocaleString()} kg</strong></div>
            <div>• Trừ bì độ ẩm (5.0%): <strong>{totalTareKg.toFixed(1)} kg</strong></div>
            <div>• Sản lượng khô thực tính: <strong style={{ color: '#0284c7' }}>{totalDryKg.toFixed(1)} kg</strong></div>
            <div>• Đơn giá lúa HT1: <strong>8.000 đ/kg</strong></div>
            <div>• Tổng thành tiền: <strong style={{ color: '#059669', fontSize: 15 }}>{totalAmount.toLocaleString()} đ</strong></div>
            <div>• Số tiền đã tạm ứng: <strong style={{ color: '#d97706' }}>{advancePayment.toLocaleString()} đ</strong></div>
            <div>
              • <strong>CÒN LẠI PHẢI THANH TOÁN:</strong> <strong style={{ color: '#ef4444', fontSize: 16 }}>{remainingPayment.toLocaleString()} VNĐ</strong>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 8, fontWeight: 700, color: '#0f172a' }}>
          📋 CHI TIẾT CÁC PHIÊN CÂN TRONG ĐỢT CỦA HỘ DÂN:
        </div>

        <table className="datagrid">
          <thead>
            <tr>
              <th>Mã phiên</th>
              <th>Ngày cân</th>
              <th>Giống lúa</th>
              <th>Số bao</th>
              <th>Kg Tươi</th>
              <th>Kg Trừ bì</th>
              <th>Kg Khô</th>
              <th>Đơn giá (đ/kg)</th>
              <th>Thành tiền (VNĐ)</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {farmerSessions.map(s => (
              <tr key={s.id}>
                <td><strong style={{ color: '#0b6bbf' }}>{s.code}</strong></td>
                <td>{new Date(s.session_date).toLocaleDateString('vi-VN')}</td>
                <td><span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{s.variety_code}</span></td>
                <td>{s.total_bags} bao</td>
                <td>{s.total_fresh_kg.toLocaleString()} kg</td>
                <td>{s.total_tare_kg.toFixed(1)} kg</td>
                <td><strong style={{ color: '#0284c7' }}>{s.total_dry_kg.toFixed(1)} kg</strong></td>
                <td>{s.price_per_kg.toLocaleString()} đ</td>
                <td><strong style={{ color: '#059669' }}>{s.total_amount.toLocaleString()} đ</strong></td>
                <td><span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>Đã xác nhận</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
