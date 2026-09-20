import React from 'react';
import { SuratItem } from '../types';
import { Mail, Send, AlertTriangle, FileCheck, Clock } from 'lucide-react';

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      
      {/* Card 1: Surat Masuk */}
      <div 
        onClick={() => onFilterChange('MASUK')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          activeFilter === 'MASUK'
            ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/20'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Surat Masuk</span>
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{suratMasukCount}</span>
          <span className="text-xs text-slate-500">berkas</span>
        </div>
        <div className="mt-2 text-xs font-medium flex items-center gap-1.5 text-red-600">
          <Clock className="w-3.5 h-3.5 text-red-500" />
          <span>{pendingDisposisi} belum didisposisi</span>
        </div>
      </div>

      {/* Card 2: Surat Keluar */}
      <div 
        onClick={() => onFilterChange('KELUAR')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          activeFilter === 'KELUAR'
            ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Surat Keluar</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{suratKeluarCount}</span>
          <span className="text-xs text-slate-500">surat resmi</span>
        </div>
        <div className="mt-2 text-xs font-medium flex items-center gap-1.5 text-emerald-700">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Tercatat & terbit di buku register</span>
        </div>
      </div>

      {/* Card 3: Pending Disposisi (Kotak Peringatan Warna Merah) */}
      <div 
        onClick={() => onFilterChange('PERLU_DISPOSISI')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          activeFilter === 'PERLU_DISPOSISI'
            ? 'bg-red-50 border-red-500 ring-2 ring-red-400/30'
            : 'bg-red-50/50 border-red-200 hover:border-red-300 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Perlu Disposisi</span>
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-red-700">{pendingDisposisi}</span>
          <span className="text-xs text-red-600 font-medium">perlu telaah KS</span>
        </div>
        <div className="mt-2 text-xs font-semibold text-red-600">
          Peringatan: Klik untuk proses disposisi
        </div>
      </div>

      {/* Card 4: Sifat Penting / Sangat Segera (Kotak Peringatan Warna Merah) */}
      <div 
        onClick={() => onFilterChange('URGENT')}
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          activeFilter === 'URGENT'
            ? 'bg-red-50 border-red-500 ring-2 ring-red-400/30'
            : 'bg-red-50/40 border-red-200 hover:border-red-300 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Prioritas / Penting</span>
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-red-700">{urgentCount}</span>
          <span className="text-xs text-red-600 font-medium">surat mendesak</span>
        </div>
        <div className="mt-2 text-xs font-semibold text-red-600">
          Peringatan: Sifat Penting & Sangat Segera
        </div>
      </div>

    </div>
  );
};
