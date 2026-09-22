import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const targetDatabaseId =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

// Initialize Firestore with robust connection settings (auto-detect long-polling for iframe/proxy environments)
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
      ignoreUndefinedProperties: true
    },
    targetDatabaseId
  );
} catch (e) {
  firestoreInstance = targetDatabaseId ? getFirestore(app, targetDatabaseId) : getFirestore(app);
}

export const db = firestoreInstance;

// Connection verification with safe fallback
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Attempt ping with 4 second timeout so slow initial handshake doesn't hang UI
    const pingPromise = getDocFromServer(doc(db, '_connection_test', 'ping'));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection check timeout')), 4000)
    );
    await Promise.race([pingPromise, timeoutPromise]);
    return true;
  } catch (error: any) {
    // If backend is still warming up or unavailable, client continues in offline cache mode
    console.warn('Firestore connection check notice (client running with local-first cache):', error?.message || error);
    return false;
  }
}

