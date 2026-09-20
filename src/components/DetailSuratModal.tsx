import React from 'react';
import { SuratItem, IdentitasSekolah } from '../types';
import { formatTanggalIndo } from '../utils/formatters';
import { 
  X, 
  Mail, 
  Send, 
  Printer, 
  Edit3, 
  Paperclip, 
  Calendar, 
  Tag, 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileCheck,
  Eye,
  Download
} from 'lucide-react';

interface DetailSuratModalProps {
  item: SuratItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: SuratItem) => void;
  onPreview?: (item: SuratItem) => void;
  onOpenDisposisi: (item: SuratItem) => void;
  onPrintDisposisi: (item: SuratItem) => void;
  sekolah: IdentitasSekolah;
}

export const DetailSuratModal: React.FC<DetailSuratModalProps> = ({
  item,
  isOpen,
  onClose,
  onEdit,
  onPreview,
  onOpenDisposisi,
  onPrintDisposisi
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl text-white ${item.tipe === 'MASUK' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {item.tipe === 'MASUK' ? <Mail className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900">{item.noAgenda}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {item.tipe === 'MASUK' ? 'Surat Masuk' : 'Surat Keluar'}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Klasifikasi: <span className="font-semibold text-slate-700">{item.kodeKlasifikasi} ({item.kategori})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1 text-xs">
          
          {/* Perihal Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Perihal Surat
            </span>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {item.perihal}
            </h3>
            {item.ringkasan && (
              <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap border-t border-slate-200/80 pt-2">
                {item.ringkasan}
              </p>
            )}
          </div>

          {/* Grid Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">
                Nomor Surat Resmi
              </span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {item.noSurat}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">
                {item.tipe === 'MASUK' ? 'Asal Surat (Pengirim)' : 'Tujuan Surat'}
              </span>
              <span className="font-bold text-slate-900 text-xs">
                {item.tipe === 'MASUK' ? item.pengirim : item.tujuan}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">
                Tanggal Surat
              </span>
              <span className="font-medium text-slate-800">
                {formatTanggalIndo(item.tanggalSurat, true)}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">
                {item.tipe === 'MASUK' ? 'Tanggal Diterima' : 'Tanggal Dikirim / Terbit'}
              </span>
              <span className="font-medium text-slate-800">
                {formatTanggalIndo(item.tanggalTerimaOrKirim, true)}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">
                Sifat Surat
              </span>
              <span className="font-bold text-slate-800">
                {item.sifat}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-1">
                Lokasi Fisik / Ordner
              </span>
              <span className="font-medium text-slate-800">
                {item.lokasiArsipFisik || 'Lemari Arsip TU'}
              </span>
            </div>
          </div>

          {/* Lampiran & Berkas */}
          {(item.lampiranJumlah || item.lampiranNama) && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-slate-500" />
                <div>
                  <span className="font-semibold text-slate-800">Lampiran Dokumen: </span>
                  <span className="text-slate-600">{item.lampiranJumlah}</span>
                  {item.lampiranNama && (
                    <span className="font-mono text-blue-700 ml-1.5 font-medium">({item.lampiranNama})</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Disposisi Section (if Surat Masuk) */}
          {item.tipe === 'MASUK' && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Lembar Disposisi Kepala Sekolah</span>
                </div>
                <button
                  onClick={() => onOpenDisposisi(item)}
                  className="text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
                >
                  {item.disposisi ? 'Edit Disposisi' : '+ Buat Disposisi'}
                </button>
              </div>

              {item.disposisi ? (
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Diteruskan Kepada:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.disposisi.tujuanJabatan.map((j) => (
                        <span key={j} className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-900 font-semibold text-[10px]">
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Instruksi Kepala Sekolah:</span>
                    <ul className="list-disc list-inside mt-0.5 text-slate-800 font-medium space-y-0.5">
                      {item.disposisi.instruksi.map((ins) => (
                        <li key={ins}>{ins}</li>
                      ))}
                    </ul>
                  </div>

                  {item.disposisi.catatan && (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Catatan / Pesan:</span>
                      <p className="italic bg-white p-2 rounded border border-blue-200 text-slate-800 mt-0.5">
                        "{item.disposisi.catatan}"
                      </p>
                    </div>
                  )}

                  {item.disposisi.statusTindakLanjut && (
                    <div className="pt-2 border-t border-blue-200">
                      <span className="text-emerald-800 font-bold block text-[11px]">Umpan Balik Tindak Lanjut:</span>
                      <p className="text-emerald-900 mt-0.5">
                        {item.disposisi.statusTindakLanjut}
                        {item.disposisi.penindakLanjut && ` (Oleh: ${item.disposisi.penindakLanjut})`}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-3.5 bg-red-50/70 border border-red-200 rounded-lg text-red-800">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-red-700 mb-1">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span>Peringatan: Surat ini belum didisposisi oleh Kepala Sekolah</span>
                  </div>
                  <p className="text-[11px] text-red-600">Harap segera buat lembar disposisi untuk ditindaklanjuti oleh staf terkait.</p>
                  <button
                    onClick={() => onOpenDisposisi(item)}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Proses Lembar Disposisi Sekarang</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onPreview && (
              <button
                onClick={() => onPreview(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100/70 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Berkas & Surat</span>
              </button>
            )}

            {item.tipe === 'MASUK' && (
              <button
                onClick={() => onPrintDisposisi(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Cetak Lembar Disposisi</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Data</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
