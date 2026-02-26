import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  localRead,
  localWrite,
  localClear,
  markPendingSync,
  clearPendingSync,
  hasPendingSync,
  type SaveBlob,
} from "./localStore";

function userDocRef(uid: string) {
  return doc(db, "users", uid);
}

async function firestoreWrite(uid: string, save: SaveBlob): Promise<boolean> {
  try {
    await setDoc(userDocRef(uid), { save, lastSynced: serverTimestamp() }, { merge: true });
    return true;
  } catch (e) {
    console.warn("[syncManager] Firestore write failed:", e);
    return false;
  }
}

async function firestoreRead(uid: string): Promise<SaveBlob | null> {
  try {
    const snap = await getDoc(userDocRef(uid));
    if (!snap.exists()) return null;
    return (snap.data()?.save as SaveBlob) ?? null;
  } catch (e) {
    console.warn("[syncManager] Firestore read failed:", e);
    return null;
  }
}

export async function hasFirestoreData(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(userDocRef(uid));
    return snap.exists() && !!snap.data()?.save;
  } catch {
    return false;
  }
}

let _currentUid: string | null = null;

export function setCurrentUser(uid: string | null) {
  _currentUid = uid;
  if (uid) {
    window.addEventListener("online", () => flushPendingSync(uid), { once: false });
    if (navigator.onLine) flushPendingSync(uid);
  }
}

async function flushPendingSync(uid: string) {
  if (!hasPendingSync()) return;
  const raw = localRead();
  if (!raw) { clearPendingSync(); return; }
  let save: SaveBlob;
  try { save = JSON.parse(raw) as SaveBlob; } catch { clearPendingSync(); return; }
  const ok = await firestoreWrite(uid, save);
  if (ok) { clearPendingSync(); console.log("[syncManager] Pending sync flushed"); }
}

export function bridgeSave(saveData: SaveBlob): void {
  localWrite(saveData);
  if (!_currentUid) return;
  if (navigator.onLine) {
    firestoreWrite(_currentUid, saveData).then(ok => { if (!ok) markPendingSync(); });
  } else {
    markPendingSync();
  }
}

export function bridgeLoadSync(): string | null {
  return localRead();
}

export function bridgeClearLocal(): void {
  localClear();
}

export async function resolveAndMigrateOnFirstLogin(uid: string): Promise<SaveBlob | null> {
  const hasRemote = await hasFirestoreData(uid);
  const localRaw = localRead();
  let localSave: SaveBlob | null = null;
  if (localRaw) { try { localSave = JSON.parse(localRaw) as SaveBlob; } catch { /**/ } }

  if (!hasRemote && localSave) {
    console.log("[syncManager] Migrating local save to Firestore...");
    const ok = await firestoreWrite(uid, localSave);
    if (ok) console.log("[syncManager] Migration complete");
    return localSave;
  }

  if (hasRemote) {
    const remoteSave = await firestoreRead(uid);
    if (remoteSave) {
      localWrite(remoteSave);
      return remoteSave;
    }
  }

  return null;
}