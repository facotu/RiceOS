import React, { useState } from 'react';
import { Vehicle, UserProfile } from '../types';
import { Truck, Share2, CheckCircle, Clock, Image, Plus } from 'lucide-react';

interface VehicleViewProps {
  currentUser: UserProfile;
}

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v-01',
    plate_number: '43C-123.45',
    driver_name: 'Phan Văn Hùng',
    driver_phone: '0935.111.222',
    status: 'full',
    current_fresh_kg: 24500,
    current_bags: 490,
    officer_name: 'Đoàn Thị Ngọc Phương',
    start_time: '07:30 - 08/08/2026',
    end_time: '10:45 - 08/08/2026'
  },
  {
    id: 'v-02',
    plate_number: '92H-987.65',
    driver_name: 'Nguyễn Đức Hoàng',
    driver_phone: '0913.333.444',
    status: 'loading',
    current_fresh_kg: 18200,
    current_bags: 364,
    officer_name: 'Trần Văn Nam',
    start_time: '09:00 - 08/08/2026',
    end_time: 'Đang bốc lúa...'
  }
];

export const VehicleView: React.FC<VehicleViewProps> = ({ currentUser }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(INITIAL_VEHICLES[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newDriver) return;

    const newV: Vehicle = {
      id: 'v-' + Date.now(),
      plate_number: newPlate,
      driver_name: newDriver,
      driver_phone: newPhone,
      status: 'active',
      current_fresh_kg: 0,
      current_bags: 0,
      officer_name: currentUser.full_name,
      start_time: 'Vừa tiếp nhận',
      end_time: 'Đang bốc lúa...'
    };

    setVehicles([...vehicles, newV]);
    setSelectedVehicle(newV);
    setShowAddModal(false);
    setNewPlate('');
    setNewDriver('');
    setNewPhone('');
    alert('✅ Đã thêm xe nhận mới vào hệ thống!');
  };

  const handleExportImage = () => {
    alert(`🖼️ Đã kết xuất thành công Tệp Hình Ảnh Báo Cáo Tải Trọng Xe ${selectedVehicle.plate_number}.png!`);
  };

  const handleShareZalo = () => {
    alert(`📱 Đã copy tin nhắn Zalo báo tải trọng Xe ${selectedVehicle.plate_number} gửi nhà xe!`);
  };

  return (
    <div className="panel-grid-container">
      <div className="panel-header">
        <div className="panel-title">
          <Truck size={20} color="#0284c7" />
          <span>QUẢN LÝ XE NHẬN & TẢI TRỌNG LÚA TẠI CẦU CÂN</span>
        </div>
        <div className="misa-command-group">
          {currentUser.role === 'admin' && (
            <button className="misa-btn-cmd primary" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Thêm xe nhận mới
            </button>
          )}
          <button className="misa-btn-cmd success" onClick={handleShareZalo}>
            <Share2 size={14} /> Gửi tin Zalo cho Nhà xe
          </button>
          <button className="misa-btn-cmd" onClick={handleExportImage}>
            <Image size={14} /> Xuất file ảnh (.PNG)
          </button>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Detail Summary Card for Selected Vehicle */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0369a1', marginBottom: 8 }}>
            🚚 CHI TIẾT XE NHẬN ĐANG ĐƯỢC CHỌN: {selectedVehicle.plate_number}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 12 }}>
            <div>• Tài xế / Chủ xe: <strong>{selectedVehicle.driver_name}</strong></div>
            <div>• Số điện thoại: <strong>{selectedVehicle.driver_phone}</strong></div>
            <div>• Cán bộ cân phụ trách: <strong>{selectedVehicle.officer_name}</strong></div>
            <div>• Tổng sản lượng tươi trên xe: <strong style={{ color: '#0284c7', fontSize: 14 }}>{(selectedVehicle.current_fresh_kg || 0).toLocaleString()} kg</strong></div>
            <div>• Tổng số bao lúa: <strong>{selectedVehicle.current_bags} bao</strong></div>
            <div>• Giờ bắt đầu nhận: <strong>{selectedVehicle.start_time}</strong></div>
            <div>• Giờ kết thúc nhận: <strong>{selectedVehicle.end_time}</strong></div>
          </div>
        </div>

        <table className="datagrid">
          <thead>
            <tr>
              <th>Biển số xe</th>
              <th>Tài xế / Chủ xe</th>
              <th>Số điện thoại</th>
              <th>Cán bộ cân phụ trách</th>
              <th>Sản lượng tươi trên xe</th>
              <th>Số bao lúa</th>
              <th>Giờ bắt đầu</th>
              <th>Giờ kết thúc</th>
              <th>Trạng thái tải</th>
              <th style={{ textAlign: 'center' }}>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr
                key={v.id}
                style={{ backgroundColor: selectedVehicle.id === v.id ? '#e0f2fe' : undefined, cursor: 'pointer' }}
                onClick={() => setSelectedVehicle(v)}
              >
                <td><strong style={{ color: '#0b6bbf' }}>{v.plate_number}</strong></td>
                <td>{v.driver_name}</td>
                <td>{v.driver_phone}</td>
                <td>{v.officer_name}</td>
                <td><strong style={{ color: '#0284c7' }}>{(v.current_fresh_kg || 0).toLocaleString()} kg</strong></td>
                <td>{v.current_bags} bao</td>
                <td>{v.start_time}</td>
                <td>{v.end_time}</td>
                <td>
                  {v.status === 'full' ? (
                    <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>
                      <CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} /> Đã đầy tải
                    </span>
                  ) : (
                    <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4 }} /> Đang bốc lúa
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="misa-btn-cmd primary" style={{ fontSize: 11, padding: '2px 8px' }} onClick={() => setSelectedVehicle(v)}>
                    Xem xe này
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <span className="modal-title">THÊM XE NHẬN LÚA MỚI VÀO CẦU CÂN</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddVehicle}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Biển số xe *</label>
                  <input type="text" className="form-control" placeholder="e.g. 43C-888.99" value={newPlate} onChange={(e) => setNewPlate(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Tên tài xế / Chủ xe *</label>
                  <input type="text" className="form-control" placeholder="Nhập tên tài xế..." value={newDriver} onChange={(e) => setNewDriver(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại *</label>
                  <input type="text" className="form-control" placeholder="0905..." value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="misa-btn-cmd" onClick={() => setShowAddModal(false)}>Hủy bỏ</button>
                <button type="submit" className="misa-btn-cmd primary">Thêm xe nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
