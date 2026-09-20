import React from 'react';
import { IdentitasSekolah } from '../types';
import { 
  Building2, 
  Mail, 
  Send, 
  BookOpen, 
  Settings, 
  Download, 
  Plus, 
  Printer, 
  CheckCircle2 
} from 'lucide-react';

interface HeaderProps {
  sekolah: IdentitasSekolah;
  onOpenAddModal: (tipe: 'MASUK' | 'KELUAR') => void;
  onOpenSettings: () => void;
  onOpenKlasifikasi: () => void;
  onExportCsv: () => void;
  onPrintAgenda: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sekolah,
  onOpenAddModal,
  onOpenSettings,
  onOpenKlasifikasi,
  onExportCsv,
  onPrintAgenda
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & School Details */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-blue-700 flex items-center justify-center shadow-xs shrink-0 overflow-hidden p-1">
              {sekolah.logoSekolah ? (
                <img 
                  src={sekolah.logoSekolah} 
                  alt={sekolah.namaSekolah} 
                  className="w-full h-full object-contain" 
                />
              ) : sekolah.logoPemda ? (
                <img 
                  src={sekolah.logoPemda} 
                  alt="Pemda" 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <Building2 className="w-6 h-6 text-blue-700" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  {sekolah.namaSekolah}
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  NPSN: {sekolah.npsn}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Buku Agenda & Disposisi Persuratan Tata Usaha</span>
                <span>•</span>
                <span className="text-slate-600 font-medium">{sekolah.kabupatenKota}, {sekolah.provinsi}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-tambah-surat-masuk"
              onClick={() => onOpenAddModal('MASUK')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>+ Surat Masuk</span>
            </button>

            <button
              id="btn-tambah-surat-keluar"
              onClick={() => onOpenAddModal('KELUAR')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>+ Surat Keluar</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <button
              id="btn-print-buku-agenda"
              onClick={onPrintAgenda}
              title="Cetak format Buku Agenda cetak fisik"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Cetak Agenda</span>
            </button>

            <a
              id="btn-unduh-html"
              href="/agenda-surat-sekolah-singlefile.html"
              download="index.html"
              title="Unduh aplikasi lengkap dalam 1 berkas index.html (Bisa dibuka offline tanpa internet)"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-indigo-200"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Unduh index.html</span>
            </a>

            <button
              id="btn-ekspor-excel"
              onClick={onExportCsv}
              title="Unduh seluruh data ke CSV / Excel"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ekspor Excel</span>
            </button>

            <button
              id="btn-klasifikasi-ref"
              onClick={onOpenKlasifikasi}
              title="Daftar Kode Klasifikasi Surat Sekolah"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Kode Surat</span>
            </button>

            <button
              id="btn-pengaturan-sekolah"
              onClick={onOpenSettings}
              title="Ubah Profil Sekolah & Kepala Sekolah"
              className="inline-flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
