import React, { useState } from 'react';
import { 
  UserProfile, 
  Farmer, 
  Vehicle, 
  WeighingRow, 
  WeighingSession, 
  SystemSettings 
} from '../types';
import { 
  Scales, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  X, 
  FileText 
} from 'lucide-react';

interface WeighingViewProps {
  currentUser: UserProfile;
  settings: SystemSettings;
  onSaveSession: (session: WeighingSession) => void;
}

const MOCK_FARMERS: Farmer[] = [
  {
    id: 'f-01',
    name: 'Nguyễn Văn Bình',
    phone: '0914.123.456',
    cccd: '048092001234',
    cccd_issue_date: '15/05/2021',
    cccd_issue_place: 'Cục CSQLHC về TTXH',
    cccd_expiry_date: '15/05/2036',
    field_name: 'Xứ đồng An Trạch 1',
    plot_no: 'Lô A2',
    area_sao: 12.5
  },
  {
    id: 'f-02',
    name: 'Trần Văn Cường',
    phone: '0988.765.432',
    cccd: '048095005678',
    cccd_issue_date: '20/10/2020',
    cccd_issue_place: 'Công an TP Đà Nẵng',
    cccd_expiry_date: '20/10/2035',
    field_name: 'Xứ đồng Hòa Tiến',
    plot_no: 'Lô B',
    area_sao: 18.0
  },
  {
    id: 'f-03',
    name: 'Lê Thị Mai',
    phone: '0905.888.999',
    cccd: '048188009999',
    cccd_issue_date: '10/01/2022',
    cccd_issue_place: 'Cục CSQLHC về TTXH',
    cccd_expiry_date: '10/01/2037',
    field_name: 'Xứ đồng Đa Phước 3',
    plot_no: 'Lô C',
    area_sao: 15.0
  }
];

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v-01', plate_number: '43C-123.45', driver_name: 'Phan Văn Hùng', driver_phone: '0935.111.222', status: 'loading' },
  { id: 'v-02', plate_number: '92H-987.65', driver_name: 'Nguyễn Đức Hoàng', driver_phone: '0913.333.444', status: 'active' }
];

