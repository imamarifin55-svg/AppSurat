import { KodeKlasifikasi } from '../types';

export const DAFTAR_KLASIFIKASI: KodeKlasifikasi[] = [
  {
    kode: '421.1',
    nama: 'Kurikulum & Pembelajaran',
    kategori: 'Kurikulum',
    deskripsi: 'Perangkat pembelajaran, kalender pendidikan, silabus, jadwal pelajaran, ANBK, dan asesmen sekolah.'
  },
  {
    kode: '421.2',
    nama: 'Kesiswaan & Ekstrakurikuler',
    kategori: 'Kesiswaan',
    deskripsi: 'PPDB, mutasi siswa, OSIS, kegiatan pramuka, lomba/prestasi, tata tertib, dan beasiswa (PIP).'
  },
  {
    kode: '421.3',
    nama: 'Sarana & Prasarana Sekolah',
    kategori: 'Sarpras',
    deskripsi: 'Pengadaan barang, perbaikan gedung, ruang kelas, laboratorium, perpustakaan, dan inventaris barang sekolah.'
  },
  {
    kode: '421.4',
    nama: 'Humas & Hubungan Kerja Sama',
    kategori: 'Humas',
    deskripsi: 'Surat komite sekolah, paguyuban orang tua murid, kemitraan instansi, dan kunjungan kedinasan.'
  },
  {
    kode: '421.5',
    nama: 'Kepegawaian Pendidik & Tenaga Kependidikan',
    kategori: 'Kepegawaian',
    deskripsi: 'SK Pembagian Tugas Mengajar, cuti guru, mutasi guru, izin belajar, dan administrasi kepegawaian.'
  },
  {
    kode: '421.6',
    nama: 'Keuangan & Pengelolaan Dana BOS',
    kategori: 'Keuangan',
    deskripsi: 'RKAS, laporan realisasi dana BOSP/BOSDA, SPJ, perpajakan, dan sumbangan sukarela.'
  },
  {
    kode: '005',
    nama: 'Undangan Resmi Kedinasan',
    kategori: 'Undangan',
    deskripsi: 'Surat undangan rapat dinas, sosialisasi, peringatan hari besar nasional/keagamaan, atau workshop.'
  },
  {
    kode: '800',
    nama: 'Kepegawaian Umum',
    kategori: 'Kepegawaian',
    deskripsi: 'Kenaikan pangkat, PAK guru, pensiun, dan disiplin pegawai.'
  },
  {
    kode: '090',
    nama: 'Perjalanan Dinas (SPPD)',
    kategori: 'Perjalanan Dinas',
    deskripsi: 'Surat tugas dan Surat Perintah Perjalanan Dinas (SPPD) kepala sekolah, guru, atau staf TU.'
  },
  {
    kode: '420',
    nama: 'Pendidikan Umum',
    kategori: 'Pendidikan Umum',
    deskripsi: 'Kebijakan umum bidang pendidikan dari kementerian atau dinas pendidikan provinsi/kabupaten/kota.'
  }
];

export const JABATAN_SEKOLAH: string[] = [
  'Wakil Kepala Sekolah Bidang Kurikulum',
  'Wakil Kepala Sekolah Bidang Kesiswaan',
  'Wakil Kepala Sekolah Bidang Sarana & Prasarana',
  'Wakil Kepala Sekolah Bidang Hubungan Masyarakat',
  'Kepala Urusan Tata Usaha',
  'Koordinator Bimbingan dan Konseling (BK)',
  'Pembina Organisasi Siswa Intra Sekolah (OSIS)',
  'Bendahara BOS / Sekolah',
  'Pengelola Perpustakaan',
  'Kepala Laboratorium Komputer/IPA',
  'Guru Piket Harian',
  'Wali Kelas'
];

export const INSTRUKSI_DISPOSISI: string[] = [
  'Tindak lanjuti segera sesuai ketentuan',
  'Hadir dan wakili Kepala Sekolah',
  'Pelajari, teliti, dan beri telaah/masukan',
  'Siapkan bahan materi/konsep surat balasan',
  'Koordinasikan dengan pihak terkait/guru',
  'Sosialisasikan kepada guru & peserta didik',
  'Arsipkan dan simpan dalam berkas agenda'
];
