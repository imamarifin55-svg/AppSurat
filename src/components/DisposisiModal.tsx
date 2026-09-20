import React, { useState, useEffect } from 'react';
import { SuratItem, DisposisiData, IdentitasSekolah } from '../types';
import { JABATAN_SEKOLAH, INSTRUKSI_DISPOSISI } from '../data/klasifikasiSurat';
import { formatTanggalIndo } from '../utils/formatters';
import { X, CheckSquare, Square, Printer, Save, CheckCircle2, UserCheck, FileText } from 'lucide-react';

interface DisposisiModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SuratItem | null;
  onSaveDisposisi: (suratId: string, disposisi: DisposisiData, newStatus: string) => void;
  onPrintDisposisi: (item: SuratItem) => void;
  sekolah: IdentitasSekolah;
}

export const DisposisiModal: React.FC<DisposisiModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveDisposisi,
  onPrintDisposisi,
  sekolah
}) => {
  const [tujuanJabatan, setTujuanJabatan] = useState<string[]>([]);
  const [instruksi, setInstruksi] = useState<string[]>([]);
  const [catatan, setCatatan] = useState('');
  const [tanggalDisposisi, setTanggalDisposisi] = useState(new Date().toISOString().slice(0, 10));
  const [statusTindakLanjut, setStatusTindakLanjut] = useState('');
  const [penindakLanjut, setPenindakLanjut] = useState('');
  const [statusAlur, setStatusAlur] = useState('Proses Tindak Lanjut');

  useEffect(() => {
    if (item) {
      if (item.disposisi) {
        setTujuanJabatan(item.disposisi.tujuanJabatan || []);
        setInstruksi(item.disposisi.instruksi || []);
        setCatatan(item.disposisi.catatan || '');
        setTanggalDisposisi(item.disposisi.tanggalDisposisi || new Date().toISOString().slice(0, 10));
        setStatusTindakLanjut(item.disposisi.statusTindakLanjut || '');
        setPenindakLanjut(item.disposisi.penindakLanjut || '');
      } else {
        setTujuanJabatan([]);
        setInstruksi([INSTRUKSI_DISPOSISI[0]]);
        setCatatan('');
        setTanggalDisposisi(new Date().toISOString().slice(0, 10));
        setStatusTindakLanjut('');
        setPenindakLanjut('');
      }
      setStatusAlur(item.status);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const toggleJabatan = (jabatan: string) => {
    setTujuanJabatan((prev) =>
      prev.includes(jabatan) ? prev.filter((j) => j !== jabatan) : [...prev, jabatan]
    );
  };

  const toggleInstruksi = (inst: string) => {
    setInstruksi((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tujuanJabatan.length === 0) {
      alert('Pilih minimal satu pejabat/petugas tujuan disposisi!');
      return;
    }

    const disposisiData: DisposisiData = {
      tujuanJabatan,
      instruksi,
      catatan,
      tanggalDisposisi,
      statusTindakLanjut,
      penindakLanjut
    };

    onSaveDisposisi(item.id, disposisiData, statusAlur);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lembar Disposisi Kepala Sekolah
              </h2>
              <p className="text-xs text-slate-500">
                Agenda: <span className="font-mono font-semibold text-blue-700">{item.noAgenda}</span> • Sifat: <span className="font-semibold text-slate-700">{item.sifat}</span>
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

        {/* Ringkasan Surat */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400">Asal Surat:</span>{' '}
            <span className="font-semibold text-slate-800">{item.pengirim}</span>
          </div>
          <div>
            <span className="text-slate-400">No. Surat:</span>{' '}
            <span className="font-mono text-slate-800 font-medium">{item.noSurat}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-400">Perihal:</span>{' '}
            <span className="font-semibold text-slate-900">{item.perihal}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto px-6 py-4 space-y-5 flex-1">
          
          {/* Section 1: Diteruskan Kepada */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>1. Diteruskan Kepada Sdr. (Tujuan Disposisi)</span>
              </label>
              <span className="text-[11px] text-blue-600 font-medium">
                {tujuanJabatan.length} dipilih
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
              {JABATAN_SEKOLAH.map((jabatan) => {
                const isChecked = tujuanJabatan.includes(jabatan);
                return (
                  <button
                    type="button"
                    key={jabatan}
                    onClick={() => toggleJabatan(jabatan)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-blue-100/70 text-blue-900 font-semibold border border-blue-200'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-tight">{jabatan}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Instruksi / Petunjuk */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              2. Instruksi / Petunjuk Kepala Sekolah
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              {INSTRUKSI_DISPOSISI.map((inst) => {
                const isChecked = instruksi.includes(inst);
                return (
                  <button
                    type="button"
                    key={inst}
                    onClick={() => toggleInstruksi(inst)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-100/70 text-emerald-900 font-semibold border border-emerald-200'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-tight">{inst}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Catatan Khusus & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan / Instruksi Khusus Kepala Sekolah
              </label>
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tuliskan arahan spesifik, batas waktu (deadline), atau pesan khusus dari Kepala Sekolah..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Disposisi
                </label>
                <input
                  type="date"
                  value={tanggalDisposisi}
                  onChange={(e) => setTanggalDisposisi(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Update Status Surat
                </label>
                <select
                  value={statusAlur}
                  onChange={(e) => setStatusAlur(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Proses Tindak Lanjut">Proses Tindak Lanjut</option>
                  <option value="Selesai">Selesai (Diarsipkan)</option>
                  <option value="Menunggu Disposisi">Menunggu Disposisi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Laporan Progres Tindak Lanjut (Umpan Balik Staf) */}
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
            <label className="text-xs font-bold text-amber-900 block mb-1">
              Catatan Progres Hasil Tindak Lanjut (Umpan Balik Staf)
            </label>
            <p className="text-[11px] text-amber-700 mb-2">
              Dapat diisi saat petugas/pejabat telah selesai menjalankan instruksi disposisi.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={penindakLanjut}
                onChange={(e) => setPenindakLanjut(e.target.value)}
                placeholder="Petugas penindak lanjut (misal: Waka Kurikulum)"
                className="px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
              />
              <input
                type="text"
                value={statusTindakLanjut}
                onChange={(e) => setStatusTindakLanjut(e.target.value)}
                placeholder="Hasil pelaksanaan (misal: Surat balasan telah dikirim & gladi siap)"
                className="sm:col-span-2 px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onPrintDisposisi({
                  ...item,
                  disposisi: {
                    tujuanJabatan,
                    instruksi,
                    catatan,
                    tanggalDisposisi,
                    statusTindakLanjut,
                    penindakLanjut
                  }
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak Lembar Disposisi Fisik</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Disposisi</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
