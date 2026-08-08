import React from 'react';
import { Truck, Share2, CheckCircle, Clock } from 'lucide-react';

export const VehicleView: React.FC = () => {
  return (
    <div className="panel-grid-container">
      <div className="panel-header">
        <div className="panel-title">
          <Truck size={20} color="#0284c7" />
          <span>QUẢN LÝ XE NHẬN & TẢI TRỌNG LÚA TẠI CẦU CÂN</span>
        </div>
        <button className="misa-btn-cmd success" onClick={() => alert('📱 Đã copy tin nhắn báo cáo tải trọng xe gửi cho nhà xe!')}>
          <Share2 size={14} /> Gửi Zalo Cho Nhà Xe
        </button>
      </div>

      <div style={{ padding: 16 }}>
        <table className="datagrid">
          <thead>
            <tr>
              <th>Biển số xe</th>
              <th>Tài xế / Chủ xe</th>
              <th>Số điện thoại</th>
              <th>Cán bộ cân phụ trách</th>
              <th>Sản lượng tươi trên xe</th>
              <th>Số bao lúa</th>
              <th>Giờ bắt đầu nhận</th>
              <th>Giờ kết thúc</th>
              <th>Trạng thái tải</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style={{ color: '#0b6bbf' }}>43C-123.45</strong></td>
              <td>Phan Văn Hùng</td>
              <td>0935.111.222</td>
              <td>Đoàn Thị Ngọc Phương</td>
              <td><strong style={{ color: '#0284c7' }}>24.500 kg</strong></td>
              <td>490 bao</td>
              <td>07:30 - 08/08/2026</td>
              <td>10:45 - 08/08/2026</td>
              <td>
                <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>
                  <CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} /> Đã đầy tải
                </span>
              </td>
            </tr>
            <tr>
              <td><strong style={{ color: '#0b6bbf' }}>92H-987.65</strong></td>
              <td>Nguyễn Đức Hoàng</td>
              <td>0913.333.444</td>
              <td>Trần Văn Nam</td>
              <td><strong style={{ color: '#0284c7' }}>18.200 kg</strong></td>
              <td>364 bao</td>
              <td>09:00 - 08/08/2026</td>
              <td>Đang bốc lúa...</td>
              <td>
                <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: 4 }} /> Đang bốc lúa
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
