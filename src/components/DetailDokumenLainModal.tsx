import React, { useState } from 'react';
import { DokumenLainItem, IdentitasSekolah } from '../types';
import {
  X,
  FileText,
  Calendar,
  Layers,
  BookOpen,
  FolderArchive,
  User,
  MapPin,
  Download,
  Edit,
  Trash2,
  Printer,
  Eye,
  CheckCircle2,
  Tag,
  Clock,
  FileSpreadsheet,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { DocumentFileViewer } from './DocumentFileViewer';
import { getFileTypeInfo, formatFileSize, triggerFileDownload } from '../utils/fileHelpers';

interface DetailDokumenLainModalProps {
  item: DokumenLainItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: DokumenLainItem) => void;
  onDelete: (id: string) => void;
  sekolah: IdentitasSekolah;
}

export const DetailDokumenLainModal: React.FC<DetailDokumenLainModalProps> = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  sekolah
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'file'>('info');

  if (!isOpen || !item) return null;

  const fileInfo = item.fileData ? getFileTypeInfo(item.fileName, item.fileType, item.fileData) : null;

  const handleDownloadFile = () => {
    if (!item.fileData) return;
    triggerFileDownload(item.fileData, item.fileName || `Dokumen_${item.nomorDokumen.replace(/[^a-zA-Z0-9]/g, '_')}`);
  };

  const handlePrintLembarIndeks = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-600/50 border border-blue-400/40 flex items-center justify-center text-white shrink-0">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-700 text-blue-100 font-bold">
                  {item.nomorDokumen}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                  {item.kategori}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold leading-tight truncate mt-1" title={item.judul}>
                {item.judul}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Detail Info vs Berkas File) */}
        {item.fileData && (
          <div className="flex items-center border-b border-slate-200 px-5 bg-slate-50/80 shrink-0">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Rincian Dokumen & Lokasi Fisik
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'file'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Berkas</span>
              {fileInfo && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${fileInfo.badgeBg} ${fileInfo.badgeText} border ${fileInfo.badgeBorder} font-bold`}>
                  {fileInfo.shortLabel}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'file' && item.fileData ? (
            <div className="h-[65vh] rounded-xl overflow-hidden border border-slate-200">
              <DocumentFileViewer
                fileData={item.fileData}
                fileName={item.fileName || item.judul}
                fileType={item.fileType}
              />
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Highlight Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-slate-50 border border-blue-100">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Nama Dokumen / Arsip
                </div>
                <div className="text-base font-bold text-slate-900 leading-snug">
                  {item.judul}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  {item.mataPelajaran && (
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-800 font-semibold shadow-xs flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      {item.mataPelajaran}
                    </span>
                  )}
                  {item.tingkatKelas && (
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-xs flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      {item.tingkatKelas}
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium shadow-xs flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    TP {item.tahunAjaran} ({item.semester})
                  </span>
                </div>
              </div>

              {/* Grid 2 Kolom Informasi Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Kolom Kiri */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    Klasifikasi & Penyusun
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500">Nomor / Kode Arsip:</div>
                    <div className="font-mono font-bold text-slate-800">{item.nomorDokumen}</div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500">Kategori Dokumen:</div>
                    <div className="font-semibold text-slate-800">{item.kategori}</div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500">Penyusun / Penanggung Jawab:</div>
                    <div className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      {item.penyusun}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500">Tanggal Pembuatan Dokumen:</div>
                    <div className="font-semibold text-slate-800">
                      {new Date(item.tanggalDokumen).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Penyimpanan & Lampiran
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500">Lokasi Arsip Fisik:</div>
                    <div className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 mt-1 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item.lokasiFisik || 'Belum dicatat / Arsip Digital'}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500">Berkas Lampiran Digital:</div>
                    {item.fileData && fileInfo ? (
                      <div className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className={`w-8 h-8 rounded-lg ${fileInfo.iconBg} ${fileInfo.iconColor} flex items-center justify-center shrink-0 border border-slate-200`}>
                            {fileInfo.category === 'pdf' && <FileText className="w-4 h-4" />}
                            {fileInfo.category === 'image' && <ImageIcon className="w-4 h-4" />}
                            {fileInfo.category === 'word' && <FileText className="w-4 h-4" />}
                            {fileInfo.category === 'excel' && <FileSpreadsheet className="w-4 h-4" />}
                            {fileInfo.category === 'powerpoint' && <FileCode className="w-4 h-4" />}
                            {fileInfo.category === 'text' && <FileCode className="w-4 h-4" />}
                            {fileInfo.category === 'archive' && <FileArchive className="w-4 h-4" />}
                            {fileInfo.category === 'other' && <File className="w-4 h-4" />}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-800 truncate text-[11px]" title={item.fileName}>
                              {item.fileName || 'Berkas Dokumen'}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className={`px-1.5 py-0.2 rounded font-semibold ${fileInfo.badgeBg} ${fileInfo.badgeText} border ${fileInfo.badgeBorder}`}>
                                {fileInfo.shortLabel}
                              </span>
                              <span>{fileInfo.label}</span>
                              {item.fileSize && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-slate-600">{formatFileSize(item.fileSize)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setActiveTab('file')}
                            className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-100/80 hover:bg-blue-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            title="Buka Pratinjau Berkas"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Pratinjau</span>
                          </button>
                          <button
                            onClick={handleDownloadFile}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            title="Unduh Berkas"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic mt-0.5 text-xs">Tidak ada berkas digital terlampir</div>
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500">Dicatat di Sistem:</div>
                    <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(item.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Keterangan Tambahan */}
              {item.keterangan && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Keterangan & Catatan
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {item.keterangan}
                  </p>
                </div>
              )}

              {/* Lembaga / Sekolah Info */}
              <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{sekolah.namaSekolah}</span> — Tata Usaha & Urusan Kurikulum
                </div>
                <div className="text-slate-500 font-mono">
                  NPSN: {sekolah.npsn}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Data</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(item.id);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {item.fileData && (
              <button
                onClick={handleDownloadFile}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
