import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Smartphone, 
  Loader2, 
  AlertCircle,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileCheck2,
  FileArchive,
  Image as ImageIcon,
  CheckCircle2,
  FileCode,
  File
} from 'lucide-react';
import { getFileTypeInfo, dataUrlToBlob, triggerFileDownload, formatFileSize } from '../utils/fileHelpers';

interface DocumentFileViewerProps {
  fileData?: string;
  fileType?: string;
  fileName?: string;
  className?: string;
  compact?: boolean;
}

// Re-export for compatibility
export { dataUrlToBlob };

// Dynamically load PDF.js from official cdnjs
let pdfjsPromise: Promise<any> | null = null;
function loadPdfJs(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR not supported'));
  if ((window as any).pdfjsLib) return Promise.resolve((window as any).pdfjsLib);

  if (!pdfjsPromise) {
    pdfjsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(lib);
        } else {
          reject(new Error('PDF.js did not initialize properly'));
        }
      };
      script.onerror = () => reject(new Error('Gagal mengunduh pustaka pembaca PDF'));
      document.head.appendChild(script);
    });
  }
  return pdfjsPromise;
}

export const DocumentFileViewer: React.FC<DocumentFileViewerProps> = ({
  fileData,
  fileType,
  fileName = 'Berkas Dokumen',
  className = '',
  compact = false
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fileInfo = getFileTypeInfo(fileName, fileType, fileData);
  const isImage = fileInfo.category === 'image';
  const isPdf = fileInfo.category === 'pdf';
  const isWord = fileInfo.category === 'word';
  const isExcel = fileInfo.category === 'excel';
  const isPowerPoint = fileInfo.category === 'powerpoint';
  const isText = fileInfo.category === 'text';
  const isArchive = fileInfo.category === 'archive';

  // Generate Blob URL once for download and native viewer
  useEffect(() => {
    if (!fileData) {
      setBlobUrl(null);
      setTextContent(null);
      return;
    }

    try {
      const blob = dataUrlToBlob(fileData);
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      // If text or CSV, decode for preview
      if (isText || (isExcel && fileName.toLowerCase().endsWith('.csv'))) {
        try {
          const parts = fileData.split(',');
          if (parts[1]) {
            const decoded = atob(parts[1]);
            setTextContent(decoded.slice(0, 10000)); // limit preview length
          }
        } catch {
          setTextContent(null);
        }
      }

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch {
      setBlobUrl(null);
    }
  }, [fileData, isText, isExcel, fileName]);

  // Load and render PDF using PDF.js
  useEffect(() => {
    if (!isPdf || !fileData) return;

    let isCancelled = false;
    setPdfLoading(true);
    setPdfError(null);

    const initPdf = async () => {
      try {
        const pdfjs = await loadPdfJs();
        if (isCancelled) return;

        // Convert dataUrl to array buffer
        const parts = fileData.split(',');
        const binaryString = atob(parts[1] || parts[0]);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const loadingTask = pdfjs.getDocument({ data: bytes });
        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setPdfLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('PDF.js inline rendering issue, fallback to native open:', err);
          setPdfError(err?.message || 'Gagal merender halaman PDF');
          setPdfLoading(false);
        }
      }
    };

    initPdf();

    return () => {
      isCancelled = true;
    };
  }, [isPdf, fileData]);

  // Render current PDF page to canvas
  useEffect(() => {
    if (!isPdf || !pdfDoc || !canvasRef.current) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate responsive viewport scale
        const containerWidth = containerRef.current?.clientWidth || 700;
        const unscaledViewport = page.getViewport({ scale: 1 });
        const targetWidth = Math.min(containerWidth - 32, 900);
        const baseScale = targetWidth / unscaledViewport.width;
        const effectiveScale = (baseScale > 0 ? baseScale : 1.2) * zoom;

        const viewport = page.getViewport({ scale: effectiveScale, rotation });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page:', err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [isPdf, pdfDoc, currentPage, zoom, rotation]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleOpenInMobileTab = () => {
    if (blobUrl) {
      const newWin = window.open(blobUrl, '_blank');
      if (!newWin) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        a.click();
      }
    } else if (fileData) {
      const a = document.createElement('a');
      a.href = fileData;
      a.target = '_blank';
      a.click();
    }
  };

  const handleDownload = () => {
    if (fileData) {
      triggerFileDownload(fileData, fileName || `Berkas-${Date.now()}`);
    }
  };

  if (!fileData) {
    return (
      <div className={`p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl ${className}`}>
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Tidak ada berkas yang diunggah.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800 ${className} ${
        isFullscreen ? 'fixed inset-0 z-100 rounded-none border-none' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="px-3 sm:px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-white">
        {/* File Name & Format Badge */}
        <div className="flex items-center gap-2 overflow-hidden max-w-[65%] sm:max-w-[70%]">
          <div className={`p-1.5 rounded-lg shrink-0 ${fileInfo.iconBg} ${fileInfo.iconColor}`}>
            {isImage && <ImageIcon className="w-4 h-4" />}
            {isPdf && <FileText className="w-4 h-4" />}
            {isWord && <FileText className="w-4 h-4" />}
            {isExcel && <FileSpreadsheet className="w-4 h-4" />}
            {isPowerPoint && <FileCode className="w-4 h-4" />}
            {isText && <FileCode className="w-4 h-4" />}
            {isArchive && <FileArchive className="w-4 h-4" />}
            {!isImage && !isPdf && !isWord && !isExcel && !isPowerPoint && !isText && !isArchive && (
              <File className="w-4 h-4" />
            )}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate" title={fileName}>
              {fileName}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${fileInfo.badgeBg} ${fileInfo.badgeText}`}>
                {fileInfo.shortLabel}
              </span>
              <span>{fileInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
          {/* Zoom & Rotate controls (Available for PDF and Images) */}
          {(isImage || (isPdf && !pdfError)) && (
            <>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Perkecil (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 min-w-[36px] text-center hidden sm:inline">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Perbesar (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Putar 90 Derajat"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
            title="Unduh Berkas ke Komputer / HP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className={`relative flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-3 sm:p-5 min-h-[360px] sm:min-h-[480px] max-h-[75vh] select-none ${
        isFullscreen ? 'max-h-none h-[calc(100vh-80px)]' : ''
      }`}>
        {/* 1. Render Image File */}
        {isImage && (
          <div className="flex items-center justify-center w-full h-full overflow-auto p-2">
            <img
              src={fileData}
              alt={fileName}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800 bg-slate-900/60"
            />
          </div>
        )}

        {/* 2. Render PDF File with PDF.js Canvas */}
        {isPdf && (
          <div className="flex flex-col items-center justify-center w-full min-h-full">
            {pdfLoading && (
              <div className="text-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-400 mb-2" />
                <p className="text-xs font-semibold text-slate-300">Menyiapkan Pratinjau Dokumen PDF...</p>
                <p className="text-[11px] text-slate-500 mt-1">Mengoptimalkan tampilan untuk layar HP & Komputer</p>
              </div>
            )}

            {pdfError && (
              <div className="max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-300 my-6 shadow-xl">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">Pratinjau Dokumen PDF</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Dokumen PDF siap dibuka secara langsung melalui penampil bawaan perangkat HP Anda.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={handleOpenInMobileTab}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Buka di Penampil HP</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh PDF</span>
                  </button>
                </div>
              </div>
            )}

            {!pdfLoading && !pdfError && (
              <div className="flex flex-col items-center py-2 overflow-auto max-w-full">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg shadow-2xl border border-slate-700/80 bg-white max-w-full"
                />
              </div>
            )}
          </div>
        )}

        {/* 3. Render Microsoft Word Document (.doc, .docx) */}
        {isWord && (
          <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-blue-900/60 p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <FileText className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider inline-block mb-2">
              Microsoft Word Document
            </span>

            <h3 className="text-base font-bold text-white mb-2 leading-snug px-2">
              {fileName}
            </h3>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {fileInfo.appDescription}
            </p>

            <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 text-left mb-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Format Dokumen:</span>
                <span className="font-semibold text-blue-400">{fileInfo.extension.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Status Berkas:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan Utuh
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Dokumen Word</span>
              </button>
              <button
                onClick={handleOpenInMobileTab}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka di Perangkat</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Render Microsoft Excel Spreadsheet (.xls, .xlsx, .csv) */}
        {isExcel && (
          <div className="max-w-lg w-full bg-slate-900 rounded-2xl border border-emerald-900/60 p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
              <FileSpreadsheet className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider inline-block mb-2">
              Microsoft Excel Spreadsheet
            </span>

            <h3 className="text-base font-bold text-white mb-2 leading-snug px-2">
              {fileName}
            </h3>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              {fileInfo.appDescription}
            </p>

            {/* If CSV text content exists, show quick table/text peek */}
            {textContent ? (
              <div className="text-left bg-slate-950 rounded-xl p-3 mb-5 border border-slate-800 max-h-48 overflow-auto font-mono text-[11px] text-emerald-400">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1 pb-1 border-b border-slate-800">
                  Pratinjau Data CSV:
                </div>
                <pre className="whitespace-pre-wrap">{textContent.slice(0, 800)}...</pre>
              </div>
            ) : (
              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 text-left mb-6 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Format Lembar Kerja:</span>
                  <span className="font-semibold text-emerald-400">{fileInfo.extension.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Aplikasi Kompatibel:</span>
                  <span className="text-slate-300 font-medium">MS Excel, Google Sheets, WPS</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Lembar Kerja Excel</span>
              </button>
              <button
                onClick={handleOpenInMobileTab}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka di Perangkat</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. Render PowerPoint (.ppt, .pptx) */}
        {isPowerPoint && (
          <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-amber-900/60 p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20 border border-amber-400/30">
              <FileCode className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider inline-block mb-2">
              PowerPoint Presentation
            </span>

            <h3 className="text-base font-bold text-white mb-2 leading-snug px-2">
              {fileName}
            </h3>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {fileInfo.appDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Slide Presentasi</span>
              </button>
              <button
                onClick={handleOpenInMobileTab}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Berkas</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. Render Plain Text / Code (.txt, etc.) */}
        {isText && textContent && (
          <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-2xl text-left flex flex-col max-h-[65vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-slate-300 font-mono">
                {fileName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase">
                Pratinjau Teks
              </span>
            </div>
            <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800/80">
              {textContent}
            </div>
          </div>
        )}

        {/* 7. Other File Formats (ZIP, Archive, etc.) */}
        {!isImage && !isPdf && !isWord && !isExcel && !isPowerPoint && (!isText || !textContent) && (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 max-w-sm w-full shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center mx-auto mb-3 border border-slate-700">
              <File className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{fileName}</h4>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              {fileInfo.appDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Berkas</span>
              </button>
              <button
                onClick={handleOpenInMobileTab}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: PDF Page Navigation or Helper */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        {isPdf && numPages > 1 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300 font-semibold font-mono text-[11px]">
              Hal. {currentPage} / {numPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Berkas tersimpan aman dan kompatibel dengan smartphone & komputer</span>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto text-[11px]">
          {(isImage || isPdf) && (
            <>
              <button
                onClick={handleResetZoom}
                className="text-slate-400 hover:text-white transition-colors underline cursor-pointer"
              >
                Reset Tampilan
              </button>
              <span>•</span>
            </>
          )}
          <button
            onClick={handleDownload}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Unduh Berkas</span>
          </button>
          <span>•</span>
          <button
            onClick={handleOpenInMobileTab}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Buka Langsung</span>
          </button>
        </div>
      </div>
    </div>
  );
};
