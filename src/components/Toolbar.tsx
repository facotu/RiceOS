import React from 'react';
import { NavTabId } from './Sidebar';
import { ChevronRight, Plus, Share2, Printer, RefreshCw, Home, MapPin, Scale, Receipt, Truck, History, LineChart, Camera, Sliders } from 'lucide-react';

interface ToolbarProps {
  activeTab: NavTabId;
  onQuickAdd: () => void;
  onExportZalo: () => void;
  onPrintReport: () => void;
  onRefreshData: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTab,
  onQuickAdd,
  onExportZalo,
  onPrintReport,
  onRefreshData
}) => {
  const getTabBreadcrumb = (tab: NavTabId) => {
    switch (tab) {
      case 'dashboard':
        return {
          module: 'Tổng Quan',
          page: 'Dashboard Chỉ Số & AVA AI Insights',
          icon: <Home size={13} color="#0b6bbf" />
        };
      case 'fieldmap':
        return {
          module: 'Vùng Trồng GIS',
          page: 'Bản Đồ Vệ Tinh Google Maps & Hộ Sản Xuất Theo Lô',
          icon: <MapPin size={13} color="#10b981" />
        };
      case 'weighing':
        return {
          module: 'Thu Mua Lúa',
          page: 'Phiên Cân Lúa Tươi Thực Địa (Scale Session)',
          icon: <Scale size={13} color="#10b981" />
        };
      case 'settlement':
        return {
          module: 'Tài Chính',
          page: 'Quyết Toán Tiền Lúa Hộ Dân',
          icon: <Receipt size={13} color="#d97706" />
        };
      case 'vehicles':
        return {
          module: 'Vận Tải & Logistics',
          page: 'Quản Lý Xe Nhận & Tải Trọng Cầu Cân',
          icon: <Truck size={13} color="#0284c7" />
        };
      case 'history':
        return {
          module: 'Tra Cứu',
          page: 'Lịch Sử Phiên Cân Đa Tiêu Chí',
          icon: <History size={13} color="#0b6bbf" />
        };
      case 'reports':
        return {
          module: 'Báo Cáo Thống Kê',
          page: 'Phân Tích Sản Lượng & Doanh Thu Thu Mua',
          icon: <LineChart size={13} color="#059669" />
        };
      case 'aicamera':
        return {
          module: 'Công Nghệ AI',
          page: 'AI Camera Đếm Bao & OCR Biển Số Xe',
          icon: <Camera size={13} color="#8b5cf6" />
        };
      case 'settings':
        return {
          module: 'Hệ Thống',
          page: 'Cài Đặt Đơn Giá, Trừ Bì & Danh Mục Xứ Đồng / Lô',
          icon: <Sliders size={13} color="#64748b" />
        };
      default:
        return {
          module: 'Nghiệp Vụ',
          page: 'RiceOS Enterprise ERP',
          icon: <Home size={13} color="#0b6bbf" />
        };
    }
  };

  const breadcrumb = getTabBreadcrumb(activeTab);

  return (
    <div className="misa-toolbar">
      {/* Modern Capsule Breadcrumb Navigation */}
      <div className="misa-breadcrumb" style={{ gap: 8 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          color: '#0369a1',
          padding: '3px 10px',
          borderRadius: 16,
          fontSize: 11,
          fontWeight: 700
        }}>
          <span>🌾 RiceOS Enterprise</span>
        </div>

        <ChevronRight size={14} color="#94a3b8" />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#047857',
          padding: '3px 10px',
          borderRadius: 16,
          fontSize: 11,
          fontWeight: 700
        }}>
          {breadcrumb.icon}
          <span>{breadcrumb.module}</span>
        </div>

        <ChevronRight size={14} color="#94a3b8" />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#0e1e25',
          color: '#ffffff',
          padding: '4px 12px',
          borderRadius: 16,
          fontSize: 11,
          fontWeight: 700,
          boxShadow: '0 2px 6px rgba(14, 30, 37, 0.25)'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f39c12', display: 'inline-block' }} />
          <span>{breadcrumb.page}</span>
        </div>
      </div>

      {/* Action Command Group */}
      <div className="misa-command-group">
        <button className="misa-btn-cmd primary" onClick={onQuickAdd}>
          <Plus size={14} /> Thêm phiên cân
        </button>
        <button className="misa-btn-cmd success" onClick={onExportZalo}>
          <Share2 size={14} /> Kết xuất Zalo
        </button>
        <button className="misa-btn-cmd" onClick={onPrintReport}>
          <Printer size={14} /> In báo cáo
        </button>
        <button className="misa-btn-cmd" onClick={onRefreshData}>
          <RefreshCw size={14} /> Nạp lại
        </button>
      </div>
    </div>
  );
};
