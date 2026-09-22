import React, { useState } from 'react';
import { SuratIzinItem, IdentitasSekolah } from '../types';
import { formatTanggalIndo } from '../utils/formatters';
import { 
  Plus, 
  Search, 
  Filter, 
  GraduationCap, 
  Briefcase, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Paperclip, 
  Edit3, 
  Trash2, 
  Printer, 
  Eye, 
  Download,
  FileText,
  UserCheck
} from 'lucide-react';

interface SuratIzinViewProps {
  items: SuratIzinItem[];
  onOpenAddModal: () => void;
  onEditItem: (item: SuratIzinItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak') => void;
  sekolah: IdentitasSekolah;
}

export const SuratIzinView: React.FC<SuratIzinViewProps> = ({
  items,
  onOpenAddModal,
  onEditItem,
  onDeleteItem,
  onUpdateStatus,
  sekolah
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipe, setFilterTipe] = useState<'ALL' | 'Siswa' | 'Guru / Tendik'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [previewItem, setPreviewItem] = useState<SuratIzinItem | null>(null);

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorInduk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kelasAtauJabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alasan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTipe = filterTipe === 'ALL' || item.tipePemohon === filterTipe;
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;

    return matchSearch && matchTipe && matchStatus;
  });

  const siswaCount = items.filter((i) => i.tipePemohon === 'Siswa').length;
  const guruCount = items.filter((i) => i.tipePemohon === 'Guru / Tendik').length;
  const pendingCount = items.filter((i) => i.status === 'Menunggu Persetujuan').length;

  const handlePrintRekapIzin = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Izin Siswa (Kotak Gradasi Hijau Lembut) */}
        <div 
          id="stat-izin-siswa"
          onClick={() => setFilterTipe('Siswa')}
          className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-emerald-400/25 overflow-hidden flex items-center justify-between ${
            filterTipe === 'Siswa'
              ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white ring-4 ring-emerald-300/80 shadow-lg scale-[1.01]'
              : 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10">
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Izin Siswa</span>
            <div className="text-3xl font-bold text-white tracking-tight mt-1.5">{siswaCount}</div>
            <span className="text-[11px] text-emerald-100/90 font-medium">Catatan izin & sakit siswa</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs relative z-10">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Izin Guru / Tendik (Kotak Gradasi Kuning Lembut) */}
        <div 
          id="stat-izin-guru"
          onClick={() => setFilterTipe('Guru / Tendik')}
          className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-amber-300/30 overflow-hidden flex items-center justify-between ${
            filterTipe === 'Guru / Tendik'
              ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white ring-4 ring-amber-200/90 shadow-lg scale-[1.01]'
              : 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10">
            <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider">Izin Guru / Tendik</span>
            <div className="text-3xl font-bold text-white tracking-tight mt-1.5">{guruCount}</div>
            <span className="text-[11px] text-amber-100/90 font-medium">Dinas, sakit, & cuti</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs relative z-10">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Perlu Persetujuan (Kotak Gradasi Ungu Lembut) */}
        <div 
          id="stat-izin-pending"
          onClick={() => setFilterStatus('Menunggu Persetujuan')}
          className={`group relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border border-purple-300/30 overflow-hidden flex items-center justify-between ${
            filterStatus === 'Menunggu Persetujuan'
              ? 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white ring-4 ring-purple-300/80 shadow-lg scale-[1.01]'
              : 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white hover:brightness-105 hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">Perlu Persetujuan</span>
              {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-xs"></span>}
            </div>
            <div className="text-3xl font-bold text-white tracking-tight mt-1.5">{pendingCount}</div>
            <span className="text-[11px] text-purple-100/90 font-medium">
              {pendingCount > 0 ? 'Menunggu persetujuan kepala sekolah' : 'Semua telah disetujui'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/25 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs relative z-10">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/40">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 tracking-tight">
              <UserCheck className="w-5 h-5 text-sky-600" />
              <span>Buku Catatan Surat Izin (Siswa & Guru/Tendik)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Administrasi permohonan izin sakit, urusan keluarga, cuti, dan tugas dinas {sekolah.namaSekolah}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrintRekapIzin}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer"
              title="Cetak Rekap Surat Izin"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Cetak Rekap</span>
            </button>

            <button
              id="btn-tambah-surat-izin"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Surat Izin</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-84">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NISN/NIP, kelas, alasan..."
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-3 focus:ring-sky-500/20 focus:border-sky-400 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60 text-xs">
              <button
                onClick={() => setFilterTipe('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterTipe === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({items.length})
              </button>
              <button
                onClick={() => setFilterTipe('Siswa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterTipe === 'Siswa' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Siswa ({siswaCount})
              </button>
              <button
                onClick={() => setFilterTipe('Guru / Tendik')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterTipe === 'Guru / Tendik' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Guru / Tendik ({guruCount})
              </button>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-colors"
            >
              <option value="ALL">Semua Status</option>
              <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10.5px] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Pemohon & Induk</th>
                <th className="py-3 px-4">Kategori & Kelas/Jabatan</th>
                <th className="py-3 px-4">Jenis & Alasan Izin</th>
                <th className="py-3 px-4">Rentang Tanggal</th>
                <th className="py-3 px-4 text-center">Bukti Dokumen</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100/80 flex items-center justify-center text-slate-400 mx-auto mb-3">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Belum ada catatan surat izin</p>
                    <p className="text-xs text-slate-400 mt-1">Klik tombol "+ Catat Surat Izin" di atas untuk menambahkan data baru.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => {
                  const isSiswa = item.tipePemohon === 'Siswa';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                        {index + 1}
                      </td>

                      {/* Nama & Induk */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 text-xs">{item.namaLengkap}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.nomorInduk || '-'}
                        </div>
                      </td>

                      {/* Kategori & Kelas */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                          isSiswa ? 'bg-sky-50 text-sky-700 border-sky-200/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                        }`}>
                          {isSiswa ? <GraduationCap className="w-3 h-3 text-sky-500" /> : <Briefcase className="w-3 h-3 text-emerald-500" />}
                          {item.tipePemohon}
                        </span>
                        <div className="text-slate-700 font-medium text-[11px] mt-1">
                          {item.kelasAtauJabatan}
                        </div>
                      </td>

                      {/* Jenis & Alasan */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-slate-800 block text-xs">
                          {item.jenisIzin}
                        </span>
                        <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5 leading-relaxed">
                          {item.alasan}
                        </p>
                        {item.keterangan && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">
                            Catatan: {item.keterangan}
                          </div>
                        )}
                      </td>

                      {/* Rentang Tanggal */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-slate-800">
                          {formatTanggalIndo(item.tanggalMulai, false)}
                        </div>
                        {item.tanggalMulai !== item.tanggalSelesai && (
                          <div className="text-[11px] text-slate-500">
                            s/d {formatTanggalIndo(item.tanggalSelesai, false)}
                          </div>
                        )}
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                          {item.jumlahHari} Hari
                        </span>
                      </td>

                      {/* Bukti Dokumen */}
                      <td className="py-3.5 px-4 text-center">
                        {item.fileBuktiData ? (
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 hover:bg-sky-100/80 text-sky-700 text-[11px] font-medium rounded-lg border border-sky-200/70 transition-all cursor-pointer shadow-2xs"
                            title="Pratinjau Bukti Dokumen"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-sky-500" />
                            <span>Lihat Bukti</span>
                          </button>
                        ) : item.fileBuktiNama ? (
                          <span className="text-[10px] font-mono text-slate-500">
                            {item.fileBuktiNama}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Tidak ada</span>
                        )}
                      </td>

                      {/* Status Persetujuan */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                            item.status === 'Disetujui'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                              : item.status === 'Ditolak'
                              ? 'bg-slate-100 text-slate-600 border-slate-200/70'
                              : 'bg-rose-50 text-rose-700 border-rose-200/70'
                          }`}>
                            {item.status}
                          </span>
                          {item.status === 'Menunggu Persetujuan' && (
                            <button
                              onClick={() => onUpdateStatus(item.id, 'Disetujui')}
                              className="px-2 py-0.5 mt-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-md text-[10px] font-semibold transition-colors cursor-pointer"
                              title="Setujui permohonan izin"
                            >
                              ✓ Setujui
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Tombol Preview Lengkap */}
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 hover:bg-sky-100/80 text-sky-700 text-xs font-semibold rounded-lg border border-sky-200/70 transition-all cursor-pointer shadow-2xs"
                            title="Preview Surat Izin"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => onEditItem(item)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data Izin"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Hapus Catatan Izin"
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

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong>{filteredItems.length}</strong> dari <strong>{items.length}</strong> permohonan surat izin
          </span>
          <span className="font-medium">
            Tata Usaha • SMPN 14 Tulang Bawang Barat
          </span>
        </div>

      </div>

      {/* Preview Modal Khusus Surat Izin */}
      {previewItem && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Header Preview */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Preview Catatan Surat Izin {previewItem.tipePemohon}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {previewItem.namaLengkap} • {previewItem.kelasAtauJabatan}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Body Preview */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Surat Izin Card Resmi Format */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-serif">
                <div className="border-b-2 border-slate-300 pb-3 mb-3">
                  <div className="flex items-center justify-between gap-3 text-center">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      {sekolah.logoPemda ? (
                        <img src={sekolah.logoPemda} alt="Pemda" className="max-h-12 max-w-full object-contain" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] uppercase tracking-wider text-slate-600 font-sans font-bold">
                        LEMBAR KETERANGAN SURAT IZIN RESMI
                      </div>
                      <div className="text-sm font-black uppercase text-slate-900 mt-0.5">
                        {sekolah.namaSekolah}
                      </div>
                      <div className="text-[10px] font-sans text-slate-500 mt-0.5">
                        {sekolah.alamat}, {sekolah.kabupatenKota} • NPSN: {sekolah.npsn}
                      </div>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      {sekolah.logoSekolah ? (
                        <img src={sekolah.logoSekolah} alt="Sekolah" className="max-h-12 max-w-full object-contain" />
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="font-sans text-xs space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nama Pemohon:</span>
                      <span className="font-bold text-slate-900 text-sm">{previewItem.namaLengkap}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">NISN / NIP:</span>
                      <span className="font-mono text-slate-800">{previewItem.nomorInduk || '-'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Kategori & Posisi:</span>
                      <span className="font-semibold text-slate-800">{previewItem.tipePemohon} • {previewItem.kelasAtauJabatan}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Jenis Izin:</span>
                      <span className="font-bold text-blue-700">{previewItem.jenisIzin}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-slate-400 block text-[11px]">Rentang Waktu Izin:</span>
                    <span className="font-semibold text-slate-900">
                      {formatTanggalIndo(previewItem.tanggalMulai, true)} s/d {formatTanggalIndo(previewItem.tanggalSelesai, true)} ({previewItem.jumlahHari} Hari Kerja)
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-400 block text-[11px]">Alasan Permohonan:</span>
                    <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 italic mt-0.5">
                      "{previewItem.alasan}"
                    </p>
                  </div>

                  {previewItem.keterangan && (
                    <div className="pt-1">
                      <span className="text-slate-400 block text-[11px]">Keterangan Tugas / Guru Pengganti:</span>
                      <p className="text-slate-700 text-xs font-medium">{previewItem.keterangan}</p>
                    </div>
                  )}

                  <div className="pt-3 flex justify-between items-end border-t border-slate-200 mt-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        previewItem.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                      }`}>
                        {previewItem.status}
                      </span>
                    </div>
                    {previewItem.disetujuiOleh && (
                      <div className="text-right text-xs">
                        <div className="text-slate-400 text-[11px]">Disetujui Oleh:</div>
                        <div className="font-bold text-slate-900 underline mt-3">{previewItem.disetujuiOleh}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Berkas Bukti Lampiran Gambar / PDF jika ada */}
              {previewItem.fileBuktiData && (
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span>Lampiran Bukti Foto / Dokumen ({previewItem.fileBuktiNama || 'Berkas'})</span>
                    </span>
                    <a
                      href={previewItem.fileBuktiData}
                      download={previewItem.fileBuktiNama || 'Bukti_Izin'}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </a>
                  </div>

                  {previewItem.fileBuktiType?.startsWith('image/') || previewItem.fileBuktiData.startsWith('data:image/') ? (
                    <div className="p-2 bg-slate-100 rounded-lg flex justify-center">
                      <img
                        src={previewItem.fileBuktiData}
                        alt="Bukti Izin"
                        className="max-h-80 object-contain rounded border border-slate-300"
                      />
                    </div>
                  ) : (
                    <iframe
                      src={previewItem.fileBuktiData}
                      title="Bukti Dokumen"
                      className="w-full h-80 border rounded-lg"
                    />
                  )}
                </div>
              )}

            </div>

            {/* Footer Preview */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Ini</span>
              </button>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Tutup Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
