import React, { useState } from 'react';
import { SystemSettings } from '../types';
import { Sliders, Save, Check } from 'lucide-react';

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
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePriceChange = (code: string, value: number) => {
    setPrices({ ...prices, [code]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemSettings = {
      tare_formula: tareFormula,
      default_tare_percent: tarePercent,
      default_tare_fixed_kg: tareFixedKg,
      variety_prices: prices
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
          <span>CÀI ĐẶT HỆ THỐNG - ĐƠN GIÁ GIỐNG LÚA & ĐỊNH MỨC TRỪ BÌ</span>
        </div>
        <button className="misa-btn-cmd primary" onClick={handleSave}>
          <Save size={14} /> Lưu cài đặt hệ thống
        </button>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '10px 16px', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Check size={16} /> Đã lưu thành công cấu hình đơn giá và định mức trừ bì hệ thống!
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
            <option value="percent">Trừ theo % Độ ẩm/Tạp chất (Mặc định được Anh chọn)</option>
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
    </div>
  );
};
