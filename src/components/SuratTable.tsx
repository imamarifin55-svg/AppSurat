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
        return 'bg-rose-50 text-rose-700 border-rose-200/70 font-semibold';
      case 'Penting':
        return 'bg-amber-50 text-amber-800 border-amber-200/70 font-semibold';
      case 'Rahasia':
        return 'bg-purple-50 text-purple-700 border-purple-200/70 font-semibold';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200/70';
    }
  };

  const getStatusBadge = (status: string, tipe: 'MASUK' | 'KELUAR') => {
    if (tipe === 'MASUK') {
      if (status === 'Menunggu Disposisi') {
        return 'bg-rose-50 text-rose-700 border-rose-200/70 font-semibold';
      }
      if (status === 'Proses Tindak Lanjut') {
        return 'bg-sky-50 text-sky-700 border-sky-200/70 font-medium';
      }
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/70 font-medium';
    } else {
      if (status === 'Terkirim') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/70 font-medium';
      }
      if (status === 'Diterbitkan') {
        return 'bg-blue-50 text-blue-700 border-blue-200/70 font-medium';
      }
      return 'bg-slate-100 text-slate-600 border-slate-200/70 font-medium';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
      
      {/* Modern Soft Segmented Tabs */}
      <div className="p-3 sm:p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          id="tab-semua"
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          Semua Agenda <span className="ml-1 opacity-75">({items.length})</span>
        </button>

        <button
          id="tab-masuk"
          onClick={() => setActiveTab('MASUK')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'MASUK'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Surat Masuk ({items.filter((i) => i.tipe === 'MASUK').length})</span>
        </button>

        <button
          id="tab-keluar"
          onClick={() => setActiveTab('KELUAR')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'KELUAR'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-orange-700 hover:bg-orange-50/70'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Surat Keluar ({items.filter((i) => i.tipe === 'KELUAR').length})</span>
        </button>

        <button
          id="tab-perlu-disposisi"
          onClick={() => setActiveTab('PERLU_DISPOSISI')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'PERLU_DISPOSISI'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-cyan-700 hover:bg-cyan-50/70'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Perlu Disposisi ({items.filter((i) => i.tipe === 'MASUK' && i.status === 'Menunggu Disposisi').length})</span>
        </button>

        <button
          id="tab-urgent"
          onClick={() => setActiveTab('URGENT')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-tight flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'URGENT'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-pink-700 hover:bg-pink-50/70'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Penting / Prioritas ({items.filter((i) => i.sifat === 'Sangat Segera' || i.sifat === 'Penting').length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-84">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-agenda"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor surat, perihal, pengirim..."
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-3 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Kategori:</span>
          </div>
          <select
            id="select-filter-kategori"
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-colors"
          >
            <option value="ALL">Semua Kategori</option>
            {uniqueKategori.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-1">
            <span className="font-medium">Sifat:</span>
          </div>
          <select
            id="select-filter-sifat"
            value={filterSifat}
            onChange={(e) => setFilterSifat(e.target.value)}
            className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-colors"
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
              className="text-xs text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100/80 font-medium px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

      </div>

      {/* Mobile Card View (Optimized for HP / Smartphone screens) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {filteredItems.length === 0 ? (
          <div className="py-12 px-4 text-center text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-700 text-sm">Tidak ada surat yang sesuai</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="p-4 bg-white hover:bg-slate-50/80 transition-colors space-y-2.5">
              {/* Header Card: No Agenda, Tipe, Sifat */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.noAgenda}
                  </span>
                  {item.tipe === 'MASUK' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                      <Mail className="w-3 h-3 text-sky-500" /> Masuk
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <Send className="w-3 h-3 text-emerald-500" /> Keluar
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getSifatBadge(item.sifat)}`}>
                    {item.sifat}
                  </span>
                </div>
              </div>

              {/* Perihal & Metadata */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {item.perihal}
                </h4>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-1">
                  <span>{item.tipe === 'MASUK' ? 'Dari:' : 'Kepada:'} <strong>{item.tipe === 'MASUK' ? item.pengirim : item.tujuan}</strong></span>
                  <span>Tgl: {formatTanggalPendek(item.tanggalSurat)}</span>
                </div>
                <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                  No: {item.noSurat}
                </div>
              </div>

              {/* Direct Mobile Preview Button (Prominent & Fast) */}
              {item.fileData ? (
                <button
                  onClick={() => onPreview ? onPreview(item) : onViewDetail(item)}
                  className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat / Preview Berkas ({item.lampiranNama || 'Dokumen Scan'})</span>
                </button>
              ) : (
                <button
                  onClick={() => onPreview ? onPreview(item) : onViewDetail(item)}
                  className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview Data Surat</span>
                </button>
              )}

              {/* Action Buttons row on Mobile */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <button
                  onClick={() => onViewDetail(item)}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium py-1 px-2 rounded hover:bg-slate-100"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Detail</span>
                </button>

                {item.tipe === 'MASUK' && (
                  <button
                    onClick={() => onOpenDisposisi(item)}
                    className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold py-1 px-2 rounded hover:bg-blue-50"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{item.disposisi ? 'Disposisi' : '+ Disposisi'}</span>
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                    title="Edit Data Surat"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Hapus Surat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/60 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
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
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center text-slate-500">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100/80 flex items-center justify-center text-slate-400 mb-3">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-700 text-sm">Tidak ada surat yang sesuai</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Coba sesuaikan kata kunci pencarian atau ganti filter kategori/sifat di atas.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* No Agenda & Tipe */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-bold text-slate-900 font-mono text-[11px] tracking-tight">
                      {item.noAgenda}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1">
                      {item.tipe === 'MASUK' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          <Mail className="w-3 h-3 text-sky-500" /> Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <Send className="w-3 h-3 text-emerald-500" /> Keluar
                        </span>
                      )}
                    </div>
                  </td>

                  {/* No Surat & Tanggal */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-semibold text-slate-800 break-words leading-snug">
                      {item.noSurat}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-1.5 flex items-center gap-1">
                      <span>Tgl:</span>
                      <span className="text-slate-700 font-medium">{formatTanggalPendek(item.tanggalSurat)}</span>
                    </div>
                    <div className="text-slate-400 text-[10.5px] mt-0.5">
                      {item.tipe === 'MASUK' ? 'Diterima:' : 'Dikirim:'} {formatTanggalPendek(item.tanggalTerimaOrKirim)}
                    </div>
                  </td>

                  {/* Asal / Tujuan */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-medium text-slate-800 line-clamp-2 leading-snug">
                      {item.tipe === 'MASUK' ? item.pengirim : item.tujuan}
                    </div>
                    {item.lokasiArsipFisik && (
                      <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100/80 border border-slate-200/60">
                          Arsip: {item.lokasiArsipFisik}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Perihal & Ringkasan */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60">
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {item.kodeKlasifikasi}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {item.kategori}
                      </span>
                      {item.fileData && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          <Paperclip className="w-3 h-3 text-emerald-500" />
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
                    <div className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                      {item.perihal}
                    </div>
                    {item.ringkasan && (
                      <p className="text-slate-500 text-[11px] line-clamp-2 mt-1 leading-relaxed">
                        {item.ringkasan}
                      </p>
                    )}
                  </td>

                  {/* Sifat & Status */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getSifatBadge(item.sifat)}`}>
                        {item.sifat}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(item.status, item.tipe)}`}>
                        {item.status}
                      </span>
                    </div>
                  </td>

                  {/* Disposisi Column (for Incoming Mail) */}
                  <td className="py-3.5 px-4 align-top text-center">
                    {item.tipe === 'MASUK' ? (
                      item.disposisi ? (
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => onOpenDisposisi(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 hover:bg-sky-100/80 border border-sky-200/70 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                            title="Edit / Lihat Lembar Disposisi"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-sky-500" />
                            <span>Sudah Disposisi</span>
                          </button>
                          <span className="text-[10px] text-slate-400">
                            {item.disposisi.tujuanJabatan.length} Pejabat Tujuan
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenDisposisi(item)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
                          title="Isi Lembar Disposisi Kepala Sekolah"
                        >
                          <Clock className="w-3.5 h-3.5 text-rose-500" />
                          <span>+ Disposisi</span>
                        </button>
                      )
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">-</span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 align-top text-right">
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 hover:bg-sky-100/80 text-sky-700 text-xs font-semibold rounded-lg border border-sky-200/70 transition-all cursor-pointer shadow-2xs"
                        title="Preview Surat & Berkas Unggahan"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => onViewDetail(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Lihat Detail Metadata"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {item.tipe === 'MASUK' && (
                        <button
                          onClick={() => onPrintDisposisi(item)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Cetak Lembar Disposisi Resmi"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Data Surat"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
      <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
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
