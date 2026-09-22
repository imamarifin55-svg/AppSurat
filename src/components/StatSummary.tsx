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
      
      {/* Card 1: Surat Masuk */}
      <div 
        id="stat-card-masuk"
        onClick={() => onFilterChange('MASUK')}
        className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
          activeFilter === 'MASUK'
            ? 'bg-gradient-to-br from-white via-sky-50/50 to-blue-50/70 border-sky-300 shadow-md ring-2 ring-sky-400/20'
            : 'bg-white/90 hover:bg-white border-slate-200/80 hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Surat Masuk</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800 tracking-tight font-sans">{suratMasukCount}</span>
              <span className="text-xs font-medium text-slate-400">berkas</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            {pendingDisposisi} belum telaah
          </span>
          <span className="text-slate-400 group-hover:text-sky-600 flex items-center text-[11px] font-medium transition-colors">
            Lihat <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 2: Surat Keluar */}
      <div 
        id="stat-card-keluar"
        onClick={() => onFilterChange('KELUAR')}
        className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
          activeFilter === 'KELUAR'
            ? 'bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/70 border-emerald-300 shadow-md ring-2 ring-emerald-400/20'
            : 'bg-white/90 hover:bg-white border-slate-200/80 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Surat Keluar</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800 tracking-tight font-sans">{suratKeluarCount}</span>
              <span className="text-xs font-medium text-slate-400">surat resmi</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
            <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
            Tercatat di register
          </span>
          <span className="text-slate-400 group-hover:text-emerald-600 flex items-center text-[11px] font-medium transition-colors">
            Lihat <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 3: Perlu Disposisi (Modern Soft Rose) */}
      <div 
        id="stat-card-perlu-disposisi"
        onClick={() => onFilterChange('PERLU_DISPOSISI')}
        className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
          activeFilter === 'PERLU_DISPOSISI'
            ? 'bg-gradient-to-br from-white via-rose-50/60 to-red-50/70 border-rose-300 shadow-md ring-2 ring-rose-400/20'
            : 'bg-white/90 hover:bg-rose-50/30 border-slate-200/80 hover:border-rose-200 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Perlu Disposisi</span>
              {pendingDisposisi > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800 tracking-tight font-sans">{pendingDisposisi}</span>
              <span className="text-xs font-medium text-rose-600/80">tenggat kepala sekolah</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-rose-600 font-medium">
            {pendingDisposisi > 0 ? 'Menunggu telaah' : 'Semua sudah diproses'}
          </span>
          <span className="text-slate-400 group-hover:text-rose-600 flex items-center text-[11px] font-medium transition-colors">
            Proses <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Card 4: Sifat Penting / Prioritas (Modern Soft Amber) */}
      <div 
        id="stat-card-urgent"
        onClick={() => onFilterChange('URGENT')}
        className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
          activeFilter === 'URGENT'
            ? 'bg-gradient-to-br from-white via-amber-50/60 to-orange-50/70 border-amber-300 shadow-md ring-2 ring-amber-400/20'
            : 'bg-white/90 hover:bg-amber-50/30 border-slate-200/80 hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Prioritas / Penting</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800 tracking-tight font-sans">{urgentCount}</span>
              <span className="text-xs font-medium text-amber-700/80">segera ditindak</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-amber-700 font-medium">
            Sifat Segera & Penting
          </span>
          <span className="text-slate-400 group-hover:text-amber-700 flex items-center text-[11px] font-medium transition-colors">
            Filter <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

    </div>
  );
};
