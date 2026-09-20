import React, { useState, useMemo } from 'react';
import { SuratItem } from '../types';
import { formatTanggalIndo, formatTanggalPendek } from '../utils/formatters';
import { 
  Search, 
  Filter, 
  Mail, 
  Send, 
  FileText, 
  Printer, 
  Edit3, 
  Trash2, 
  Eye, 
  FileCheck2, 
  Clock, 
  AlertCircle,
  Paperclip,
  CheckCircle,
  Tag
} from 'lucide-react';

interface SuratTableProps {
  items: SuratItem[];
  onViewDetail: (item: SuratItem) => void;
  onPreview?: (item: SuratItem) => void;
  onEdit: (item: SuratItem) => void;
  onDelete: (id: string) => void;
  onOpenDisposisi: (item: SuratItem) => void;
  onPrintDisposisi: (item: SuratItem) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SuratTable: React.FC<SuratTableProps> = ({
  items,
  onViewDetail,
  onPreview,
  onEdit,
  onDelete,
  onOpenDisposisi,
  onPrintDisposisi,
  activeTab,
  setActiveTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('ALL');
  const [filterSifat, setFilterSifat] = useState('ALL');

  // Filter logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Tab filter
      if (activeTab === 'MASUK' && item.tipe !== 'MASUK') return false;
      if (activeTab === 'KELUAR' && item.tipe !== 'KELUAR') return false;
      if (activeTab === 'PERLU_DISPOSISI') {
        if (item.tipe !== 'MASUK' || item.status !== 'Menunggu Disposisi') return false;
      }
      if (activeTab === 'URGENT') {
        if (item.sifat !== 'Sangat Segera' && item.sifat !== 'Penting') return false;
      }

      // Kategori filter
      if (filterKategori !== 'ALL' && item.kategori !== filterKategori) return false;

      // Sifat filter
      if (filterSifat !== 'ALL' && item.sifat !== filterSifat) return false;

      // Search text filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchNoSurat = item.noSurat.toLowerCase().includes(q);
        const matchNoAgenda = item.noAgenda.toLowerCase().includes(q);
        const matchPerihal = item.perihal.toLowerCase().includes(q);
        const matchRingkasan = item.ringkasan.toLowerCase().includes(q);
        const matchKode = item.kodeKlasifikasi.toLowerCase().includes(q);
        const matchParty = item.tipe === 'MASUK' 
          ? (item.pengirim || '').toLowerCase().includes(q)
          : (item.tujuan || '').toLowerCase().includes(q);

        return matchNoSurat || matchNoAgenda || matchPerihal || matchRingkasan || matchKode || matchParty;
      }

      return true;
    });
  }, [items, activeTab, filterKategori, filterSifat, searchQuery]);

  const uniqueKategori = useMemo(() => {
    const list = Array.from(new Set(items.map((i) => i.kategori))).filter(Boolean);
    return list.sort();
  }, [items]);

  const getSifatBadge = (sifat: string) => {
    switch (sifat) {
      case 'Sangat Segera':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'Penting':
        return 'bg-red-50 text-red-700 border-red-300 font-semibold';
      case 'Rahasia':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string, tipe: 'MASUK' | 'KELUAR') => {
    if (tipe === 'MASUK') {
      if (status === 'Menunggu Disposisi') {
        return 'bg-red-50 text-red-700 border-red-300 font-semibold';
      }
      if (status === 'Proses Tindak Lanjut') {
        return 'bg-blue-50 text-blue-700 border-blue-200';
      }
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else {
      if (status === 'Terkirim') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      }
      if (status === 'Diterbitkan') {
        return 'bg-blue-50 text-blue-700 border-blue-200';
      }
      return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Tabs */}
      <div className="border-b border-slate-200 px-4 sm:px-6 pt-3 flex flex-wrap gap-2 sm:gap-6">
        <button
          id="tab-semua"
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-tight border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ALL'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Semua Agenda ({items.length})
        </button>

        <button
          id="tab-masuk"
          onClick={() => setActiveTab('MASUK')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-tight border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'MASUK'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Mail className="w-4 h-4 text-blue-600" />
          <span>Surat Masuk ({items.filter((i) => i.tipe === 'MASUK').length})</span>
        </button>

        <button
          id="tab-keluar"
          onClick={() => setActiveTab('KELUAR')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-tight border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'KELUAR'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Send className="w-4 h-4 text-emerald-600" />
          <span>Surat Keluar ({items.filter((i) => i.tipe === 'KELUAR').length})</span>
        </button>

        <button
          id="tab-perlu-disposisi"
          onClick={() => setActiveTab('PERLU_DISPOSISI')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-tight border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'PERLU_DISPOSISI'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-red-600 hover:border-red-300'
          }`}
        >
          <Clock className="w-4 h-4 text-red-600" />
          <span>Perlu Disposisi ({items.filter((i) => i.tipe === 'MASUK' && i.status === 'Menunggu Disposisi').length})</span>
        </button>

        <button
          id="tab-urgent"
          onClick={() => setActiveTab('URGENT')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-tight border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'URGENT'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-red-600 hover:border-red-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>Penting / Prioritas ({items.filter((i) => i.sifat === 'Sangat Segera' || i.sifat === 'Penting').length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-agenda"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no surat, perihal, pengirim, no agenda..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </div>
          <select
            id="select-filter-kategori"
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="ALL">Semua Kategori</option>
            {uniqueKategori.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <span>Sifat:</span>
          </div>
          <select
            id="select-filter-sifat"
            value={filterSifat}
            onChange={(e) => setFilterSifat(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="ALL">Semua Sifat</option>
            <option value="Biasa">Biasa</option>
            <option value="Penting">Penting</option>
            <option value="Sangat Segera">Sangat Segera</option>
            <option value="Rahasia">Rahasia</option>
          </select>

          {(searchQuery || filterKategori !== 'ALL' || filterSifat !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterKategori('ALL');
                setFilterSifat('ALL');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-28">No. Agenda</th>
              <th className="py-3 px-4 w-44">No. & Tanggal Surat</th>
              <th className="py-3 px-4 w-48">Asal / Tujuan</th>
              <th className="py-3 px-4 min-w-[280px]">Perihal & Ringkasan</th>
              <th className="py-3 px-4 w-32">Sifat & Status</th>
              <th className="py-3 px-4 w-36 text-center">Disposisi</th>
              <th className="py-3 px-4 w-36 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <FileText className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-700">Tidak ada surat yang sesuai</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba sesuaikan kata kunci pencarian atau bersihkan filter yang aktif.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  {/* No Agenda & Tipe */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-bold text-slate-900 font-mono text-[11px]">
                      {item.noAgenda}
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      {item.tipe === 'MASUK' ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                          <Mail className="w-3 h-3" /> Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <Send className="w-3 h-3" /> Keluar
                        </span>
                      )}
                    </div>
                  </td>

                  {/* No Surat & Tanggal */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-semibold text-slate-900 break-words leading-tight">
                      {item.noSurat}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-1">
                      Tgl: <span className="text-slate-700 font-medium">{formatTanggalPendek(item.tanggalSurat)}</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">
                      {item.tipe === 'MASUK' ? 'Diterima:' : 'Dikirim:'} {formatTanggalPendek(item.tanggalTerimaOrKirim)}
                    </div>
                  </td>

                  {/* Asal / Tujuan */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-medium text-slate-800 line-clamp-2">
                      {item.tipe === 'MASUK' ? item.pengirim : item.tujuan}
                    </div>
                    {item.lokasiArsipFisik && (
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <span>Arsip: {item.lokasiArsipFisik}</span>
                      </div>
                    )}
                  </td>

                  {/* Perihal & Ringkasan */}
                  <td className="py-3 px-4 align-top">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                        <Tag className="w-2.5 h-2.5" />
                        {item.kodeKlasifikasi}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {item.kategori}
                      </span>
                      {item.fileData && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <Paperclip className="w-3 h-3 text-emerald-600" />
                          Berkas Terunggah
                        </span>
                      )}
                      {item.lampiranJumlah && !item.fileData && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 ml-auto">
                          <Paperclip className="w-3 h-3" />
                          {item.lampiranJumlah}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-900 line-clamp-2">
                      {item.perihal}
                    </div>
                    <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5 leading-relaxed">
                      {item.ringkasan}
                    </p>
                  </td>

                  {/* Sifat & Status */}
                  <td className="py-3 px-4 align-top">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getSifatBadge(item.sifat)}`}>
                        {item.sifat}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(item.status, item.tipe)}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>

                  {/* Disposisi Column (for Incoming Mail) */}
                  <td className="py-3 px-4 align-top text-center">
                    {item.tipe === 'MASUK' ? (
                      item.disposisi ? (
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => onOpenDisposisi(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded transition-colors cursor-pointer"
                            title="Edit / Lihat Lembar Disposisi"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Sudah Disposisi</span>
                          </button>
                          <span className="text-[10px] text-slate-400">
                            {item.disposisi.tujuanJabatan.length} Tujuan Pejabat
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenDisposisi(item)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 px-2 py-1 rounded transition-colors cursor-pointer"
                          title="Isi Lembar Disposisi Kepala Sekolah"
                        >
                          <Clock className="w-3.5 h-3.5 text-red-600" />
                          <span>+ Disposisi</span>
                        </button>
                      )
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">-</span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-4 align-top text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Tombol Preview Berkas / Surat */}
                      <button
                        onClick={() => {
                          if (onPreview) {
                            onPreview(item);
                          } else {
                            onViewDetail(item);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-md border border-blue-200 transition-colors cursor-pointer"
                        title="Preview Surat & Berkas Unggahan"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => onViewDetail(item)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Lihat Detail Metadata"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {item.tipe === 'MASUK' && (
                        <button
                          onClick={() => onPrintDisposisi(item)}
                          className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Cetak Lembar Disposisi Resmi"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Edit Data Surat"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        title="Hapus Surat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          Menampilkan <span className="font-semibold text-slate-700">{filteredItems.length}</span> dari <span className="font-semibold text-slate-700">{items.length}</span> agenda persuratan sekolah.
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Surat Masuk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Surat Keluar
          </span>
        </div>
      </div>

    </div>
  );
};
