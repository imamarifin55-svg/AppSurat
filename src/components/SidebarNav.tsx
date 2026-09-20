import React from 'react';
import { IdentitasSekolah } from '../types';
import { 
  Building2, 
  Mail, 
  Send, 
  BookOpen, 
  Settings, 
  Download, 
  Printer, 
  FileText,
  Clock,
  AlertTriangle,
  Award,
  MapPin,
  X,
  UserCheck
} from 'lucide-react';

interface SidebarNavProps {
  sekolah: IdentitasSekolah;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: (tipe: 'MASUK' | 'KELUAR') => void;
  onOpenSettings: () => void;
  onOpenKlasifikasi: () => void;
  onExportCsv: () => void;
  onPrintAgenda: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  itemsCount: {
    all: number;
    masuk: number;
    keluar: number;
    pendingDisposisi: number;
    urgent: number;
    suratIzin?: number;
  };
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  sekolah,
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenSettings,
  onOpenKlasifikasi,
  onExportCsv,
  onPrintAgenda,
  isMobileOpen,
  setIsMobileOpen,
  itemsCount
}) => {
  const navItems = [
    {
      id: 'ALL',
      label: 'Semua Agenda',
      icon: FileText,
      count: itemsCount.all
    },
    {
      id: 'MASUK',
      label: 'Surat Masuk',
      icon: Mail,
      count: itemsCount.masuk
    },
    {
      id: 'KELUAR',
      label: 'Surat Keluar',
      icon: Send,
      count: itemsCount.keluar
    },
    {
      id: 'SURAT_IZIN',
      label: 'Catatan Surat Izin',
      icon: UserCheck,
      count: itemsCount.suratIzin ?? 0
    },
    {
      id: 'PERLU_DISPOSISI',
      label: 'Perlu Disposisi',
      icon: Clock,
      count: itemsCount.pendingDisposisi,
      badgeHighlight: itemsCount.pendingDisposisi > 0
    },
    {
      id: 'URGENT',
      label: 'Prioritas / Penting',
      icon: AlertTriangle,
      count: itemsCount.urgent,
      badgeHighlight: itemsCount.urgent > 0
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container: Nuansa Biru Elegan (Navy/Royal Blue #1e3a8a - #1e40af) */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-blue-900 text-white border-r border-blue-800 flex flex-col shadow-xl transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Identitas Sekolah */}
        <div className="p-4 border-b border-blue-800/80 bg-blue-950/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-950/40 shrink-0 font-black text-lg border border-blue-400/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-sm font-black text-white leading-tight truncate" title={sekolah.namaSekolah}>
                  {sekolah.namaSekolah}
                </h1>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-blue-800 text-blue-100 border border-blue-700/80">
                    NPSN {sekolah.npsn}
                  </span>
                  {sekolah.akreditasi && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-0.5">
                      <Award className="w-2.5 h-2.5 inline" />
                      Akreditasi {sekolah.akreditasi}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-2.5 text-[11px] text-blue-200/80 leading-tight flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-300 mt-0.5" />
            <span className="line-clamp-2">
              {sekolah.alamat}, Kec. {sekolah.kecamatan}, {sekolah.kabupatenKota}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons (Primary CTAs) */}
        <div className="p-3.5 border-b border-blue-800/80 bg-blue-950/30 space-y-2">
          <button
            id="btn-sidebar-tambah-masuk"
            onClick={() => {
              onOpenAddModal('MASUK');
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer border border-blue-400/40"
          >
            <Mail className="w-4 h-4" />
            <span>Catat Surat Masuk</span>
          </button>

          <button
            id="btn-sidebar-tambah-keluar"
            onClick={() => {
              onOpenAddModal('KELUAR');
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer border border-emerald-500/40"
          >
            <Send className="w-4 h-4" />
            <span>Buat Surat Keluar</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-blue-300/70 uppercase tracking-wider">
            Menu Utama
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-950/30'
                    : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                  isActive
                    ? 'bg-white text-blue-900 font-bold'
                    : item.badgeHighlight
                    ? 'bg-red-500 text-white font-bold shadow-xs shadow-red-950/40'
                    : 'bg-blue-800 text-blue-200'
                }`}>
                  {item.count}
                </span>
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-1.5 text-[10px] font-bold text-blue-300/70 uppercase tracking-wider">
            Layanan & Administrasi
          </div>

          <button
            onClick={() => {
              onPrintAgenda();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-300" />
            <span>Cetak Buku Register Agenda</span>
          </button>

          <button
            onClick={() => {
              onOpenKlasifikasi();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-300" />
            <span>Katalog Kode Klasifikasi</span>
          </button>

          <button
            onClick={onExportCsv}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-blue-100 hover:bg-blue-800/60 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-300" />
            <span>Ekspor Semua ke Excel/CSV</span>
          </button>

          <a
            href="/agenda-surat-sekolah-singlefile.html"
            download="index.html"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-cyan-200 bg-blue-800/70 hover:bg-blue-700/80 font-medium rounded-xl transition-colors cursor-pointer border border-blue-700/60"
            title="Unduh 1 berkas index.html utuh untuk dijalankan offline di komputer TU"
          >
            <Download className="w-4 h-4 text-cyan-300" />
            <span>Unduh Aplikasi 1 File (.html)</span>
          </a>
        </div>

        {/* Footer Sidebar: Pengaturan Sekolah */}
        <div className="p-3 border-t border-blue-800/80 bg-blue-950/60">
          <button
            id="btn-sidebar-pengaturan"
            onClick={() => {
              onOpenSettings();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-between p-2 hover:bg-blue-800/60 rounded-xl transition-colors text-left cursor-pointer border border-blue-800/50"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-800 text-blue-200 flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  Profil & Pengaturan
                </div>
                <div className="text-[10px] text-blue-300 truncate">
                  {sekolah.namaKepalaSekolah || 'Kepala Sekolah'}
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-800 text-blue-200 font-medium">
              Ubah
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};
