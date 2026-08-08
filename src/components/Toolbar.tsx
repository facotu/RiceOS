import React from 'react';
import { NavTabId } from './Sidebar';
import { ChevronRight, Plus, Share2, Printer, RefreshCw } from 'lucide-react';

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
  const titles: Record<NavTabId, string> = {
    'dashboard': 'Phân hệ Tổng quan Dashboard (MISA AMIS ERP)',
    'weighing': 'Nghiệp vụ Thu mua > Cân Lúa Tươi Thực Địa (Phiên Cân)',
    'settlement': 'Tài chính > Quyết Toán Tiền Lúa Hộ Dân',
    'vehicles': 'Vận tải > Quản lý Xe Nhận & Tải Trọng Cầu Cân',
    'history': 'Tra cứu > Lịch sử Phiên Cân Đa Tiêu Chí',
    'reports': 'Báo cáo > Phân tích Sản lượng & Doanh thu Thu mua',
    'aicamera': 'Công nghệ AI > Module Camera Đếm Bao & OCR Biển Số',
    'settings': 'Hệ thống > Cài đặt Đơn giá & Định mức Trừ bì'
  };

  return (
    <div className="misa-toolbar">
      <div className="misa-breadcrumb">
        <span>RiceOS Enterprise</span>
        <ChevronRight size={14} />
        <strong>{titles[activeTab]}</strong>
      </div>

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
