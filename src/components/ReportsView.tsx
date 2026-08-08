import React, { useState } from 'react';
import { WeighingSession } from '../types';
import { LineChart, Download, FileSpreadsheet, Printer } from 'lucide-react';

interface ReportsViewProps {
  sessions: WeighingSession[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ sessions }) => {
  const [reportMode, setReportMode] = useState<'all' | 'date' | 'variety'>('all');

  const totalFarmers = 42;
  const totalBags = sessions.reduce((sum, s) => sum + s.total_bags, 0);
  const totalFresh = sessions.reduce((sum, s) => sum + s.total_fresh_kg, 0);
  const totalDry = sessions.reduce((sum, s) => sum + s.total_dry_kg, 0);
  const totalRevenue = sessions.reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <div class="panel-grid-container">
      <div class="panel-header">
        <div class="panel-title">
          <LineChart size={20} color="#059669" />
          <span>BÁO CÁO THỐNG KÊ ĐA CHIỀU THU MUA LÚA</span>
        </div>
        <div class="misa-command-group">
          <button class="misa-btn-cmd success" onClick={() => alert('📊 Đã xuất file Báo cáo Excel thành công!')}>
            <FileSpreadsheet size={14} /> Xuất Excel (.XLSX)
          </button>
          <button class="misa-btn-cmd" onClick={() => window.print()}>
            <Printer size={14} /> In Báo Cáo
          </button>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Tùy chọn hiển thị báo cáo</label>
          <select
            class="form-control"
            value={reportMode}
            onChange={(e) => setReportMode(e.target.value as any)}
          >
            <option value="all">Tất cả số liệu đợt thu mua</option>
            <option value="date">Báo cáo theo Ngày cân</option>
            <option value="variety">Báo cáo tổng hợp theo Giống Lúa</option>
          </select>
        </div>
      </div>

      {/* Report Summary KPIs */}
      <div class="kpi-row" style={{ padding: '0 16px 16px 16px' }}>
        <div class="kpi-box">
          <div>
            <div class="kpi-num" style={{ color: '#0b6bbf' }}>{totalFarmers} hộ</div>
            <div class="kpi-text">Tổng số hộ dân cân</div>
          </div>
        </div>

        <div class="kpi-box">
          <div>
            <div class="kpi-num" style={{ color: '#0284c7' }}>{totalBags.toLocaleString()} bao</div>
            <div class="kpi-text">Tổng số bao lúa tươi</div>
          </div>
        </div>

        <div class="kpi-box">
          <div>
            <div class="kpi-num" style={{ color: '#059669' }}>{totalDry.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg</div>
            <div class="kpi-text">Tổng sản lượng lúa khô</div>
          </div>
        </div>

        <div class="kpi-box">
          <div>
            <div class="kpi-num" style={{ color: '#d97706' }}>{totalRevenue.toLocaleString()} VNĐ</div>
            <div class="kpi-text">Doanh thu thu mua</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
          📊 BẢNG THỐNG KÊ CHI TIẾT THEO CÁN BỘ CÂN & XE NHẬN:
        </h4>

        <table class="datagrid">
          <thead>
            <tr>
              <th>Tên phân loại / Giống lúa</th>
              <th>Số hộ dân</th>
              <th>Số bao</th>
              <th>Sản lượng tươi (kg)</th>
              <th>Sản lượng khô (kg)</th>
              <th>Doanh thu (VNĐ)</th>
              <th>Tỷ trọng sản lượng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Giống lúa HT1</strong></td>
              <td>16 hộ</td>
              <td>1.240 bao</td>
              <td>62.000 kg</td>
              <td>58.900 kg</td>
              <td><strong style={{ color: '#059669' }}>471.200.000 đ</strong></td>
              <td><span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>43.8%</span></td>
            </tr>
            <tr>
              <td><strong>Giống lúa J02</strong></td>
              <td>12 hộ</td>
              <td>850 bao</td>
              <td>42.500 kg</td>
              <td>40.375 kg</td>
              <td><strong style={{ color: '#059669' }}>343.187.500 đ</strong></td>
              <td><span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>30.0%</span></td>
            </tr>
            <tr>
              <td><strong>Giống lúa HG12</strong></td>
              <td>8 hộ</td>
              <td>450 bao</td>
              <td>22.500 kg</td>
              <td>21.375 kg</td>
              <td><strong style={{ color: '#059669' }}>160.312.500 đ</strong></td>
              <td><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>15.9%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
