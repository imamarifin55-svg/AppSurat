/**
 * IndexedDB Local Storage Service
 * Provides durable, high-capacity local storage for all documents, records,
 * multi-format uploaded files (Word, Excel, PPT, Photos, PDFs, etc.),
 * and deleted documents history (Recycle Bin / Kotak Sampah).
 */

import { SuratItem, SuratIzinItem, DokumenLainItem, IdentitasSekolah, DokumenTerhapusItem } from '../types';

const DB_NAME = 'AgendaSuratSekolah_DB_v2';
const DB_VERSION = 1;

const STORE_SURAT = 'surat';
const STORE_SURAT_IZIN = 'surat_izin';
const STORE_DOKUMEN_LAIN = 'dokumen_lain';
const STORE_DOKUMEN_TERHAPUS = 'dokumen_terhapus';
const STORE_SEKOLAH = 'sekolah';

let dbInstance: IDBDatabase | null = null;
let dbInitPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }
  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported on this platform'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_SURAT)) {
        db.createObjectStore(STORE_SURAT, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SURAT_IZIN)) {
        db.createObjectStore(STORE_SURAT_IZIN, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_DOKUMEN_LAIN)) {
        db.createObjectStore(STORE_DOKUMEN_LAIN, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_DOKUMEN_TERHAPUS)) {
        db.createObjectStore(STORE_DOKUMEN_TERHAPUS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SEKOLAH)) {
        db.createObjectStore(STORE_SEKOLAH, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.warn('Failed to open IndexedDB:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbInitPromise;
}

// Generic helper to get all records from a store
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB getAllFromStore error for ${storeName}:`, err);
    return [];
  }
}

// Generic helper to put a record into a store
async function putToStore<T extends { id?: string }>(storeName: string, item: T): Promise<void> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB putToStore error for ${storeName}:`, err);
  }
}

// Generic helper to put multiple records into a store
async function putManyToStore<T extends { id?: string }>(storeName: string, items: T[]): Promise<void> {
  if (!items || items.length === 0) return;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      items.forEach((item) => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`IndexedDB putManyToStore error for ${storeName}:`, err);
  }
}

