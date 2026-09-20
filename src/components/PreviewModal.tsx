import React from 'react';
import { SuratItem, IdentitasSekolah } from '../types';
import { 
  X, 
  Eye, 
  Download, 
  FileText, 
  Building2, 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  CheckCircle2, 
  Paperclip,
  Printer,
  ExternalLink
} from 'lucide-react';
import { formatTanggalIndo } from '../utils/formatters';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SuratItem | null;
  onPrintDisposisi?: (item: SuratItem) => void;
  sekolah?: IdentitasSekolah;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  item,
  onPrintDisposisi,
  sekolah
}) => {
  if (!isOpen || !item) return null;

  const isMasuk = item.tipe === 'MASUK';
  const hasUploadedFile = !!item.fileData;
  const isImageFile = item.fileType?.startsWith('image/') || item.fileData?.startsWith('data:image/');
  const isPdfFile = item.fileType === 'application/pdf' || item.fileData?.startsWith('data:application/pdf');

  const handleDownloadFile = () => {
    if (!item.fileData) return;
    const a = document.createElement('a');
    a.href = item.fileData;
    a.download = item.lampiranNama || `Berkas-${item.noAgenda}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Preview Modal */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white shadow-xs ${
              isMasuk ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isMasuk ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Preview {isMasuk ? 'Surat Masuk' : 'Surat Keluar'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {item.noAgenda}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
                {item.perihal}
              </h2>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-2">
            {hasUploadedFile && (
              <button
                onClick={handleDownloadFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors cursor-pointer"
                title="Unduh Berkas Lampiran"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh Berkas</span>
              </button>
            )}

            {isMasuk && onPrintDisposisi && (
              <button
                onClick={() => onPrintDisposisi(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                title="Cetak Lembar Disposisi"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lembar Disposisi</span>
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
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

          {/* Area Preview Dokumen / File Lampiran */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span>Dokumen Berkas Lampiran {item.lampiranNama ? `(${item.lampiranNama})` : ''}</span>
              </h3>
              {item.lampiranJumlah && (
                <span className="text-xs text-slate-500">
                  Jumlah: <strong>{item.lampiranJumlah}</strong>
                </span>
              )}
            </div>

            {hasUploadedFile ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900/5">
                {/* Jika file berupa gambar */}
                {isImageFile && (
                  <div className="p-4 flex flex-col items-center justify-center bg-slate-100">
                    <img 
                      src={item.fileData} 
                      alt={item.lampiranNama || 'Lampiran'} 
                      className="max-h-[500px] object-contain rounded-lg shadow-md border border-slate-300"
                    />
                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
                      <span>Pratinjau Berkas Gambar Asli</span>
                      <span>•</span>
                      <button 
                        onClick={handleDownloadFile}
                        className="text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Unduh Ukuran Penuh
                      </button>
                    </div>
                  </div>
                )}

                {/* Jika file berupa PDF */}
                {isPdfFile && (
                  <div className="w-full flex flex-col items-center">
                    <iframe 
                      src={item.fileData} 
                      title={item.lampiranNama || 'Dokumen PDF'}
                      className="w-full h-[550px] border-0 rounded-b-xl"
                    />
                  </div>
                )}

                {/* Jika file format lainnya */}
                {!isImageFile && !isPdfFile && (
                  <div className="p-8 text-center bg-slate-50">
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-slate-900">{item.lampiranNama || 'Berkas Dokumen'}</h4>
                    <p className="text-xs text-slate-500 mt-1">Berkas terunggah siap diunduh atau dibuka secara mandiri.</p>
                    <button
                      onClick={handleDownloadFile}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Berkas Lampiran</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Tampilan Lembar Dokumen Representasi Resmi jika belum ada file scan asli */
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-xs border border-slate-200 text-slate-900 font-serif text-xs leading-relaxed">
                  <div className="border-b border-slate-300 pb-3 mb-4 flex items-center justify-between gap-3 text-center">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      {sekolah?.logoPemda ? (
                        <img src={sekolah.logoPemda} alt="Pemda" className="max-h-10 max-w-full object-contain" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                        LEMBAR INFORMASI PERSURATAN RESMI
                      </div>
                      <div className="text-sm font-bold uppercase mt-0.5">
                        {isMasuk ? item.pengirim : (sekolah?.namaSekolah || 'SMPN 14 TULANG BAWANG BARAT')}
                      </div>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      {sekolah?.logoSekolah ? (
                        <img src={sekolah.logoSekolah} alt="Sekolah" className="max-h-10 max-w-full object-contain" />
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

                <div className="text-center mt-3 text-[11px] text-slate-400">
                  Catatan: Dokumen fisik tersimpan di <strong>{item.lokasiArsipFisik || 'Ordner Tata Usaha'}</strong>. Anda dapat mengunggah file scan PDF/Gambar melalui tombol <em>Edit Data Surat</em>.
                </div>
              </div>
            )}
          </div>

          {/* Lembar Disposisi (jika surat masuk dan sudah didisposisi) */}
          {isMasuk && item.disposisi && (
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Lembar Disposisi Kepala Sekolah (Tercatat)
                </span>
                <span className="text-[11px] text-blue-600 font-normal">
                  Tgl Disposisi: {formatTanggalIndo(item.disposisi.tanggalDisposisi, false)}
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
                <div className="mt-2 bg-white p-2 rounded border border-blue-200 text-slate-800 italic">
                  Catatan KS: "{item.disposisi.catatan}"
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Agenda Persuratan • SMPN 14 Tulang Bawang Barat
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Tutup Preview
          </button>
        </div>

      </div>
    </div>
  );
};