export const WeighingView: React.FC<WeighingViewProps> = ({
  currentUser,
  settings,
  onSaveSession
}) => {
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(MOCK_FARMERS[0].id);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(MOCK_VEHICLES[0].id);
  const [selectedVarietyCode, setSelectedVarietyCode] = useState<string>('HT1');
  const [tarePercent, setTarePercent] = useState<number>(settings.default_tare_percent || 5.0);

  const [rows, setRows] = useState<WeighingRow[]>([
    { id: 'r-1', time: '11:05', bag_count: 10, fresh_kg: 500, tare_kg: 25, dry_kg: 475, price_per_kg: 8000, subtotal: 3800000 },
    { id: 'r-2', time: '11:10', bag_count: 12, fresh_kg: 600, tare_kg: 30, dry_kg: 570, price_per_kg: 8000, subtotal: 4560000 },
    { id: 'r-3', time: '11:15', bag_count: 10, fresh_kg: 500, tare_kg: 25, dry_kg: 475, price_per_kg: 8000, subtotal: 3800000 }
  ]);

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editBagCount, setEditBagCount] = useState<number>(0);
  const [editFreshKg, setEditFreshKg] = useState<number>(0);

  const [showZaloModal, setShowZaloModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);

  const currentFarmer = MOCK_FARMERS.find(f => f.id === selectedFarmerId) || MOCK_FARMERS[0];
  const currentVehicle = MOCK_VEHICLES.find(v => v.id === selectedVehicleId) || MOCK_VEHICLES[0];
  const unitPrice = settings.variety_prices[selectedVarietyCode] || 8000;

  const totalBags = rows.reduce((sum, r) => sum + r.bag_count, 0);
  const totalFreshKg = rows.reduce((sum, r) => sum + r.fresh_kg, 0);
  const totalTareKg = (totalFreshKg * tarePercent) / 100;
  const totalDryKg = Math.max(0, totalFreshKg - totalTareKg);
  const totalAmount = totalDryKg * unitPrice;

  const handleAddRow = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newBags = 10;
    const newFresh = 500;
    const tareKg = (newFresh * tarePercent) / 100;
    const dryKg = Math.max(0, newFresh - tareKg);
    const subtotal = dryKg * unitPrice;

    const newRow: WeighingRow = {
      id: 'r-' + Date.now(),
      time: timeStr,
      bag_count: newBags,
      fresh_kg: newFresh,
      tare_kg: tareKg,
      dry_kg: dryKg,
      price_per_kg: unitPrice,
      subtotal: subtotal
    };

    setRows([...rows, newRow]);
  };

  const handleStartEditRow = (row: WeighingRow) => {
    setEditingRowId(row.id);
    setEditBagCount(row.bag_count);
    setEditFreshKg(row.fresh_kg);
  };

  const handleSaveEditRow = (rowId: string) => {
    setRows(rows.map(r => {
      if (r.id === rowId) {
        const tareKg = (editFreshKg * tarePercent) / 100;
        const dryKg = Math.max(0, editFreshKg - tareKg);
        const subtotal = dryKg * unitPrice;
        return {
          ...r,
          bag_count: editBagCount,
          fresh_kg: editFreshKg,
          tare_kg: tareKg,
          dry_kg: dryKg,
          price_per_kg: unitPrice,
          subtotal: subtotal
        };
      }
      return r;
    }));
    setEditingRowId(null);
  };

  const handleDeleteRow = (rowId: string) => {
    setRows(rows.filter(r => r.id !== rowId));
  };

  const handleSaveSession = () => {
    const session: WeighingSession = {
      id: 'sess-' + Date.now(),
      code: 'PC-' + Math.floor(100000 + Math.random() * 900000),
      session_date: new Date().toISOString(),
      farmer_id: currentFarmer.id,
      farmer_name: currentFarmer.name,
      farmer_phone: currentFarmer.phone,
      field_name: currentFarmer.field_name,
      plot_no: currentFarmer.plot_no,
      officer_id: currentUser.id,
      officer_name: currentUser.full_name,
      vehicle_id: currentVehicle.id,
      vehicle_plate: currentVehicle.plate_number,
      variety_code: selectedVarietyCode,
      variety_name: `Giống lúa ${selectedVarietyCode}`,
      rows: rows,
      total_bags: totalBags,
      total_fresh_kg: totalFreshKg,
      tare_formula: 'percent',
      tare_value: tarePercent,
      total_tare_kg: totalTareKg,
      total_dry_kg: totalDryKg,
      price_per_kg: unitPrice,
      total_amount: totalAmount,
      advance_payment: 0,
      remaining_payment: totalAmount,
      status: 'completed'
    };

    onSaveSession(session);
    alert('✅ Đã ghi nhập thành công Phiên Cân Lúa!');
  };

  const getZaloText = () => {
    return `🌾 RiceOS - THÔNG BÁO PHIÊN CÂN LÚA TƯƠI
----------------------------------------
Chủ ruộng: ${currentFarmer.name} (SĐT: ${currentFarmer.phone})
Xứ đồng: ${currentFarmer.field_name} - ${currentFarmer.plot_no}
Giống lúa: ${selectedVarietyCode}
Tổng số bao cân: ${totalBags.toLocaleString()} bao
Tổng khối lượng tươi: ${totalFreshKg.toLocaleString()} kg
Trừ bì độ ẩm (${tarePercent}%): ${totalTareKg.toFixed(1)} kg
Sản lượng khô thực tính: ${totalDryKg.toFixed(1)} kg
Đơn giá thu mua: ${unitPrice.toLocaleString()} đ/kg
----------------------------------------
THÀNH TIỀN: ${totalAmount.toLocaleString()} VNĐ
----------------------------------------
Cán bộ cân phụ trách: ${currentUser.full_name}
Xe nhận lúa: ${currentVehicle.plate_number} (${currentVehicle.driver_name})
Cảm ơn quý hộ dân đã đồng hành cùng RiceOS!`;
  };

  const handleCopyZalo = () => {
    navigator.clipboard.writeText(getZaloText());
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 2000);
  };

  return (
    <div className="panel-grid-container">
      <div className="panel-header">
        <div className="panel-title">
          <Scales size={20} color="#10b981" />
          <span>TẠO PHIÊN CÂN LÚA MỚI (CÂN TƯƠI TRỰC TIẾP TẠI CẦU CÂN)</span>
        </div>
        <div className="misa-command-group">
          <button className="misa-btn-cmd primary" onClick={handleSaveSession}>
            <Save size={14} /> Ghi nhập phiên cân
          </button>
          <button className="misa-btn-cmd success" onClick={() => setShowZaloModal(true)}>
            <Share2 size={14} /> Copy tin nhắn Zalo
          </button>
          <button className="misa-btn-cmd" onClick={() => setShowTicketModal(true)}>
            <Printer size={14} /> In phiếu cân nhiệt
          </button>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Chọn Chủ Ruộng (Hộ Dân) *</label>
          <select
            className="form-control"
            value={selectedFarmerId}
            onChange={(e) => setSelectedFarmerId(e.target.value)}
          >
            {MOCK_FARMERS.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} - SĐT: {f.phone} ({f.field_name})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Số CCCD / Nơi cấp / Hạn dùng</label>
          <input
            type="text"
            className="form-control"
            value={`${currentFarmer.cccd} - ${currentFarmer.cccd_issue_place} (Hạn: ${currentFarmer.cccd_expiry_date})`}
            readOnly
            style={{ backgroundColor: '#f8fafc' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Xứ đồng / Lô / Diện tích</label>
          <input
            type="text"
            className="form-control"
            value={`${currentFarmer.field_name} - ${currentFarmer.plot_no} (${currentFarmer.area_sao} sào)`}
            readOnly
            style={{ backgroundColor: '#f8fafc' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cán bộ phụ trách cân</label>
          <input
            type="text"
            className="form-control"
            value={`${currentUser.full_name} (${currentUser.role.toUpperCase()})`}
            readOnly
            style={{ backgroundColor: '#f8fafc' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Chọn Xe Nhận Lúa *</label>
          <select
            className="form-control"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
          >
            {MOCK_VEHICLES.map(v => (
              <option key={v.id} value={v.id}>
                {v.plate_number} - Tài xế: {v.driver_name} (SĐT: {v.driver_phone})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Loại Giống Lúa Thu Mua *</label>
          <select
            className="form-control"
            value={selectedVarietyCode}
            onChange={(e) => setSelectedVarietyCode(e.target.value)}
          >
            {Object.entries(settings.variety_prices).map(([code, price]) => (
              <option key={code} value={code}>
                Giống lúa {code} (Đơn giá: {price.toLocaleString()} đ/kg)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Mức Trừ Bì (%) Mặc định *</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number"
              step="0.1"
              className="form-control"
              value={tarePercent}
              onChange={(e) => setTarePercent(parseFloat(e.target.value) || 0)}
              style={{ width: 100 }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>% Độ ẩm/Tạp chất</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px 16px' }}>
        <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileText size={16} color="#0b6bbf" /> BẢNG NHẬP MÃ CÂN LÚA CHI TIẾT (CHO PHÉP SỬA MÃ CÂN NHẬP NHẦM)
          </span>
          <button className="misa-btn-cmd primary" onClick={handleAddRow}>
            <Plus size={14} /> Thêm mã cân mới
          </button>
        </div>

        <table className="datagrid">
          <thead>
            <tr>
              <th style={{ width: 50, textAlign: 'center' }}>STT</th>
              <th>Thời gian</th>
              <th style={{ width: 120 }}>Số bao cân</th>
              <th>Kg Tươi (Tổng mã)</th>
              <th>Trừ bì {tarePercent}% (kg)</th>
              <th>Kg Khô (Thực tính)</th>
              <th>Đơn giá (đ/kg)</th>
              <th>Thành tiền (VNĐ)</th>
              <th style={{ width: 120, textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isEditing = editingRowId === row.id;

              return (
                <tr key={row.id}>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{index + 1}</td>
                  <td>{row.time}</td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editBagCount}
                        onChange={(e) => setEditBagCount(parseInt(e.target.value) || 0)}
                        style={{ width: 80, textAlign: 'center', fontWeight: 700 }}
                      />
                    ) : (
                      <strong>{row.bag_count} bao</strong>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editFreshKg}
                        onChange={(e) => setEditFreshKg(parseFloat(e.target.value) || 0)}
                        style={{ width: 110, fontWeight: 700, color: '#0284c7' }}
                      />
                    ) : (
                      <strong style={{ color: '#0284c7' }}>{row.fresh_kg.toLocaleString()} kg</strong>
                    )}
                  </td>

                  <td style={{ color: '#64748b' }}>
                    {isEditing
                      ? ((editFreshKg * tarePercent) / 100).toFixed(1)
                      : row.tare_kg.toFixed(1)} kg
                  </td>

                  <td>
                    <strong style={{ color: '#059669' }}>
                      {isEditing
                        ? Math.max(0, editFreshKg - (editFreshKg * tarePercent) / 100).toFixed(1)
                        : row.dry_kg.toFixed(1)} kg
                    </strong>
                  </td>

                  <td>{unitPrice.toLocaleString()} đ</td>

                  <td>
                    <strong style={{ color: '#d97706' }}>
                      {isEditing
                        ? (Math.max(0, editFreshKg - (editFreshKg * tarePercent) / 100) * unitPrice).toLocaleString()
                        : row.subtotal.toLocaleString()} đ
                    </strong>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button
                          className="misa-btn-cmd success"
                          style={{ padding: '2px 6px', fontSize: 11 }}
                          onClick={() => handleSaveEditRow(row.id)}
                          title="Lưu chỉnh sửa"
                        >
                          <Check size={12} /> Lưu
                        </button>
                        <button
                          className="misa-btn-cmd"
                          style={{ padding: '2px 6px', fontSize: 11 }}
                          onClick={() => setEditingRowId(null)}
                          title="Hủy"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          style={{ background: 'none', border: 'none', color: '#0b6bbf', cursor: 'pointer' }}
                          onClick={() => handleStartEditRow(row)}
                          title="Chỉnh sửa mã cân nhập nhầm"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          onClick={() => handleDeleteRow(row.id)}
                          title="Xóa mã cân"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        backgroundColor: '#ecfdf5',
        borderTop: '2px solid #10b981',
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <span style={{ fontSize: 12, color: '#047857' }}>TỔNG CỘNG PHIÊN CÂN:</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#065f46' }}>
            {totalBags.toLocaleString()} bao | {totalFreshKg.toLocaleString()} kg Tươi | Trừ bì ({tarePercent}%): {totalTareKg.toFixed(1)} kg
          </div>
        </div>

        <div>
          <span style={{ fontSize: 12, color: '#047857' }}>SẢN LƯỢNG KHÔ THỰC TÍNH:</span>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0284c7' }}>
            {totalDryKg.toFixed(1)} kg Khô
          </div>
        </div>

        <div>
          <span style={{ fontSize: 12, color: '#047857' }}>TỔNG THÀNH TIỀN PHẢI THANH TOÁN:</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706' }}>
            {totalAmount.toLocaleString()} VNĐ
          </div>
        </div>
      </div>

      {showZaloModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <span className="modal-title">📱 KẾT XUẤT NỘI DUNG GỬI QUA ZALO</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowZaloModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                Nội dung tin nhắn đã được định dạng chuẩn sẵn sàng copy gửi qua Zalo Web/App:
              </p>
              <textarea
                style={{
                  width: '100%',
                  height: 220,
                  padding: 12,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  backgroundColor: '#f8fafc'
                }}
                readOnly
                value={getZaloText()}
              />
            </div>
            <div className="modal-footer">
              <button className="misa-btn-cmd primary" onClick={handleCopyZalo}>
                {copiedZalo ? <><Check size={14} /> Đã sao chép!</> : <><Copy size={14} /> Sao chép tin nhắn Zalo</>}
              </button>
              <button className="misa-btn-cmd" onClick={() => setShowZaloModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {showTicketModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">🖨️ XEM TRƯỚC PHIẾU CÂN NHIỆT (TICKET)</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowTicketModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="ticket-preview">
                <div className="ticket-header">
                  <strong>HTX NÔNG NGHIỆP RICEOS</strong><br />
                  CẦU CÂN AN TRẠCH - HÒA TIẾN<br />
                  Hotline: 1900 2812
                </div>
                <div>PHIẾU CÂN LÚA TƯƠI #{Math.floor(100000 + Math.random() * 900000)}</div>
                <div>Ngày: {new Date().toLocaleDateString('vi-VN')}</div>
                <div>Chủ lúa: {currentFarmer.name}</div>
                <div>Xứ đồng: {currentFarmer.field_name} - {currentFarmer.plot_no}</div>
                <div>Giống lúa: {selectedVarietyCode}</div>
                <hr style={{ borderTop: '1px dashed black', margin: '6px 0' }} />
                <div>Tổng số bao: {totalBags} bao</div>
                <div>Kg Tươi: {totalFreshKg.toLocaleString()} kg</div>
                <div>Kg Trừ bì ({tarePercent}%): {totalTareKg.toFixed(1)} kg</div>
                <div><strong>KG KHÔ THỰC TÍNH: {totalDryKg.toFixed(1)} KG</strong></div>
                <div>Đơn giá: {unitPrice.toLocaleString()} đ/kg</div>
                <hr style={{ borderTop: '1px dashed black', margin: '6px 0' }} />
                <div><strong style={{ fontSize: 14 }}>THÀNH TIỀN: {totalAmount.toLocaleString()} Đ</strong></div>
                <div style={{ marginTop: 12, textAlign: 'center' }}>Cán bộ cân ký: {currentUser.full_name}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="misa-btn-cmd primary" onClick={() => window.print()}>
                <Printer size={14} /> In Hóa Đơn Ngay
              </button>
              <button className="misa-btn-cmd" onClick={() => setShowTicketModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
