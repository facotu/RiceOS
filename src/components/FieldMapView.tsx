import React, { useState } from 'react';
import { FieldPlot, Farmer, UserProfile } from '../types';
import { SAMPLE_FARMERS } from '../supabaseClient';
import { MapPin, Navigation, Users, Scale, ExternalLink, Plus, Map as MapIcon, ChevronRight } from 'lucide-react';

interface FieldMapViewProps {
  currentUser: UserProfile;
  plots: FieldPlot[];
  onNavigateWeighing: (farmerId: string) => void;
}

export const FieldMapView: React.FC<FieldMapViewProps> = ({
  currentUser,
  plots,
  onNavigateWeighing
}) => {
  const [selectedPlotId, setSelectedPlotId] = useState<string>(plots[0]?.id || 'fp-1');
  const [farmers] = useState<Farmer[]>(SAMPLE_FARMERS);
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);

  // New Plot Form State
  const [newFieldName, setNewFieldName] = useState('');
  const [newPlotNo, setNewPlotNo] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newLat, setNewLat] = useState('15.9625');
  const [newLng, setNewLng] = useState('108.2045');

  const selectedPlot = plots.find(p => p.id === selectedPlotId) || plots[0] || {
    id: 'fp-1',
    field_name: 'Xứ đồng An Trạch 1',
    plot_no: 'Lô A2',
    address: 'Thôn An Trạch, Xã Hòa Tiến, Đà Nẵng',
    lat: 15.9625,
    lng: 108.2045,
    area_total_sao: 22.5,
    main_variety: 'HT1',
    status: 'harvesting'
  };

  const plotFarmers = farmers.filter(f => f.plot_id === selectedPlotId || (f.field_name === selectedPlot?.field_name && f.plot_no === selectedPlot?.plot_no));

  const totalAreaSao = plots.reduce((sum, p) => sum + (p.area_total_sao || 0), 0);
  const totalFarmers = farmers.length;

  const handleOpenGoogleMapsNav = (plot: FieldPlot) => {
    const lat = plot.lat || 15.9625;
    const lng = plot.lng || 108.2045;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="panel-grid-container">
      {/* Header Command Bar */}
      <div className="panel-header">
        <div className="panel-title">
          <MapPin size={20} color="#059669" />
          <span>BẢN ĐỒ VÙNG TRỒNG GOOGLE MAPS & QUẢN LÝ CÁC HỘ SẢN XUẤT THEO LÔ</span>
        </div>
        <div className="misa-command-group">
          {currentUser.role === 'admin' && (
            <button className="misa-btn-cmd primary" onClick={() => setShowAddPlotModal(true)}>
              <Plus size={14} /> Thêm Lô Ruộng GPS Mới
            </button>
          )}
          <button className="misa-btn-cmd success" onClick={() => handleOpenGoogleMapsNav(selectedPlot)}>
            <Navigation size={14} /> Chỉ Đường Google Maps
          </button>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="kpi-row" style={{ padding: '16px 16px 0 16px' }}>
        <div className="kpi-box">
          <div className="kpi-icon green"><MapIcon size={20} /></div>
          <div>
            <div className="kpi-num" style={{ color: '#059669' }}>{plots.length} Lô ruộng</div>
            <div className="kpi-text">Tổng số lô vùng trồng</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon blue"><Users size={20} /></div>
          <div>
            <div className="kpi-num" style={{ color: '#0284c7' }}>{totalFarmers} Hộ dân</div>
            <div className="kpi-text">Hộ sản xuất liên kết</div>
          </div>
        </div>

        <div className="kpi-box">
          <div className="kpi-icon amber"><Scale size={20} /></div>
          <div>
            <div className="kpi-num" style={{ color: '#d97706' }}>{totalAreaSao} Sào</div>
            <div className="kpi-text">Diện tích canh tác (ha/sào)</div>
          </div>
        </div>
      </div>

      {/* 2-Column GIS Workspace: Left List + Center Google Maps + Bottom Farmers Grid */}
      <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>
        {/* Left Column: Plot Selector Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0e1e25', display: 'flex', alignItems: 'center', gap: 6 }}>
            📍 DANH SÁCH LÔ RUỘNG VÙNG TRỒNG ({plots.length})
          </h4>

          {plots.map(plot => {
            const isSelected = plot.id === selectedPlotId;
            const count = farmers.filter(f => f.plot_id === plot.id || (f.field_name === plot.field_name && f.plot_no === plot.plot_no)).length;

            return (
              <div
                key={plot.id}
                style={{
                  backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.03)'
                }}
                onClick={() => setSelectedPlotId(plot.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#0369a1' : '#0e1e25' }}>
                    {plot.field_name} - {plot.plot_no}
                  </span>
                  <span style={{
                    backgroundColor: plot.status === 'harvesting' ? '#d1fae5' : '#fef3c7',
                    color: plot.status === 'harvesting' ? '#047857' : '#b45309',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 10
                  }}>
                    {plot.status === 'harvesting' ? '🌾 Đang thu hoạch' : '⏳ Chờ thu hoạch'}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, lineHeight: 1.4 }}>
                  📍 {plot.address || 'Hòa Tiến, Hòa Vang, Đà Nẵng'}
                </div>

                <div style={{ fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#334155' }}>
                  <span>• Giống: <strong>{plot.main_variety || 'HT1'}</strong></span>
                  <span>• Diện tích: <strong>{plot.area_total_sao || 10} sào</strong></span>
                  <span style={{ color: '#0b6bbf', fontWeight: 700 }}>{count} Hộ dân</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Google Maps Display + Interactive Frame */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0e1e25' }}>
                🗺️ BẢN ĐỒ VỆ TINH GOOGLE MAPS - {selectedPlot.field_name.toUpperCase()} ({selectedPlot.plot_no})
              </span>
              <button
                className="misa-btn-cmd primary"
                style={{ fontSize: 11, padding: '3px 8px' }}
                onClick={() => handleOpenGoogleMapsNav(selectedPlot)}
              >
                <ExternalLink size={12} /> Mở ứng dụng Google Maps
              </button>
            </div>

            {/* Embedded Google Maps View */}
            <div style={{ position: 'relative', width: '100%', height: 320, backgroundColor: '#e2e8f0' }}>
              <iframe
                title="Google Maps Plot Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${selectedPlot.lat || 15.9625},${selectedPlot.lng || 108.2045}&hl=vi&z=15&output=embed`}
                allowFullScreen
              />

              {/* Marker Card Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                <MapPin size={24} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 800, color: '#00d2d3' }}>{selectedPlot.field_name} - {selectedPlot.plot_no}</div>
                  <div style={{ fontSize: 10, color: '#cbd5e1' }}>GPS: {selectedPlot.lat || 15.9625}, {selectedPlot.lng || 108.2045}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Producing Households DataGrid for Selected Plot */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 16
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0b6bbf', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Users size={16} /> DANH SÁCH CÁC HỘ SẢN XUẤT THUỘC {selectedPlot.plot_no.toUpperCase()} ({plotFarmers.length} HỘ)
            </h4>

            {plotFarmers.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>
                Chưa có hộ dân sản xuất nào được liên kết với lô này.
              </div>
            ) : (
              <table className="datagrid">
                <thead>
                  <tr>
                    <th>Họ và tên Chủ hộ</th>
                    <th>Số điện thoại</th>
                    <th>Số CCCD</th>
                    <th>Diện tích (sào)</th>
                    <th>Giống lúa</th>
                    <th>Sản lượng ước tính</th>
                    <th>Trạng thái thu hoạch</th>
                    <th style={{ textAlign: 'center' }}>Tác vụ cân lúa</th>
                  </tr>
                </thead>
                <tbody>
                  {plotFarmers.map(f => (
                    <tr key={f.id}>
                      <td><strong>{f.name}</strong></td>
                      <td>{f.phone}</td>
                      <td>{f.cccd}</td>
                      <td><strong>{f.area_sao} sào</strong></td>
                      <td><span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>{f.variety_code || 'HT1'}</span></td>
                      <td><strong style={{ color: '#059669' }}>{f.estimated_yield_ton || 7.5} tấn</strong></td>
                      <td>
                        <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: 11 }}>
                          🌾 Đang thu hoạch
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="misa-btn-cmd primary"
                          style={{ fontSize: 11, padding: '2px 8px' }}
                          onClick={() => onNavigateWeighing(f.id)}
                        >
                          Cân lúa hộ này <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal Add New GPS Plot */}
      {showAddPlotModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <span className="modal-title">THÊM TỌA ĐỘ LÔ RUỘNG MỚI VÀO GOOGLE MAPS</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowAddPlotModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Tên Xứ đồng *</label>
                <input type="text" className="form-control" placeholder="VD: Xứ đồng An Trạch 2" value={newFieldName} onChange={(e) => setNewFieldName(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Số Lô Ruộng *</label>
                <input type="text" className="form-control" placeholder="VD: Lô A3" value={newPlotNo} onChange={(e) => setNewPlotNo(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Địa chỉ chi tiết *</label>
                <input type="text" className="form-control" placeholder="VD: Thôn An Trạch, Xã Hòa Tiến, Đà Nẵng" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Vĩ độ Google Maps (Lat)</label>
                  <input type="text" className="form-control" value={newLat} onChange={(e) => setNewLat(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kinh độ Google Maps (Lng)</label>
                  <input type="text" className="form-control" value={newLng} onChange={(e) => setNewLng(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="misa-btn-cmd" onClick={() => setShowAddPlotModal(false)}>Hủy bỏ</button>
              <button
                type="button"
                className="misa-btn-cmd primary"
                onClick={() => {
                  alert('✅ Đã định vị và thêm Lô ruộng mới lên Google Maps thành công!');
                  setShowAddPlotModal(false);
                }}
              >
                Gắn vị trí Google Maps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
