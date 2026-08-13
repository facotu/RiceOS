'use client';

import React, { useState, useMemo } from 'react';
import { Farmer } from '@/types/database.types';
import {
  Search,
  X,
  MapPin,
  Users,
  Wheat,
  CheckCircle2,
  Filter,
  User,
  Phone,
  FileText
} from 'lucide-react';

interface FarmerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmers: Farmer[];
  selectedFarmerId: string;
  onSelectFarmer: (farmer: Farmer) => void;
}

export default function FarmerPickerModal({
  isOpen,
  onClose,
  farmers,
  selectedFarmerId,
  onSelectFarmer
}: FarmerPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Unique Field Regions (Xứ đồng)
  const regions = useMemo(() => {
    const set = new Set(farmers.map(f => f.field_region));
    return Array.from(set).sort();
  }, [farmers]);

  // Counts per region
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { all: farmers.length };
    farmers.forEach(f => {
      counts[f.field_region] = (counts[f.field_region] || 0) + 1;
    });
    return counts;
  }, [farmers]);

  // Filtered farmers
  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const matchSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.phone.includes(searchQuery) ||
        (f.landowner_name && f.landowner_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.cccd && f.cccd.includes(searchQuery)) ||
        f.field_region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.lot.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRegion = selectedRegionFilter === 'all' || f.field_region === selectedRegionFilter;

      return matchSearch && matchRegion;
    });
  }, [farmers, searchQuery, selectedRegionFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage) || 1;
  const paginatedFarmers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFarmers.slice(start, start + itemsPerPage);
  }, [filteredFarmers, currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0b132b] border border-emerald-700/60 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/50 flex justify-between items-center bg-brand-dark/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-gold-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0b132b] rounded-[9px] flex items-center justify-center">
                <Users className="w-5 h-5 text-gold-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Chọn Hộ Sản Xuất / Thửa Đất
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {filteredFarmers.length} kết quả
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Tìm kiếm theo Tên hộ, SĐT, CCCD, Xứ đồng hoặc Lô ruộng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-950 text-slate-400 hover:text-white hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="p-4 bg-emerald-950/40 border-b border-emerald-800/40 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Gõ tên hộ sản xuất (ví dụ: Hồ Thị Vân, Nguyễn Hồng, 0905...)"
              className="w-full pl-10 pr-4 py-2.5 bg-[#0b132b] border border-emerald-700/60 rounded-xl text-white text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Region Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => { setSelectedRegionFilter('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all ${
                selectedRegionFilter === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-[#0b132b] text-slate-400 border-emerald-900 hover:text-white'
              }`}
            >
              Tất cả Xứ Đồng ({regionCounts.all || 0})
            </button>
            {regions.map(reg => (
              <button
                key={reg}
                onClick={() => { setSelectedRegionFilter(reg); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all ${
                  selectedRegionFilter === reg
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-[#0b132b] text-slate-400 border-emerald-900 hover:text-white'
                }`}
              >
                {reg} ({regionCounts[reg] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {paginatedFarmers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">Không tìm thấy Hộ sản xuất nào phù hợp từ khóa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paginatedFarmers.map(f => {
                const isSelected = f.id === selectedFarmerId;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFarmer(f);
                      onClose();
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400'
                        : 'bg-emerald-950/50 border-emerald-900/80 text-slate-200 hover:bg-emerald-900/60 hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-gold-300 group-hover:text-gold-200">
                            {f.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                        {f.landowner_name && (
                          <p className="text-[11px] text-slate-400 font-normal">
                            Chủ đất: <strong className="text-slate-300">{f.landowner_name}</strong>
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                        {f.area.toLocaleString('vi-VN')} m²
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-sky-300 font-medium">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        {f.field_region} - <strong className="text-gold-300">{f.lot}</strong>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        <Phone className="w-3 h-3" /> {f.phone}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Pagination */}
        {totalPages > 1 && (
          <div className="p-3 bg-brand-dark/95 border-t border-emerald-800/50 flex justify-between items-center text-xs">
            <span className="text-slate-400 text-[11px]">
              Hiển thị <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredFarmers.length)}</strong> trên <strong>{filteredFarmers.length}</strong> thửa
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800 disabled:opacity-40 hover:bg-emerald-900 text-slate-200 font-bold"
              >
                Trước
              </button>
              <span className="font-bold text-gold-300 font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800 disabled:opacity-40 hover:bg-emerald-900 text-slate-200 font-bold"
              >
                Sau
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
