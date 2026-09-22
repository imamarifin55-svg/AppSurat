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
      
      {/* Card 1: Surat Masuk (Kotak Warna Hijau) */}
      <div 
        id="stat-card-masuk"
        onClick={() => onFilterChange('MASUK')}
        className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm ${
          activeFilter === 'MASUK'
            ? 'bg-emerald-600 text-white ring-4 ring-emerald-300/80 shadow-lg scale-[1.02]'
            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Surat Masuk</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-sans">{suratMasukCount}</span>
              <span className="text-xs font-medium text-emerald-100">berkas</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-100 font-medium">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            {pendingDisposisi} belum telaah
          </span>
          <span className="text-emerald-100 group-hover:text-white flex items-center text-[11px] font-semibold transition-colors">
            Lihat <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 2: Surat Keluar (Kotak Warna Orange) */}
      <div 
        id="stat-card-keluar"
        onClick={() => onFilterChange('KELUAR')}
        className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm ${
          activeFilter === 'KELUAR'
            ? 'bg-orange-500 text-white ring-4 ring-orange-300/80 shadow-lg scale-[1.02]'
            : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-orange-100 uppercase tracking-wider">Surat Keluar</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-sans">{suratKeluarCount}</span>
              <span className="text-xs font-medium text-orange-100">surat resmi</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-orange-100 font-medium">
            <FileCheck className="w-3.5 h-3.5 text-orange-200" />
            Tercatat di register
          </span>
          <span className="text-orange-100 group-hover:text-white flex items-center text-[11px] font-semibold transition-colors">
            Lihat <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 3: Perlu Disposisi (Kotak Warna Biru Telur Bebek) */}
      <div 
        id="stat-card-perlu-disposisi"
        onClick={() => onFilterChange('PERLU_DISPOSISI')}
        className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm ${
          activeFilter === 'PERLU_DISPOSISI'
            ? 'bg-[#38a8b8] text-white ring-4 ring-cyan-200/90 shadow-lg scale-[1.02]'
            : 'bg-[#38a8b8] text-white hover:bg-[#3097a5] hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#e1f7f9] uppercase tracking-wider">Perlu Disposisi</span>
              {pendingDisposisi > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-sans">{pendingDisposisi}</span>
              <span className="text-xs font-medium text-[#e1f7f9]">tenggat kepala sekolah</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <span className="text-[#e1f7f9] font-medium">
            {pendingDisposisi > 0 ? 'Menunggu telaah' : 'Semua sudah diproses'}
          </span>
          <span className="text-[#e1f7f9] group-hover:text-white flex items-center text-[11px] font-semibold transition-colors">
            Proses <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 4: Sifat Penting / Prioritas (Kotak Warna Pink) */}
      <div 
        id="stat-card-urgent"
        onClick={() => onFilterChange('URGENT')}
        className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm ${
          activeFilter === 'URGENT'
            ? 'bg-pink-500 text-white ring-4 ring-pink-200/90 shadow-lg scale-[1.02]'
            : 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-pink-100 uppercase tracking-wider">Prioritas / Penting</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-sans">{urgentCount}</span>
              <span className="text-xs font-medium text-pink-100">segera ditindak</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
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
