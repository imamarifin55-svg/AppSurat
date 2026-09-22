import React from 'react';
import { IdentitasSekolah } from '../types';
import { 
  Menu, 
  Search, 
  Mail, 
  Send, 
  Printer, 
  Download, 
  BookOpen, 
  Settings,
  Award,
  Bell,
  Cloud,
  CheckCircle2
} from 'lucide-react';

interface TopNavbarProps {
  sekolah: IdentitasSekolah;
  isCloudConnected?: boolean;
  isSyncing?: boolean;
  onOpenMobileMenu: () => void;
  onOpenAddModal: (tipe: 'MASUK' | 'KELUAR') => void;
  onOpenSettings: () => void;
  onOpenKlasifikasi: () => void;
  onExportCsv: () => void;
  onPrintAgenda: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  sekolah,
  isCloudConnected = true,
  isSyncing = false,
  onOpenMobileMenu,
  onOpenAddModal,
  onOpenSettings,
  onOpenKlasifikasi,
  onExportCsv,
  onPrintAgenda
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left section: Hamburger (mobile) & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Buka menu samping"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  {sekolah.namaSekolah}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  NPSN: {sekolah.npsn}
                </span>
                {sekolah.akreditasi && (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Award className="w-3 h-3 text-emerald-600" />
                    Akreditasi {sekolah.akreditasi}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Buku Agenda Surat & Tata Usaha • {sekolah.alamat}, Kec. {sekolah.kecamatan}, {sekolah.kabupatenKota}
              </p>
            </div>
          </div>

          {/* Right section: Quick actions & Cloud Sync */}
          <div className="flex items-center gap-2">

            {/* Cloud Sync Status Indicator */}
            <div 
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                isCloudConnected 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={
                isCloudConnected 
                  ? "Database Cloud Aktif: Surat otomatis tersinkron ke semua komputer & perangkat secara real-time" 
                  : "Mode Offline / Tersimpan Lokal"
              }
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                isCloudConnected 
                  ? (isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500') 
                  : 'bg-amber-500'
              }`}></span>
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">{isSyncing ? 'Menyinkronkan...' : 'Cloud Aktif'}</span>
            </div>
            
            {/* Quick action buttons for desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => onOpenAddModal('MASUK')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>+ Surat Masuk</span>
              </button>

              <button
                onClick={() => onOpenAddModal('KELUAR')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>+ Surat Keluar</span>
              </button>
            </div>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <button
              onClick={onPrintAgenda}
              title="Cetak format Buku Register Agenda fisik"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onExportCsv}
              title="Ekspor seluruh data ke Excel / CSV"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              title="Pengaturan Profil Sekolah & Pejabat"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
