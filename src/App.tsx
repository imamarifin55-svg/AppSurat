/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SuratItem, IdentitasSekolah, DisposisiData, TipeSurat, SuratIzinItem } from './types';
import { INITIAL_SEKOLAH, INITIAL_SURAT, INITIAL_SURAT_IZIN } from './data/initialData';
import { exportSuratToCsv } from './utils/formatters';

import { SidebarNav } from './components/SidebarNav';
import { TopNavbar } from './components/TopNavbar';
import { StatSummary } from './components/StatSummary';
import { SuratTable } from './components/SuratTable';
import { SuratModal } from './components/SuratModal';
import { DisposisiModal } from './components/DisposisiModal';
import { DetailSuratModal } from './components/DetailSuratModal';
import { PreviewModal } from './components/PreviewModal';
import { SuratIzinView } from './components/SuratIzinView';
import { SuratIzinModal } from './components/SuratIzinModal';
import { PrintDisposisiView } from './components/PrintDisposisiView';
import { PrintBukuAgendaView } from './components/PrintBukuAgendaView';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { KlasifikasiModal } from './components/KlasifikasiModal';

import { CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY_ITEMS = 'agenda_surat_items_v2';
const STORAGE_KEY_SEKOLAH = 'agenda_surat_sekolah_v2';
const STORAGE_KEY_SURAT_IZIN = 'agenda_surat_izin_v1';

export default function App() {
  // Persistence state
  const [items, setItems] = useState<SuratItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS) || localStorage.getItem('agenda_surat_items_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load items from localStorage', e);
    }
    return INITIAL_SURAT;
  });

  const [suratIzinItems, setSuratIzinItems] = useState<SuratIzinItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SURAT_IZIN);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load surat izin from localStorage', e);
    }
    return INITIAL_SURAT_IZIN;
  });

  const [sekolah, setSekolah] = useState<IdentitasSekolah>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SEKOLAH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.npsn === '10809848') return parsed;
      }
    } catch (e) {
      console.error('Failed to load sekolah from localStorage', e);
    }
    return INITIAL_SEKOLAH;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save items to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SURAT_IZIN, JSON.stringify(suratIzinItems));
    } catch (e) {
      console.error('Failed to save surat izin to localStorage', e);
    }
  }, [suratIzinItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SEKOLAH, JSON.stringify(sekolah));
    } catch (e) {
      console.error('Failed to save sekolah to localStorage', e);
    }
  }, [sekolah]);

  // Modal and Navigation states
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [isSuratModalOpen, setIsSuratModalOpen] = useState(false);
  const [modalDefaultTipe, setModalDefaultTipe] = useState<TipeSurat>('MASUK');
  const [editingItem, setEditingItem] = useState<SuratItem | null>(null);

  // Surat Izin modal states
  const [isSuratIzinModalOpen, setIsSuratIzinModalOpen] = useState(false);
  const [editingSuratIzin, setEditingSuratIzin] = useState<SuratIzinItem | null>(null);

  // Preview Modal state
  const [previewSuratItem, setPreviewSuratItem] = useState<SuratItem | null>(null);

  const [disposisiItem, setDisposisiItem] = useState<SuratItem | null>(null);
  const [detailItem, setDetailItem] = useState<SuratItem | null>(null);
  const [printDisposisiItem, setPrintDisposisiItem] = useState<SuratItem | null>(null);
  const [isPrintAgendaOpen, setIsPrintAgendaOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKlasifikasiOpen, setIsKlasifikasiOpen] = useState(false);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Counts for sidebar
  const itemsCount = {
    all: items.length,
    masuk: items.filter((i) => i.tipe === 'MASUK').length,
    keluar: items.filter((i) => i.tipe === 'KELUAR').length,
    pendingDisposisi: items.filter((i) => i.tipe === 'MASUK' && i.status === 'Menunggu Disposisi').length,
    urgent: items.filter((i) => i.sifat === 'Sangat Segera' || i.sifat === 'Penting').length,
    suratIzin: suratIzinItems.length
  };

  // Handlers
  const handleOpenAddModal = (tipe: TipeSurat) => {
    setEditingItem(null);
    setModalDefaultTipe(tipe);
    setIsSuratModalOpen(true);
  };

  const handleEdit = (item: SuratItem) => {
    setEditingItem(item);
    setModalDefaultTipe(item.tipe);
    setIsSuratModalOpen(true);
  };

  const handleSaveSurat = (savedItem: SuratItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      } else {
        return [savedItem, ...prev];
      }
    });
    setIsSuratModalOpen(false);
    showToast(
      savedItem.tipe === 'MASUK'
        ? `Surat Masuk (${savedItem.noAgenda}) berhasil disimpan!`
        : `Surat Keluar (${savedItem.noAgenda}) berhasil diterbitkan!`
    );
  };

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus agenda ${item.noAgenda} (${item.perihal})?`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`Data agenda ${item.noAgenda} berhasil dihapus.`);
    }
  };

  const handleSaveDisposisi = (suratId: string, disposisi: DisposisiData, newStatus: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === suratId) {
          return {
            ...item,
            disposisi,
            status: newStatus as any,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      })
    );
    showToast('Lembar disposisi Kepala Sekolah berhasil diperbarui!');
  };

  const handleExportCsv = () => {
    exportSuratToCsv(items, `Buku_Agenda_${sekolah.namaSekolah.replace(/\s+/g, '_')}`);
    showToast('Data agenda berhasil diekspor ke format CSV / Excel!');
  };

  const handleRestoreData = (newItems: SuratItem[], newSekolah: IdentitasSekolah) => {
    setItems(newItems);
    setSekolah(newSekolah);
    showToast('Data berhasil dipulihkan dari berkas cadangan!');
  };

  const handleResetToDefault = () => {
    setItems(INITIAL_SURAT);
    setSuratIzinItems(INITIAL_SURAT_IZIN);
    setSekolah(INITIAL_SEKOLAH);
    showToast('Data berhasil diatur ulang ke data contoh bawaan.');
  };

  // Handlers for Surat Izin
  const handleOpenAddSuratIzin = () => {
    setEditingSuratIzin(null);
    setIsSuratIzinModalOpen(true);
  };

  const handleEditSuratIzin = (item: SuratIzinItem) => {
    setEditingSuratIzin(item);
    setIsSuratIzinModalOpen(true);
  };

  const handleSaveSuratIzin = (savedItem: SuratIzinItem) => {
    setSuratIzinItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      } else {
        return [savedItem, ...prev];
      }
    });
    setIsSuratIzinModalOpen(false);
    showToast(`Catatan surat izin atas nama ${savedItem.namaLengkap} berhasil disimpan!`);
  };

  const handleDeleteSuratIzin = (id: string) => {
    const item = suratIzinItems.find((i) => i.id === id);
    if (!item) return;

    if (confirm(`Hapus catatan izin untuk ${item.namaLengkap}?`)) {
      setSuratIzinItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`Catatan surat izin ${item.namaLengkap} berhasil dihapus.`);
    }
  };

  const handleUpdateStatusSuratIzin = (
    id: string,
    newStatus: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak'
  ) => {
    setSuratIzinItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            disetujuiOleh: newStatus === 'Disetujui' ? sekolah.namaKepalaSekolah : item.disetujuiOleh,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      })
    );
    showToast(`Status surat izin berhasil diperbarui menjadi ${newStatus}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-70 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Menu */}
      <SidebarNav
        sekolah={sekolah}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenKlasifikasi={() => setIsKlasifikasiOpen(true)}
        onExportCsv={handleExportCsv}
        onPrintAgenda={() => setIsPrintAgendaOpen(true)}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
        itemsCount={itemsCount}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        
        {/* Top Navbar */}
        <TopNavbar
          sekolah={sekolah}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenAddModal={handleOpenAddModal}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenKlasifikasi={() => setIsKlasifikasiOpen(true)}
          onExportCsv={handleExportCsv}
          onPrintAgenda={() => setIsPrintAgendaOpen(true)}
        />

        {/* Main Content Container */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 max-w-7xl mx-auto">
          
          {/* Operational Stats Summary (tampil jika bukan tab SURAT_IZIN) */}
          {activeTab !== 'SURAT_IZIN' && (
            <StatSummary
              items={items}
              onFilterChange={(filter) => setActiveTab(filter)}
              activeFilter={activeTab}
            />
          )}

          {/* View Switch: Surat Izin vs Agenda Surat Masuk/Keluar */}
          {activeTab === 'SURAT_IZIN' ? (
            <SuratIzinView
              items={suratIzinItems}
              onOpenAddModal={handleOpenAddSuratIzin}
              onEditItem={handleEditSuratIzin}
              onDeleteItem={handleDeleteSuratIzin}
              onUpdateStatus={handleUpdateStatusSuratIzin}
              sekolah={sekolah}
            />
          ) : (
            <SuratTable
              items={items}
              onViewDetail={(item) => setDetailItem(item)}
              onPreview={(item) => setPreviewSuratItem(item)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onOpenDisposisi={(item) => setDisposisiItem(item)}
              onPrintDisposisi={(item) => setPrintDisposisiItem(item)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 max-w-7xl mx-auto">
            <div>
              <span className="font-semibold text-slate-700">{sekolah.namaSekolah}</span> — Sistem Informasi Buku Agenda & Disposisi Tata Usaha
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Kec. {sekolah.kecamatan}, {sekolah.kabupatenKota}</span>
              <span>•</span>
              <span>Penyimpanan Mandiri</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Modal Tambah / Edit Surat */}
      <SuratModal
        isOpen={isSuratModalOpen}
        onClose={() => setIsSuratModalOpen(false)}
        onSave={handleSaveSurat}
        initialItem={editingItem}
        defaultTipe={modalDefaultTipe}
        existingItems={items}
        sekolah={sekolah}
      />

      {/* Modal Disposisi Kepala Sekolah */}
      <DisposisiModal
        isOpen={!!disposisiItem}
        onClose={() => setDisposisiItem(null)}
        item={disposisiItem}
        onSaveDisposisi={handleSaveDisposisi}
        onPrintDisposisi={(item) => {
          setDisposisiItem(null);
          setPrintDisposisiItem(item);
        }}
        sekolah={sekolah}
      />

      {/* Modal Detail Surat */}
      <DetailSuratModal
        item={detailItem}
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        onEdit={(item) => {
          setDetailItem(null);
          handleEdit(item);
        }}
        onPreview={(item) => {
          setDetailItem(null);
          setPreviewSuratItem(item);
        }}
        onOpenDisposisi={(item) => {
          setDetailItem(null);
          setDisposisiItem(item);
        }}
        onPrintDisposisi={(item) => {
          setDetailItem(null);
          setPrintDisposisiItem(item);
        }}
        sekolah={sekolah}
      />

      {/* Modal Preview Berkas Dokumen & Tampilan Resmi Surat */}
      <PreviewModal
        item={previewSuratItem}
        isOpen={!!previewSuratItem}
        onClose={() => setPreviewSuratItem(null)}
        onPrintDisposisi={(item) => {
          setPreviewSuratItem(null);
          setPrintDisposisiItem(item);
        }}
        sekolah={sekolah}
      />

      {/* Modal Tambah / Edit Catatan Surat Izin */}
      <SuratIzinModal
        isOpen={isSuratIzinModalOpen}
        onClose={() => setIsSuratIzinModalOpen(false)}
        onSave={handleSaveSuratIzin}
        initialItem={editingSuratIzin}
        sekolah={sekolah}
      />

      {/* View Cetak Lembar Disposisi */}
      {printDisposisiItem && (
        <PrintDisposisiView
          item={printDisposisiItem}
          sekolah={sekolah}
          onClose={() => setPrintDisposisiItem(null)}
        />
      )}

      {/* View Cetak Buku Agenda Lengkap */}
      {isPrintAgendaOpen && (
        <PrintBukuAgendaView
          items={items}
          sekolah={sekolah}
          onClose={() => setIsPrintAgendaOpen(false)}
        />
      )}

      {/* Modal Pengaturan Sekolah & Backup */}
      <SchoolSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        sekolah={sekolah}
        onSaveSekolah={(newSekolah) => {
          setSekolah(newSekolah);
          showToast('Profil sekolah berhasil diperbarui!');
        }}
        onRestoreData={handleRestoreData}
        onResetToDefault={handleResetToDefault}
        items={items}
      />

      {/* Modal Referensi Kode Klasifikasi */}
      <KlasifikasiModal
        isOpen={isKlasifikasiOpen}
        onClose={() => setIsKlasifikasiOpen(false)}
      />

    </div>
  );
}
