import React, { useState, useMemo } from 'react';
import { DokumenLainItem, IdentitasSekolah, KategoriDokumenLain } from '../types';
import {
  FolderArchive,
  Plus,
  Search,
  Filter,
  FileText,
  Printer,
  Download,
  Calendar,
  Layers,
  BookOpen,
  MapPin,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Info
} from 'lucide-react';
import { DetailDokumenLainModal } from './DetailDokumenLainModal';
import { PrintDokumenLainView } from './PrintDokumenLainView';
import { PreviewModal } from './PreviewModal';
import { DocumentFileViewer } from './DocumentFileViewer';

interface DokumenLainViewProps {
  items: DokumenLainItem[];
  onOpenAddModal: () => void;
  onEditItem: (item: DokumenLainItem) => void;
  onDeleteItem: (id: string) => void;
  sekolah: IdentitasSekolah;
}

export const DokumenLainView: React.FC<DokumenLainViewProps> = ({
  items,
  onOpenAddModal,
  onEditItem,
  onDeleteItem,
  sekolah
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('ALL');
  const [filterKelas, setFilterKelas] = useState<string>('ALL');
  const [filterTahun, setFilterTahun] = useState<string>('ALL');

  // Modal states
  const [detailItem, setDetailItem] = useState<DokumenLainItem | null>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [previewFileItem, setPreviewFileItem] = useState<DokumenLainItem | null>(null);

  // Statistics calculation
  const totalCount = items.length;
  const soalCount = items.filter(
    (i) => i.kategori === 'Lembar Soal / Asesmen' || i.kategori === 'Kisi-Kisi & Kunci Jawaban'
  ).length;
  const perangkatCount = items.filter(
    (i) => i.kategori === 'Perangkat Ajar / Modul' || i.kategori === 'Kurikulum & Jadwal'
  ).length;
  const skLaporanCount = items.filter(
    (i) => i.kategori === 'SK & Berita Acara' || i.kategori === 'Laporan & LPJ' || i.kategori === 'Dokumen Akreditasi'
  ).length;

  const tahunList = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.tahunAjaran))).filter(Boolean);
  }, [items]);

  // Filtering
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterKategori !== 'ALL' && item.kategori !== filterKategori) return false;
      if (filterKelas !== 'ALL' && item.tingkatKelas !== filterKelas) return false;
      if (filterTahun !== 'ALL' && item.tahunAjaran !== filterTahun) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchJudul = item.judul.toLowerCase().includes(query);
        const matchKode = item.nomorDokumen.toLowerCase().includes(query);
        const matchMapel = item.mataPelajaran?.toLowerCase().includes(query) ?? false;
        const matchPenyusun = item.penyusun.toLowerCase().includes(query);
        const matchLokasi = item.lokasiFisik?.toLowerCase().includes(query) ?? false;
        const matchKet = item.keterangan?.toLowerCase().includes(query) ?? false;
        return matchJudul || matchKode || matchMapel || matchPenyusun || matchLokasi || matchKet;
      }

      return true;
    });
  }, [items, filterKategori, filterKelas, filterTahun, searchQuery]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'No',
      'No / Kode Arsip',
      'Judul Dokumen',
      'Kategori',
      'Mata Pelajaran',
      'Tingkat / Kelas',
      'Tahun Ajaran',
      'Semester',
      'Tanggal Dokumen',
      'Penyusun / Penanggung Jawab',
      'Lokasi Fisik',
      'Ada Berkas Digital',
      'Keterangan'
    ];

    const rows = filteredItems.map((it, idx) => [
      idx + 1,
      `"${it.nomorDokumen}"`,
      `"${it.judul.replace(/"/g, '""')}"`,
      `"${it.kategori}"`,
      `"${it.mataPelajaran || '-'}"`,
      `"${it.tingkatKelas || '-'}"`,
      `"${it.tahunAjaran}"`,
      `"${it.semester}"`,
      `"${it.tanggalDokumen}"`,
      `"${it.penyusun.replace(/"/g, '""')}"`,
      `"${it.lokasiFisik || '-'}"`,
      it.fileData ? 'Ya' : 'Tidak',
      `"${(it.keterangan || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arsip_Dokumen_Lainnya_${sekolah.namaSekolah.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================= */}
      {/* KARTU STATISTIK DENGAN GRADASI WARNA LEMBUT & MENAWAN     */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Semua Arsip Dokumen (Gradasi Biru / Indigo Elegan) */}
        <div
          id="stat-dokumen-total"
          onClick={() => setFilterKategori('ALL')}
          className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-blue-400/25 overflow-hidden ${
            filterKategori === 'ALL'
              ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 text-white ring-4 ring-blue-300/80 shadow-lg scale-[1.01]'
              : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Total Dokumen</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{totalCount}</span>
                <span className="text-xs font-medium text-blue-200">arsip</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <FolderArchive className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
            <span className="text-blue-100 font-medium">Semua arsip selain surat</span>
            <span className="text-blue-100 group-hover:text-white flex items-center text-[11px] font-semibold">
              Lihat <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Lembar Soal & Kisi-Kisi (Gradasi Hijau Lembut) */}
        <div
          id="stat-dokumen-soal"
          onClick={() => setFilterKategori('Lembar Soal / Asesmen')}
          className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-emerald-400/25 overflow-hidden ${
            filterKategori === 'Lembar Soal / Asesmen' || filterKategori === 'Kisi-Kisi & Kunci Jawaban'
              ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white ring-4 ring-emerald-300/80 shadow-lg scale-[1.01]'
              : 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Lembar Soal & Ujian</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{soalCount}</span>
                <span className="text-xs font-medium text-emerald-100/90">naskah</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
            <span className="text-emerald-100 font-medium">Soal SAS, STS, & Kisi-Kisi</span>
            <span className="text-emerald-100 group-hover:text-white flex items-center text-[11px] font-semibold">
              Filter <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Perangkat Ajar & Modul (Gradasi Kuning/Amber Lembut) */}
        <div
          id="stat-dokumen-perangkat"
          onClick={() => setFilterKategori('Perangkat Ajar / Modul')}
          className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-amber-300/30 overflow-hidden ${
            filterKategori === 'Perangkat Ajar / Modul'
              ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white ring-4 ring-amber-200/90 shadow-lg scale-[1.01]'
              : 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider">Perangkat & Modul</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{perangkatCount}</span>
                <span className="text-xs font-medium text-amber-100/90">modul</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
            <span className="text-amber-100 font-medium">Modul Ajar, RPP, Kurikulum</span>
            <span className="text-amber-100 group-hover:text-white flex items-center text-[11px] font-semibold">
              Filter <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 4: SK, Berita Acara & Laporan (Gradasi Ungu Lembut) */}
        <div
          id="stat-dokumen-sk"
          onClick={() => setFilterKategori('SK & Berita Acara')}
          className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-purple-300/30 overflow-hidden ${
            filterKategori === 'SK & Berita Acara' || filterKategori === 'Laporan & LPJ'
              ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white ring-4 ring-purple-300/80 shadow-lg scale-[1.01]'
              : 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">SK & Laporan LPJ</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{skLaporanCount}</span>
                <span className="text-xs font-medium text-purple-100/90">dokumen</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/20 flex items-center justify-between text-xs relative z-10">
            <span className="text-purple-100 font-medium">SK Tugas, ANBK, LPJ BOSP</span>
            <span className="text-purple-100 group-hover:text-white flex items-center text-[11px] font-semibold">
              Filter <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* TOOLBAR, FILTER DAN TOMBOL AKSI                           */}
      {/* ========================================================= */}
      <div className="bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
        
        {/* Header Title & Primary Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-lg font-bold text-slate-800">
                Arsip Dokumen Lainnya (Non-Surat)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengarsipan naskah lembar soal, kisi-kisi asesmen, perangkat ajar/modul, SK pembagian tugas, dan berkas fisik sekolah
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPrintOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Cetak Buku Register Arsip Dokumen"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak Register</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Ekspor data ke Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor CSV</span>
            </button>

            <button
              id="btn-tambah-dokumen-lain"
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Arsip Dokumen</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, kode, mapel, penyusun..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Filter Kategori */}
          <div>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
            >
              <option value="ALL">Semua Kategori Dokumen</option>
              <option value="Lembar Soal / Asesmen">Lembar Soal / Asesmen</option>
              <option value="Kisi-Kisi & Kunci Jawaban">Kisi-Kisi & Kunci Jawaban</option>
              <option value="Perangkat Ajar / Modul">Perangkat Ajar / Modul</option>
              <option value="Kurikulum & Jadwal">Kurikulum & Jadwal</option>
              <option value="SK & Berita Acara">SK & Berita Acara</option>
              <option value="Laporan & LPJ">Laporan & LPJ</option>
              <option value="Dokumen Akreditasi">Dokumen Akreditasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Filter Tingkat Kelas */}
          <div>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
            >
              <option value="ALL">Semua Tingkat / Sasaran</option>
              <option value="Kelas 7">Kelas 7</option>
              <option value="Kelas 8">Kelas 8</option>
              <option value="Kelas 9">Kelas 9</option>
              <option value="Semua Kelas (7, 8, 9)">Semua Kelas</option>
              <option value="Guru / Tendik">Guru / Tendik</option>
            </select>
          </div>

          {/* Filter Tahun Ajaran */}
          <div>
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium"
            >
              <option value="ALL">Semua Tahun Ajaran</option>
              {tahunList.map((th) => (
                <option key={th} value={th}>
                  TP {th}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* TAMPILAN TABEL DESKTOP (MD & LG SCREENS)                  */}
      {/* ========================================================= */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-emerald-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5 text-center w-12">No</th>
                <th className="py-3 px-3.5 w-32">Kode Arsip</th>
                <th className="py-3 px-4">Nama & Judul Dokumen</th>
                <th className="py-3 px-3.5 w-44">Kategori & Mapel</th>
                <th className="py-3 px-3 text-center w-28">Sasaran / TP</th>
                <th className="py-3 px-3.5 w-36">Penyusun</th>
                <th className="py-3 px-3.5 w-40">Lokasi Fisik</th>
                <th className="py-3 px-3 text-center w-28">Berkas</th>
                <th className="py-3 px-3.5 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FolderArchive className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">Tidak ada arsip dokumen yang sesuai filter.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Klik tombol "Tambah Arsip Dokumen" untuk mulai mencatat lembar soal atau berkas lainnya.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => setDetailItem(item)}
                    >
                      {/* No */}
                      <td className="py-3.5 px-3.5 text-center font-mono text-slate-500 font-semibold">
                        {idx + 1}
                      </td>

                      {/* Kode Arsip */}
                      <td className="py-3.5 px-3.5">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                          {item.nomorDokumen}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          {item.tanggalDokumen}
                        </div>
                      </td>

                      {/* Judul & Ringkasan */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                          {item.judul}
                        </div>
                        {item.keterangan && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.keterangan}
                          </div>
                        )}
                      </td>

                      {/* Kategori & Mapel */}
                      <td className="py-3.5 px-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.kategori.includes('Soal')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : item.kategori.includes('Kisi-Kisi')
                            ? 'bg-teal-100 text-teal-800 border border-teal-200'
                            : item.kategori.includes('Modul') || item.kategori.includes('Perangkat')
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : item.kategori.includes('SK')
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {item.kategori}
                        </span>
                        {item.mataPelajaran && (
                          <div className="text-[11px] text-slate-600 font-medium mt-1 truncate max-w-[170px]" title={item.mataPelajaran}>
                            {item.mataPelajaran}
                          </div>
                        )}
                      </td>

                      {/* Sasaran / Tahun Ajaran */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="font-semibold text-slate-700">{item.tingkatKelas || '-'}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          TP {item.tahunAjaran} ({item.semester})
                        </div>
                      </td>

                      {/* Penyusun */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-medium text-slate-800 truncate max-w-[140px]" title={item.penyusun}>
                          {item.penyusun}
                        </div>
                      </td>

                      {/* Lokasi Fisik */}
                      <td className="py-3.5 px-3.5">
                        <div className="text-[11px] text-emerald-800 bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-100 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="line-clamp-2 leading-tight">
                            {item.lokasiFisik || 'Arsip Digital'}
                          </span>
                        </div>
                      </td>

                      {/* Berkas File Preview CTA */}
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {item.fileData ? (
                          <button
                            onClick={() => setPreviewFileItem(item)}
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center gap-1 mx-auto transition-colors shadow-xs"
                            title="Pratinjau Berkas Dokumen"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Preview</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Tanpa File</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Dokumen"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Dokumen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAMPILAN KHUSUS SMARTPHONE / MOBILE (MD:HIDDEN)           */}
      {/* ========================================================= */}
      <div className="block md:hidden space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <FolderArchive className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600 text-xs">Belum ada arsip dokumen yang cocok.</p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setDetailItem(item)}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm active:scale-[0.99] transition-transform space-y-3 cursor-pointer"
            >
              {/* Top Row: Kode & Kategori */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {item.nomorDokumen}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.kategori.includes('Soal')
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.kategori.includes('Modul')
                    ? 'bg-amber-100 text-amber-800'
                    : item.kategori.includes('SK')
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.kategori}
                </span>
              </div>

              {/* Judul Dokumen */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.judul}
                </h3>
                {item.keterangan && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {item.keterangan}
                  </p>
                )}
              </div>

              {/* Chips Info */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {item.mataPelajaran && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-medium border border-blue-100">
                    {item.mataPelajaran}
                  </span>
                )}
                {item.tingkatKelas && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {item.tingkatKelas}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                  TP {item.tahunAjaran} ({item.semester})
                </span>
              </div>

              {/* Penyusun & Lokasi Fisik */}
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                <div className="text-slate-600 flex items-center justify-between">
                  <span className="text-slate-400">Penyusun:</span>
                  <span className="font-semibold text-slate-800">{item.penyusun}</span>
                </div>
                {item.lokasiFisik && (
                  <div className="text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.lokasiFisik}</span>
                  </div>
                )}
              </div>

              {/* Mobile Action Buttons (Direct Preview Button) */}
              <div className="pt-2 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                {item.fileData ? (
                  <button
                    onClick={() => setPreviewFileItem(item)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat / Preview Berkas</span>
                  </button>
                ) : (
                  <div className="flex-1 py-1.5 text-center text-xs text-slate-400 italic">
                    Tanpa Berkas Digital
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditItem(item)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
                    title="Edit Data"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200"
                    title="Hapus Data"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL DETAIL DOKUMEN LAIN                                 */}
      {/* ========================================================= */}
      <DetailDokumenLainModal
        item={detailItem}
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => {
          setDetailItem(null);
          onEditItem(item);
        }}
        onDelete={(id) => {
          setDetailItem(null);
          onDeleteItem(id);
        }}
        sekolah={sekolah}
      />

      {/* ========================================================= */}
      {/* MODAL PRATINJAU LANGSUNG BERKAS (MOBILE & DESKTOP)        */}
      {/* ========================================================= */}
      {previewFileItem && previewFileItem.fileData && (
        <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-sm flex flex-col p-2 sm:p-4">
          <div className="flex items-center justify-between text-white pb-3 max-w-5xl w-full mx-auto">
            <div className="overflow-hidden pr-2">
              <div className="text-xs font-mono text-blue-300 font-bold">
                {previewFileItem.nomorDokumen} • {previewFileItem.kategori}
              </div>
              <div className="text-sm font-bold truncate">
                {previewFileItem.judul}
              </div>
            </div>
            <button
              onClick={() => setPreviewFileItem(null)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Tutup [✕]
            </button>
          </div>
          <div className="flex-1 max-w-5xl w-full mx-auto bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10">
            <DocumentFileViewer
              fileData={previewFileItem.fileData}
              fileName={previewFileItem.fileName || previewFileItem.judul}
              fileType={previewFileItem.fileType}
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL PRINT BUKU REGISTER ARSIP DOKUMEN                   */}
      {/* ========================================================= */}
      {isPrintOpen && (
        <PrintDokumenLainView
          items={items}
          sekolah={sekolah}
          onClose={() => setIsPrintOpen(false)}
        />
      )}

    </div>
  );
};
