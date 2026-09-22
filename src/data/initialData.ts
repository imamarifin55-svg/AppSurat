import { SuratItem, IdentitasSekolah, SuratIzinItem } from '../types';

export const DEFAULT_LOGO_PEMDA = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120"><path d="M50 5 L88 22 L88 65 C88 92 50 114 50 114 C50 114 12 92 12 65 L12 22 Z" fill="%231e3a8a" stroke="%23f59e0b" stroke-width="3"/><path d="M50 15 L78 28 L78 62 C78 84 50 102 50 102 C50 102 22 84 22 62 L22 28 Z" fill="%230284c7"/><polygon points="50,24 53,33 63,33 55,39 58,48 50,42 42,48 45,39 37,33 47,33" fill="%23fbbf24"/><path d="M30 75 Q50 90 70 75" fill="none" stroke="%23fbbf24" stroke-width="4"/><circle cx="50" cy="58" r="14" fill="%23ffffff" stroke="%23f59e0b" stroke-width="2"/><path d="M42 58 L47 64 L58 52" fill="none" stroke="%2316a34a" stroke-width="3" stroke-linecap="round"/><text x="50" y="86" font-size="8" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">PEMDA</text></svg>';

export const DEFAULT_LOGO_SEKOLAH = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120"><polygon points="50,5 92,35 76,95 24,95 8,35" fill="%23059669" stroke="%23f59e0b" stroke-width="3"/><polygon points="50,15 82,39 70,87 30,87 18,39" fill="%2310b981"/><path d="M32 55 C38 45 48 46 50 54 C52 46 62 45 68 55 C60 62 50 60 50 68 C50 60 40 62 32 55 Z" fill="%23ffffff"/><path d="M50 32 L46 44 L54 44 Z" fill="%23ef4444"/><circle cx="50" cy="28" r="4" fill="%23f59e0b"/><rect x="36" y="66" width="28" height="6" rx="2" fill="%23fef08a"/><path d="M28 78 L50 72 L72 78 L50 82 Z" fill="%23ffffff"/><text x="50" y="107" font-size="8" font-family="sans-serif" font-weight="bold" fill="%231e293b" text-anchor="middle">TUT WURI</text></svg>';

export const INITIAL_SEKOLAH: IdentitasSekolah = {
  namaSekolah: 'SMPN 14 Tulang Bawang Barat',
  npsn: '10809848',
  akreditasi: 'B',
  statusSekolah: 'Negeri',
  jenjang: 'SMP (Sekolah Menengah Pertama)',
  alamat: 'Jl. Poros Tiyuh Marga Jaya',
  desaKelurahan: 'Tiyuh Marga Jaya',
  kecamatan: 'Gunung Agung',
  kabupatenKota: 'Kabupaten Tulang Bawang Barat',
  provinsi: 'Provinsi Lampung',
  kodePos: '34684',
  telepon: '(0726) 781203',
  email: 'smpn14tubaba@admin.smp.belajar.id',
  website: 'smpn14tubaba.sch.id',
  namaKepalaSekolah: 'Imam Arifin, S.Pd., M.Pd.',
  nipKepalaSekolah: '19810415 200604 1 008',
  namaKepalaTU: 'Kaur Tata Usaha SMPN 14 Tubaba',
  nipKepalaTU: '19850912 201001 1 012',
  logoPemda: DEFAULT_LOGO_PEMDA,
  logoSekolah: DEFAULT_LOGO_SEKOLAH
};

