/**
 * Utility helper functions for handling multiple document file types
 * (PDF, Word, Excel, PowerPoint, Foto/Scan, Text, ZIP, etc.)
 */

export type FileCategory = 
  | 'pdf' 
  | 'image' 
  | 'word' 
  | 'excel' 
  | 'powerpoint' 
  | 'text' 
  | 'archive' 
  | 'other';

export interface FileTypeInfo {
  category: FileCategory;
  label: string;
  shortLabel: string;
  extension: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconColor: string;
  brandColor: string;
  canDirectPreview: boolean;
  appDescription: string;
}

/**
 * Determine file category and metadata from filename, MIME type, or data URL
 */
export function getFileTypeInfo(
  fileName: string = '',
  fileType: string = '',
  fileData: string = ''
): FileTypeInfo {
  const lowerName = fileName.toLowerCase();
  const lowerType = fileType.toLowerCase();
  const ext = lowerName.includes('.') ? lowerName.substring(lowerName.lastIndexOf('.')) : '';

  // 1. PDF
  if (lowerType === 'application/pdf' || ext === '.pdf' || fileData.startsWith('data:application/pdf')) {
    return {
      category: 'pdf',
      label: 'Dokumen PDF (.pdf)',
      shortLabel: 'PDF',
      extension: '.pdf',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      badgeBorder: 'border-rose-200',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      brandColor: '#e11d48',
      canDirectPreview: true,
      appDescription: 'Dapat dibaca langsung di browser atau aplikasi Adobe Acrobat / PDF Reader.'
    };
  }

  // 2. Images (JPG, PNG, WEBP, GIF, SVG)
  if (
    lowerType.startsWith('image/') ||
    fileData.startsWith('data:image/') ||
    ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.svg'].includes(ext)
  ) {
    return {
      category: 'image',
      label: 'Foto / Scan Dokumen',
      shortLabel: 'Foto/Scan',
      extension: ext || '.jpg',
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-700',
      badgeBorder: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      brandColor: '#9333ea',
      canDirectPreview: true,
      appDescription: 'Foto lembar soal / dokumen dapat diperbesar, diputar, dan diunduh.'
    };
  }

  // 3. Microsoft Word (.doc, .docx)
  if (
    lowerType === 'application/msword' ||
    lowerType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ['.doc', '.docx', '.dotx'].includes(ext)
  ) {
    return {
      category: 'word',
      label: 'Microsoft Word (' + (ext.toUpperCase() || '.DOCX') + ')',
      shortLabel: 'Word',
      extension: ext || '.docx',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-blue-700',
      badgeBorder: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      brandColor: '#2563eb',
      canDirectPreview: false,
      appDescription: 'Naskah soal / perangkat ajar siap dibuka dan diedit di Microsoft Word, WPS Office, atau Google Docs.'
    };
  }

  // 4. Microsoft Excel (.xls, .xlsx, .csv)
  if (
    lowerType === 'application/vnd.ms-excel' ||
    lowerType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    lowerType === 'text/csv' ||
    ['.xls', '.xlsx', '.csv', '.ods'].includes(ext)
  ) {
    return {
      category: 'excel',
      label: 'Microsoft Excel (' + (ext.toUpperCase() || '.XLSX') + ')',
      shortLabel: 'Excel',
      extension: ext || '.xlsx',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      brandColor: '#059669',
      canDirectPreview: ext === '.csv',
      appDescription: 'Lembar kerja / analisis nilai siap dibuka dan diolah di Microsoft Excel, WPS Spreadsheets, atau Google Sheets.'
    };
  }

  // 5. PowerPoint (.ppt, .pptx)
  if (
    lowerType === 'application/vnd.ms-powerpoint' ||
    lowerType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    ['.ppt', '.pptx', '.odp'].includes(ext)
  ) {
    return {
      category: 'powerpoint',
      label: 'PowerPoint (' + (ext.toUpperCase() || '.PPTX') + ')',
      shortLabel: 'PPT',
      extension: ext || '.pptx',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      badgeBorder: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      brandColor: '#d97706',
      canDirectPreview: false,
      appDescription: 'Slide presentasi siap ditayangkan melalui PowerPoint, Google Slides, atau WPS Presentation.'
    };
  }

  // 6. Text file (.txt, .rtf)
  if (lowerType.startsWith('text/') || ['.txt', '.rtf', '.md'].includes(ext)) {
    return {
      category: 'text',
      label: 'Dokumen Teks (' + (ext.toUpperCase() || '.TXT') + ')',
      shortLabel: 'Teks',
      extension: ext || '.txt',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      badgeBorder: 'border-slate-300',
      iconBg: 'bg-slate-200',
      iconColor: 'text-slate-700',
      brandColor: '#475569',
      canDirectPreview: true,
      appDescription: 'File teks dapat langsung dibaca di layar HP atau komputer.'
    };
  }

  // 7. Compressed Archive (.zip, .rar, .7z)
  if (['.zip', '.rar', '.7z'].includes(ext) || lowerType.includes('zip') || lowerType.includes('compressed')) {
    return {
      category: 'archive',
      label: 'Arsip Berkas (' + (ext.toUpperCase() || '.ZIP') + ')',
      shortLabel: 'ZIP',
      extension: ext || '.zip',
      badgeBg: 'bg-indigo-50',
      badgeText: 'text-indigo-700',
      badgeBorder: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      brandColor: '#4f46e5',
      canDirectPreview: false,
      appDescription: 'Paket berkas terkompresi siap diunduh dan diekstrak.'
    };
  }

  // 8. Other / Default
  return {
    category: 'other',
    label: ext ? `Berkas ${ext.toUpperCase()}` : 'Berkas Dokumen',
    shortLabel: ext.replace('.', '').toUpperCase() || 'Berkas',
    extension: ext || '',
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    brandColor: '#64748b',
    canDirectPreview: false,
    appDescription: 'Berkas dokumen tersimpan aman dan siap diunduh ke perangkat Anda.'
  };
}

/**
 * Format bytes into human readable KB / MB
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Convert base64 dataUrl to native Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (err) {
    console.error('Failed to convert dataUrl to Blob:', err);
    return new Blob([], { type: 'application/octet-stream' });
  }
}

/**
 * Trigger browser file download cleanly
 */
export function triggerFileDownload(fileData: string, fileName: string = 'Dokumen'): void {
  try {
    const blob = dataUrlToBlob(fileData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error('Fallback direct download:', err);
    const a = document.createElement('a');
    a.href = fileData;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
