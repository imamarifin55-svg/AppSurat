import React from 'react';
import { SuratItem, IdentitasSekolah } from '../types';
import { JABATAN_SEKOLAH, INSTRUKSI_DISPOSISI } from '../data/klasifikasiSurat';
import { formatTanggalIndo } from '../utils/formatters';
import { Printer, X } from 'lucide-react';

interface PrintDisposisiViewProps {
  item: SuratItem;
  sekolah: IdentitasSekolah;
  onClose: () => void;
}

export const PrintDisposisiView: React.FC<PrintDisposisiViewProps> = ({
  item,
  sekolah,
  onClose
}) => {
  const disposisi = item.disposisi;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-start p-2 sm:p-4 overflow-y-auto">
      
      {/* Floating Action Bar (Hidden on Print) */}
      <div className="sticky top-2 z-60 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-slate-200 flex items-center gap-3 mb-4 print:hidden">
        <span className="text-xs font-semibold text-slate-700">
          Pratinjau Lembar Disposisi ({item.noAgenda})
        </span>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Sekarang</span>
        </button>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Printable Sheet (Simulating standard A4 page) */}
      <div className="bg-white text-black w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-2xl rounded-sm print:p-0 print:shadow-none print:w-full print:max-w-none">
        
        {/* Kop Surat Sekolah Resmi dengan Foto Pemda (Kiri) dan Logo Sekolah (Kanan) */}
        <div className="border-b-[3px] border-double border-black pb-3 mb-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo / Foto Pemda di sisi KIRI */}
            <div className="w-20 h-20 flex items-center justify-center shrink-0">
              {sekolah.logoPemda ? (
                <img 
                  src={sekolah.logoPemda} 
                  alt="Lambang Pemda" 
                  className="max-h-20 max-w-full object-contain" 
                />
              ) : (
                <div className="w-16 h-16 border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400">
                  Logo Pemda
                </div>
              )}
            </div>

            {/* Identitas Instansi di bagian TENGAH */}
            <div className="flex-1 text-center px-2">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-black">
                PEMERINTAH {sekolah.kabupatenKota.toUpperCase()}
              </h3>
              <h2 className="text-sm uppercase tracking-wider font-bold text-black mt-0.5">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h2>
              <h1 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">
                {sekolah.namaSekolah}
              </h1>
              <p className="text-[11px] text-black mt-1 leading-tight">
                {sekolah.alamat}, {sekolah.desaKelurahan}, {sekolah.kecamatan}, {sekolah.kabupatenKota}, {sekolah.provinsi} {sekolah.kodePos}
              </p>
              <p className="text-[10px] text-black leading-tight mt-0.5">
                NPSN: {sekolah.npsn} {sekolah.akreditasi ? `• Terakreditasi: ${sekolah.akreditasi}` : ''} • Telp: {sekolah.telepon} • Pos-el: {sekolah.email} {sekolah.website ? `• Laman: ${sekolah.website}` : ''}
              </p>
            </div>

            {/* Logo Sekolah Resmi di sisi KANAN */}
            <div className="w-20 h-20 flex items-center justify-center shrink-0">
              {sekolah.logoSekolah ? (
                <img 
                  src={sekolah.logoSekolah} 
                  alt="Logo Sekolah" 
                  className="max-h-20 max-w-full object-contain" 
                />
              ) : (
                <div className="w-16 h-16 border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400">
                  Logo Sekolah
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Judul Lembar Disposisi */}
        <div className="text-center my-3">
          <h2 className="text-base font-bold uppercase underline tracking-wider">
            LEMBAR DISPOSISI KEPALA SEKOLAH
          </h2>
          <p className="text-xs font-semibold mt-0.5">
            NO. AGENDA: <span className="font-mono">{item.noAgenda}</span>
          </p>
        </div>

        {/* Tabel Metadata Surat Masuk */}
        <table className="w-full border-collapse border border-black text-xs mb-4">
          <tbody>
            <tr>
              <td className="border border-black px-2.5 py-1.5 font-semibold w-32 bg-slate-100">
                Surat Dari
              </td>
              <td className="border border-black px-2.5 py-1.5 font-medium" colSpan={3}>
                {item.pengirim || '-'}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2.5 py-1.5 font-semibold bg-slate-100">
                No. Surat Asli
              </td>
              <td className="border border-black px-2.5 py-1.5 font-mono">
                {item.noSurat}
              </td>
              <td className="border border-black px-2.5 py-1.5 font-semibold w-32 bg-slate-100">
                Tgl. Diterima
              </td>
              <td className="border border-black px-2.5 py-1.5">
                {formatTanggalIndo(item.tanggalTerimaOrKirim)}
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2.5 py-1.5 font-semibold bg-slate-100">
                Tanggal Surat
              </td>
              <td className="border border-black px-2.5 py-1.5">
                {formatTanggalIndo(item.tanggalSurat)}
              </td>
              <td className="border border-black px-2.5 py-1.5 font-semibold bg-slate-100">
                Sifat Surat
              </td>
              <td className="border border-black px-2.5 py-1.5 font-bold">
                [ {item.sifat === 'Sangat Segera' ? 'X' : ' '} ] Sangat Segera &nbsp;&nbsp;
                [ {item.sifat === 'Penting' ? 'X' : ' '} ] Penting &nbsp;&nbsp;
                [ {item.sifat === 'Rahasia' ? 'X' : ' '} ] Rahasia &nbsp;&nbsp;
                [ {item.sifat === 'Biasa' ? 'X' : ' '} ] Biasa
              </td>
            </tr>
            <tr>
              <td className="border border-black px-2.5 py-1.5 font-semibold bg-slate-100">
                Perihal
              </td>
              <td className="border border-black px-2.5 py-1.5 font-semibold" colSpan={3}>
                {item.perihal}
              </td>
            </tr>
            {item.ringkasan && (
              <tr>
                <td className="border border-black px-2.5 py-1.5 font-semibold bg-slate-100 align-top">
                  Isi Ringkas
                </td>
                <td className="border border-black px-2.5 py-1.5 text-[11px]" colSpan={3}>
                  {item.ringkasan}
                </td>
              </tr>
            )}
            <tr>
              <td className="border border-black px-2.5 py-1.5 font-semibold bg-slate-100">
                Klasifikasi
              </td>
              <td className="border border-black px-2.5 py-1.5">
                {item.kodeKlasifikasi} ({item.kategori})
              </td>
              <td className="border border-black px-2.5 py-1.5 font-semibold bg-slate-100">
                Lampiran
              </td>
              <td className="border border-black px-2.5 py-1.5">
                {item.lampiranJumlah || 'Nihil'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Dua Kolom: Diteruskan Kepada & Instruksi */}
        <div className="grid grid-cols-2 gap-4 border border-black p-3 text-xs mb-4">
          
          {/* Kolom Kiri: Diteruskan Kepada */}
          <div>
            <div className="font-bold border-b border-black pb-1 mb-2 uppercase text-[11px]">
              Diteruskan Kepada Sdr.:
            </div>
            <div className="space-y-1.5">
              {JABATAN_SEKOLAH.map((jabatan) => {
                const isChecked = disposisi?.tujuanJabatan?.includes(jabatan);
                return (
                  <div key={jabatan} className="flex items-start gap-1.5">
                    <span className="font-mono font-bold">
                      [{isChecked ? '✓' : ' '}]
                    </span>
                    <span className={isChecked ? 'font-bold' : 'text-black'}>
                      {jabatan}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan: Instruksi / Petunjuk */}
          <div>
            <div className="font-bold border-b border-black pb-1 mb-2 uppercase text-[11px]">
              Instruksi / Petunjuk Kepala Sekolah:
            </div>
            <div className="space-y-1.5">
              {INSTRUKSI_DISPOSISI.map((inst) => {
                const isChecked = disposisi?.instruksi?.includes(inst);
                return (
                  <div key={inst} className="flex items-start gap-1.5">
                    <span className="font-mono font-bold">
                      [{isChecked ? '✓' : ' '}]
                    </span>
                    <span className={isChecked ? 'font-bold' : 'text-black'}>
                      {inst}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Catatan Arahan Kepala Sekolah */}
        <div className="border border-black p-3 text-xs min-h-[90px] mb-4">
          <div className="font-bold uppercase text-[11px] mb-1">
            Catatan / Pesan Khusus Kepala Sekolah:
          </div>
          <div className="text-xs italic leading-relaxed whitespace-pre-wrap">
            {disposisi?.catatan ? `"${disposisi.catatan}"` : '- (Tidak ada catatan khusus) -'}
          </div>
        </div>

        {/* Tanda Tangan & Tanggal Disposisi */}
        <div className="flex justify-end mt-4 text-xs">
          <div className="w-64 text-center">
            <p>
              {sekolah.kabupatenKota.replace('Kabupaten ', '').replace('Kota ', '')},{' '}
              {formatTanggalIndo(disposisi?.tanggalDisposisi || item.tanggalTerimaOrKirim)}
            </p>
            <p className="font-bold mt-1">Kepala {sekolah.namaSekolah}</p>
            <div className="h-16"></div>
            <p className="font-bold underline">{sekolah.namaKepalaSekolah}</p>
            <p>NIP. {sekolah.nipKepalaSekolah}</p>
          </div>
        </div>

        {/* Catatan Kaki Alur Surat */}
        <div className="mt-8 pt-2 border-t border-dashed border-black/40 text-[9px] text-black/70 flex justify-between">
          <span>Dicetak dari Sistem Agenda Persuratan Digital Sekolah</span>
          <span>Lembar ini wajib dikembalikan ke Tata Usaha setelah ditindaklanjuti</span>
        </div>

      </div>

    </div>
  );
};
