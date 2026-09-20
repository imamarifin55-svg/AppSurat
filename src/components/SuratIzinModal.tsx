import React, { useState, useRef } from 'react';
import { SuratIzinItem, TipeSuratIzin, JenisIzin, StatusSuratIzin, IdentitasSekolah } from '../types';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Trash2, 
  UserCheck, 
  Calendar, 
  Clock, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';

interface SuratIzinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: SuratIzinItem) => void;
  initialItem?: SuratIzinItem | null;
  sekolah: IdentitasSekolah;
}

export const SuratIzinModal: React.FC<SuratIzinModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  sekolah
}) => {
  const [tipePemohon, setTipePemohon] = useState<TipeSuratIzin>(initialItem?.tipePemohon || 'Siswa');
  const [namaLengkap, setNamaLengkap] = useState(initialItem?.namaLengkap || '');
  const [nomorInduk, setNomorInduk] = useState(initialItem?.nomorInduk || '');
  const [kelasAtauJabatan, setKelasAtauJabatan] = useState(initialItem?.kelasAtauJabatan || 'Kelas VII-A');
  const [jenisIzin, setJenisIzin] = useState<JenisIzin>(initialItem?.jenisIzin || 'Sakit');
  
  const today = new Date().toISOString().slice(0, 10);
  const [tanggalMulai, setTanggalMulai] = useState(initialItem?.tanggalMulai || today);
  const [tanggalSelesai, setTanggalSelesai] = useState(initialItem?.tanggalSelesai || today);
  const [jumlahHari, setJumlahHari] = useState(initialItem?.jumlahHari || 1);
  const [alasan, setAlasan] = useState(initialItem?.alasan || '');
  const [keterangan, setKeterangan] = useState(initialItem?.keterangan || '');
  const [status, setStatus] = useState<StatusSuratIzin>(initialItem?.status || 'Menunggu Persetujuan');
  const [disetujuiOleh, setDisetujuiOleh] = useState(initialItem?.disetujuiOleh || '');

  // File Bukti Unggahan
  const [fileBuktiNama, setFileBuktiNama] = useState(initialItem?.fileBuktiNama || '');
  const [fileBuktiData, setFileBuktiData] = useState<string | undefined>(initialItem?.fileBuktiData);
  const [fileBuktiType, setFileBuktiType] = useState<string | undefined>(initialItem?.fileBuktiType);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Hitung jumlah hari otomatis
  const handleDateChange = (start: string, end: string) => {
    setTanggalMulai(start);
    setTanggalSelesai(end);
    try {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setJumlahHari(diffDays > 0 ? diffDays : 1);
    } catch {
      setJumlahHari(1);
    }
  };

  const processUploadedFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFileBuktiData(reader.result as string);
      setFileBuktiType(file.type);
      setFileBuktiNama(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim() || !alasan.trim()) {
      alert('Mohon isi nama lengkap pemohon dan alasan izin!');
      return;
    }

    const payload: SuratIzinItem = {
      id: initialItem ? initialItem.id : `iz-${Date.now()}`,
      tipePemohon,
      namaLengkap,
      nomorInduk,
      kelasAtauJabatan,
      jenisIzin,
      tanggalMulai,
      tanggalSelesai,
      jumlahHari,
      alasan,
      keterangan,
      status,
      disetujuiOleh: status === 'Disetujui' && !disetujuiOleh ? sekolah.namaKepalaSekolah : disetujuiOleh,
      fileBuktiNama,
      fileBuktiData,
      fileBuktiType,
      createdAt: initialItem ? initialItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialItem ? 'Edit Catatan Surat Izin' : 'Catat Surat Izin Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan izin sakit, keperluan keluarga, atau tugas dinas siswa & guru/tendik
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
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
          
          {/* Tipe Pemohon */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori Pemohon Izin
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTipePemohon('Siswa');
                  if (!initialItem) setKelasAtauJabatan('Kelas VIII-A');
                }}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  tipePemohon === 'Siswa'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-400/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Siswa / Murid</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipePemohon('Guru / Tendik');
                  if (!initialItem) setKelasAtauJabatan('Guru Mata Pelajaran');
                }}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  tipePemohon === 'Guru / Tendik'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-400/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Guru / Tenaga Kependidikan</span>
              </button>
            </div>
          </div>

          {/* Row 1: Nama & Nomor Induk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder={tipePemohon === 'Siswa' ? 'Contoh: Ahmad Rizky' : 'Contoh: Siti Rahmawati, S.Pd.'}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {tipePemohon === 'Siswa' ? 'NISN / No. Induk Siswa' : 'NIP / NUPTK / No. Pegawai'}
              </label>
              <input
                type="text"
                value={nomorInduk}
                onChange={(e) => setNomorInduk(e.target.value)}
                placeholder={tipePemohon === 'Siswa' ? 'Contoh: 0098765432' : 'Contoh: 19850912 201001 1 012'}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 2: Kelas/Jabatan & Jenis Izin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {tipePemohon === 'Siswa' ? 'Kelas / Rombel' : 'Jabatan / Tugas Mengajar'}
              </label>
              <input
                type="text"
                value={kelasAtauJabatan}
                onChange={(e) => setKelasAtauJabatan(e.target.value)}
                placeholder={tipePemohon === 'Siswa' ? 'Contoh: Kelas VII-B' : 'Contoh: Guru IPA / Kaur Tata Usaha'}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis / Sifat Izin
              </label>
              <select
                value={jenisIzin}
                onChange={(e) => setJenisIzin(e.target.value as JenisIzin)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              >
                <option value="Sakit">Sakit (Kondisi Kesehatan / Surat Dokter)</option>
                <option value="Izin Keperluan Keluarga / Mendesak">Izin Keperluan Keluarga / Mendesak</option>
                <option value="Tugas Dinas / Pelatihan">Tugas Dinas / Pelatihan / Lomba</option>
                <option value="Cuti">Cuti Resmi (Tahunan/Melahirkan/Alasan Penting)</option>
                <option value="Lainnya">Lain-lain</option>
              </select>
            </div>
          </div>

          {/* Row 3: Tanggal Mulai, Selesai, dan Durasi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Mulai Tanggal</span>
              </label>
              <input
                type="date"
                required
                value={tanggalMulai}
                onChange={(e) => handleDateChange(e.target.value, tanggalSelesai)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Sampai Tanggal</span>
              </label>
              <input
                type="date"
                required
                value={tanggalSelesai}
                onChange={(e) => handleDateChange(tanggalMulai, e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Durasi Izin</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={1}
                  value={jumlahHari}
                  onChange={(e) => setJumlahHari(Number(e.target.value))}
                  className="w-20 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold text-center"
                />
                <span className="text-xs text-slate-600 font-medium">Hari Kerja</span>
              </div>
            </div>
          </div>

          {/* Row 4: Alasan Izin */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan Izin Secara Rinci <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Jelaskan alasan izin (misal diagnosa sakit, nama kegiatan pelatihan, atau urusan keluarga)..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Row 5: Keterangan Tambahan / Penugasan Guru Piket */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan / Catatan Tugas Pengganti
            </label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Modul ajar diserahkan ke guru piket, tugas siswa dikirim via WA Group"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Row 6: Unggah Bukti Surat / Dokumen Pendukung */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Unggah Bukti Surat (Surat Dokter / Undangan Dinas / Surat Ortu)</span>
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) processUploadedFile(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : fileBuktiData
                  ? 'border-emerald-300 bg-emerald-50/50'
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

              {fileBuktiData ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-left">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{fileBuktiNama}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold">✓ Berkas bukti terlampir</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileBuktiData(undefined);
                      setFileBuktiNama('');
                    }}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-600">
                  <UploadCloud className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <span>Klik atau seret foto/PDF surat bukti izin ke sini</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 7: Status Persetujuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Persetujuan Izin
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusSuratIzin)}
                className={`w-full px-3 py-2 text-xs border rounded-lg font-semibold ${
                  status === 'Disetujui'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : status === 'Ditolak'
                    ? 'bg-red-50 text-red-800 border-red-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pejabat Penyetuju (KS / Wali Kelas / Ka. TU)
              </label>
              <input
                type="text"
                value={disetujuiOleh}
                onChange={(e) => setDisetujuiOleh(e.target.value)}
                placeholder={sekolah.namaKepalaSekolah}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {initialItem ? 'Simpan Perubahan' : 'Catat Surat Izin'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
