import { SuratItem } from '../types';

export function formatTanggalIndo(dateString: string, includeDay: boolean = false): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(includeDay ? { weekday: 'long' } : {})
    };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  } catch {
    return dateString;
  }
}

export function formatTanggalPendek(dateString: string): string {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function toRomanMonth(monthIndex: number): string {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return roman[monthIndex] || 'I';
}

export function generateNextNomorAgenda(items: SuratItem[], tipe: 'MASUK' | 'KELUAR'): string {
  const prefix = tipe === 'MASUK' ? 'SM' : 'SK';
  const currentYear = new Date().getFullYear();
  const itemsInTipe = items.filter(
    (item) => item.tipe === tipe && item.noAgenda.startsWith(`${prefix}-${currentYear}`)
  );
  
  const count = itemsInTipe.length + 1;
  const formattedCount = String(count).padStart(3, '0');
  return `${prefix}-${currentYear}-${formattedCount}`;
}

export function exportSuratToCsv(items: SuratItem[], title: string = 'Buku_Agenda_Surat_Sekolah'): void {
  const headers = [
    'Tipe Surat',
    'No. Agenda',
    'No. Surat',
    'Tanggal Surat',
    'Tanggal Terima/Kirim',
    'Pengirim/Tujuan',
    'Perihal',
    'Ringkasan',
    'Klasifikasi',
    'Kategori',
    'Sifat',
    'Status',
    'Lampiran',
    'Lokasi Fisik',
    'Disposisi Tujuan',
    'Disposisi Instruksi',
    'Disposisi Catatan'
  ];

  const rows = items.map((item) => {
    const pihak = (item.tipe === 'MASUK' ? item.pengirim : item.tujuan) || '';
    const disposisiTujuan = item.disposisi?.tujuanJabatan?.join('; ') || '';
    const disposisiInstruksi = item.disposisi?.instruksi?.join('; ') || '';
    const disposisiCatatan = item.disposisi?.catatan || '';

    return [
      item.tipe === 'MASUK' ? 'Surat Masuk' : 'Surat Keluar',
      `"${item.noAgenda.replace(/"/g, '""')}"`,
      `"${item.noSurat.replace(/"/g, '""')}"`,
      item.tanggalSurat,
      item.tanggalTerimaOrKirim,
      `"${pihak.replace(/"/g, '""')}"`,
      `"${item.perihal.replace(/"/g, '""')}"`,
      `"${item.ringkasan.replace(/"/g, '""')}"`,
      item.kodeKlasifikasi,
      item.kategori,
      item.sifat,
      item.status,
      `"${(item.lampiranJumlah || '').replace(/"/g, '""')}"`,
      `"${(item.lokasiArsipFisik || '').replace(/"/g, '""')}"`,
      `"${disposisiTujuan.replace(/"/g, '""')}"`,
      `"${disposisiInstruksi.replace(/"/g, '""')}"`,
      `"${disposisiCatatan.replace(/"/g, '""')}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${title}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
