// Reusable Master Data list layout component
// File: src/features/master-data/components/MasterDataList.tsx

import React from "react";

interface Column {
  header: string;
  accessor: string;
  render?: (row: any) => React.ReactNode;
}

interface MasterDataListProps {
  title: string;
  data: any[];
  columns: Column[];
  isLoading?: boolean;
}

export default function MasterDataList({
  title,
  data,
  columns,
  isLoading = false
}: MasterDataListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden">
      {/* HEADER DANH MỤC */}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h3>
        <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
          Tổng số: {data.length}
        </span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-gray-400 font-medium animate-pulse">
          Đang nạp dữ liệu danh mục hệ thống...
        </div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-400 font-semibold">
          Danh mục hiện đang trống. Vui lòng thêm mới.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {columns.map((col, idx) => (
                  <th key={idx} className="py-3 px-6">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
              {data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50/30">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3.5 px-6">
                      {col.render ? col.render(row) : row[col.accessor] || "--"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
