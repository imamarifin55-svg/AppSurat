export type TipeSurat = 'MASUK' | 'KELUAR';

export type SifatSurat = 'Biasa' | 'Penting' | 'Rahasia' | 'Sangat Segera';

export type StatusSuratMasuk = 'Menunggu Disposisi' | 'Proses Tindak Lanjut' | 'Selesai';
export type StatusSuratKeluar = 'Konsep' | 'Diterbitkan' | 'Terkirim';

export interface DisposisiData {
  tujuanJabatan: string[];
  instruksi: string[];
  catatan: string;
  tanggalDisposisi: string;
  statusTindakLanjut: string;
  penindakLanjut?: string;
  catatanTindakLanjut?: string;
}

export interface SuratItem {
  id: string;
  tipe: TipeSurat;
  noAgenda: string;
  noSurat: string;
  tanggalSurat: string;
  tanggalTerimaOrKirim: string;
  pengirim?: string; // Khusus Surat Masuk
  tujuan?: string;   // Khusus Surat Keluar
  perihal: string;
  ringkasan: string;
  kodeKlasifikasi: string;
  kategori: string;
  sifat: SifatSurat;
  status: StatusSuratMasuk | StatusSuratKeluar;
  lampiranJumlah: string;
  lampiranNama?: string;
  fileData?: string; // Data URL Base64 file lampiran dokumen (PDF/Gambar/Scan)
  fileType?: string; // MIME type (e.g. application/pdf, image/jpeg, image/png)
  fileSize?: number; // File size in bytes
  penandatangan?: string; // Khusus Surat Keluar
  lokasiArsipFisik?: string; // Misal: "Ordner A-01 / Rak 2"
  disposisi?: DisposisiData;
  createdAt: string;
  updatedAt: string;
}

export type TipeSuratIzin = 'Siswa' | 'Guru / Tendik';
export type JenisIzin = 'Sakit' | 'Izin Keperluan Keluarga / Mendesak' | 'Tugas Dinas / Pelatihan' | 'Cuti' | 'Lainnya';
export type StatusSuratIzin = 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';

export interface SuratIzinItem {
  id: string;
  tipePemohon: TipeSuratIzin;
  namaLengkap: string;
  nomorInduk: string; // NISN / NIP / NUPTK
  kelasAtauJabatan: string; // misal: Kelas 8A atau Guru Matematika
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  jumlahHari: number;
  alasan: string;
  keterangan?: string;
  status: StatusSuratIzin;
  disetujuiOleh?: string;
  fileBuktiNama?: string;
  fileBuktiData?: string;
  fileBuktiType?: string;
  createdAt: string;
  updatedAt: string;
}

export type KategoriDokumenLain = 
  | 'Lembar Soal / Asesmen'
  | 'Kisi-Kisi & Kunci Jawaban'
  | 'Perangkat Ajar / Modul'
  | 'Kurikulum & Jadwal'
  | 'SK & Berita Acara'
  | 'Laporan & LPJ'
  | 'Dokumen Akreditasi'
  | 'Lainnya';

export interface DokumenLainItem {
  id: string;
  nomorDokumen: string; // e.g. "ARS-2026/SL-001" atau kode dokumen
  judul: string; // e.g. "Naskah Soal Sumatif Akhir Semester Ganjil - IPA Kelas 8"
  kategori: KategoriDokumenLain;
  mataPelajaran?: string; // e.g. "IPA", "Matematika", "Bahasa Indonesia", dll.
  tingkatKelas?: string; // e.g. "Kelas 7", "Kelas 8", "Kelas 9", "Semua Kelas", "Guru / Tendik"
  tahunAjaran: string; // e.g. "2026/2027"
  semester: 'Ganjil' | 'Genap' | 'Semua / Tahunan';
  tanggalDokumen: string; // YYYY-MM-DD
  penyusun: string; // Guru / Tim Penyusun / Tendik
  lokasiFisik?: string; // Misal: "Ordner Soal Sem. 1 / Lemari 2 Rak A"
  keterangan?: string;
  fileName?: string;
  fileData?: string; // Data URL Base64 file dokumen (PDF/Gambar/Scan)
  fileType?: string; // MIME type
  fileSize?: number; // Bytes
  createdAt: string;
  updatedAt: string;
}

export interface IdentitasSekolah {
  namaSekolah: string;
  npsn: string;
  akreditasi?: string;
  statusSekolah: 'Negeri' | 'Swasta';
  jenjang: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaKepalaTU: string;
  nipKepalaTU: string;
  logoPemda?: string; // Data URL Base64 Lambang / Foto Pemerintah Daerah / Dinas Pendidikan
  logoSekolah?: string; // Data URL Base64 Logo Resmi Sekolah
}

export interface KodeKlasifikasi {
  kode: string;
  nama: string;
  kategori: string;
  deskripsi: string;
}

export type TipeItemTerhapus = 'SURAT' | 'SURAT_IZIN' | 'DOKUMEN_LAIN';

export interface DokumenTerhapusItem {
  id: string; // e.g. "trash-xxx"
  originalId: string;
  tipeItem: TipeItemTerhapus;
  judul: string;
  nomor: string;
  kategori: string;
  tanggalDokumen: string;
  dihapusPada: string; // ISO string
  alasanHapus?: string;
  dihapusOleh?: string;
  fileName?: string;
  fileData?: string;
  fileType?: string;
  fileSize?: number;
  originalData: SuratItem | SuratIzinItem | DokumenLainItem;
}
