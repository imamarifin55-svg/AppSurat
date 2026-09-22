import React from 'react';
import { SuratItem } from '../types';
import { Mail, Send, AlertTriangle, FileCheck, Clock, ArrowUpRight } from 'lucide-react';

interface StatSummaryProps {
  items: SuratItem[];
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

export const StatSummary: React.FC<StatSummaryProps> = ({
  items,
  onFilterChange,
  activeFilter
}) => {
  const suratMasukCount = items.filter((s) => s.tipe === 'MASUK').length;
  const suratKeluarCount = items.filter((s) => s.tipe === 'KELUAR').length;
  
  const pendingDisposisi = items.filter(
    (s) => s.tipe === 'MASUK' && s.status === 'Menunggu Disposisi'
  ).length;

  const urgentCount = items.filter(
    (s) => s.sifat === 'Sangat Segera' || s.sifat === 'Penting'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: Surat Masuk (Kotak Gradasi Hijau Lembut) */}
      <div 
        id="stat-card-masuk"
        onClick={() => onFilterChange('MASUK')}
        className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-emerald-400/25 overflow-hidden ${
          activeFilter === 'MASUK'
            ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white ring-4 ring-emerald-300/80 shadow-lg scale-[1.02]'
            : 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Surat Masuk</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-sans">{suratMasukCount}</span>
              <span className="text-xs font-medium text-emerald-100/90">berkas</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
          <span className="inline-flex items-center gap-1.5 text-emerald-100 font-medium">
            <span className="w-2 h-2 rounded-full bg-white shadow-xs"></span>
            {pendingDisposisi} belum telaah
          </span>
          <span className="text-emerald-100 group-hover:text-white flex items-center text-[11px] font-semibold transition-colors">
            Lihat <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 2: Surat Keluar (Kotak Gradasi Orange Lembut) */}
      <div 
        id="stat-card-keluar"
        onClick={() => onFilterChange('KELUAR')}
        className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-orange-300/30 overflow-hidden ${
          activeFilter === 'KELUAR'
            ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 text-white ring-4 ring-orange-300/80 shadow-lg scale-[1.02]'
            : 'bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-xs font-semibold text-orange-100 uppercase tracking-wider">Surat Keluar</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-sans">{suratKeluarCount}</span>
              <span className="text-xs font-medium text-orange-100/90">surat resmi</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
          <span className="inline-flex items-center gap-1.5 text-orange-100 font-medium">
            <FileCheck className="w-3.5 h-3.5 text-orange-200" />
            Tercatat di register
          </span>
          <span className="text-orange-100 group-hover:text-white flex items-center text-[11px] font-semibold transition-colors">
            Lihat <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 3: Perlu Disposisi (Kotak Gradasi Biru Telur Bebek Lembut) */}
      <div 
        id="stat-card-perlu-disposisi"
        onClick={() => onFilterChange('PERLU_DISPOSISI')}
        className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-cyan-300/30 overflow-hidden ${
          activeFilter === 'PERLU_DISPOSISI'
            ? 'bg-gradient-to-br from-[#4db5c4] via-[#38a8b8] to-[#248896] text-white ring-4 ring-cyan-200/90 shadow-lg scale-[1.02]'
            : 'bg-gradient-to-br from-[#4db5c4] via-[#38a8b8] to-[#248896] text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#e1f7f9] uppercase tracking-wider">Perlu Disposisi</span>
              {pendingDisposisi > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-xs"></span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-sans">{pendingDisposisi}</span>
              <span className="text-xs font-medium text-[#e1f7f9]/90">tenggat kepala sekolah</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
          <span className="text-[#e1f7f9] font-medium">
            {pendingDisposisi > 0 ? 'Menunggu telaah' : 'Semua sudah diproses'}
          </span>
          <span className="text-[#e1f7f9] group-hover:text-white flex items-center text-[11px] font-semibold transition-colors">
            Proses <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 4: Sifat Penting / Prioritas (Kotak Gradasi Pink Lembut) */}
      <div 
        id="stat-card-urgent"
        onClick={() => onFilterChange('URGENT')}
        className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-pink-300/30 overflow-hidden ${
          activeFilter === 'URGENT'
            ? 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white ring-4 ring-pink-200/90 shadow-lg scale-[1.02]'
            : 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-xs font-semibold text-pink-100 uppercase tracking-wider">Prioritas / Penting</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-sans">{urgentCount}</span>
              <span className="text-xs font-medium text-pink-100/90">segera ditindak</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
          <span className="text-pink-100 font-medium">
            Sifat Segera & Penting
          </span>
          <span className="text-pink-100 group-hover:text-white flex items-center text-[11px] font-semibold transition-colors">
            Filter <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

    </div>
  );
};
