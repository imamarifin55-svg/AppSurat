import React, { useState, useEffect } from 'react';
import { SuratItem, IdentitasSekolah } from '../types';
import { 
  X, 
  Eye, 
  Download, 
  FileText, 
  Calendar, 
  Clock, 
  Tag, 
  Paperclip,
  Printer,
  CheckCircle2,
  Building2,
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { formatTanggalIndo } from '../utils/formatters';
import { DocumentFileViewer, dataUrlToBlob } from './DocumentFileViewer';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SuratItem | null;
  onPrintDisposisi?: (item: SuratItem) => void;
  sekolah?: IdentitasSekolah;
}

type PreviewTab = 'FILE' | 'METADATA' | 'RESMI';

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  item,
  onPrintDisposisi,
  sekolah
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('FILE');

  // Whenever a new item is opened, prioritize viewing the uploaded file if available
  useEffect(() => {
    if (item?.fileData) {
      setActiveTab('FILE');
    } else {
      setActiveTab('METADATA');
    }
  }, [item?.id, item?.fileData, isOpen]);

  if (!isOpen || !item) return null;

  const isMasuk = item.tipe === 'MASUK';
  const hasUploadedFile = !!item.fileData;

  const handleDownloadFile = () => {
    if (!item.fileData) return;
    try {
      const blob = dataUrlToBlob(item.fileData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.lampiranNama || `Berkas-${item.noAgenda}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch {
      const a = document.createElement('a');
      a.href = item.fileData;
      a.download = item.lampiranNama || `Berkas-${item.noAgenda}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Preview Modal */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className={`p-2 rounded-xl text-white shadow-xs shrink-0 ${
              isMasuk ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              <Eye className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isMasuk ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Preview {isMasuk ? 'Surat Masuk' : 'Surat Keluar'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {item.noAgenda}
                </span>
                {hasUploadedFile && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <Paperclip className="w-2.5 h-2.5" /> Berkas Terunggah
                  </span>
                )}
              </div>
              <h2 className="text-xs sm:text-base font-bold text-slate-900 truncate mt-0.5">
                {item.perihal}
              </h2>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {hasUploadedFile && (
              <button
                onClick={handleDownloadFile}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors cursor-pointer"
                title="Unduh Berkas Lampiran"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Unduh Berkas</span>
              </button>
            )}

            {isMasuk && onPrintDisposisi && (
              <button
                onClick={() => onPrintDisposisi(item)}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                title="Cetak Lembar Disposisi"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Disposisi</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Direct & Fast Mobile Access */}
        <div className="px-4 sm:px-5 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('FILE')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'FILE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Berkas Dokumen Lampiran</span>
            {hasUploadedFile && (
              <span className={`w-2 h-2 rounded-full ${activeTab === 'FILE' ? 'bg-white' : 'bg-emerald-500'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('METADATA')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'METADATA'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Rincian & Disposisi</span>
          </button>

          <button
            onClick={() => setActiveTab('RESMI')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'RESMI'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Format Kop Resmi</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          
          {/* TAB 1: Dokumen Berkas Lampiran (UTAMA UNTUK HP / MOBILE) */}
          {activeTab === 'FILE' && (
            <div className="space-y-4">
              {hasUploadedFile ? (
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <span>Dokumen: </span>
                      <strong className="text-blue-700 font-mono">{item.lampiranNama || 'Berkas Terunggah'}</strong>
                    </span>
                    {item.lampiranJumlah && (
                      <span className="text-slate-500">Jumlah: {item.lampiranJumlah}</span>
                    )}
                  </div>

                  {/* Responsive High-Fidelity Document Viewer */}
                  <DocumentFileViewer
                    fileData={item.fileData}
                    fileType={item.fileType}
                    fileName={item.lampiranNama}
                  />

                  {/* Helpful Mobile Instructions */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
                    <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong>Tips Pengguna HP / Mobile:</strong> Anda dapat mencubit layar untuk memperbesar (*pinch to zoom*), memutar dokumen jika posisi miring, atau klik tombol <strong>"Buka di HP"</strong> di sudut kanan atas untuk membuka langsung lewat penampil dokumen bawaan HP Anda.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 sm:p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl max-w-lg mx-auto">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Paperclip className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Belum Ada Berkas File Terunggah</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                    Surat ini tercatat sebagai arsip fisik di <strong>{item.lokasiArsipFisik || 'Ordner Tata Usaha'}</strong>. Anda dapat mengunggah file foto atau PDF sewaktu-waktu melalui tombol <em>Edit Surat</em>.
                  </p>
                  <button
                    onClick={() => setActiveTab('METADATA')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Lihat Rincian & Lembar Disposisi</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Metadata & Rincian Surat */}
          {activeTab === 'METADATA' && (
            <div className="space-y-4">
              {/* Metadata Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Nomor Resmi Surat:</span>
                  <span className="font-mono font-bold text-slate-900 break-words">{item.noSurat}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">
                    {isMasuk ? 'Asal Pengirim:' : 'Tujuan Surat:'}
                  </span>
                  <span className="font-bold text-slate-900">{isMasuk ? item.pengirim : item.tujuan}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Tanggal Surat:</span>
                  <span className="font-medium text-slate-800">{formatTanggalIndo(item.tanggalSurat, true)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">
                    {isMasuk ? 'Tanggal Diterima:' : 'Tanggal Terbit:'}
                  </span>
                  <span className="font-medium text-slate-800">{formatTanggalIndo(item.tanggalTerimaOrKirim, true)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Klasifikasi:</span>
                  <span className="font-semibold text-slate-800">{item.kodeKlasifikasi} ({item.kategori})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Sifat Surat:</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.sifat === 'Sangat Segera' || item.sifat === 'Penting'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-200 text-slate-800'
                  }`}>
                    {item.sifat}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Status Surat:</span>
                  <span className="font-semibold text-slate-800">{item.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Lokasi Arsip Fisik:</span>
                  <span className="font-medium text-slate-800">{item.lokasiArsipFisik || 'Lemari Arsip TU'}</span>
                </div>
              </div>

              {/* Ringkasan Pokok Surat */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Ringkasan / Uraian Pokok Surat</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                  {item.ringkasan || 'Tidak ada uraian ringkasan terlampir.'}
                </p>
              </div>

              {/* Lembar Disposisi Kepala Sekolah */}
              {isMasuk && item.disposisi && (
                <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 text-xs space-y-2.5">
                  <div className="flex items-center justify-between font-bold text-blue-900">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Lembar Disposisi Kepala Sekolah (Tercatat)
                    </span>
                    <span className="text-[11px] text-blue-600 font-normal">
                      Tgl: {formatTanggalIndo(item.disposisi.tanggalDisposisi, false)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Diteruskan Kepada:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.disposisi.tujuanJabatan.map((j) => (
                          <span key={j} className="px-2 py-0.5 rounded bg-white text-blue-900 font-bold border border-blue-200 text-[10px]">
                            {j}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Instruksi:</span>
                      <ul className="list-disc list-inside text-slate-800 font-medium mt-1 space-y-0.5">
                        {item.disposisi.instruksi.map((ins) => (
                          <li key={ins}>{ins}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {item.disposisi.catatan && (
                    <div className="mt-2 bg-white p-2.5 rounded-lg border border-blue-200 text-slate-800 italic">
                      Catatan KS: "{item.disposisi.catatan}"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Format Lembar Kop Surat Resmi */}
          {activeTab === 'RESMI' && (
            <div className="p-4 sm:p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="max-w-xl mx-auto bg-white p-5 sm:p-6 rounded-lg shadow-xs border border-slate-200 text-slate-900 font-serif text-xs leading-relaxed">
                <div className="border-b border-slate-300 pb-3 mb-4 flex items-center justify-between gap-3 text-center">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    {sekolah?.logoPemda ? (
                      <img src={sekolah.logoPemda} alt="Pemda" className="max-h-12 max-w-full object-contain" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      LEMBAR INFORMASI PERSURATAN RESMI
                    </div>
                    <div className="text-sm font-bold uppercase mt-0.5">
                      {isMasuk ? item.pengirim : (sekolah?.namaSekolah || 'SMPN 14 TULANG BAWANG BARAT')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                      {sekolah?.kabupatenKota || 'Kabupaten Tulang Bawang Barat'}
                    </div>
                  </div>
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    {sekolah?.logoSekolah ? (
                      <img src={sekolah.logoSekolah} alt="Sekolah" className="max-h-12 max-w-full object-contain" />
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2 mb-4 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nomor: {item.noSurat}</span>
                    <span className="text-slate-500">{formatTanggalIndo(item.tanggalSurat, false)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Perihal: </span>
                    <span className="font-bold text-slate-900">{item.perihal}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{isMasuk ? 'Diterima Dari:' : 'Ditujukan Kepada:'} </span>
                    <span className="font-semibold text-slate-800">{isMasuk ? item.pengirim : item.tujuan}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-slate-700 font-sans text-xs italic mb-4">
                  "{item.ringkasan}"
                </div>

                {item.penandatangan && (
                  <div className="text-right font-sans text-xs mt-6">
                    <div className="text-slate-500">Tertanda,</div>
                    <div className="font-bold text-slate-900 mt-6 underline">{item.penandatangan}</div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px] sm:text-xs truncate">
            {sekolah?.namaSekolah || 'SMPN 14 Tulang Bawang Barat'} • Agenda Surat Digital
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors cursor-pointer text-xs"
          >
            Tutup Preview
          </button>
        </div>

      </div>
    </div>
  );
};
