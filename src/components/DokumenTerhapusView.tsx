import React, { useState, useMemo } from 'react';
import { DokumenTerhapusItem, IdentitasSekolah } from '../types';
import { 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter, 
  FileText, 
  Mail, 
  Send, 
  UserCheck, 
  FolderArchive, 
  Calendar, 
  Clock, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Info,
  ShieldAlert,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { getFileTypeInfo, formatFileSize, triggerFileDownload } from '../utils/fileHelpers';
import { DocumentFileViewer } from './DocumentFileViewer';

interface DokumenTerhapusViewProps {
  items: DokumenTerhapusItem[];
  onRestoreItem: (item: DokumenTerhapusItem) => void;
  onPermanentlyDeleteItem: (id: string) => void;
  onClearAllTrash: () => void;
  sekolah: IdentitasSekolah;
}

export const DokumenTerhapusView: React.FC<DokumenTerhapusViewProps> = ({
  items,
  onRestoreItem,
  onPermanentlyDeleteItem,
  onClearAllTrash,
  sekolah
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SURAT' | 'SURAT_IZIN' | 'DOKUMEN_LAIN'>('ALL');
  
  // State for previewing attached file of a deleted document
  const [previewFileItem, setPreviewFileItem] = useState<DokumenTerhapusItem | null>(null);

  // Confirmation modal states (in-app, avoiding window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isConfirmClearAllOpen, setIsConfirmClearAllOpen] = useState(false);
  const [confirmRestoreItem, setConfirmRestoreItem] = useState<DokumenTerhapusItem | null>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (typeFilter !== 'ALL' && item.tipeItem !== typeFilter) {
        return false;
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        item.judul.toLowerCase().includes(q) ||
        item.nomor.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q) ||
        (item.fileName && item.fileName.toLowerCase().includes(q))
      );
    });
  }, [items, typeFilter, searchTerm]);

  // Counts by type
  const counts = {
    all: items.length,
    surat: items.filter((i) => i.tipeItem === 'SURAT').length,
    suratIzin: items.filter((i) => i.tipeItem === 'SURAT_IZIN').length,
    dokumenLain: items.filter((i) => i.tipeItem === 'DOKUMEN_LAIN').length
  };

  const formatDeletedDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getItemTypeBadge = (tipe: 'SURAT' | 'SURAT_IZIN' | 'DOKUMEN_LAIN') => {
    switch (tipe) {
      case 'SURAT':
        return {
          label: 'Agenda Surat',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Mail
        };
      case 'SURAT_IZIN':
        return {
          label: 'Catatan Izin',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: UserCheck
        };
      case 'DOKUMEN_LAIN':
        return {
          label: 'Arsip Dokumen / Soal',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: FolderArchive
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Explanation */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-slate-100 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Arsip Dokumen Terhapus (Kotak Sampah)
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {items.length} Dokumen Tersimpan
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Setiap data surat atau berkas yang dihapus otomatis diamankan di sini agar tidak hilang permanen. 
                Anda dapat melihat rincian dokumen, memeriksa/mengunduh berkas lampiran, atau <strong>memulihkan (restore)</strong> dokumen kembali ke daftar asalnya dengan satu klik.
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => setIsConfirmClearAllOpen(true)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Sampah</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({counts.all})
            </button>
            <button
              onClick={() => setTypeFilter('SURAT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === 'SURAT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Agenda Surat ({counts.surat})
            </button>
            <button
              onClick={() => setTypeFilter('SURAT_IZIN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === 'SURAT_IZIN'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Surat Izin ({counts.suratIzin})
            </button>
            <button
              onClick={() => setTypeFilter('DOKUMEN_LAIN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === 'DOKUMEN_LAIN'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Dokumen / Soal ({counts.dokumenLain})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari perihal, nomor, kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {items.length === 0 ? 'Kotak Sampah Bersih' : 'Tidak Ada Dokumen yang Cocok'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {items.length === 0 
              ? 'Belum ada dokumen atau surat yang dihapus. Apabila sewaktu-waktu ada data yang dihapus dari aplikasi, arsipnya akan otomatis tersimpan di sini.'
              : 'Tidak ditemukan dokumen terhapus dengan kata kunci pencarian atau filter yang dipilih.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 w-36">Jenis Dokumen</th>
                  <th className="py-3 px-4 w-44">Nomor Dokumen</th>
                  <th className="py-3 px-4">Judul / Perihal</th>
                  <th className="py-3 px-4 w-36">Waktu Dihapus</th>
                  <th className="py-3 px-4 w-40 text-center">Berkas Lampiran</th>
                  <th className="py-3 px-4 w-44 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => {
                  const typeBadge = getItemTypeBadge(item.tipeItem);
                  const TypeIcon = typeBadge.icon;
                  const fileInfo = item.fileData ? getFileTypeInfo(item.fileName, item.fileType, item.fileData) : null;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* No */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>

                      {/* Jenis Dokumen Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${typeBadge.bg}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          <span>{typeBadge.label}</span>
                        </span>
                      </td>

                      {/* Nomor Dokumen */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-800">
                          {item.nomor}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Kategori: {item.kategori}
                        </div>
                      </td>

                      {/* Judul / Perihal */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-snug">
                          {item.judul}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Tgl Dokumen: {item.tanggalDokumen}</span>
                        </div>
                      </td>

                      {/* Waktu Dihapus */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-900">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{formatDeletedDate(item.dihapusPada)}</span>
                        </div>
                      </td>

                      {/* Berkas Lampiran */}
                      <td className="py-3.5 px-4 text-center">
                        {item.fileData && fileInfo ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setPreviewFileItem(item)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 hover:shadow-xs transition-colors cursor-pointer ${fileInfo.badgeBg} ${fileInfo.badgeText} ${fileInfo.badgeBorder}`}
                              title={`Pratinjau ${item.fileName || 'berkas'}`}
                            >
                              <Eye className="w-3 h-3" />
                              <span>{fileInfo.shortLabel}</span>
                            </button>
                            <button
                              onClick={() => triggerFileDownload(item.fileData!, item.fileName || item.judul)}
                              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                              title="Unduh berkas lampiran"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Tanpa berkas
                          </span>
                        )}
                      </td>

                      {/* Aksi: Pulihkan & Hapus Permanen */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setConfirmRestoreItem(item)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Pulihkan dokumen ini kembali ke daftar aktif"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Pulihkan</span>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus permanen dari tempat sampah"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const typeBadge = getItemTypeBadge(item.tipeItem);
              const TypeIcon = typeBadge.icon;
              const fileInfo = item.fileData ? getFileTypeInfo(item.fileName, item.fileType, item.fileData) : null;

              return (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${typeBadge.bg}`}>
                      <TypeIcon className="w-3 h-3" />
                      <span>{typeBadge.label}</span>
                    </span>
                    <span className="text-[10px] text-amber-800 font-medium flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-amber-600" />
                      {formatDeletedDate(item.dihapusPada)}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.judul}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-600 mt-1">
                      {item.nomor}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Kategori: {item.kategori} • Tgl: {item.tanggalDokumen}
                    </div>
                  </div>

                  {/* Attachment info if exists */}
                  {item.fileData && fileInfo && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${fileInfo.badgeBg} ${fileInfo.badgeText}`}>
                          {fileInfo.shortLabel}
                        </span>
                        <span className="text-[11px] text-slate-700 truncate font-medium">
                          {item.fileName || 'Berkas Lampiran'}
                        </span>
                        {item.fileSize && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            ({formatFileSize(item.fileSize)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setPreviewFileItem(item)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => triggerFileDownload(item.fileData!, item.fileName || item.judul)}
                          className="p-1 text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mobile Actions */}
                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      onClick={() => setConfirmRestoreItem(item)}
                      className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Pulihkan Dokumen</span>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Hapus permanen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* MODAL: Pratinjau Berkas Dokumen Terhapus */}
      {previewFileItem && previewFileItem.fileData && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex flex-col p-2 sm:p-4 animate-in fade-in">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  [Dokumen Terhapus] {previewFileItem.fileName || previewFileItem.judul}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">
                  {previewFileItem.nomor} • {previewFileItem.kategori}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => triggerFileDownload(previewFileItem.fileData!, previewFileItem.fileName || previewFileItem.judul)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </button>
              <button
                onClick={() => setPreviewFileItem(null)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>
          </div>

          {/* Viewer Content */}
          <div className="flex-1 bg-slate-900/50 rounded-b-2xl overflow-hidden shadow-2xl">
            <DocumentFileViewer
              fileData={previewFileItem.fileData}
              fileName={previewFileItem.fileName || previewFileItem.judul}
              fileType={previewFileItem.fileType}
            />
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Pulihkan (Restore) */}
      {confirmRestoreItem && (
        <div className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">
              Pulihkan Dokumen ke Daftar Aktif?
            </h3>
            <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800">{confirmRestoreItem.judul}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">{confirmRestoreItem.nomor}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Tipe: {getItemTypeBadge(confirmRestoreItem.tipeItem).label}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Dokumen ini beserta berkas lampirannya akan dikembalikan ke menu asalnya dan siap digunakan kembali.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setConfirmRestoreItem(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onRestoreItem(confirmRestoreItem);
                  setConfirmRestoreItem(null);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Ya, Pulihkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Hapus Permanen Single Item */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">
              Hapus Dokumen Secara Permanen?
            </h3>
            <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed">
              Tindakan ini akan menghapus dokumen dan berkas lampirannya secara permanen dari komputer dan cloud. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onPermanentlyDeleteItem(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Kosongkan Seluruh Tempat Sampah */}
      {isConfirmClearAllOpen && (
        <div className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">
              Kosongkan Seluruh Tempat Sampah?
            </h3>
            <p className="text-xs text-slate-500 mt-2 text-center leading-relaxed">
              Seluruh <strong>{items.length} dokumen</strong> yang ada di tempat sampah ini akan dihapus secara permanen.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setIsConfirmClearAllOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onClearAllTrash();
                  setIsConfirmClearAllOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Ya, Kosongkan Semua
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
