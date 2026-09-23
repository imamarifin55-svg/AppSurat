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
  ChevronRight
} from 'lucide-react';

interface DocumentFileViewerProps {
  fileData?: string;
  fileType?: string;
  fileName?: string;
  className?: string;
  compact?: boolean;
}

// Convert data URL (base64) to native Blob for reliable mobile viewing
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
  fileName,
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!fileData) {
    return (
      <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Tidak ada berkas yang diunggah.</p>
      </div>
    );
  }

  const isImage = 
    fileType?.startsWith('image/') || 
    fileData.startsWith('data:image/') ||
    /\.(jpe?g|png|webp|gif|svg)$/i.test(fileName || '');

  const isPdf = 
    fileType === 'application/pdf' || 
    fileData.startsWith('data:application/pdf') ||
    /\.pdf$/i.test(fileName || '');

  // Generate Blob URL once for download and native viewer
  useEffect(() => {
    try {
      const blob = dataUrlToBlob(fileData);
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch {
      setBlobUrl(null);
    }
  }, [fileData]);

  // Open in native mobile tab or PDF viewer
  const handleOpenInMobileTab = () => {
    if (blobUrl) {
      const newWin = window.open(blobUrl, '_blank');
      if (!newWin) {
        // Fallback for pop-up blocked
        const a = document.createElement('a');
        a.href = blobUrl;
        a.target = '_blank';
        a.click();
      }
    } else {
      const a = document.createElement('a');
      a.href = fileData;
      a.target = '_blank';
      a.click();
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = blobUrl || fileData;
    a.download = fileName || `Berkas-${Date.now()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };

  // Load PDF with PDF.js for crisp canvas rendering across mobile and desktop
  useEffect(() => {
    if (!isPdf) return;

    let isMounted = true;
    setPdfLoading(true);
    setPdfError(null);

    loadPdfJs()
      .then(async (pdfjsLib) => {
        if (!isMounted) return;
        try {
          const parts = fileData.split(',');
          const base64Data = parts[1] || parts[0];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const loadingTask = pdfjsLib.getDocument({ data: bytes });
          const doc = await loadingTask.promise;
          if (isMounted) {
            setPdfDoc(doc);
            setNumPages(doc.numPages);
            setCurrentPage(1);
            setPdfLoading(false);
          }
        } catch (err: any) {
          console.error('Error loading PDF bytes:', err);
          if (isMounted) {
            setPdfError('Format PDF memerlukan pembuka eksternal.');
            setPdfLoading(false);
          }
        }
      })
      .catch((err) => {
        console.error('Error loading PDF.js library:', err);
        if (isMounted) {
          setPdfError('Pustaka penampil PDF tidak dapat dimuat.');
          setPdfLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fileData, isPdf]);

  // Render current PDF page to canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !isPdf) return;

    let renderTask: any = null;
    let isCancelled = false;

    pdfDoc.getPage(currentPage).then((page: any) => {
      if (isCancelled || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Base width fitted to container or screen
      const containerWidth = containerRef.current?.clientWidth || 360;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const fitScale = (containerWidth - 24) / unscaledViewport.width;
      
      // High-DPI sharpness adjustment (devicePixelRatio)
      const dpr = window.devicePixelRatio || 1;
      const finalScale = Math.max(fitScale, 0.6) * zoom;
      const viewport = page.getViewport({ scale: finalScale * dpr, rotation });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      renderTask = page.render(renderContext);
      renderTask.promise.catch((err: any) => {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('PDF render notice:', err);
        }
      });
    });

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, zoom, rotation, isPdf]);

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col bg-slate-900/90 rounded-2xl overflow-hidden shadow-xl border border-slate-700/60 ${className} ${
        isFullscreen ? 'fixed inset-0 z-100 rounded-none h-screen' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="px-3 sm:px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 text-white flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-blue-600/80 text-white shrink-0">
            {isPdf ? <FileText className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-slate-100 truncate block">
              {fileName || (isPdf ? 'Dokumen PDF' : 'Berkas Lampiran')}
            </span>
            <span className="text-[10px] text-slate-400">
              {isPdf ? 'Format PDF Dokumen Resmi' : isImage ? 'Format Gambar Scan/Foto' : 'Berkas Lampiran'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Zoom & Rotate Controls */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Perkecil (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-300 px-1 font-semibold min-w-9 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Perbesar (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors ml-0.5"
              title="Putar 90 Derajat"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dedicated Mobile & Fullscreen Action */}
          <button
            onClick={handleOpenInMobileTab}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Buka Langsung di Penampil HP / Tab Baru"
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Buka di HP</span>
            <ExternalLink className="w-3 h-3 shrink-0 ml-0.5" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
            title="Unduh Berkas Asli"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Preview Canvas / Container */}
      <div className={`relative flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-3 sm:p-4 min-h-[360px] sm:min-h-[480px] max-h-[75vh] select-none ${
        isFullscreen ? 'max-h-none h-[calc(100vh-80px)]' : ''
      }`}>
        {/* Render Image File */}
        {isImage && (
          <div className="flex items-center justify-center w-full h-full overflow-auto">
            <img
              src={fileData}
              alt={fileName || 'Pratinjau Gambar'}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800 bg-slate-900/60"
            />
          </div>
        )}

        {/* Render PDF File with PDF.js Canvas */}
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
              <div className="max-w-md p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-300 my-6 shadow-xl">
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

        {/* Fallback for other file types */}
        {!isImage && !isPdf && (
          <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 max-w-sm">
            <FileText className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">{fileName || 'Berkas Dokumen'}</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Format berkas ini dapat dibuka langsung pada aplikasi penampil perangkat Anda.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleOpenInMobileTab}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Berkas</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Unduh</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: PDF Page Navigation or Mobile Helper */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        {isPdf && numPages > 1 ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
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
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Pratinjau responsif siap dibaca di layar HP & Komputer</span>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto text-[11px]">
          <button
            onClick={handleResetZoom}
            className="text-slate-400 hover:text-white transition-colors underline cursor-pointer"
          >
            Reset Tampilan
          </button>
          <span>•</span>
          <button
            onClick={handleOpenInMobileTab}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Penampil Layar Penuh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
