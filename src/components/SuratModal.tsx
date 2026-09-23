import React, { useState, useEffect, useRef } from 'react';
import { SuratItem, TipeSurat, SifatSurat, StatusSuratMasuk, StatusSuratKeluar, IdentitasSekolah } from '../types';
import { DAFTAR_KLASIFIKASI } from '../data/klasifikasiSurat';
import { generateNextNomorAgenda, toRomanMonth } from '../utils/formatters';
import { 
  X, 
  Mail, 
  Send, 
  Wand2, 
  Paperclip, 
  HelpCircle, 
  Check, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Eye, 
  RotateCw, 
  Smartphone, 
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { DocumentFileViewer } from './DocumentFileViewer';

interface SuratModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (surat: SuratItem) => void;
  initialItem?: SuratItem | null;
  defaultTipe: TipeSurat;
  existingItems: SuratItem[];
  sekolah: IdentitasSekolah;
}

export const SuratModal: React.FC<SuratModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  defaultTipe,
  existingItems,
  sekolah
}) => {
  const [tipe, setTipe] = useState<TipeSurat>(defaultTipe);
  const [noAgenda, setNoAgenda] = useState('');
  const [noSurat, setNoSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState(new Date().toISOString().slice(0, 10));
  const [tanggalTerimaOrKirim, setTanggalTerimaOrKirim] = useState(new Date().toISOString().slice(0, 10));
  const [pengirim, setPengirim] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [perihal, setPerihal] = useState('');
  const [ringkasan, setRingkasan] = useState('');
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState('421.1');
  const [kategori, setKategori] = useState('Kurikulum');
  const [sifat, setSifat] = useState<SifatSurat>('Biasa');
  const [status, setStatus] = useState<string>('Menunggu Disposisi');
  const [lampiranJumlah, setLampiranJumlah] = useState('1 Berkas');
  const [lampiranNama, setLampiranNama] = useState('');
  const [penandatangan, setPenandatangan] = useState(sekolah.namaKepalaSekolah);
  const [lokasiArsipFisik, setLokasiArsipFisik] = useState('Ordner A / Rak 1');

  // State untuk Berkas Unggahan
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [fileType, setFileType] = useState<string | undefined>(undefined);
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load initial data when modal opens
  useEffect(() => {
    if (initialItem) {
      setTipe(initialItem.tipe);
      setNoAgenda(initialItem.noAgenda);
      setNoSurat(initialItem.noSurat);
      setTanggalSurat(initialItem.tanggalSurat);
      setTanggalTerimaOrKirim(initialItem.tanggalTerimaOrKirim);
      setPengirim(initialItem.pengirim || '');
      setTujuan(initialItem.tujuan || '');
      setPerihal(initialItem.perihal);
      setRingkasan(initialItem.ringkasan);
      setKodeKlasifikasi(initialItem.kodeKlasifikasi);
      setKategori(initialItem.kategori);
      setSifat(initialItem.sifat);
      setStatus(initialItem.status);
      setLampiranJumlah(initialItem.lampiranJumlah || '');
      setLampiranNama(initialItem.lampiranNama || '');
      setFileData(initialItem.fileData);
      setFileType(initialItem.fileType);
      setFileSize(initialItem.fileSize);
      setPenandatangan(initialItem.penandatangan || sekolah.namaKepalaSekolah);
      setLokasiArsipFisik(initialItem.lokasiArsipFisik || '');
    } else {
      setTipe(defaultTipe);
      setNoAgenda(generateNextNomorAgenda(existingItems, defaultTipe));
      setNoSurat('');
      const today = new Date().toISOString().slice(0, 10);
      setTanggalSurat(today);
      setTanggalTerimaOrKirim(today);
      setPengirim('');
      setTujuan('');
      setPerihal('');
      setRingkasan('');
      setKodeKlasifikasi('421.1');
      setKategori('Kurikulum');
      setSifat('Biasa');
      setStatus(defaultTipe === 'MASUK' ? 'Menunggu Disposisi' : 'Diterbitkan');
      setLampiranJumlah('1 Berkas');
      setLampiranNama('');
      setFileData(undefined);
      setFileType(undefined);
      setFileSize(undefined);
      setPenandatangan(sekolah.namaKepalaSekolah);
      setLokasiArsipFisik(defaultTipe === 'MASUK' ? 'Ordner Masuk / Lemari 1' : 'Ordner Keluar / Lemari 2');
    }
  }, [initialItem, defaultTipe, isOpen, sekolah]);

  // Handle file reading with mobile camera image optimization
  const processUploadedFile = (file: File) => {
    if (!file) return;

    // Check if image for camera optimization (avoids hitting Firestore 1MB limit & loads fast on mobile)
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
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setFileData(optimizedDataUrl);
            setFileType('image/jpeg');
            const approxBytes = Math.round((optimizedDataUrl.length * 3) / 4);
            setFileSize(approxBytes);
          } else {
            setFileData(e.target?.result as string);
            setFileType(file.type);
            setFileSize(file.size);
          }
          if (!lampiranNama) {
            setLampiranNama(file.name);
          }
        };
        img.onerror = () => {
          setFileData(e.target?.result as string);
          setFileType(file.type);
          setFileSize(file.size);
          if (!lampiranNama) {
            setLampiranNama(file.name);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or other documents
      if (file.size > 2 * 1024 * 1024) {
        alert('Perhatian: Ukuran file PDF disarankan di bawah 2MB agar sinkronisasi cloud tetap lancar.');
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFileData(reader.result as string);
        setFileType(file.type);
        setFileSize(file.size);
        if (!lampiranNama) {
          setLampiranNama(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to rotate image 90 degrees directly (very common for mobile camera photos)
  const handleRotateUploadedImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileData) return;
    const isImage = fileType?.startsWith('image/') || fileData.startsWith('data:image/');
    if (!isImage) return;

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
      const rotatedUrl = canvas.toDataURL('image/jpeg', 0.85);
      setFileData(rotatedUrl);
    };
    img.src = fileData;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setFileData(undefined);
    setFileType(undefined);
    setFileSize(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update no agenda if tipe toggles in create mode
  const handleTipeChange = (newTipe: TipeSurat) => {
    setTipe(newTipe);
    if (!initialItem) {
      setNoAgenda(generateNextNomorAgenda(existingItems, newTipe));
      setStatus(newTipe === 'MASUK' ? 'Menunggu Disposisi' : 'Diterbitkan');
      setLokasiArsipFisik(newTipe === 'MASUK' ? 'Ordner Masuk / Lemari 1' : 'Ordner Keluar / Lemari 2');
    }
  };

  // Helper to generate standard official school outgoing letter number
  const handleGenerateNoSuratKeluar = () => {
    const d = new Date(tanggalSurat);
    const monthRoman = toRomanMonth(d.getMonth());
    const year = d.getFullYear();
    const count = existingItems.filter((i) => i.tipe === 'KELUAR').length + 1;
    const countPadded = String(count).padStart(3, '0');
    
    // Format standar surat dinas sekolah: [Kode Klasifikasi]/[Nomor Urut]/[Singkatan Sekolah]/[Bulan Romawi]/[Tahun]
    const singkatan = sekolah.namaSekolah
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 5) || 'SMP.01';

    const generated = `${kodeKlasifikasi}/${countPadded}/${singkatan}/${monthRoman}/${year}`;
    setNoSurat(generated);
  };

  const handleSelectKlasifikasi = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = DAFTAR_KLASIFIKASI.find((k) => k.kode === e.target.value);
    if (selected) {
      setKodeKlasifikasi(selected.kode);
      setKategori(selected.kategori);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noAgenda.trim() || !noSurat.trim() || !perihal.trim()) {
      alert('Mohon lengkapi Nomor Agenda, Nomor Surat, dan Perihal!');
      return;
    }

    const payload: SuratItem = {
      id: initialItem ? initialItem.id : `${tipe === 'MASUK' ? 'sm' : 'sk'}-${Date.now()}`,
      tipe,
      noAgenda,
      noSurat,
      tanggalSurat,
      tanggalTerimaOrKirim,
      pengirim: tipe === 'MASUK' ? pengirim : undefined,
      tujuan: tipe === 'KELUAR' ? tujuan : undefined,
      perihal,
      ringkasan,
      kodeKlasifikasi,
      kategori,
      sifat,
      status: status as StatusSuratMasuk | StatusSuratKeluar,
      lampiranJumlah,
      lampiranNama,
      fileData,
      fileType,
      fileSize,
      penandatangan: tipe === 'KELUAR' ? penandatangan : undefined,
      lokasiArsipFisik,
      disposisi: initialItem?.disposisi,
      createdAt: initialItem ? initialItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg text-white ${tipe === 'MASUK' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {tipe === 'MASUK' ? <Mail className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialItem ? `Edit Agenda: ${initialItem.noAgenda}` : `Catat ${tipe === 'MASUK' ? 'Surat Masuk' : 'Surat Keluar'}`}
              </h2>
              <p className="text-xs text-slate-500">
                {tipe === 'MASUK' ? 'Surat yang diterima oleh pihak sekolah' : 'Surat resmi yang diterbitkan oleh pihak sekolah'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          
          {/* Tipe Selector Tab (if new item) */}
          {!initialItem && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTipeChange('MASUK')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tipe === 'MASUK' 
                    ? 'bg-white text-blue-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>SURAT MASUK</span>
              </button>
              <button
                type="button"
                onClick={() => handleTipeChange('KELUAR')}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tipe === 'KELUAR' 
                    ? 'bg-white text-emerald-700 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>SURAT KELUAR</span>
              </button>
            </div>
          )}

          {/* Row 1: No Agenda & Sifat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Agenda Tata Usaha <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={noAgenda}
                onChange={(e) => setNoAgenda(e.target.value)}
                placeholder="Contoh: SM-2026-004"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sifat Surat
              </label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Biasa">Biasa</option>
                <option value="Penting">Penting</option>
                <option value="Sangat Segera">Sangat Segera (Urgent)</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Alur
              </label>
              {tipe === 'MASUK' ? (
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Menunggu Disposisi">Menunggu Disposisi</option>
                  <option value="Proses Tindak Lanjut">Proses Tindak Lanjut</option>
                  <option value="Selesai">Selesai (Diarsipkan)</option>
                </select>
              ) : (
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Konsep">Konsep / Draf</option>
                  <option value="Diterbitkan">Diterbitkan (Sudah TTD)</option>
                  <option value="Terkirim">Terkirim ke Penerima</option>
                </select>
              )}
            </div>
          </div>

          {/* Row 2: No Surat & Generate Helper */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {tipe === 'MASUK' ? 'Nomor Surat Asli Pengirim' : 'Nomor Surat Keluar Sekolah'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              {tipe === 'KELUAR' && (
                <button
                  type="button"
                  onClick={handleGenerateNoSuratKeluar}
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Generate Format No. Sekolah Otomatis</span>
                </button>
              )}
            </div>
            <input
              type="text"
              value={noSurat}
              onChange={(e) => setNoSurat(e.target.value)}
              placeholder={
                tipe === 'MASUK'
                  ? 'Contoh: 421.3/102/Disdik/2026 atau 005/34/PKM/2026'
                  : 'Contoh: 421.1/045/SMP.01/IX/2026'
              }
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          {/* Row 3: Tanggal Surat & Tanggal Diterima/Kirim */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal yang Tertera pada Surat <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {tipe === 'MASUK' ? 'Tanggal Diterima Sekolah' : 'Tanggal Dikirim / Terbit'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalTerimaOrKirim}
                onChange={(e) => setTanggalTerimaOrKirim(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Row 4: Pengirim / Tujuan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {tipe === 'MASUK' ? 'Asal Surat (Pengirim)' : 'Tujuan Surat (Ditujukan Kepada)'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tipe === 'MASUK' ? pengirim : tujuan}
              onChange={(e) => (tipe === 'MASUK' ? setPengirim(e.target.value) : setTujuan(e.target.value))}
              placeholder={
                tipe === 'MASUK'
                  ? 'Contoh: Dinas Pendidikan dan Kebudayaan, Komite Sekolah, Puskesmas Sukamaju'
                  : 'Contoh: Orang Tua / Wali Murid Kelas IX, Kepala Cabang Dinas Pendidikan'
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          {/* Row 5: Kode Klasifikasi & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode Klasifikasi Kemendikbud
              </label>
              <select
                value={kodeKlasifikasi}
                onChange={handleSelectKlasifikasi}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {DAFTAR_KLASIFIKASI.map((k) => (
                  <option key={k.kode} value={k.kode}>
                    {k.kode} - {k.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Urusan
              </label>
              <input
                type="text"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="Kurikulum, Kesiswaan, Sarpras, Keuangan"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 6: Perihal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Perihal Surat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              placeholder="Contoh: Undangan Sosialisasi Program Persiapan Ujian Akhir Sekolah"
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          {/* Row 7: Ringkasan Isi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ringkasan / Uraian Singkat Isi Surat
            </label>
            <textarea
              rows={3}
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              placeholder="Tuliskan intisari pokok isi surat, instruksi, atau jadwal penting..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Row 8: Lampiran & Unggah File Dokumen Scan/PDF */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Unggah Berkas File Dokumen Asli (Scan/PDF/Foto)</span>
              </label>
              <span className="text-[11px] text-slate-500">
                PDF, JPG, PNG (Maks 15MB)
              </span>
            </div>

            {/* Drag & Drop File Upload Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-400/20'
                  : fileData
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {fileData ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left bg-white p-3 rounded-xl border border-emerald-200/90 shadow-2xs">
                  <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
                    {/* Visual thumbnail if image */}
                    {(fileType?.startsWith('image/') || fileData.startsWith('data:image/')) ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 group">
                        <img 
                          src={fileData} 
                          alt="Thumbnail Lampiran" 
                          className="w-full h-full object-cover"
                        />
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowQuickPreview(true);
                          }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Perbesar"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-red-100 text-red-700 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}

                    <div className="overflow-hidden flex-1">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {lampiranNama || 'Berkas Dokumen Terunggah'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Siap Dipratinjau
                        </span>
                        {fileSize && (
                          <span>• {(fileSize / 1024).toFixed(1)} KB</span>
                        )}
                        {(fileType?.startsWith('image/') || fileData.startsWith('data:image/')) && (
                          <span className="text-blue-600 font-medium">• Foto/Gambar</span>
                        )}
                        {(fileType === 'application/pdf' || fileData.startsWith('data:application/pdf')) && (
                          <span className="text-red-600 font-medium">• PDF Dokumen</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuickPreview(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors cursor-pointer"
                      title="Lihat Pratinjau Dokumen"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Pratinjau</span>
                    </button>

                    {(fileType?.startsWith('image/') || fileData.startsWith('data:image/')) && (
                      <button
                        type="button"
                        onClick={handleRotateUploadedImage}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="Putar Gambar 90 Derajat (Cocok untuk Foto HP)"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Putar</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Ganti
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Hapus Berkas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <UploadCloud className="w-7 h-7 text-blue-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-800">
                    Klik untuk memilih berkas atau seret & lepas berkas ke sini
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Dapat berupa scan surat masuk, draft resmi surat keluar, atau berkas foto disposisi
                  </p>
                </div>
              )}
            </div>

            {/* Detail Keterangan Lampiran & Lokasi Fisik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Lampiran
                </label>
                <input
                  type="text"
                  value={lampiranJumlah}
                  onChange={(e) => setLampiranJumlah(e.target.value)}
                  placeholder="Contoh: 1 Berkas, 2 Lembar, Nihil"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Keterangan Dokumen
                </label>
                <input
                  type="text"
                  value={lampiranNama}
                  onChange={(e) => setLampiranNama(e.target.value)}
                  placeholder="Contoh: Surat_Edaran_ANBK.pdf"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi Arsip Fisik
                </label>
                <input
                  type="text"
                  value={lokasiArsipFisik}
                  onChange={(e) => setLokasiArsipFisik(e.target.value)}
                  placeholder="Contoh: Ordner A-01 / Rak 2"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {tipe === 'KELUAR' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pejabat Penandatangan Surat
              </label>
              <input
                type="text"
                value={penandatangan}
                onChange={(e) => setPenandatangan(e.target.value)}
                placeholder="Nama Kepala Sekolah / Penandatangan"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-lg transition-colors shadow-xs cursor-pointer ${
                tipe === 'MASUK' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              Simpan Data Agenda
            </button>
          </div>

        </form>

      </div>

      {/* Quick Preview Modal Overlay for mobile & desktop */}
      {showQuickPreview && fileData && (
        <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-700">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2 truncate">
                <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Pratinjau Berkas: {lampiranNama || 'Dokumen Terunggah'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowQuickPreview(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 sm:p-3 overflow-auto flex-1 bg-slate-950">
              <DocumentFileViewer
                fileData={fileData}
                fileType={fileType}
                fileName={lampiranNama}
              />
            </div>
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Tekan tombol di atas untuk membuka di penampil HP atau memutar
              </span>
              <button
                type="button"
                onClick={() => setShowQuickPreview(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
