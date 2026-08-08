import React from 'react';
import { UserProfile, WeighingSession } from '../types';
import { Users, Package, Truck, UserCheck, ArrowRight, Table } from 'lucide-react';

interface DashboardViewProps {
  currentUser: UserProfile;
  sessions: WeighingSession[];
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  sessions,
  onNavigateTab
}) => {
  const totalFarmersCount = 42;
  const totalBagsSum = sessions.reduce((sum, s) => sum + s.total_bags, 0);
  const totalFreshSum = sessions.reduce((sum, s) => sum + s.total_fresh_kg, 0);
  const totalDrySum = sessions.reduce((sum, s) => sum + s.total_dry_kg, 0);
  const totalAmountSum = sessions.reduce((sum, s) => sum + s.total_amount, 0);

  return (
    <>
      <div className="banner-welcome">
        <div>
          <div className="banner-title">👋 Chào {currentUser.full_name} ({currentUser.role.toUpperCase()})</div>
          <div className="banner-desc">
            Tiến độ đợt thu mua lúa Hè Thu 2026 tại Cầu cân An Trạch đã hoàn thành <b>68.4%</b> kế hoạch đợt 1.
          </div>
        </div>
        <button className="misa-btn-cmd primary" onClick={() => onNavigateTab('weighing')}>
          Vào Cân Lúa Ngay
        </button>
      </div>

      <div className="ai-cards-grid" style={{ marginTop: 16 }}>
        <div className="ai-card">
          <div className="card-header-meta">
            <span className="card-label">✨ AVA AI Assistant Insight</span>
            <span className="card-time">Tính đến 11:45 hôm nay</span>
          </div>
          <div className="card-value" style={{ color: '#059669' }}>
            {totalFreshSum.toLocaleString()} kg tươi
          </div>
          <div className="card-comment">
            <b>Nhận xét AI:</b> Sản lượng lúa tươi thu mua tăng <b>+18.5%</b>. Giống lúa <b>HT1</b> & <b>J02</b> chiếm 62% tổng lượng nhập.
          </div>
          <a href="#" className="card-link" onClick={(e) => { e.preventDefault(); onNavigateTab('reports'); }}>
            Xem phân tích chuyên sâu giống lúa <ArrowRight size={12} />
          </a>
        </div>

        <div className="ai-card">
          <div className="card-header-meta">
            <span className="card-label">📦 Lúa Khô & Trừ Bì %</span>
            <span className="card-time">Quy đổi chuẩn</span>
          </div>
          <div className="card-value" style={{ color: '#0284c7' }}>
            {totalDrySum.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg khô
          </div>
          <div className="card-comment">
            Đã trừ <b>{(totalFreshSum - totalDrySum).toFixed(1)} kg bì & tạp chất</b> (Độ ẩm bình quân 5.0%). Tỷ lệ đạt tiêu chuẩn thu mua.
          </div>
          <a href="#" className="card-link" onClick={(e) => { e.preventDefault(); onNavigateTab('settings'); }}>
            Cấu hình lại định mức trừ bì % <ArrowRight size={12} />
          </a>
        </div>

        <div className="ai-card">
          <div className="card-header-meta">
            <span className="card-label">💰 Tổng Giá Trị & Tạm Ứng</span>
            <span className="card-time">Tài chính đợt</span>
          </div>
          <div className="card-value" style={{ color: '#d97706' }}>
            {totalAmountSum.toLocaleString()} VNĐ
          </div>
          <div className="card-comment">
            Đã thanh toán tạm ứng: <b>420.000.000 đ</b> cho 28 hộ dân. Dòng tiền quyết toán hoạt động ổn định.
          </div>
          <a href="#" className="card-link" onClick={(e) => { e.preventDefault(); onNavigateTab('settlement'); }}>
            Quyết toán với hộ dân ngay <ArrowRight size={12} />
          </a>
        </div>
      </div>

      <div className="kpi-row" style={{ marginTop: 16 }}>
        <div className="kpi-box">
          <div className="kpi-icon green"><Users size={22} /></div>
          <div>
            <div className="kpi-num">{totalFarmersCount} hộ</div>
            <div className="kpi-text">Tổng số hộ dân đã cân</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon blue"><Package size={22} /></div>
          <div>
            <div className="kpi-num">{totalBagsSum.toLocaleString()} bao</div>
            <div className="kpi-text">Tổng số bao lúa tươi</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon amber"><Truck size={22} /></div>
          <div>
            <div className="kpi-num">6 xe nhận</div>
            <div className="kpi-text">Xe vận chuyển đang tải</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon purple"><UserCheck size={22} /></div>
          <div>
            <div className="kpi-num">3 cán bộ</div>
            <div className="kpi-text">Cán bộ cân đang trực</div>
          </div>
        </div>
      </div>

      <div className="panel-grid-container" style={{ marginTop: 16 }}>
        <div className="panel-header">
          <div className="panel-title">
            <Table size={18} color="#0b6bbf" />
            <span>Danh sách Các Phiên Cân Lúa Gần Đây (Master DataGrid View)</span>
          </div>
          <button className="misa-btn-cmd primary" onClick={() => onNavigateTab('weighing')}>
            + Phiên Cân Mới
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="datagrid">
            <thead>
              <tr>
                <th>Mã phiên</th>
                <th>Thời gian</th>
                <th>Chủ ruộng (Hộ dân)</th>
                <th>Xứ đồng / Lô</th>
                <th>Giống lúa</th>
                <th>Số bao</th>
                <th>Kg Tươi</th>
                <th>Kg Khô</th>
                <th>Thành tiền (VNĐ)</th>
                <th>Cán bộ cân</th>
                <th>Xe nhận</th>
                <th>Trạng thái</th>
              </tr>
              <tr className="filter-row">
                <td><input type="text" placeholder="Filter mã..." /></td>
                <td><input type="text" placeholder="Filter ngày..." /></td>
                <td><input type="text" placeholder="Filter tên chủ..." /></td>
                <td><input type="text" placeholder="Filter lô..." /></td>
                <td><input type="text" placeholder="Giống..." /></td>
                <td><input type="text" placeholder="Bao..." /></td>
                <td><input type="text" placeholder="Kg tươi..." /></td>
                <td><input type="text" placeholder="Kg khô..." /></td>
                <td><input type="text" placeholder="Thành tiền..." /></td>
                <td><input type="text" placeholder="Cán bộ..." /></td>
                <td><input type="text" placeholder="Biển số..." /></td>
                <td><input type="text" placeholder="Trạng thái..." /></td>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id}>
                  <td><strong style={{ color: '#0b6bbf' }}>{s.code}</strong></td>
                  <td>{new Date(s.session_date).toLocaleDateString('vi-VN')}</td>
                  <td><strong>{s.farmer_name}</strong></td>
                  <td>{s.field_name} - {s.plot_no}</td>
                  <td>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                      {s.variety_code}
                    </span>
                  </td>
                  <td>{s.total_bags} bao</td>
                  <td>{s.total_fresh_kg.toLocaleString()} kg</td>
                  <td><strong style={{ color: '#0284c7' }}>{s.total_dry_kg.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg</strong></td>
                  <td><strong style={{ color: '#059669' }}>{s.total_amount.toLocaleString()} đ</strong></td>
                  <td>{s.officer_name}</td>
                  <td>{s.vehicle_plate}</td>
                  <td>
                    <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontWeight: 600, fontSize: 11 }}>
                      Đã hoàn thành
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid-footer-status">
          <span>Hiển thị: {sessions.length} phiên cân gần nhất | Tổng cộng đợt: 42 phiên</span>
          <span>
            Tổng sản lượng tươi: <strong>{totalFreshSum.toLocaleString()} kg</strong> | Thành tiền: <strong style={{ color: '#059669' }}>{totalAmountSum.toLocaleString()} VNĐ</strong>
          </span>
        </div>
      </div>
    </>
  );
};
