import React, { useState } from 'react';
import { DAFTAR_KLASIFIKASI } from '../data/klasifikasiSurat';
import { X, Search, BookOpen, Copy, Check } from 'lucide-react';

interface KlasifikasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKode?: (kode: string, kategori: string) => void;
}

export const KlasifikasiModal: React.FC<KlasifikasiModalProps> = ({
  isOpen,
  onClose,
  onSelectKode
}) => {
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = DAFTAR_KLASIFIKASI.filter(
    (k) =>
      k.kode.toLowerCase().includes(search.toLowerCase()) ||
      k.nama.toLowerCase().includes(search.toLowerCase()) ||
      k.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
      k.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (kode: string) => {
    navigator.clipboard.writeText(kode);
    setCopiedCode(kode);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daftar Kode Klasifikasi Surat Dinas Pendidikan
              </h2>
              <p className="text-xs text-slate-500">
                Standar tata kearsipan persuratan bidang pendidikan dan kebudayaan
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

        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode atau nama urusan (contoh: 421.1, kurikulum, kesiswaan, BOS)..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {filtered.map((k) => (
            <div
              key={k.kode}
              className="p-3 bg-white hover:bg-indigo-50/40 border border-slate-200 rounded-xl flex items-start justify-between gap-3 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-100 text-indigo-800">
                    {k.kode}
                  </span>
                  <span className="font-bold text-xs text-slate-900">{k.nama}</span>
                  <span className="text-[10px] text-slate-500 px-1.5 py-0.2 rounded bg-slate-100">
                    {k.kategori}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {k.deskripsi}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(k.kode)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Salin kode ke papan klip"
                >
                  {copiedCode === k.kode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
