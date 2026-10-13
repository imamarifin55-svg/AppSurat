import React, { useState, useRef, useEffect } from 'react';
import { DokumenLainItem, KategoriDokumenLain, IdentitasSekolah } from '../types';
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  Calendar,
  Layers,
  BookOpen,
  FolderArchive,
  User,
  MapPin,
  RotateCw,
  Eye,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { DocumentFileViewer } from './DocumentFileViewer';

interface DokumenLainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DokumenLainItem) => void;
  initialItem?: DokumenLainItem | null;
  sekolah: IdentitasSekolah;
}

const KATEGORI_OPTIONS: KategoriDokumenLain[] = [
  'Lembar Soal / Asesmen',
  'Kisi-Kisi & Kunci Jawaban',
  'Perangkat Ajar / Modul',
  'Kurikulum & Jadwal',
  'SK & Berita Acara',
  'Laporan & LPJ',
  'Dokumen Akreditasi',
  'Lainnya'
];

const MATA_PELAJARAN_LIST = [
  'Ilmu Pengetahuan Alam (IPA)',
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Pendidikan Agama & Budi Pekerti',
  'Pendidikan Pancasila / PPKn',
  'Ilmu Pengetahuan Sosial (IPS)',
  'Informatika',
  'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
  'Seni Budaya',
  'Prakarya & Kewirausahaan',
  'Muatan Lokal (Bahasa Lampung)',
  'Bimbingan & Konseling (BK)',
  'Umum / Tata Usaha / Non-Mapel'
];

