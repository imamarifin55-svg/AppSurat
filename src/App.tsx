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

import { CheckCircle2, AlertCircle, Cloud, RefreshCw } from 'lucide-react';
import { 
  subscribeSurat, 
  subscribeSuratIzin, 
  subscribeSekolah, 
  saveSuratItem, 
  deleteSuratItem, 
  saveSuratIzinItem, 
  deleteSuratIzinItem, 
  saveIdentitasSekolah, 
  seedInitialDataIfEmpty 
} from './services/firestoreService';
import { testFirestoreConnection } from './lib/firebase';

const STORAGE_KEY_ITEMS = 'agenda_surat_items_v2';
const STORAGE_KEY_SEKOLAH = 'agenda_surat_sekolah_v2';
const STORAGE_KEY_SURAT_IZIN = 'agenda_surat_izin_v1';

export default function App() {
  // Cloud & Sync state
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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
        if (parsed.npsn === '10809848') {
          if (parsed.kabupatenKota === 'Kab. Tulang Bawang Barat') {
            parsed.kabupatenKota = 'Kabupaten Tulang Bawang Barat';
          }
          return parsed;
        }
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

  // Real-time Firestore Cloud Database Synchronization
  useEffect(() => {
    let isMounted = true;

    async function initFirestoreCloud() {
      try {
        setIsSyncing(true);
        const isConnected = await testFirestoreConnection();
        if (isMounted) setIsCloudConnected(isConnected);

        // Seed initial data if Firestore collections are empty
        await seedInitialDataIfEmpty(INITIAL_SURAT, INITIAL_SURAT_IZIN, INITIAL_SEKOLAH);
      } catch (err) {
        console.warn('Firestore initialization notice:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    initFirestoreCloud();

    // Subscribe to real-time changes from other computers/users
    const unsubSurat = subscribeSurat(
      (cloudItems) => {
        if (isMounted) {
          setIsCloudConnected(true);
          if (cloudItems.length > 0) {
            setItems(cloudItems);
          }
        }
      },
      (err) => console.warn('Surat sync listener notice:', err)
    );

    const unsubIzin = subscribeSuratIzin(
      (cloudIzin) => {
        if (isMounted) {
          setIsCloudConnected(true);
          if (cloudIzin.length > 0) {
            setSuratIzinItems(cloudIzin);
          }
        }
      },
      (err) => console.warn('Surat Izin sync listener notice:', err)
    );

    const unsubSekolah = subscribeSekolah(
      (cloudSekolah) => {
        if (isMounted) {
          setIsCloudConnected(true);
          if (cloudSekolah?.namaSekolah) {
            if (cloudSekolah.kabupatenKota === 'Kab. Tulang Bawang Barat') {
              const updated = { ...cloudSekolah, kabupatenKota: 'Kabupaten Tulang Bawang Barat' };
              setSekolah(updated);
              saveIdentitasSekolah(updated).catch(console.warn);
            } else {
              setSekolah(cloudSekolah);
            }
          }
        }
      },
      (err) => console.warn('Sekolah sync listener notice:', err)
    );

    return () => {
      isMounted = false;
      unsubSurat();
      unsubIzin();
      unsubSekolah();
    };
  }, []);

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

  const handleSaveSurat = async (savedItem: SuratItem) => {
    // Immediate local optimistic update
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
        ? `Surat Masuk (${savedItem.noAgenda}) tersimpan & disinkronkan ke Cloud!`
        : `Surat Keluar (${savedItem.noAgenda}) diterbitkan & disinkronkan ke Cloud!`
    );

    // Save to Firestore for multi-device sync
    try {
      setIsSyncing(true);
      await saveSuratItem(savedItem);
    } catch (err) {
      console.error('Error saving to Firestore:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus agenda ${item.noAgenda} (${item.perihal})? Perubahan akan terhapus di seluruh komputer.`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`Data agenda ${item.noAgenda} berhasil dihapus.`);

      try {
        setIsSyncing(true);
        await deleteSuratItem(id);
      } catch (err) {
        console.error('Error deleting from Firestore:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleSaveDisposisi = async (suratId: string, disposisi: DisposisiData, newStatus: string) => {
    let updatedItem: SuratItem | null = null;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === suratId) {
          updatedItem = {
            ...item,
            disposisi,
            status: newStatus as any,
            updatedAt: new Date().toISOString()
          };
          return updatedItem;
        }
        return item;
      })
    );
    showToast('Lembar disposisi berhasil diperbarui & disinkronkan ke seluruh komputer!');

    if (updatedItem) {
      try {
        setIsSyncing(true);
        await saveSuratItem(updatedItem);
      } catch (err) {
        console.error('Error updating disposisi in Firestore:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleExportCsv = () => {
    exportSuratToCsv(items, `Buku_Agenda_${sekolah.namaSekolah.replace(/\s+/g, '_')}`);
    showToast('Data agenda berhasil diekspor ke format CSV / Excel!');
  };

  const handleRestoreData = async (newItems: SuratItem[], newSekolah: IdentitasSekolah) => {
    setItems(newItems);
    setSekolah(newSekolah);
    showToast('Data berhasil dipulihkan & disinkronkan ke Cloud!');

    try {
      setIsSyncing(true);
      await saveIdentitasSekolah(newSekolah);
      for (const it of newItems) {
        await saveSuratItem(it);
      }
    } catch (err) {
      console.error('Error syncing restored data:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetToDefault = async () => {
    setItems(INITIAL_SURAT);
    setSuratIzinItems(INITIAL_SURAT_IZIN);
    setSekolah(INITIAL_SEKOLAH);
    showToast('Data berhasil diatur ulang ke data contoh bawaan.');

    try {
      setIsSyncing(true);
      await saveIdentitasSekolah(INITIAL_SEKOLAH);
      for (const s of INITIAL_SURAT) {
        await saveSuratItem(s);
      }
      for (const iz of INITIAL_SURAT_IZIN) {
        await saveSuratIzinItem(iz);
      }
    } catch (err) {
      console.error('Error resetting cloud data:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSekolah = async (newSekolah: IdentitasSekolah) => {
    setSekolah(newSekolah);
    showToast('Profil sekolah berhasil diperbarui di seluruh perangkat!');

    try {
      setIsSyncing(true);
      await saveIdentitasSekolah(newSekolah);
    } catch (err) {
      console.error('Error saving school profile to Firestore:', err);
    } finally {
      setIsSyncing(false);
    }
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

  const handleSaveSuratIzin = async (savedItem: SuratIzinItem) => {
    setSuratIzinItems((prev) => {
      const exists = prev.some((i) => i.id === savedItem.id);
      if (exists) {
        return prev.map((i) => (i.id === savedItem.id ? savedItem : i));
      } else {
        return [savedItem, ...prev];
      }
    });
    setIsSuratIzinModalOpen(false);
    showToast(`Catatan izin ${savedItem.namaLengkap} tersimpan & disinkronkan ke Cloud!`);

    try {
      setIsSyncing(true);
      await saveSuratIzinItem(savedItem);
    } catch (err) {
      console.error('Error saving surat izin to Firestore:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteSuratIzin = async (id: string) => {
    const item = suratIzinItems.find((i) => i.id === id);
    if (!item) return;

    if (confirm(`Hapus catatan izin untuk ${item.namaLengkap}? Perubahan akan terhapus di seluruh komputer.`)) {
      setSuratIzinItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`Catatan surat izin ${item.namaLengkap} berhasil dihapus.`);

      try {
        setIsSyncing(true);
        await deleteSuratIzinItem(id);
      } catch (err) {
        console.error('Error deleting surat izin from Firestore:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleUpdateStatusSuratIzin = async (
    id: string,
    newStatus: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak'
  ) => {
    let updatedItem: SuratIzinItem | null = null;
    setSuratIzinItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedItem = {
            ...item,
            status: newStatus,
            disetujuiOleh: newStatus === 'Disetujui' ? sekolah.namaKepalaSekolah : item.disetujuiOleh,
            updatedAt: new Date().toISOString()
          };
          return updatedItem;
        }
        return item;
      })
    );
    showToast(`Status surat izin berhasil disinkronkan menjadi ${newStatus}!`);

    if (updatedItem) {
      try {
        setIsSyncing(true);
        await saveSuratIzinItem(updatedItem);
      } catch (err) {
        console.error('Error updating status izin in Firestore:', err);
      } finally {
        setIsSyncing(false);
      }
    }
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

      {/* Main Content Area (offset by sidebar on desktop) - Background Hijau Daun (Soft Leaf Green) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 bg-gradient-to-br from-[#eaf4ec] via-[#f0f7f1] to-[#e7f3ea]">
        
        {/* Top Navbar */}
        <TopNavbar
          sekolah={sekolah}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenAddModal={handleOpenAddModal}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenKlasifikasi={() => setIsKlasifikasiOpen(true)}
          onExportCsv={handleExportCsv}
          onPrintAgenda={() => setIsPrintAgendaOpen(true)}
          isCloudConnected={isCloudConnected}
          isSyncing={isSyncing}
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
        <footer className="bg-white/85 backdrop-blur-xs border-t border-emerald-900/10 py-4 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 max-w-7xl mx-auto">
            <div>
              <span className="font-semibold text-slate-700">{sekolah.namaSekolah}</span> — Sistem Informasi Buku Agenda & Disposisi Tata Usaha
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Kec. {sekolah.kecamatan}, {sekolah.kabupatenKota}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Cloud Database Aktif (Multi-Komputer)
              </span>
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
        onSaveSekolah={handleSaveSekolah}
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