// Generic helper to delete a record by key
async function deleteFromStore(storeName: string, key: string): Promise<void> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB deleteFromStore error for ${storeName}:`, err);
  }
}

// Generic helper to clear a store
async function clearStore(storeName: string): Promise<void> {
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`IndexedDB clearStore error for ${storeName}:`, err);
  }
}

/* ==================== SURAT (MASUK & KELUAR) ==================== */

export async function dbGetAllSurat(): Promise<SuratItem[]> {
  return getAllFromStore<SuratItem>(STORE_SURAT);
}

export async function dbSaveSurat(item: SuratItem): Promise<void> {
  return putToStore(STORE_SURAT, item);
}

export async function dbSaveAllSurat(items: SuratItem[]): Promise<void> {
  return putManyToStore(STORE_SURAT, items);
}

export async function dbDeleteSurat(id: string): Promise<void> {
  return deleteFromStore(STORE_SURAT, id);
}

/* ==================== SURAT IZIN ==================== */

export async function dbGetAllSuratIzin(): Promise<SuratIzinItem[]> {
  return getAllFromStore<SuratIzinItem>(STORE_SURAT_IZIN);
}

export async function dbSaveSuratIzin(item: SuratIzinItem): Promise<void> {
  return putToStore(STORE_SURAT_IZIN, item);
}

export async function dbSaveAllSuratIzin(items: SuratIzinItem[]): Promise<void> {
  return putManyToStore(STORE_SURAT_IZIN, items);
}

export async function dbDeleteSuratIzin(id: string): Promise<void> {
  return deleteFromStore(STORE_SURAT_IZIN, id);
}

/* ==================== DOKUMEN LAIN (SOAL, MODUL, DLL) ==================== */

export async function dbGetAllDokumenLain(): Promise<DokumenLainItem[]> {
  return getAllFromStore<DokumenLainItem>(STORE_DOKUMEN_LAIN);
}

export async function dbSaveDokumenLain(item: DokumenLainItem): Promise<void> {
  return putToStore(STORE_DOKUMEN_LAIN, item);
}

export async function dbSaveAllDokumenLain(items: DokumenLainItem[]): Promise<void> {
  return putManyToStore(STORE_DOKUMEN_LAIN, items);
}

export async function dbDeleteDokumenLain(id: string): Promise<void> {
  return deleteFromStore(STORE_DOKUMEN_LAIN, id);
}

/* ==================== DOKUMEN TERHAPUS (RECYCLE BIN / KOTAK SAMPAH) ==================== */

export async function dbGetAllDokumenTerhapus(): Promise<DokumenTerhapusItem[]> {
  const items = await getAllFromStore<DokumenTerhapusItem>(STORE_DOKUMEN_TERHAPUS);
  // Sort descending by dihapusPada (most recently deleted first)
  return items.sort((a, b) => new Date(b.dihapusPada).getTime() - new Date(a.dihapusPada).getTime());
}

export async function dbSaveDokumenTerhapus(item: DokumenTerhapusItem): Promise<void> {
  return putToStore(STORE_DOKUMEN_TERHAPUS, item);
}

export async function dbSaveAllDokumenTerhapus(items: DokumenTerhapusItem[]): Promise<void> {
  return putManyToStore(STORE_DOKUMEN_TERHAPUS, items);
}

export async function dbDeleteDokumenTerhapus(id: string): Promise<void> {
  return deleteFromStore(STORE_DOKUMEN_TERHAPUS, id);
}

export async function dbClearAllDokumenTerhapus(): Promise<void> {
  return clearStore(STORE_DOKUMEN_TERHAPUS);
}

/* ==================== IDENTITAS SEKOLAH ==================== */

export async function dbGetIdentitasSekolah(): Promise<IdentitasSekolah | null> {
  try {
    const list = await getAllFromStore<IdentitasSekolah & { id: string }>(STORE_SEKOLAH);
    return list.length > 0 ? list[0] : null;
  } catch (err) {
    return null;
  }
}

export async function dbSaveIdentitasSekolah(sekolah: IdentitasSekolah): Promise<void> {
  return putToStore(STORE_SEKOLAH, { ...sekolah, id: 'identitas_sekolah_config' });
}

/* ==================== INITIAL SEEDING HELPER ==================== */

export async function dbSeedInitialDataIfEmpty(
  initialSurat: SuratItem[],
  initialSuratIzin: SuratIzinItem[],
  initialDokumenLain: DokumenLainItem[],
  initialSekolah: IdentitasSekolah
): Promise<{
  surat: SuratItem[];
  suratIzin: SuratIzinItem[];
  dokumenLain: DokumenLainItem[];
  sekolah: IdentitasSekolah;
  dokumenTerhapus: DokumenTerhapusItem[];
}> {
  try {
    const [existingSurat, existingIzin, existingDok, existingSekolah, existingTrash] = await Promise.all([
      dbGetAllSurat(),
      dbGetAllSuratIzin(),
      dbGetAllDokumenLain(),
      dbGetIdentitasSekolah(),
      dbGetAllDokumenTerhapus()
    ]);

    let finalSurat = existingSurat;
    let finalIzin = existingIzin;
    let finalDok = existingDok;
    let finalSekolah = existingSekolah || initialSekolah;
    let finalTrash = existingTrash;

    if (finalSurat.length === 0 && initialSurat.length > 0) {
      await dbSaveAllSurat(initialSurat);
      finalSurat = initialSurat;
    }
    if (finalIzin.length === 0 && initialSuratIzin.length > 0) {
      await dbSaveAllSuratIzin(initialSuratIzin);
      finalIzin = initialSuratIzin;
    }
    if (finalDok.length === 0 && initialDokumenLain.length > 0) {
      await dbSaveAllDokumenLain(initialDokumenLain);
      finalDok = initialDokumenLain;
    }
    if (!existingSekolah) {
      await dbSaveIdentitasSekolah(initialSekolah);
    }

    return {
      surat: finalSurat,
      suratIzin: finalIzin,
      dokumenLain: finalDok,
      sekolah: finalSekolah,
      dokumenTerhapus: finalTrash
    };
  } catch (err) {
    console.warn('dbSeedInitialDataIfEmpty notice:', err);
    return {
      surat: initialSurat,
      suratIzin: initialSuratIzin,
      dokumenLain: initialDokumenLain,
      sekolah: initialSekolah,
      dokumenTerhapus: []
    };
  }
}