export const INITIAL_SURAT: SuratItem[] = [
  {
    id: 'sm-001',
    tipe: 'MASUK',
    noAgenda: 'SM-2026-001',
    noSurat: '421.3/0892/Disdikbud-TBB/2026',
    tanggalSurat: '2026-09-12',
    tanggalTerimaOrKirim: '2026-09-14',
    pengirim: 'Dinas Pendidikan dan Kebudayaan Kabupaten Tulang Bawang Barat',
    perihal: 'Pemberitahuan Pelaksanaan Simulasi & Gladi Bersih ANBK SMP Tahun Ajaran 2026/2027',
    ringkasan: 'Instruksi persiapan teknis server, proktor, teknisi, dan gladi bersih ANBK bagi seluruh siswa kelas VIII pada tanggal 28-30 September 2026.',
    kodeKlasifikasi: '421.1',
    kategori: 'Kurikulum',
    sifat: 'Penting',
    status: 'Proses Tindak Lanjut',
    lampiranJumlah: '1 Berkas (Jadwal & POS ANBK)',
    lampiranNama: 'POS_Gladi_ANBK_2026.pdf',
    lokasiArsipFisik: 'Ordner SM-Kurikulum / Lemari 1 Rak B',
    disposisi: {
      tujuanJabatan: [
        'Wakil Kepala Sekolah Bidang Kurikulum',
        'Kepala Laboratorium Komputer/IPA',
        'Kepala Urusan Tata Usaha'
      ],
      instruksi: [
        'Tindak lanjuti segera sesuai ketentuan',
        'Koordinasikan dengan pihak terkait/guru',
        'Siapkan bahan materi/konsep surat balasan'
      ],
      catatan: 'Segera cek kesiapan 40 unit PC client & proktor utama. Adakan rapat koordinasi proktor hari Senin.',
      tanggalDisposisi: '2026-09-15',
      statusTindakLanjut: 'Proktor telah memeriksa spesifikasi PC dan membuat jadwal sesi gladi.',
      penindakLanjut: 'Waka Kurikulum & Ka. Labkom'
    },
    createdAt: '2026-09-14T08:30:00Z',
    updatedAt: '2026-09-15T10:15:00Z'
  },
  {
    id: 'sm-002',
    tipe: 'MASUK',
    noAgenda: 'SM-2026-002',
    noSurat: '005/112/PKM-GA/IX/2026',
    tanggalSurat: '2026-09-15',
    tanggalTerimaOrKirim: '2026-09-16',
    pengirim: 'Puskesmas Rawat Inap Gunung Agung',
    perihal: 'Pemeriksaan Kesehatan Berkala & Penjaringan Kesehatan Peserta Didik Baru',
    ringkasan: 'Pemberitahuan jadwal kunjungan tim medis Puskesmas untuk skrining kesehatan umum, gigi, dan anemia bagi seluruh siswa kelas VII pada tanggal 24 September 2026.',
    kodeKlasifikasi: '421.2',
    kategori: 'Kesiswaan',
    sifat: 'Biasa',
    status: 'Menunggu Disposisi',
    lampiranJumlah: '1 Lembar (Format Data Siswa)',
    lampiranNama: 'Jadwal_Skrining_Puskesmas.pdf',
    lokasiArsipFisik: 'Ordner SM-Kesiswaan / Lemari 1 Rak C',
    createdAt: '2026-09-16T09:45:00Z',
    updatedAt: '2026-09-16T09:45:00Z'
  },
  {
    id: 'sm-003',
    tipe: 'MASUK',
    noAgenda: 'SM-2026-003',
    noSurat: '005/014/KOMITE-SMP14/2026',
    tanggalSurat: '2026-09-17',
    tanggalTerimaOrKirim: '2026-09-18',
    pengirim: 'Pengurus Komite SMPN 14 Tulang Bawang Barat',
    perihal: 'Permohonan Fasilitasi Rapat Pleno Rencana Kerja Anggaran Sekolah (RKAS)',
    ringkasan: 'Permohonan pemakaian aula sekolah dan kehadiran dewan guru dalam rangka pemaparan program komite bersama perwakilan orang tua murid semester ganjil.',
    kodeKlasifikasi: '421.4',
    kategori: 'Humas',
    sifat: 'Penting',
    status: 'Proses Tindak Lanjut',
    lampiranJumlah: '1 Berkas',
    lokasiArsipFisik: 'Ordner SM-Komite / Lemari 2 Rak A',
    disposisi: {
      tujuanJabatan: [
        'Wakil Kepala Sekolah Bidang Sarana & Prasarana',
        'Wakil Kepala Sekolah Bidang Hubungan Masyarakat'
      ],
      instruksi: [
        'Tindak lanjuti segera sesuai ketentuan',
        'Koordinasikan dengan pihak terkait/guru'
      ],
      catatan: 'Fasilitasi aula dan sound system. Konfirmasi ketersediaan tempat pada Sabtu, 26 September.',
      tanggalDisposisi: '2026-09-18',
      statusTindakLanjut: 'Aula dan LCD Proyektor sudah dipesan untuk tanggal tersebut.'
    },
    createdAt: '2026-09-18T11:00:00Z',
    updatedAt: '2026-09-18T13:20:00Z'
  },
  {
    id: 'sk-001',
    tipe: 'KELUAR',
    noAgenda: 'SK-2026-001',
    noSurat: '421.3/145/SMPN.14/TBB/IX/2026',
    tanggalSurat: '2026-09-14',
    tanggalTerimaOrKirim: '2026-09-15',
    tujuan: 'Orang Tua / Wali Murid Kelas VII, VIII, dan IX',
    perihal: 'Pemberitahuan Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil TP 2026/2027',
    ringkasan: 'Surat edaran jadwal PTS, tata tertib pelaksanaan, dan imbauan agar mendampingi belajar peserta didik di rumah.',
    kodeKlasifikasi: '421.1',
    kategori: 'Kurikulum',
    sifat: 'Biasa',
    status: 'Terkirim',
    lampiranJumlah: '1 Lembar (Jadwal Ujian)',
    lampiranNama: 'Jadwal_PTS_Ganjil_2026.pdf',
    penandatangan: 'Imam Arifin, S.Pd., M.Pd.',
    lokasiArsipFisik: 'Ordner SK-Resmi / Lemari 2 Rak B',
    createdAt: '2026-09-14T14:00:00Z',
    updatedAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'sk-002',
    tipe: 'KELUAR',
    noAgenda: 'SK-2026-002',
    noSurat: '421.6/146/SMPN.14/TBB/IX/2026',
    tanggalSurat: '2026-09-17',
    tanggalTerimaOrKirim: '2026-09-18',
    tujuan: 'Kepala Dinas Pendidikan Kabupaten Tulang Bawang Barat (Up. Tim Manajemen BOS)',
    perihal: 'Penyampaian Laporan SPJ Realisasi Bantuan Operasional Satuan Pendidikan (BOSP) Tahap II',
    ringkasan: 'Pengiriman berkas laporan fisik pertanggungjawaban penyerapan dana BOSP Reguler periode Mei - Agustus 2026.',
    kodeKlasifikasi: '421.6',
    kategori: 'Keuangan',
    sifat: 'Penting',
    status: 'Terkirim',
    lampiranJumlah: '1 Jilid Buku SPJ',
    lampiranNama: 'Laporan_BOSP_Tahap2_2026.pdf',
    penandatangan: 'Imam Arifin, S.Pd., M.Pd.',
    lokasiArsipFisik: 'Ordner SK-BOS / Lemari 3 Rak Keuangan',
    createdAt: '2026-09-17T15:30:00Z',
    updatedAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'sk-003',
    tipe: 'KELUAR',
    noAgenda: 'SK-2026-003',
    noSurat: '421.2/147/SMPN.14/TBB/IX/2026',
    tanggalSurat: '2026-09-19',
    tanggalTerimaOrKirim: '2026-09-20',
    tujuan: 'Kepala Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek',
    perihal: 'Rekomendasi & Pengiriman Delegasi Olimpiade Sains Nasional Tingkat Provinsi (OSN-P) Jenjang SMP',
    ringkasan: 'Surat tugas dan rekomendasi atas nama 3 siswa berprestasi bidang Matematika dan IPA untuk mengikuti seleksi OSN-P mewakili sekolah.',
    kodeKlasifikasi: '421.2',
    kategori: 'Kesiswaan',
    sifat: 'Penting',
    status: 'Diterbitkan',
    lampiranJumlah: '1 Berkas (Biodata & Surat Izin Ortu)',
    penandatangan: 'Imam Arifin, S.Pd., M.Pd.',
    lokasiArsipFisik: 'Ordner SK-Kesiswaan / Lemari 2 Rak C',
    createdAt: '2026-09-19T08:00:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  }
];

export const INITIAL_SURAT_IZIN: SuratIzinItem[] = [
  {
    id: 'iz-001',
    tipePemohon: 'Guru / Tendik',
    namaLengkap: 'Siti Rahmawati, S.Pd.',
    nomorInduk: '19890520 201502 2 003',
    kelasAtauJabatan: 'Guru Bahasa Indonesia',
    jenisIzin: 'Tugas Dinas / Pelatihan',
    tanggalMulai: '2026-09-22',
    tanggalSelesai: '2026-09-24',
    jumlahHari: 3,
    alasan: 'Mengikuti Bimbingan Teknis Implementasi Kurikulum Merdeka Jenjang SMP di Hotel Emersia Bandar Lampung.',
    keterangan: 'Tugas mengajar kelas 7A dan 7B diisi oleh guru piket sesuai modul ajar.',
    status: 'Disetujui',
    disetujuiOleh: 'Imam Arifin, S.Pd., M.Pd. (Kepala Sekolah)',
    fileBuktiNama: 'Surat_Tugas_Bimtek_IKM.pdf',
    createdAt: '2026-09-18T09:00:00Z',
    updatedAt: '2026-09-18T11:30:00Z'
  },
  {
    id: 'iz-002',
    tipePemohon: 'Siswa',
    namaLengkap: 'Ahmad Rizky Pratama',
    nomorInduk: 'NISN: 0098765432',
    kelasAtauJabatan: 'Kelas VIII-B',
    jenisIzin: 'Sakit',
    tanggalMulai: '2026-09-19',
    tanggalSelesai: '2026-09-21',
    jumlahHari: 3,
    alasan: 'Demam tinggi dan gejala tipes, disarankan istirahat penuh oleh dokter Puskesmas Rawat Inap Gunung Agung.',
    keterangan: 'Disampaikan oleh wali murid melalui surat resmi bermaterai dan surat dokter.',
    status: 'Disetujui',
    disetujuiOleh: 'Wali Kelas & Guru BK',
    fileBuktiNama: 'Surat_Keterangan_Dokter_Puskesmas.pdf',
    createdAt: '2026-09-19T07:15:00Z',
    updatedAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'iz-003',
    tipePemohon: 'Siswa',
    namaLengkap: 'Dewi Lestari',
    nomorInduk: 'NISN: 0102938475',
    kelasAtauJabatan: 'Kelas IX-A',
    jenisIzin: 'Izin Keperluan Keluarga / Mendesak',
    tanggalMulai: '2026-09-25',
    tanggalSelesai: '2026-09-26',
    jumlahHari: 2,
    alasan: 'Menghadiri acara pernikahan saudara kandung di luar kota (Palembang).',
    keterangan: 'Tugas harian akan disusulkan setelah kembali ke sekolah.',
    status: 'Menunggu Persetujuan',
    fileBuktiNama: 'Surat_Izin_Orang_Tua.pdf',
    createdAt: '2026-09-19T10:00:00Z',
    updatedAt: '2026-09-19T10:00:00Z'
  }
];
