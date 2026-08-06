import React from "react";
import { Scale, Search, Eye } from "lucide-react";

export default function WeighingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách phiếu cân lúa</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và đối soát thông tin cân vỏ/cân tổng của HTX</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm biển số xe, mã phiếu, chủ ruộng..."
            className="w-full h-11 pl-9 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex space-x-3">
          <select className="h-11 px-3 border border-gray-200 rounded-xl text-xs font-semibold bg-white">
            <option>Tất cả giống lúa</option>
            <option>OM18</option>
            <option>Đài Thơm 8</option>
          </select>
          <select className="h-11 px-3 border border-gray-200 rounded-xl text-xs font-semibold bg-white">
            <option>Tất cả trạng thái</option>
            <option>Chờ đổ kho</option>
            <option>Chờ cân vỏ</option>
            <option>Đã quyết toán</option>
          </select>
        </div>
      </div>

      {/* TABLE PLACEHOLDER */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-6">Mã Phiếu</th>
              <th className="py-4 px-6">Biển Số Xe</th>
              <th className="py-4 px-6">Chủ Ruộng</th>
              <th className="py-4 px-6">Giống Lúa</th>
              <th className="py-4 px-6">Cân Tổng (Gross)</th>
              <th className="py-4 px-6">Cân Vỏ (Tare)</th>
              <th className="py-4 px-6">Chất Lượng</th>
              <th className="py-4 px-6">Trạng Thái</th>
              <th className="py-4 px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
            {[
              { id: "PC-20260806-0001", plate: "43C-123.45", farmer: "Nguyễn Văn An", variety: "OM18", gross: "8,900 kg", tare: "3,200 kg", quality: "14.5% ẩm | 1.0% tạp", status: "Chờ quyết toán", statusColor: "bg-amber-100 text-amber-800" },
              { id: "PC-20260806-0002", plate: "92H-567.89", farmer: "Lê Văn Bình", variety: "Đài Thơm 8", gross: "10,500 kg", tare: "4,500 kg", quality: "15.0% ẩm | 1.2% tạp", status: "Đã quyết toán", statusColor: "bg-emerald-100 text-emerald-800" },
              { id: "PC-20260806-0003", plate: "43C-888.88", farmer: "Trần Văn Chính", variety: "OM18", gross: "7,800 kg", tare: "--", quality: "14.0% ẩm | 0.8% tạp", status: "Chờ cân vỏ", statusColor: "bg-blue-100 text-blue-800" }
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50">
                <td className="py-4 px-6 font-bold text-gray-900">{row.id}</td>
                <td className="py-4 px-6">{row.plate}</td>
                <td className="py-4 px-6">{row.farmer}</td>
                <td className="py-4 px-6">{row.variety}</td>
                <td className="py-4 px-6">{row.gross}</td>
                <td className="py-4 px-6">{row.tare}</td>
                <td className="py-4 px-6 text-gray-500">{row.quality}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.statusColor}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="h-8 w-8 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-lg inline-flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
