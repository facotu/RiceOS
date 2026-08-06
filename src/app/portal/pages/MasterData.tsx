// Master Data Management ERP Portal Page with Financial Governance
// File: src/app/portal/pages/MasterData.tsx

import React, { useState } from "react";
import { usePortal } from "../context/PortalContext.tsx";
import useMasterData from "../../../features/master-data/hooks/useMasterData.ts";
import useAccountingGovernance from "../../../features/accounting/hooks/useAccountingGovernance.ts";
import MasterDataList from "../../../features/master-data/components/MasterDataList.tsx";
import MasterDataForm, { FormField } from "../../../features/master-data/components/MasterDataForm.tsx";
import { Users, Sprout, Warehouse, Landmark, BarChart } from "lucide-react";

export default function MasterDataPage() {
  const { user } = usePortal();
  const [activeTab, setActiveTab] = useState<'farmers' | 'varieties' | 'warehouses' | 'accounts' | 'costCenters'>('farmers');
  
  const { 
    farmers, 
    varieties, 
    warehouses, 
    isLoading: isMasterLoading, 
    error: masterError, 
    addFarmer, 
    addVariety, 
    addWarehouse 
  } = useMasterData(user?.organization_id || "org-default");

  const {
    accounts,
    costCenters,
    isLoading: isGovLoading,
    error: govError,
    addAccount,
    addCostCenter
  } = useAccountingGovernance(user?.organization_id || "org-default");

  const isLoading = isMasterLoading || isGovLoading;
  const error = masterError || govError;

  // Định nghĩa Schema Fields cho biểu mẫu động
  const farmerFields: FormField[] = [
    { label: "Họ và tên chủ ruộng", name: "name", type: "text", placeholder: "Ví dụ: Nguyễn Văn An", required: true },
    { label: "Số điện thoại trạm cân", name: "phone", type: "tel", placeholder: "Ví dụ: 0905111222", required: true },
    { label: "Địa chỉ thôn/xã", name: "address", type: "text", placeholder: "Ví dụ: Thôn Lệ Sơn, Hòa Tiến", required: false }
  ];

  const varietyFields: FormField[] = [
    { label: "Tên giống lúa", name: "name", type: "text", placeholder: "Ví dụ: OM18, Đài Thơm 8", required: true },
    { label: "Mô tả chất lượng lúa", name: "description", type: "text", placeholder: "Ví dụ: Thân cứng, năng suất cao", required: false }
  ];

  const warehouseFields: FormField[] = [
    { label: "Tên Silo chứa lúa sấy", name: "name", type: "text", placeholder: "Ví dụ: Silo Sấy C", required: true },
    { label: "Sức chứa tối đa (kg)", name: "capacity", type: "number", placeholder: "Ví dụ: 100000", required: true }
  ];

  const accountFields: FormField[] = [
    { label: "Mã tài khoản kế toán", name: "code", type: "text", placeholder: "Ví dụ: 1561", required: true },
    { label: "Tên gọi tài khoản", name: "name", type: "text", placeholder: "Ví dụ: Hàng hóa lúa gạo", required: true },
    { label: "Loại tài khoản (asset/liability/equity/revenue/expense)", name: "type", type: "text", placeholder: "asset", required: true }
  ];

  const costCenterFields: FormField[] = [
    { label: "Mã trung tâm chi phí", name: "code", type: "text", placeholder: "Ví dụ: CC-DRY-B", required: true },
    { label: "Tên trung tâm", name: "name", type: "text", placeholder: "Ví dụ: Trạm sấy lò hấp B", required: true },
    { label: "Ghi chú theo dõi", name: "desc", type: "text", placeholder: "Theo dõi lò sấy lúa ướt B", required: false }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Danh mục hệ thống (Master Data)</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý cơ sở dữ liệu nền tảng nông nghiệp & cấu hình tài khoản kế toán quản trị</p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* TABS CHỌN DANH MỤC */}
      <div className="grid grid-cols-5 gap-2 bg-gray-100 p-1.5 rounded-2xl max-w-4xl">
        <button
          onClick={() => setActiveTab('farmers')}
          className={`h-11 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1 transition ${activeTab === 'farmers' ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">NÔNG DÂN ({farmers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('varieties')}
          className={`h-11 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1 transition ${activeTab === 'varieties' ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GIỐNG LÚA ({varieties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('warehouses')}
          className={`h-11 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1 transition ${activeTab === 'warehouses' ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}
        >
          <Warehouse className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">KHO SILO ({warehouses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          className={`h-11 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1 transition ${activeTab === 'accounts' ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">HỆ TK ({accounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('costCenters')}
          className={`h-11 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1 transition ${activeTab === 'costCenters' ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}
        >
          <BarChart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">TRẠM CC ({costCenters.length})</span>
        </button>
      </div>

      {/* CORE WORKSPACE: LIST & FORM SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* TRÁI: TABLE HIỂN THỊ */}
        <div className="lg:col-span-2">
          {activeTab === 'farmers' && (
            <MasterDataList
              title="Danh sách chủ ruộng & nông dân liên kết"
              data={farmers}
              isLoading={isLoading}
              columns={[
                { header: "Họ và tên", accessor: "full_name" },
                { header: "Số điện thoại", accessor: "phone_number" },
                { header: "Địa chỉ", accessor: "address" },
                {
                  header: "Trạng thái",
                  accessor: "is_active",
                  render: (row) => (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      Hoạt động
                    </span>
                  )
                }
              ]}
            />
          )}

          {activeTab === 'varieties' && (
            <MasterDataList
              title="Danh mục các giống lúa thu mua"
              data={varieties}
              isLoading={isLoading}
              columns={[
                { header: "Tên giống lúa", accessor: "name" },
                { header: "Mô tả chất lượng", accessor: "description" }
              ]}
            />
          )}

          {activeTab === 'warehouses' && (
            <MasterDataList
              title="Danh sách trạm kho & Silo sấy lúa"
              data={warehouses}
              isLoading={isLoading}
              columns={[
                { header: "Tên Silo", accessor: "name" },
                {
                  header: "Sức chứa sấy",
                  accessor: "capacity_kg",
                  render: (row) => `${(row.capacity_kg / 1000).toFixed(1)} Tấn`
                },
                {
                  header: "Tồn kho thực tế",
                  accessor: "current_stock_kg",
                  render: (row) => `${(row.current_stock_kg / 1000).toFixed(1)} Tấn`
                }
              ]}
            />
          )}

          {activeTab === 'accounts' && (
            <MasterDataList
              title="Hệ thống tài khoản chuẩn VAS"
              data={accounts}
              isLoading={isLoading}
              columns={[
                { header: "Mã TK", accessor: "code" },
                { header: "Tên tài khoản kế toán", accessor: "name" },
                { header: "Loại tài khoản", accessor: "type" }
              ]}
            />
          )}

          {activeTab === 'costCenters' && (
            <MasterDataList
              title="Danh sách Trung tâm chi phí lò sấy lúa"
              data={costCenters}
              isLoading={isLoading}
              columns={[
                { header: "Mã trạm chi phí", accessor: "code" },
                { header: "Tên trung tâm theo dõi", accessor: "name" },
                { header: "Ghi chú lò sấy", accessor: "description" }
              ]}
            />
          )}
        </div>

        {/* PHẢI: FORM THÊM MỚI DANH MỤC */}
        <div>
          {activeTab === 'farmers' && (
            <MasterDataForm
              title="Thêm nông dân mới"
              fields={farmerFields}
              onSubmit={async (vals) => addFarmer(vals.name, vals.phone, vals.address)}
            />
          )}

          {activeTab === 'varieties' && (
            <MasterDataForm
              title="Thêm giống lúa mới"
              fields={varietyFields}
              onSubmit={async (vals) => addVariety(vals.name, vals.description)}
            />
          )}

          {activeTab === 'warehouses' && (
            <MasterDataForm
              title="Thêm Silo sấy mới"
              fields={warehouseFields}
              onSubmit={async (vals) => addWarehouse(vals.name, parseFloat(vals.capacity))}
            />
          )}

          {activeTab === 'accounts' && (
            <MasterDataForm
              title="Thêm tài khoản kế toán mới"
              fields={accountFields}
              onSubmit={async (vals) => addAccount(vals.code, vals.name, vals.type)}
            />
          )}

          {activeTab === 'costCenters' && (
            <MasterDataForm
              title="Thêm trung tâm chi phí mới"
              fields={costCenterFields}
              onSubmit={async (vals) => addCostCenter(vals.code, vals.name, vals.desc)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
