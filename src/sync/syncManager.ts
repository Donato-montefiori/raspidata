// ===================================================================
// SYNC MANAGER — bridges local save ↔ Firestore
// Implements "local-first" semantics:
//   1. Always write to localStorage immediately
//   2. Also write to Firestore when online (best-effort)
//   3. If offline, set _pendingSync flag; retry when online
//   4. On first auth: migrate any existing localStorage save to Firestore
// ===================================================================
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  localRead,
  localWrite,
  localClear,
  markPendingSync,
  clearPendingSync,
  hasPendingSync,
  type SaveBlob,
} from './localStore';

// --- Firestore helpers ---

function userDocRef(uid: string) {
  return doc(db, 'users', uid);
}

/** Write save to Firestore. Returns true on success. */
async function firestoreWrite(uid: string, save: SaveBlob): Promise<boolean> {
  try {
    await setDoc(userDocRef(uid), {
      save,
      lastSynced: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (e) {
    console.warn('[syncManager] Firestore write failed:', e);
    return false;
  }
}

/** Read save from Firestore. Returns SaveBlob or null. */
async function firestoreRead(uid: string): Promise<SaveBlob | null> {
  try {
    const snap = await getDoc(userDocRef(uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return (data?.save as SaveBlob) ?? null;
  } catch (e) {
    console.warn('[syncManager] Firestore read failed:', e);
    return null;
  }
}

/** Check if the user already has data in Firestore */
export async function hasFirestoreData(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(userDocRef(uid));
    return snap.exists() && !!snap.data()?.save;
  } catch {
    return false;
  }
}

/** Get profileSetupDone flag from Firestore */
export async function getProfileSetupDone(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(userDocRef(uid));
    return snap.exists() ? (snap.data()?.profileSetupDone === true) : false;
  } catch {
    return false;
  }
}

/** Persist profileSetupDone flag to Firestore */
export async function markProfileSetupDone(uid: string): Promise<void> {
  try {
    await setDoc(userDocRef(uid), { profileSetupDone: true }, { merge: true });
  } catch (e) {
    console.warn('[syncManager] markProfileSetupDone failed:', e);
  }
}

// -----------------------------------------------------------------------
// The game engine calls these functions via the bridge object.
// They are synchronous from the engine's perspective.
// -----------------------------------------------------------------------

let _currentUid: string | null = null;

/** Called by AuthGate/Game to configure the manager for the current user */
export function setCurrentUser(uid: string | null) {
  _currentUid = uid;

  if (uid) {
    // Whenever we come online, flush any pending sync
    window.addEventListener('online', () => flushPendingSync(uid), { once: false });
    // Flush immediately if already online
    if (navigator.onLine) flushPendingSync(uid);
  }
}

/** Flush a pending local save to Firestore */
async function flushPendingSync(uid: string) {
  if (!hasPendingSync()) return;
  const raw = localRead();
  if (!raw) { clearPendingSync(); return; }
  let save: SaveBlob;
  try {
    save = JSON.parse(raw) as SaveBlob;
  } catch {
    clearPendingSync();
    return;
  }
  const ok = await firestoreWrite(uid, save);
  if (ok) {
    clearPendingSync();
    console.log('[syncManager] Pending sync flushed to Firestore');
  }
}

// -----------------------------------------------------------------------
// Bridge API (called by the game engine)
// -----------------------------------------------------------------------

/**
 * Save game data.
 * - Always writes to localStorage first (synchronous)
 * - Then attempts Firestore write async (best-effort)
 */
export function bridgeSave(saveData: SaveBlob): void {
  // Always persist locally first
  localWrite(saveData);

  if (!_currentUid) return;

  if (navigator.onLine) {
    firestoreWrite(_currentUid, saveData).then(ok => {
      if (!ok) markPendingSync();
    });
  } else {
    markPendingSync();
  }
}

/**
 * Load game data (synchronous, returns JSON string).
 * Priority: localStorage (already loaded by loadGameFromBestSource before game init)
 */
export function bridgeLoadSync(): string | null {
  return localRead();
}

/**
 * Clear local save data.
 */
export function bridgeClearLocal(): void {
  localClear();
}

// -----------------------------------------------------------------------
// One-time migration: copy localStorage save → Firestore for existing
// offline players who sign in for the first time.
// -----------------------------------------------------------------------

/**
 * Called after Google Sign-In.
 * Checks if:
 *   a) User has NO Firestore data → migrate local save → Firestore
 *   b) User HAS Firestore data → download it → overwrite localStorage (remote wins)
 * Returns the resolved SaveBlob (what the game should use), or null.
 */
export async function resolveAndMigrateOnFirstLogin(
  uid: string
): Promise<SaveBlob | null> {
  const hasRemote = await hasFirestoreData(uid);
  const localRaw = localRead();
  let localSave: SaveBlob | null = null;
  if (localRaw) {
    try { localSave = JSON.parse(localRaw) as SaveBlob; } catch { /* ignore */ }
  }

  if (!hasRemote && localSave) {
    // ── Migration: existing offline player signs in for the first time ──
    console.log('[syncManager] Migrating local save to Firestore...');
    const ok = await firestoreWrite(uid, localSave);
    if (ok) console.log('[syncManager] Migration complete');
    return localSave; // game continues with local data
  }

  if (hasRemote) {
    // ── Remote data exists: download and use it (remote is source of truth) ──
    const remoteSave = await firestoreRead(uid);
    if (remoteSave) {
      // Write remote data to localStorage so engine picks it up via bridgeLoadSync
      localWrite(remoteSave);
      return remoteSave;
    }
  }

  // No data anywhere → new player, start fresh
  return null;
}