export const DokumenLainModal: React.FC<DokumenLainModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  sekolah
}) => {
  const [judul, setJudul] = useState('');
  const [nomorDokumen, setNomorDokumen] = useState('');
  const [kategori, setKategori] = useState<KategoriDokumenLain>('Lembar Soal / Asesmen');
  const [mataPelajaran, setMataPelajaran] = useState('Ilmu Pengetahuan Alam (IPA)');
  const [tingkatKelas, setTingkatKelas] = useState('Kelas 8');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap' | 'Semua / Tahunan'>('Ganjil');
  const [tanggalDokumen, setTanggalDokumen] = useState(new Date().toISOString().slice(0, 10));
  const [penyusun, setPenyusun] = useState('');
  const [lokasiFisik, setLokasiFisik] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // File upload state
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState<string | undefined>();
  const [fileType, setFileType] = useState<string | undefined>();
  const [fileSize, setFileSize] = useState<number | undefined>();
  const [isDragOver, setIsDragOver] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form on open
  useEffect(() => {
    if (initialItem) {
      setJudul(initialItem.judul || '');
      setNomorDokumen(initialItem.nomorDokumen || '');
      setKategori(initialItem.kategori || 'Lembar Soal / Asesmen');
      setMataPelajaran(initialItem.mataPelajaran || 'Ilmu Pengetahuan Alam (IPA)');
      setTingkatKelas(initialItem.tingkatKelas || 'Kelas 8');
      setTahunAjaran(initialItem.tahunAjaran || '2026/2027');
      setSemester(initialItem.semester || 'Ganjil');
      setTanggalDokumen(initialItem.tanggalDokumen || new Date().toISOString().slice(0, 10));
      setPenyusun(initialItem.penyusun || '');
      setLokasiFisik(initialItem.lokasiFisik || '');
      setKeterangan(initialItem.keterangan || '');
      setFileName(initialItem.fileName || '');
      setFileData(initialItem.fileData);
      setFileType(initialItem.fileType);
      setFileSize(initialItem.fileSize);
    } else {
      setJudul('');
      const year = new Date().getFullYear();
      const randNum = Math.floor(100 + Math.random() * 900);
      setNomorDokumen(`ARS-${year}/SL-${randNum}`);
      setKategori('Lembar Soal / Asesmen');
      setMataPelajaran('Ilmu Pengetahuan Alam (IPA)');
      setTingkatKelas('Kelas 8');
      setTahunAjaran('2026/2027');
      setSemester('Ganjil');
      setTanggalDokumen(new Date().toISOString().slice(0, 10));
      setPenyusun(sekolah.namaKepalaTU || 'Tim Pengembang Kurikulum');
      setLokasiFisik('Ordner Soal SAS / Lemari 2 Rak B');
      setKeterangan('');
      setFileName('');
      setFileData(undefined);
      setFileType(undefined);
      setFileSize(undefined);
    }
  }, [initialItem, isOpen, sekolah]);

  if (!isOpen) return null;

  const handleGenerateKode = () => {
    const year = new Date().getFullYear();
    let prefix = 'DOK';
    if (kategori.includes('Soal')) prefix = 'SL';
    else if (kategori.includes('Kisi-Kisi')) prefix = 'KS';
    else if (kategori.includes('Perangkat') || kategori.includes('Modul')) prefix = 'MOD';
    else if (kategori.includes('SK')) prefix = 'SK';
    else if (kategori.includes('Laporan')) prefix = 'LPJ';
    else if (kategori.includes('Kurikulum')) prefix = 'KUR';
    else if (kategori.includes('Akreditasi')) prefix = 'AKR';

    const rand = Math.floor(100 + Math.random() * 900);
    setNomorDokumen(`ARS-${year}/${prefix}-${rand}`);
  };

  const processUploadedFile = (file: File) => {
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          const maxDim = 1600;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.85);
            setFileData(optimized);
            setFileType('image/jpeg');
          } else {
            setFileData(e.target?.result as string);
            setFileType(file.type);
          }
          setFileName(file.name);
          setFileSize(file.size);
        };
        img.onerror = () => {
          setFileData(e.target?.result as string);
          setFileType(file.type);
          setFileName(file.name);
          setFileSize(file.size);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setFileData(reader.result as string);
        setFileType(file.type);
        setFileName(file.name);
        setFileSize(file.size);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotateImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileData) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const rotated = canvas.toDataURL('image/jpeg', 0.85);
      setFileData(rotated);
    };
    img.src = fileData;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!judul.trim()) {
      alert('Judul Dokumen wajib diisi.');
      return;
    }
    if (!penyusun.trim()) {
      alert('Nama Guru / Tim Penyusun / Penanggung Jawab wajib diisi.');
      return;
    }

    const itemToSave: DokumenLainItem = {
      id: initialItem?.id || `dok-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      nomorDokumen: nomorDokumen.trim() || `ARS-${new Date().getFullYear()}/DOK-${Math.floor(100 + Math.random() * 900)}`,
      judul: judul.trim(),
      kategori,
      mataPelajaran: mataPelajaran.trim() || undefined,
      tingkatKelas: tingkatKelas.trim() || undefined,
      tahunAjaran,
      semester,
      tanggalDokumen,
      penyusun: penyusun.trim(),
      lokasiFisik: lokasiFisik.trim() || undefined,
      keterangan: keterangan.trim() || undefined,
      fileName: fileName.trim() || undefined,
      fileData,
      fileType,
      fileSize,
      createdAt: initialItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(itemToSave);
  };

  return (
    <>
      <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/50 border border-blue-400/40 flex items-center justify-center text-white">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight">
                  {initialItem ? 'Edit Arsip Dokumen Lainnya' : 'Tambah Arsip Dokumen Lainnya'}
                </h2>
                <p className="text-xs text-blue-200">
                  Arsip lembar soal ujian, kisi-kisi, modul ajar, SK, dan berkas sekolah
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
            
            {/* Row 1: Nomor Dokumen & Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor / Kode Arsip Dokumen
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={nomorDokumen}
                    onChange={(e) => setNomorDokumen(e.target.value)}
                    placeholder="Contoh: ARS-2026/SL-001"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateKode}
                    title="Buat Kode Otomatis"
                    className="px-2.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Auto</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Dokumen <span className="text-rose-500">*</span>
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as KategoriDokumenLain)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white font-medium"
                >
                  {KATEGORI_OPTIONS.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Judul Dokumen (Full Width) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul / Nama Lengkap Dokumen <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Naskah Soal Sumatif Akhir Semester (SAS) Ganjil - IPA Kelas VIII"
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium text-slate-900"
              />
            </div>

            {/* Row 3: Mata Pelajaran & Tingkat / Kelas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran / Bidang
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="mapel-list"
                    value={mataPelajaran}
                    onChange={(e) => setMataPelajaran(e.target.value)}
                    placeholder="Pilih atau ketik mata pelajaran..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <datalist id="mapel-list">
                    {MATA_PELAJARAN_LIST.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tingkat / Sasaran Dokumen
                </label>
                <select
                  value={tingkatKelas}
                  onChange={(e) => setTingkatKelas(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="Kelas 7">Kelas 7</option>
                  <option value="Kelas 8">Kelas 8</option>
                  <option value="Kelas 9">Kelas 9</option>
                  <option value="Semua Kelas (7, 8, 9)">Semua Kelas (7, 8, 9)</option>
                  <option value="Guru / Tendik">Guru / Tenaga Kependidikan</option>
                  <option value="Sekolah / Kelembagaan">Sekolah / Kelembagaan</option>
                </select>
              </div>
            </div>

            {/* Row 4: Tahun Ajaran, Semester, & Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                  placeholder="2026/2027"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                  <option value="Semua / Tahunan">Semua / Tahunan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Dokumen
                </label>
                <input
                  type="date"
                  value={tanggalDokumen}
                  onChange={(e) => setTanggalDokumen(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Row 5: Penyusun & Lokasi Fisik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guru Penyusun / Penanggung Jawab <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={penyusun}
                  onChange={(e) => setPenyusun(e.target.value)}
                  placeholder="Nama guru / MGMP / staf TU"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lokasi Penyimpanan Fisik (Ordner/Lemari)
                </label>
                <input
                  type="text"
                  value={lokasiFisik}
                  onChange={(e) => setLokasiFisik(e.target.value)}
                  placeholder="Contoh: Ordner Soal SAS / Lemari 2 Rak B"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Row 6: Keterangan / Catatan Tambahan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keterangan / Catatan Dokumen (Opsional)
              </label>
              <textarea
                rows={2}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan jumlah butir soal, status telaah/validasi, rubrik penilaian, dll..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Row 7: Upload Berkas Dokumen (PDF / Scan / Foto) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Unggah Berkas Dokumen (PDF / Gambar / Foto Lembar Soal)</span>
                {fileData && (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Berkas Terlampir
                  </span>
                )}
              </label>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) processUploadedFile(f);
                }}
                onClick={() => !fileData && fileInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/70'
                    : fileData
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-300 bg-white hover:border-blue-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) processUploadedFile(f);
                  }}
                  className="hidden"
                />

                {fileData ? (
                  <div className="flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {fileType?.startsWith('image/') || fileData.startsWith('data:image/') ? (
                        <img
                          src={fileData}
                          alt="Thumbnail Berkas"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {fileName || 'Berkas Dokumen'}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 mt-0.5">
                          <span>{fileType === 'application/pdf' ? 'Dokumen PDF' : 'File Foto/Scan'}</span>
                          {fileSize && (
                            <>
                              <span>•</span>
                              <span>{(fileSize / 1024).toFixed(0)} KB</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQuickPreview(true);
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100/80 hover:bg-blue-200 rounded-lg flex items-center gap-1 transition-colors"
                        title="Pratinjau Berkas"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Pratinjau</span>
                      </button>

                      {(fileType?.startsWith('image/') || fileData.startsWith('data:image/')) && (
                        <button
                          type="button"
                          onClick={handleRotateImage}
                          className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Putar Foto 90 Derajat"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileData(undefined);
                          setFileName('');
                          setFileType(undefined);
                          setFileSize(undefined);
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Hapus Lampiran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs text-slate-600">
                    <UploadCloud className="w-7 h-7 text-blue-500 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-700">
                      Klik atau seret berkas lembar soal / PDF / foto ke sini
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mendukung PDF, Foto Kamera HP, dan Gambar Scan (Otomatis Dioptimasi)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FolderArchive className="w-4 h-4" />
                <span>{initialItem ? 'Simpan Perubahan' : 'Arsipkan Dokumen'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Quick Preview Modal Overlay */}
      {showQuickPreview && fileData && (
        <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-sm flex flex-col p-4">
          <div className="flex items-center justify-between text-white pb-3 max-w-5xl w-full mx-auto">
            <div className="text-sm font-bold truncate">
              Pratinjau Cepat: {fileName || 'Berkas Dokumen'}
            </div>
            <button
              type="button"
              onClick={() => setShowQuickPreview(false)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 max-w-5xl w-full mx-auto bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-white/10">
            <DocumentFileViewer
              fileData={fileData}
              fileName={fileName || 'berkas_dokumen'}
              fileType={fileType}
            />
          </div>
        </div>
      )}
    </>
  );
};
