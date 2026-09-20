import React, { useState } from 'react';
import { SuratItem, IdentitasSekolah, TipeSurat } from '../types';
import { formatTanggalPendek } from '../utils/formatters';
import { Printer, X, FileText, Check } from 'lucide-react';

interface PrintBukuAgendaViewProps {
  items: SuratItem[];
  sekolah: IdentitasSekolah;
  onClose: () => void;
}

export const PrintBukuAgendaView: React.FC<PrintBukuAgendaViewProps> = ({
  items,
  sekolah,
  onClose
}) => {
  const [selectedTipe, setSelectedTipe] = useState<TipeSurat>('MASUK');
  const [selectedTahun, setSelectedTahun] = useState<string>(new Date().getFullYear().toString());
  const [orientasi, setOrientasi] = useState<'landscape' | 'portrait'>('landscape');

  const filteredItems = items.filter((item) => {
    if (item.tipe !== selectedTipe) return false;
    if (selectedTahun && !item.tanggalSurat.startsWith(selectedTahun)) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-4 overflow-y-auto">
      
      {/* Dynamic CSS rule for strict A4 Page Size */}
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
      <div className="sticky top-2 z-60 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 mb-4 print:hidden max-w-4xl w-full">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tipe Agenda */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedTipe('MASUK')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                selectedTipe === 'MASUK' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda Surat Masuk
            </button>
            <button
              onClick={() => setSelectedTipe('KELUAR')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                selectedTipe === 'KELUAR' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda Surat Keluar
            </button>
          </div>

          {/* Pengaturan Ukuran Kertas A4 & Orientasi */}
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg">
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Kertas: A4
            </span>
            <div className="h-3 w-px bg-blue-200 mx-0.5"></div>
            <select
              value={orientasi}
              onChange={(e) => setOrientasi(e.target.value as 'landscape' | 'portrait')}
              className="text-[11px] bg-transparent font-semibold text-blue-800 cursor-pointer focus:outline-none"
            >
              <option value="landscape">Landscape (Standar Agenda)</option>
              <option value="portrait">Portrait (Tegak)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak A4 ({orientasi === 'landscape' ? 'Landscape' : 'Portrait'})</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 Paper Container) */}
      <div 
        className={`a4-print-sheet bg-white text-black p-8 sm:p-10 shadow-2xl rounded-sm print:p-0 print:shadow-none transition-all ${
          orientasi === 'landscape' ? 'w-full max-w-[297mm]' : 'w-full max-w-[210mm]'
        }`}
      >
        
        {/* Kop Surat Sekolah Resmi dengan Foto Pemda (Kiri) dan Logo Sekolah (Kanan) */}
        <div className="border-b-[3px] border-double border-black pb-3 mb-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo / Foto Pemda di sisi KIRI */}
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

            {/* Identitas Instansi di bagian TENGAH */}
            <div className="flex-1 text-center px-2">
              <h3 className="text-xs sm:text-sm uppercase tracking-widest font-semibold text-black">
                PEMERINTAH {sekolah.kabupatenKota.toUpperCase()}
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

            {/* Logo Sekolah Resmi di sisi KANAN */}
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

        {/* Judul Buku Register */}
        <div className="text-center my-3">
          <h2 className="text-base font-bold uppercase tracking-wider underline">
            BUKU REGISTER AGENDA {selectedTipe === 'MASUK' ? 'SURAT MASUK' : 'SURAT KELUAR'}
          </h2>
          <p className="text-xs font-semibold mt-0.5">
            Tahun Kalender / Ajaran: {selectedTahun}
          </p>
        </div>

        {/* Tabel Register */}
        <table className="w-full border-collapse border border-black text-[10px] my-3">
          <thead>
            <tr className="bg-slate-100 text-center font-bold">
              <th className="border border-black p-1.5 w-8">No</th>
              <th className="border border-black p-1.5 w-20">No. Agenda</th>
              <th className="border border-black p-1.5 w-20">
                {selectedTipe === 'MASUK' ? 'Tgl. Terima' : 'Tgl. Kirim'}
              </th>
              <th className="border border-black p-1.5 w-32">Nomor Surat</th>
              <th className="border border-black p-1.5 w-20">Tgl. Surat</th>
              <th className="border border-black p-1.5 w-36">
                {selectedTipe === 'MASUK' ? 'Asal Surat (Pengirim)' : 'Tujuan Surat'}
              </th>
              <th className="border border-black p-1.5">Perihal / Isi Ringkas</th>
              <th className="border border-black p-1.5 w-14">Kode</th>
              <th className="border border-black p-1.5 w-28">
                {selectedTipe === 'MASUK' ? 'Disposisi' : 'Penandatangan'}
              </th>
              <th className="border border-black p-1.5 w-20">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="border border-black p-6 text-center text-slate-500 italic">
                  Belum ada data {selectedTipe === 'MASUK' ? 'surat masuk' : 'surat keluar'} pada periode ini.
                </td>
              </tr>
            ) : (
              filteredItems.map((item, index) => (
                <tr key={item.id} className="align-top">
                  <td className="border border-black p-1.5 text-center font-mono">
                    {index + 1}
                  </td>
                  <td className="border border-black p-1.5 text-center font-mono font-semibold">
                    {item.noAgenda}
                  </td>
                  <td className="border border-black p-1.5 text-center">
                    {formatTanggalPendek(item.tanggalTerimaOrKirim)}
                  </td>
                  <td className="border border-black p-1.5 font-medium break-words">
                    {item.noSurat}
                  </td>
                  <td className="border border-black p-1.5 text-center">
                    {formatTanggalPendek(item.tanggalSurat)}
                  </td>
                  <td className="border border-black p-1.5 font-medium">
                    {selectedTipe === 'MASUK' ? item.pengirim : item.tujuan}
                  </td>
                  <td className="border border-black p-1.5">
                    <div className="font-semibold">{item.perihal}</div>
                    {item.ringkasan && (
                      <div className="text-[9px] text-slate-600 mt-0.5 line-clamp-2">
                        {item.ringkasan}
                      </div>
                    )}
                  </td>
                  <td className="border border-black p-1.5 text-center font-mono">
                    {item.kodeKlasifikasi}
                  </td>
                  <td className="border border-black p-1.5 text-[9px]">
                    {selectedTipe === 'MASUK' ? (
                      item.disposisi ? (
                        <div>
                          <div className="font-semibold text-blue-900">
                            {item.disposisi.tujuanJabatan.join(', ')}
                          </div>
                          <div className="italic text-slate-600">
                            {item.disposisi.instruksi[0]}
                          </div>
                        </div>
                      ) : (
                        <span className="italic text-slate-400">Belum Disposisi</span>
                      )
                    ) : (
                      item.penandatangan || '-'
                    )}
                  </td>
                  <td className="border border-black p-1.5 text-[9px] text-center">
                    <div>{item.lokasiArsipFisik || item.sifat}</div>
                    <div className="font-semibold">({item.status})</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Kolom Tanda Tangan Buku Agenda */}
        <div className="flex justify-between items-start mt-6 text-xs px-8">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala {sekolah.namaSekolah}</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{sekolah.namaKepalaSekolah}</p>
            <p>NIP. {sekolah.nipKepalaSekolah}</p>
          </div>

          <div className="text-center">
            <p>
              {sekolah.kabupatenKota.replace('Kabupaten ', '').replace('Kota ', '')},{' '}
              {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
            </p>
            <p className="font-bold">Kepala Urusan Tata Usaha,</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{sekolah.namaKepalaTU}</p>
            <p>NIP. {sekolah.nipKepalaTU}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
