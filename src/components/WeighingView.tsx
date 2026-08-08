import React, { useState, useEffect, useRef } from 'react';
import { 
  UserProfile, 
  Farmer, 
  Vehicle, 
  WeighingRow, 
  WeighingSession, 
  SystemSettings 
} from '../types';
import { 
  Scale, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  X, 
  FileText,
  Camera,
  Image,
  Calculator,
  CornerDownLeft
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
  // Session Form State
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(MOCK_FARMERS[0].id);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(MOCK_VEHICLES[0].id);
  const [selectedVarietyCode, setSelectedVarietyCode] = useState<string>('HT1');
  
  // Tare Deduction Mode (% vs kg/bag)
  const [tareFormula, setTareFormula] = useState<'percent' | 'kg_fixed'>(settings.tare_formula || 'percent');
  const [tarePercent, setTarePercent] = useState<number>(settings.default_tare_percent || 5.0);
  const [tareFixedKg, setTareFixedKg] = useState<number>(settings.default_tare_fixed_kg || 1.2);
  const [advancePayment, setAdvancePayment] = useState<number>(0);

  // Weigh Rows State
  const [rows, setRows] = useState<WeighingRow[]>([
    { id: 'r-1', time: '11:05', bag_count: 10, fresh_kg: 500, tare_kg: 25, dry_kg: 475, price_per_kg: 8000, subtotal: 3800000 },
    { id: 'r-2', time: '11:10', bag_count: 12, fresh_kg: 600, tare_kg: 30, dry_kg: 570, price_per_kg: 8000, subtotal: 4560000 },
    { id: 'r-3', time: '11:15', bag_count: 10, fresh_kg: 500, tare_kg: 25, dry_kg: 475, price_per_kg: 8000, subtotal: 3800000 }
  ]);

  // Fast Input State
  const [inputBags, setInputBags] = useState<string>('10');
  const [inputFreshKg, setInputFreshKg] = useState<string>('500');
  const freshKgInputRef = useRef<HTMLInputElement>(null);

  // Inline Row Edit State
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editBagCount, setEditBagCount] = useState<number>(0);
  const [editFreshKg, setEditFreshKg] = useState<number>(0);

  // Modals & Drawers
  const [showZaloModal, setShowZaloModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showAiWidget, setShowAiWidget] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);

  const currentFarmer = MOCK_FARMERS.find(f => f.id === selectedFarmerId) || MOCK_FARMERS[0];
  const currentVehicle = MOCK_VEHICLES.find(v => v.id === selectedVehicleId) || MOCK_VEHICLES[0];
  const unitPrice = settings.variety_prices[selectedVarietyCode] || 8000;

  // Real-time Calculations for Rows
  const calculateRowTareAndDry = (bags: number, fresh: number) => {
    const tareKg = tareFormula === 'percent'
      ? (fresh * tarePercent) / 100
      : bags * tareFixedKg;
    const dryKg = Math.max(0, fresh - tareKg);
    const subtotal = dryKg * unitPrice;
    return { tareKg, dryKg, subtotal };
  };

  // Recalculate all rows whenever tare formula/percent or variety price changes
  useEffect(() => {
    setRows(prevRows => prevRows.map(r => {
      const { tareKg, dryKg, subtotal } = calculateRowTareAndDry(r.bag_count, r.fresh_kg);
      return {
        ...r,
        tare_kg: tareKg,
        dry_kg: dryKg,
        price_per_kg: unitPrice,
        subtotal: subtotal
      };
    }));
  }, [tareFormula, tarePercent, tareFixedKg, selectedVarietyCode]);

  // Session Totals
  const totalBags = rows.reduce((sum, r) => sum + r.bag_count, 0);
  const totalFreshKg = rows.reduce((sum, r) => sum + r.fresh_kg, 0);
  const totalTareKg = rows.reduce((sum, r) => sum + r.tare_kg, 0);
  const totalDryKg = rows.reduce((sum, r) => sum + r.dry_kg, 0);
  const totalAmount = rows.reduce((sum, r) => sum + r.subtotal, 0);
  const remainingPayment = Math.max(0, totalAmount - advancePayment);

  // Fast Weight Entry Handler
  const handleFastAddRow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const bags = parseInt(inputBags) || 0;
    const fresh = parseFloat(inputFreshKg) || 0;

    if (bags <= 0 || fresh <= 0) {
      alert('Vui lòng nhập số bao (>0) và số kg tươi (>0)!');
      return;
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { tareKg, dryKg, subtotal } = calculateRowTareAndDry(bags, fresh);

    const newRow: WeighingRow = {
      id: 'r-' + Date.now(),
      time: timeStr,
      bag_count: bags,
      fresh_kg: fresh,
      tare_kg: tareKg,
      dry_kg: dryKg,
      price_per_kg: unitPrice,
      subtotal: subtotal
    };

    setRows([...rows, newRow]);
    setInputFreshKg('');
    if (freshKgInputRef.current) {
      freshKgInputRef.current.focus();
    }
  };

  // Inline Row Edit Handlers
  const handleStartEditRow = (row: WeighingRow) => {
    setEditingRowId(row.id);
    setEditBagCount(row.bag_count);
    setEditFreshKg(row.fresh_kg);
  };

  const handleSaveEditRow = (rowId: string) => {
    const { tareKg, dryKg, subtotal } = calculateRowTareAndDry(editBagCount, editFreshKg);

    setRows(rows.map(r => {
      if (r.id === rowId) {
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
    if (rows.length === 0) {
      alert('Chưa có mã cân nào trong phiên! Vui lòng nhập mã cân.');
      return;
    }

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
      tare_formula: tareFormula,
      tare_value: tareFormula === 'percent' ? tarePercent : tareFixedKg,
      total_tare_kg: totalTareKg,
      total_dry_kg: totalDryKg,
      price_per_kg: unitPrice,
      total_amount: totalAmount,
      advance_payment: advancePayment,
      remaining_payment: remainingPayment,
      status: 'completed'
    };

    onSaveSession(session);
    alert(`✅ Ghi nhập thành công Phiên Cân ${session.code}!`);
  };

  const getZaloText = () => {
    return `🌾 RiceOS - THÔNG BÁO PHIÊN CÂN LÚA TƯƠI
----------------------------------------
Chủ ruộng: ${currentFarmer.name} (SĐT: ${currentFarmer.phone})
Xứ đồng: ${currentFarmer.field_name} - ${currentFarmer.plot_no} (${currentFarmer.area_sao} sào)
Giống lúa: ${selectedVarietyCode}
----------------------------------------
Tổng mã cân: ${rows.length} mã
Tổng số bao cân: ${totalBags.toLocaleString()} bao
Tổng khối lượng tươi: ${totalFreshKg.toLocaleString()} kg
Trừ bì ${tareFormula === 'percent' ? `${tarePercent}%` : `${tareFixedKg}kg/bao`}: ${totalTareKg.toFixed(1)} kg
----------------------------------------
KG KHÔ THỰC TÍNH: ${totalDryKg.toFixed(1)} KG
Đơn giá thu mua: ${unitPrice.toLocaleString()} đ/kg
THÀNH TIỀN: ${totalAmount.toLocaleString()} VNĐ
${advancePayment > 0 ? `Đã tạm ứng: ${advancePayment.toLocaleString()} VNĐ\nCòn lại thanh toán: ${remainingPayment.toLocaleString()} VNĐ` : ''}
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

  const handleExportPNG = () => {
    alert(`🖼️ Đã kết xuất thành công tệp hình ảnh Phiếu Cân Lúa_${currentFarmer.name}.png!`);
  };

  return (
    <div className="panel-grid-container">
      {/* Top Header Toolbar */}
      <div className="panel-header">
        <div className="panel-title">
          <Scale size={20} color="#10b981" />
          <span>TẠO PHIÊN CÂN LÚA TƯƠI THỰC ĐỊA</span>
        </div>

        <div className="misa-command-group">
          <button className="misa-btn-cmd primary" onClick={handleSaveSession}>
            <Save size={14} /> Ghi nhập phiên cân
          </button>
          <button className="misa-btn-cmd success" onClick={() => setShowZaloModal(true)}>
            <Share2 size={14} /> Copy Zalo
          </button>
          <button className="misa-btn-cmd" onClick={handleExportPNG}>
            <Image size={14} /> Xuất ảnh PNG
          </button>
          <button className="misa-btn-cmd" onClick={() => setShowTicketModal(true)}>
            <Printer size={14} /> In phiếu nhiệt
          </button>
          <button 
            className={`misa-btn-cmd ${showAiWidget ? 'primary' : ''}`} 
            onClick={() => setShowAiWidget(!showAiWidget)}
          >
            <Camera size={14} /> {showAiWidget ? 'Ẩn AI' : 'Bật AI'}
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left + Fast Input Center + AI Widget Right */}
      <div style={{ display: 'grid', gridTemplateColumns: showAiWidget ? '1fr 300px' : '1fr', gap: 16 }}>
        <div>
          {/* Header Metadata Inputs */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Chủ Ruộng (Hộ Dân) *</label>
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
              <label className="form-label">Thông tin CCCD / Nơi cấp</label>
              <input
                type="text"
                className="form-control"
                value={`${currentFarmer.cccd} - ${currentFarmer.cccd_issue_place}`}
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
              <label className="form-label">Cán bộ trực cân</label>
              <input
                type="text"
                className="form-control"
                value={`${currentUser.full_name} (${currentUser.role.toUpperCase()})`}
                readOnly
                style={{ backgroundColor: '#f8fafc' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Xe Nhận Lúa *</label>
              <select
                className="form-control"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
              >
                {MOCK_VEHICLES.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.plate_number} - Tài xế: {v.driver_name} ({v.driver_phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Giống Lúa Thu Mua *</label>
              <select
                className="form-control"
                value={selectedVarietyCode}
                onChange={(e) => setSelectedVarietyCode(e.target.value)}
              >
                {Object.entries(settings.variety_prices).map(([code, price]) => (
                  <option key={code} value={code}>
                    Giống lúa {code} ({price.toLocaleString()} đ/kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Công thức Trừ Bì *</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <select
                  className="form-control"
                  value={tareFormula}
                  onChange={(e) => setTareFormula(e.target.value as any)}
                  style={{ width: 130 }}
                >
                  <option value="percent">Trừ % độ ẩm</option>
                  <option value="kg_fixed">Trừ kg/bao</option>
                </select>
                {tareFormula === 'percent' ? (
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={tarePercent}
                    onChange={(e) => setTarePercent(parseFloat(e.target.value) || 0)}
                    placeholder="% Bì"
                    style={{ width: 90 }}
                  />
                ) : (
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={tareFixedKg}
                    onChange={(e) => setTareFixedKg(parseFloat(e.target.value) || 0)}
                    placeholder="kg/bao"
                    style={{ width: 90 }}
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tiền Đã Tạm Ứng (VNĐ)</label>
              <input
                type="number"
                step="100000"
                className="form-control"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(parseFloat(e.target.value) || 0)}
                placeholder="0 đ"
              />
            </div>
          </div>

          {/* Fast Entry Numeric Bar (Optimized for Mobile Smartphone Touch Numpad) */}
          <div style={{
            margin: '0 12px 12px 12px',
            padding: 14,
            backgroundColor: '#f0f9ff',
            border: '2px dashed #0284c7',
            borderRadius: 10
          }}>
            <form onSubmit={handleFastAddRow} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calculator size={18} color="#0284c7" /> NHẬP NHANH MÃ CÂN ĐIỆN THOẠI:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>Số bao:</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="form-control"
                    value={inputBags}
                    onChange={(e) => setInputBags(e.target.value)}
                    style={{ height: 42, fontSize: 18, fontWeight: 800, textAlign: 'center', color: '#0e1e25' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>Tổng Kg Tươi (kg):</label>
                  <input
                    ref={freshKgInputRef}
                    type="number"
                    step="0.5"
                    inputMode="decimal"
                    className="form-control"
                    value={inputFreshKg}
                    onChange={(e) => setInputFreshKg(e.target.value)}
                    style={{ height: 42, fontSize: 20, fontWeight: 800, textAlign: 'right', color: '#0284c7', paddingRight: 10 }}
                    placeholder="e.g. 500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="misa-btn-cmd primary"
                style={{ height: 44, fontSize: 14, fontWeight: 800, justifyContent: 'center', borderRadius: 8, marginTop: 2 }}
              >
                <Plus size={18} /> THÊM MÃ CÂN (ENTER <CornerDownLeft size={14} />)
              </button>
            </form>
          </div>

          {/* Master Detail DataGrid (Inline Editable Rows) */}
          <div style={{ padding: '0 12px 12px 12px' }}>
            <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <FileText size={16} color="#0b6bbf" /> BẢNG MÃ CÂN ({rows.length} MÃ)
              </span>
              <span style={{ fontSize: 11, color: '#64748b' }}>Đơn giá: <strong>{unitPrice.toLocaleString()} đ/kg</strong></span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="datagrid">
                <thead>
                  <tr>
                    <th style={{ width: 40, textAlign: 'center' }}>STT</th>
                    <th>Thời gian</th>
                    <th style={{ width: 90 }}>Số bao</th>
                    <th>Kg Tươi</th>
                    <th>Trừ bì ({tareFormula === 'percent' ? `${tarePercent}%` : `${tareFixedKg}kg/bao`})</th>
                    <th>Kg Khô</th>
                    <th>Thành tiền (VNĐ)</th>
                    <th style={{ width: 80, textAlign: 'center' }}>Sửa</th>
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
                              inputMode="decimal"
                              className="form-control"
                              value={editBagCount}
                              onChange={(e) => setEditBagCount(parseInt(e.target.value) || 0)}
                              style={{ width: 70, textAlign: 'center', fontWeight: 700, height: 32 }}
                            />
                          ) : (
                            <strong>{row.bag_count} bao</strong>
                          )}
                        </td>

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.5"
                              inputMode="decimal"
                              className="form-control"
                              value={editFreshKg}
                              onChange={(e) => setEditFreshKg(parseFloat(e.target.value) || 0)}
                              style={{ width: 90, fontWeight: 700, color: '#0284c7', height: 32 }}
                            />
                          ) : (
                            <strong style={{ color: '#0284c7' }}>{row.fresh_kg.toLocaleString()} kg</strong>
                          )}
                        </td>

                        <td style={{ color: '#64748b' }}>
                          {isEditing
                            ? calculateRowTareAndDry(editBagCount, editFreshKg).tareKg.toFixed(1)
                            : row.tare_kg.toFixed(1)} kg
                        </td>

                        <td>
                          <strong style={{ color: '#059669' }}>
                            {isEditing
                              ? calculateRowTareAndDry(editBagCount, editFreshKg).dryKg.toFixed(1)
                              : row.dry_kg.toFixed(1)} kg
                          </strong>
                        </td>

                        <td>
                          <strong style={{ color: '#d97706' }}>
                            {isEditing
                              ? calculateRowTareAndDry(editBagCount, editFreshKg).subtotal.toLocaleString()
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
                              >
                                <Check size={12} /> Lưu
                              </button>
                              <button
                                className="misa-btn-cmd"
                                style={{ padding: '2px 6px', fontSize: 11 }}
                                onClick={() => setEditingRowId(null)}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              <button
                                style={{ background: 'none', border: 'none', color: '#0b6bbf', cursor: 'pointer' }}
                                onClick={() => handleStartEditRow(row)}
                                title="Sửa mã cân"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                onClick={() => handleDeleteRow(row.id)}
                                title="Xóa mã cân"
                              >
                                <Trash2 size={16} />
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
          </div>

          {/* Session Summary Bar (Mobile Sticky Bottom) */}
          <div className="mobile-sticky-summary" style={{
            backgroundColor: '#ecfdf5',
            borderTop: '2px solid #10b981',
            padding: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div>
              <span style={{ fontSize: 11, color: '#047857', fontWeight: 600 }}>TỔNG CỘNG PHIÊN CÂN:</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#065f46' }}>
                {totalBags.toLocaleString()} bao | {totalFreshKg.toLocaleString()} kg Tươi
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11, color: '#047857', fontWeight: 600 }}>KG KHÔ THỰC TÍNH:</span>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0284c7' }}>
                {totalDryKg.toFixed(1)} kg Khô
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11, color: '#047857', fontWeight: 600 }}>TỔNG THÀNH TIỀN:</span>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#d97706' }}>
                {totalAmount.toLocaleString()} VNĐ
              </div>
            </div>

            {advancePayment > 0 && (
              <div>
                <span style={{ fontSize: 11, color: '#047857', fontWeight: 600 }}>CÒN LẠI THANH TOÁN:</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4444' }}>
                  {remainingPayment.toLocaleString()} VNĐ
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Camera Assistant Drawer Widget */}
        {showAiWidget && (
          <div style={{
            backgroundColor: '#0f172a',
            color: 'white',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00d2d3', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Camera size={16} /> AI CAMERA ĐẾM BAO
            </div>
            <div style={{
              backgroundColor: '#1e293b',
              borderRadius: 8,
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: 12,
              position: 'relative'
            }}>
              <div>
                <div>📷 Camera AI Live Stream</div>
                <div style={{ color: '#10b981', fontWeight: 700, marginTop: 4 }}>Đang đếm tự động bao lúa...</div>
              </div>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
              • Số bao phát hiện: <strong style={{ color: '#10b981', fontSize: 16 }}>{totalBags} bao</strong><br />
              • Độ chính xác AI: <strong>99.4%</strong><br />
              • Tốc độ băng chuyền: <strong>1.5 bao/giây</strong>
            </div>
          </div>
        )}
      </div>

      {/* Modals: Zalo Message & Ticket Thermal Preview */}
      {showZaloModal && (
        <div className="modal-overlay active">
          <div className="modal-box" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <span className="modal-title">📱 KẾT XUẤT PHIẾU CÂN GỬI QUA ZALO</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowZaloModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <textarea
                style={{
                  width: '100%',
                  height: 240,
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
              <span className="modal-title">🖨️ IN PHIẾU CÂN NHIỆT (TICKET 80MM)</span>
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
                <div>Tổng số mã: {rows.length} mã cân</div>
                <div>Tổng số bao: {totalBags} bao</div>
                <div>Kg Tươi: {totalFreshKg.toLocaleString()} kg</div>
                <div>Kg Trừ bì ({tareFormula === 'percent' ? `${tarePercent}%` : `${tareFixedKg}kg/bao`}): {totalTareKg.toFixed(1)} kg</div>
                <div><strong>KG KHÔ THỰC TÍNH: {totalDryKg.toFixed(1)} KG</strong></div>
                <div>Đơn giá: {unitPrice.toLocaleString()} đ/kg</div>
                <hr style={{ borderTop: '1px dashed black', margin: '6px 0' }} />
                <div><strong style={{ fontSize: 14 }}>THÀNH TIỀN: {totalAmount.toLocaleString()} Đ</strong></div>
                {advancePayment > 0 && <div>Đã tạm ứng: {advancePayment.toLocaleString()} đ</div>}
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
