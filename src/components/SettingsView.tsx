import React, { useState } from 'react';
import { SystemSettings, FieldPlot } from '../types';
import { Sliders, Save, Check, Plus, Trash2, MapPin } from 'lucide-react';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (newSettings: SystemSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings
}) => {
  const [tareFormula, setTareFormula] = useState<'percent' | 'kg_fixed'>(settings.tare_formula);
  const [tarePercent, setTarePercent] = useState(settings.default_tare_percent);
  const [tareFixedKg, setTareFixedKg] = useState(settings.default_tare_fixed_kg);
  const [prices, setPrices] = useState(settings.variety_prices);
  const [fieldsPlots, setFieldsPlots] = useState<FieldPlot[]>(settings.fields_plots || []);

  const [newFieldName, setNewFieldName] = useState('');
  const [newPlotNo, setNewPlotNo] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePriceChange = (code: string, value: number) => {
    setPrices({ ...prices, [code]: value });
  };

  const handleAddFieldPlot = () => {
    if (!newFieldName || !newPlotNo) return;
    const newFP: FieldPlot = {
      id: 'fp-' + Date.now(),
      field_name: newFieldName,
      plot_no: newPlotNo,
      address: `${newFieldName}, Đà Nẵng`,
      lat: 15.9625,
      lng: 108.2045,
      area_total_sao: 10.0,
      main_variety: 'HT1',
      status: 'harvesting'
    };
    setFieldsPlots([...fieldsPlots, newFP]);
    setNewFieldName('');
    setNewPlotNo('');
  };

  const handleDeleteFieldPlot = (id: string) => {
    setFieldsPlots(fieldsPlots.filter(fp => fp.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemSettings = {
      tare_formula: tareFormula,
      default_tare_percent: tarePercent,
      default_tare_fixed_kg: tareFixedKg,
      variety_prices: prices,
      fields_plots: fieldsPlots
    };
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="panel-grid-container">
      <div className="panel-header">
        <div className="panel-title">
          <Sliders size={20} color="#64748b" />
          <span>CÀI ĐẶT HỆ THỐNG - ĐƠN GIÁ, CÔNG THỨC TRỪ BÌ & XỨ ĐỒNG / LÔ</span>
        </div>
        <button className="misa-btn-cmd primary" onClick={handleSave}>
          <Save size={14} /> Lưu cài đặt hệ thống
        </button>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '10px 16px', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Check size={16} /> Đã lưu thành công toàn bộ cài đặt đơn giá, trừ bì % và danh mục xứ đồng / lô!
        </div>
      )}

      <form onSubmit={handleSave} className="form-grid">
        <div className="form-group">
          <label className="form-label">Công thức Trừ Bì Mặc Định *</label>
          <select
            className="form-control"
            value={tareFormula}
            onChange={(e) => setTareFormula(e.target.value as any)}
          >
            <option value="percent">Trừ theo % Độ ẩm/Tạp chất (Mặc định)</option>
            <option value="kg_fixed">Trừ theo Khối lượng cố định/bao (kg/bao)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Mức % Trừ Bì mặc định (%)</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            value={tarePercent}
            onChange={(e) => setTarePercent(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mức Trừ Bì cố định/bao (kg/bao)</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            value={tareFixedKg}
            onChange={(e) => setTareFixedKg(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Đơn giá giống HT1 (đ/kg)</label>
          <input
            type="number"
            className="form-control"
            value={prices['HT1'] || 8000}
            onChange={(e) => handlePriceChange('HT1', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Đơn giá giống HG12 (đ/kg)</label>
          <input
            type="number"
            className="form-control"
            value={prices['HG12'] || 7500}
            onChange={(e) => handlePriceChange('HG12', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Đơn giá giống HG244 (đ/kg)</label>
          <input
            type="number"
            className="form-control"
            value={prices['HG244'] || 7800}
            onChange={(e) => handlePriceChange('HG244', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Đơn giá giống ĐT100 (đ/kg)</label>
          <input
            type="number"
            className="form-control"
            value={prices['ĐT100'] || 8200}
            onChange={(e) => handlePriceChange('ĐT100', parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Đơn giá giống J02 (đ/kg)</label>
          <input
            type="number"
            className="form-control"
            value={prices['J02'] || 8500}
            onChange={(e) => handlePriceChange('J02', parseInt(e.target.value) || 0)}
          />
        </div>
      </form>

      {/* Field & Plot Master Manager */}
      <div style={{ padding: 16, borderTop: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0e1e25', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={16} color="#0b6bbf" /> CÀI ĐẶT DANH MỤC XỨ ĐỒNG & LÔ RUỘNG
        </h4>

        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Tên Xứ đồng..."
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            style={{ width: 200 }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Số Lô..."
            value={newPlotNo}
            onChange={(e) => setNewPlotNo(e.target.value)}
            style={{ width: 140 }}
          />
          <button className="misa-btn-cmd primary" onClick={handleAddFieldPlot}>
            <Plus size={14} /> Thêm Xứ đồng & Lô
          </button>
        </div>

        <table className="datagrid">
          <thead>
            <tr>
              <th>Xứ đồng</th>
              <th>Số Lô</th>
              <th style={{ textAlign: 'center' }}>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {fieldsPlots.map(fp => (
              <tr key={fp.id}>
                <td><strong>{fp.field_name}</strong></td>
                <td>{fp.plot_no}</td>
                <td style={{ textAlign: 'center' }}>
                  <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDeleteFieldPlot(fp.id)}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
