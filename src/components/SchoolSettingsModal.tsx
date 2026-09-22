import React, { useState, useRef } from 'react';
import { IdentitasSekolah, SuratItem } from '../types';
import { 
  X, 
  Building2, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { DEFAULT_LOGO_PEMDA, DEFAULT_LOGO_SEKOLAH } from '../data/initialData';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sekolah: IdentitasSekolah;
  onSaveSekolah: (sekolah: IdentitasSekolah) => void;
  onRestoreData: (items: SuratItem[], sekolah: IdentitasSekolah) => void;
  onResetToDefault: () => void;
  items: SuratItem[];
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  sekolah,
  onSaveSekolah,
  onRestoreData,
  onResetToDefault,
  items
}) => {
  const [formData, setFormData] = useState<IdentitasSekolah>({ ...sekolah });
  const [successMsg, setSuccessMsg] = useState(false);
  const [pemdaDragOver, setPemdaDragOver] = useState(false);
  const [sekolahDragOver, setSekolahDragOver] = useState(false);

  const pemdaInputRef = useRef<HTMLInputElement>(null);
  const sekolahInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processImageFile = (field: 'logoPemda' | 'logoSekolah', file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (PNG, JPG, JPEG, WebP, atau SVG).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB agar tidak memperberat memori penyimpanan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        [field]: dataUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (field: 'logoPemda' | 'logoSekolah', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(field, file);
    }
  };

  const handleRemoveLogo = (field: 'logoPemda' | 'logoSekolah') => {
    setFormData((prev) => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleResetDefaultLogo = (field: 'logoPemda' | 'logoSekolah') => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'logoPemda' ? DEFAULT_LOGO_PEMDA : DEFAULT_LOGO_SEKOLAH
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSekolah(formData);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1000);
  };

  // Export full JSON backup
  const handleBackupJson = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      sekolah: formData,
      items
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Agenda_Surat_${formData.namaSekolah.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Restore from JSON backup
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.items && Array.isArray(parsed.items)) {
          onRestoreData(parsed.items, parsed.sekolah || formData);
          alert('Berhasil memulihkan data dari berkas cadangan!');
          onClose();
        } else {
          alert('Format berkas cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas cadangan. Pastikan berkas JSON valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Profil Sekolah & Pejabat Penandatangan
              </h2>
              <p className="text-xs text-slate-500">
                Data ini otomatis tercetak pada Kop Surat, Lembar Disposisi, dan Buku Agenda
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

        {/* Body */}
        <form onSubmit={handleSave} className="overflow-y-auto px-6 py-5 space-y-4 flex-1 text-xs">
          
          {/* Identitas Sekolah */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b pb-1">
              1. Identitas Satuan Pendidikan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Nama Resmi Sekolah</label>
                <input
                  type="text"
                  name="namaSekolah"
                  value={formData.namaSekolah}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">NPSN</label>
                <input
                  type="text"
                  name="npsn"
                  value={formData.npsn}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Akreditasi</label>
                <input
                  type="text"
                  name="akreditasi"
                  value={formData.akreditasi || ''}
                  onChange={handleChange}
                  placeholder="Contoh: B"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Alamat Lengkap</label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Desa/Kelurahan</label>
                <input
                  type="text"
                  name="desaKelurahan"
                  value={formData.desaKelurahan}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Kecamatan</label>
                <input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Kabupaten/Kota</label>
                <input
                  type="text"
                  name="kabupatenKota"
                  value={formData.kabupatenKota}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Provinsi</label>
                <input
                  type="text"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Email Resmi</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Website Sekolah</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Menu Upload Foto Pemda dan Logo Sekolah */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b pb-1">
              <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Upload Foto Pemda & Logo Resmi Sekolah</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">
                Format: PNG / JPG / SVG (Maks. 2MB)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Kartu 1: Foto / Lambang Pemerintah Daerah */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <label className="block text-slate-800 font-bold text-xs">
                      Foto / Lambang Pemda & Dinas
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Tampil di sisi <strong>KIRI</strong> Kop Surat resmi
                    </p>
                  </div>
                  {formData.logoPemda && (
                    <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-100 text-emerald-700 rounded-md">
                      Terpasang
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Pratinjau Gambar */}
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center p-1 relative shrink-0 shadow-2xs overflow-hidden">
                    {formData.logoPemda ? (
                      <img 
                        src={formData.logoPemda} 
                        alt="Logo Pemda" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImageIcon className="w-6 h-6 mx-auto stroke-1" />
                        <span className="text-[8px] block">Kosong</span>
                      </div>
                    )}
                  </div>

                  {/* Kontrol Upload & Aksi */}
                  <div className="flex-1 space-y-1.5">
                    <input
                      ref={pemdaInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload('logoPemda', e)}
                      className="hidden"
                      id="upload-foto-pemda"
                    />
                    
                    <div className="flex flex-wrap items-center gap-1.5">
                      <label
                        htmlFor="upload-foto-pemda"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Pilih Foto Pemda</span>
                      </label>

                      {formData.logoPemda && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLogo('logoPemda')}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Hapus Logo Pemda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleResetDefaultLogo('logoPemda')}
                        className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                        title="Gunakan Lambang Standar"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      Disarankan gambar dengan latar transparan (.PNG)
                    </p>
                  </div>
                </div>
              </div>

              {/* Kartu 2: Logo Resmi Sekolah */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <label className="block text-slate-800 font-bold text-xs">
                      Logo Resmi Sekolah
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Tampil di sisi <strong>KANAN</strong> Kop Surat resmi
                    </p>
                  </div>
                  {formData.logoSekolah && (
                    <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-emerald-100 text-emerald-700 rounded-md">
                      Terpasang
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Pratinjau Gambar */}
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center p-1 relative shrink-0 shadow-2xs overflow-hidden">
                    {formData.logoSekolah ? (
                      <img 
                        src={formData.logoSekolah} 
                        alt="Logo Sekolah" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImageIcon className="w-6 h-6 mx-auto stroke-1" />
                        <span className="text-[8px] block">Kosong</span>
                      </div>
                    )}
                  </div>

                  {/* Kontrol Upload & Aksi */}
                  <div className="flex-1 space-y-1.5">
                    <input
                      ref={sekolahInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload('logoSekolah', e)}
                      className="hidden"
                      id="upload-logo-sekolah"
                    />
                    
                    <div className="flex flex-wrap items-center gap-1.5">
                      <label
                        htmlFor="upload-logo-sekolah"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Pilih Logo Sekolah</span>
                      </label>

                      {formData.logoSekolah && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLogo('logoSekolah')}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Hapus Logo Sekolah"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleResetDefaultLogo('logoSekolah')}
                        className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                        title="Gunakan Logo Standar"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      Format PNG/JPG transparan untuk hasil cetak terbaik
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulasi Pratinjau Kop Surat */}
            <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Pratinjau Kop Surat Cetak (Simulasi)
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[9px] border border-blue-200">
                  Format Kertas: A4
                </span>
              </div>
              <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50/40 flex items-center justify-between gap-3 text-center border-b-2 border-b-black">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  {formData.logoPemda ? (
                    <img src={formData.logoPemda} alt="Logo Pemda" className="max-h-12 max-w-12 object-contain" />
                  ) : (
                    <div className="w-10 h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-[8px] text-slate-400">Pemda</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[9px] uppercase font-bold tracking-wider text-slate-800">
                    PEMERINTAH {(formData.kabupatenKota || 'KABUPATEN').replace(/^kab\.\s*/i, 'Kabupaten ').toUpperCase()}
                  </div>
                  <div className="text-[9px] uppercase font-semibold text-slate-700">
                    DINAS PENDIDIKAN DAN KEBUDAYAAN
                  </div>
                  <div className="text-[11px] uppercase font-black tracking-tight text-black mt-0.5">
                    {formData.namaSekolah || 'NAMA SATUAN PENDIDIKAN'}
                  </div>
                  <div className="text-[8px] text-slate-600 leading-tight mt-0.5">
                    {formData.alamat} • NPSN: {formData.npsn} • Telp: {formData.telepon}
                  </div>
                </div>
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  {formData.logoSekolah ? (
                    <img src={formData.logoSekolah} alt="Logo Sekolah" className="max-h-12 max-w-12 object-contain" />
                  ) : (
                    <div className="w-10 h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-[8px] text-slate-400">Sekolah</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pejabat Penandatangan */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b pb-1">
              3. Pimpinan & Kepala Tata Usaha
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  name="namaKepalaSekolah"
                  value={formData.namaKepalaSekolah}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  name="nipKepalaSekolah"
                  value={formData.nipKepalaSekolah}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Kepala Urusan Tata Usaha</label>
                <input
                  type="text"
                  name="namaKepalaTU"
                  value={formData.namaKepalaTU}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">NIP Kepala Tata Usaha</label>
                <input
                  type="text"
                  name="nipKepalaTU"
                  value={formData.nipKepalaTU}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Manajemen Cadangan Data */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b pb-1 flex items-center justify-between">
              <span>4. Database Cloud & Cadangan Data (Backup / Restore)</span>
              <span className="text-emerald-600 font-bold lowercase text-[11px] normal-case bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                🟢 Cloud Multi-Komputer Aktif
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Data kini tersinkronisasi otomatis ke <strong>Cloud Firestore</strong> sehingga dapat dilihat dan dikelola bersama dari laptop/komputer lain secara real-time. Anda juga tetap bisa mengunduh file cadangan mandiri (JSON / Offline HTML).
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="/agenda-surat-sekolah-singlefile.html"
                download="index.html"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer text-xs shadow-xs"
                title="Unduh langsung berkas index.html utuh untuk dijalankan secara offline di komputer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File index.html (Aplikasi Offline)</span>
              </a>

              <button
                type="button"
                onClick={handleBackupJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Cadangan Data (JSON)</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Pulihkan dari File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Kembalikan ke data contoh bawaan sistem? Data saat ini akan diganti dengan data contoh.')) {
                    onResetToDefault();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg font-medium transition-colors cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Data Demo</span>
              </button>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {successMsg ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Tersimpan!
              </span>
            ) : (
              <span></span>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Profil Sekolah</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
