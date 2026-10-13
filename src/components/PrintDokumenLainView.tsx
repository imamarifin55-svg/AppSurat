import React, { useState } from 'react';
import { DokumenLainItem, IdentitasSekolah, KategoriDokumenLain } from '../types';
import { Printer, X, FolderArchive, Check } from 'lucide-react';

interface PrintDokumenLainViewProps {
  items: DokumenLainItem[];
  sekolah: IdentitasSekolah;
  onClose: () => void;
}

export const PrintDokumenLainView: React.FC<PrintDokumenLainViewProps> = ({
  items,
  sekolah,
  onClose
}) => {
  const [selectedKategori, setSelectedKategori] = useState<string>('ALL');
  const [selectedTahun, setSelectedTahun] = useState<string>('ALL');
  const [orientasi, setOrientasi] = useState<'landscape' | 'portrait'>('landscape');

  const tahunList = Array.from(new Set(items.map((i) => i.tahunAjaran))).filter(Boolean);

  const filteredItems = items.filter((item) => {
    if (selectedKategori !== 'ALL' && item.kategori !== selectedKategori) return false;
    if (selectedTahun !== 'ALL' && item.tahunAjaran !== selectedTahun) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-4 overflow-y-auto">
      
      {/* Dynamic CSS rule for A4 Page Size */}
      <style>{`
        @page {
          size: A4 ${orientasi};
          margin: ${orientasi === 'landscape' ? '8mm 10mm' : '10mm 10mm'};
        }
        @media print {
          html, body {
            width: ${orientasi === 'landscape' ? '297mm' : '210mm'};
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .a4-print-sheet {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Floating Action Bar (Hidden on Print) */}
      <div className="sticky top-2 z-60 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 mb-4 print:hidden max-w-5xl w-full">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mr-2">
            <FolderArchive className="w-4 h-4 text-blue-600" />
            <span>Katalog Arsip Dokumen</span>
          </div>

          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Lembar Soal / Asesmen">Lembar Soal / Asesmen</option>
            <option value="Kisi-Kisi & Kunci Jawaban">Kisi-Kisi & Kunci Jawaban</option>
            <option value="Perangkat Ajar / Modul">Perangkat Ajar / Modul</option>
            <option value="Kurikulum & Jadwal">Kurikulum & Jadwal</option>
            <option value="SK & Berita Acara">SK & Berita Acara</option>
            <option value="Laporan & LPJ">Laporan & LPJ</option>
            <option value="Dokumen Akreditasi">Dokumen Akreditasi</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          {tahunList.length > 0 && (
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Tahun Ajaran</option>
              {tahunList.map((th) => (
                <option key={th} value={th}>
                  TP {th}
                </option>
              ))}
            </select>
          )}

          <div className="flex rounded-lg border border-slate-300 overflow-hidden text-xs">
            <button
              onClick={() => setOrientasi('landscape')}
              className={`px-2.5 py-1.5 font-medium ${
                orientasi === 'landscape' ? 'bg-blue-600 text-white font-bold' : 'bg-white text-slate-700'
              }`}
            >
              Landscape
            </button>
            <button
              onClick={() => setOrientasi('portrait')}
              className={`px-2.5 py-1.5 font-medium ${
                orientasi === 'portrait' ? 'bg-blue-600 text-white font-bold' : 'bg-white text-slate-700'
              }`}
            >
              Portrait
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div
        className={`a4-print-sheet bg-white text-black p-8 sm:p-10 shadow-2xl rounded-sm print:p-0 print:shadow-none transition-all ${
          orientasi === 'landscape' ? 'w-full max-w-[297mm]' : 'w-full max-w-[210mm]'
        }`}
      >
        {/* Kop Surat Sekolah Resmi */}
        <div className="border-b-[3px] border-double border-black pb-3 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Pemda */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
              {sekolah.logoPemda ? (
                <img
                  src={sekolah.logoPemda}
                  alt="Lambang Pemda"
                  className="max-h-20 sm:max-h-24 max-w-full object-contain"
                />
              ) : (
                <div className="w-16 h-16 border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400">
                  Logo Pemda
                </div>
              )}
            </div>

            {/* Identitas Instansi */}
            <div className="flex-1 text-center px-2">
              <h3 className="text-xs sm:text-sm uppercase tracking-widest font-semibold text-black">
                PEMERINTAH {sekolah.kabupatenKota.replace(/^kab\.\s*/i, 'Kabupaten ').toUpperCase()}
              </h3>
              <h2 className="text-sm sm:text-base uppercase tracking-wider font-bold text-black mt-0.5">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h2>
              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-black mt-0.5">
                {sekolah.namaSekolah}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-black mt-1 leading-tight">
                {sekolah.alamat}, {sekolah.desaKelurahan}, {sekolah.kecamatan}, {sekolah.kabupatenKota}, {sekolah.provinsi} {sekolah.kodePos}
              </p>
              <p className="text-[9px] sm:text-[10px] text-black leading-tight mt-0.5">
                NPSN: {sekolah.npsn} {sekolah.akreditasi ? `• Akreditasi: ${sekolah.akreditasi}` : ''} • Telp: {sekolah.telepon} • Pos-el: {sekolah.email} {sekolah.website ? `• Laman: ${sekolah.website}` : ''}
              </p>
            </div>

            {/* Logo Sekolah */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
              {sekolah.logoSekolah ? (
                <img
                  src={sekolah.logoSekolah}
                  alt="Logo Sekolah"
                  className="max-h-20 sm:max-h-24 max-w-full object-contain"
                />
              ) : (
                <div className="w-16 h-16 border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400">
                  Logo Sekolah
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Judul Dokumen Cetak */}
        <div className="text-center my-4">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-black underline underline-offset-4">
            BUKU REGISTER ARSIP DOKUMEN LAINNYA
          </h2>
          <p className="text-xs font-semibold text-black mt-1">
            {selectedKategori === 'ALL'
              ? 'Lembar Soal, Kisi-Kisi, Perangkat Ajar, SK & Berkas Sekolah'
              : `Kategori: ${selectedKategori}`}
            {selectedTahun !== 'ALL' && ` • Tahun Ajaran: ${selectedTahun}`}
          </p>
        </div>

        {/* Tabel Data Arsip Dokumen */}
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-black border-collapse border border-black">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-black px-2 py-1.5 text-center w-8">No</th>
                <th className="border border-black px-2 py-1.5 text-center w-28">No. / Kode Arsip</th>
                <th className="border border-black px-2 py-1.5 text-left">Nama / Judul Dokumen</th>
                <th className="border border-black px-2 py-1.5 text-left w-32">Kategori & Mapel</th>
                <th className="border border-black px-2 py-1.5 text-center w-24">Kelas / TP</th>
                <th className="border border-black px-2 py-1.5 text-left w-36">Penyusun</th>
                <th className="border border-black px-2 py-1.5 text-left w-36">Lokasi Fisik</th>
                <th className="border border-black px-2 py-1.5 text-center w-16">Berkas</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="border border-black px-4 py-8 text-center text-slate-500 italic">
                    Belum ada data arsip dokumen untuk kategori ini.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 1 ? 'bg-slate-50' : ''}>
                    <td className="border border-black px-2 py-1.5 text-center font-mono">{idx + 1}</td>
                    <td className="border border-black px-2 py-1.5 font-mono font-bold text-center">
                      {item.nomorDokumen}
                    </td>
                    <td className="border border-black px-2 py-1.5">
                      <div className="font-bold">{item.judul}</div>
                      {item.keterangan && (
                        <div className="text-[10px] text-slate-600 mt-0.5 line-clamp-1">
                          {item.keterangan}
                        </div>
                      )}
                    </td>
                    <td className="border border-black px-2 py-1.5">
                      <div className="font-semibold">{item.kategori}</div>
                      {item.mataPelajaran && (
                        <div className="text-[10px] text-slate-700">{item.mataPelajaran}</div>
                      )}
                    </td>
                    <td className="border border-black px-2 py-1.5 text-center">
                      <div>{item.tingkatKelas || '-'}</div>
                      <div className="text-[10px] font-mono text-slate-600">{item.tahunAjaran} ({item.semester})</div>
                    </td>
                    <td className="border border-black px-2 py-1.5">{item.penyusun}</td>
                    <td className="border border-black px-2 py-1.5">{item.lokasiFisik || '-'}</td>
                    <td className="border border-black px-2 py-1.5 text-center font-semibold">
                      {item.fileData ? 'Ada' : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tanda Tangan Pengesahan (Kepala Sekolah & Kepala Urusan TU) */}
        <div className="mt-8 pt-4 flex justify-between text-xs text-black break-inside-avoid">
          <div className="text-center w-64">
            <p className="mb-1">Mengetahui,</p>
            <p className="font-bold">Kepala Sekolah</p>
            <div className="h-16"></div>
            <p className="font-bold underline uppercase">{sekolah.namaKepalaSekolah}</p>
            <p className="text-[11px]">NIP. {sekolah.nipKepalaSekolah}</p>
          </div>

          <div className="text-center w-64">
            <p className="mb-1">
              {sekolah.kecamatan}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-bold">Pengelola Arsip / Kaur TU</p>
            <div className="h-16"></div>
            <p className="font-bold underline uppercase">{sekolah.namaKepalaTU}</p>
            <p className="text-[11px]">NIP. {sekolah.nipKepalaTU}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
