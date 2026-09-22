import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SuratItem, SuratIzinItem, IdentitasSekolah } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {},
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  if (errMessage.includes('insufficient permissions') || errMessage.includes('Missing or insufficient permissions')) {
    throw new Error(JSON.stringify(errInfo));
  }
}

// Helper to remove undefined fields because Firestore rejects undefined
function cleanForFirestore<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        cleaned[key] = cleanForFirestore(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

const SURAT_COLLECTION = 'surat';
const SURAT_IZIN_COLLECTION = 'surat_izin';
const SEKOLAH_COLLECTION = 'sekolah_config';
const SEKOLAH_DOC_ID = 'identitas';

/**
 * Listen to real-time updates for agenda surat (masuk & keluar)
 */
export function subscribeSurat(
  onData: (items: SuratItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, SURAT_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: SuratItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as SuratItem);
      });
      // Sort by tanggalSurat desc or createdAt desc
      list.sort((a, b) => {
        const timeA = new Date(b.createdAt || b.tanggalSurat).getTime();
        const timeB = new Date(a.createdAt || a.tanggalSurat).getTime();
        return timeA - timeB;
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, SURAT_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Listen to real-time updates for surat izin
 */
export function subscribeSuratIzin(
  onData: (items: SuratIzinItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, SURAT_IZIN_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: SuratIzinItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as SuratIzinItem);
      });
      list.sort((a, b) => {
        const timeA = new Date(b.createdAt || b.tanggalMulai).getTime();
        const timeB = new Date(a.createdAt || a.tanggalMulai).getTime();
        return timeA - timeB;
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, SURAT_IZIN_COLLECTION);
      if (onError) onError(error);
    }
  );
}

/**
 * Listen to real-time updates for school profile
 */
export function subscribeSekolah(
  onData: (sekolah: IdentitasSekolah) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = doc(db, SEKOLAH_COLLECTION, SEKOLAH_DOC_ID);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data() as IdentitasSekolah);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${SEKOLAH_COLLECTION}/${SEKOLAH_DOC_ID}`);
      if (onError) onError(error);
    }
  );
}

/**
 * Save or update a single Surat item to Firestore
 */
export async function saveSuratItem(item: SuratItem): Promise<void> {
  const path = `${SURAT_COLLECTION}/${item.id}`;
  try {
    const cleaned = cleanForFirestore(item);
    const docRef = doc(db, SURAT_COLLECTION, item.id);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Delete a Surat item from Firestore
 */
export async function deleteSuratItem(id: string): Promise<void> {
  const path = `${SURAT_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, SURAT_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Save or update a Surat Izin item to Firestore
 */
export async function saveSuratIzinItem(item: SuratIzinItem): Promise<void> {
  const path = `${SURAT_IZIN_COLLECTION}/${item.id}`;
  try {
    const cleaned = cleanForFirestore(item);
    const docRef = doc(db, SURAT_IZIN_COLLECTION, item.id);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Delete a Surat Izin item from Firestore
 */
export async function deleteSuratIzinItem(id: string): Promise<void> {
  const path = `${SURAT_IZIN_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, SURAT_IZIN_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

/**
 * Save or update school identity to Firestore
 */
export async function saveIdentitasSekolah(sekolah: IdentitasSekolah): Promise<void> {
  const path = `${SEKOLAH_COLLECTION}/${SEKOLAH_DOC_ID}`;
  try {
    const cleaned = cleanForFirestore(sekolah);
    const docRef = doc(db, SEKOLAH_COLLECTION, SEKOLAH_DOC_ID);
    await setDoc(docRef, cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

/**
 * Seed initial sample data to Firestore if the collections are empty
 */
export async function seedInitialDataIfEmpty(
  initialSurat: SuratItem[],
  initialSuratIzin: SuratIzinItem[],
  initialSekolah: IdentitasSekolah
): Promise<void> {
  try {
    // Check surat collection
    const suratSnap = await getDocs(collection(db, SURAT_COLLECTION));
    if (suratSnap.empty && initialSurat.length > 0) {
      const batch = writeBatch(db);
      for (const s of initialSurat) {
        const ref = doc(db, SURAT_COLLECTION, s.id);
        batch.set(ref, cleanForFirestore(s));
      }
      await batch.commit();
      console.log('Seeded initial surat collection');
    }

    // Check surat_izin collection
    const izinSnap = await getDocs(collection(db, SURAT_IZIN_COLLECTION));
    if (izinSnap.empty && initialSuratIzin.length > 0) {
      const batch = writeBatch(db);
      for (const iz of initialSuratIzin) {
        const ref = doc(db, SURAT_IZIN_COLLECTION, iz.id);
        batch.set(ref, cleanForFirestore(iz));
      }
      await batch.commit();
      console.log('Seeded initial surat_izin collection');
    }

    // Check sekolah configuration
    const sekolahRef = doc(db, SEKOLAH_COLLECTION, SEKOLAH_DOC_ID);
    const sekolahSnap = await getDoc(sekolahRef);
    if (!sekolahSnap.exists()) {
      await setDoc(sekolahRef, cleanForFirestore(initialSekolah));
      console.log('Seeded initial sekolah config');
    }
  } catch (error) {
    console.warn('Initial seeding encountered an error (safe to ignore if already populated):', error);
  }
}
