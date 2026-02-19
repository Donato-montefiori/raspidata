// ===================================================================
// LOCAL STORE — typed wrapper around localStorage for the game save  
// ===================================================================
export const SAVE_KEY = 'raspadita_gemas_save';
export const PENDING_SYNC_KEY = 'raspadita_pending_sync';

export interface SaveBlob {
  version: number;
  gameData: Record<string, unknown>;
  createdGems: unknown[];
  polishedGems: unknown[];
  timestamp: number;
}

/** Write save blob to localStorage */
export function localWrite(save: SaveBlob): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) {
    console.warn('[localStore] write failed:', e);
  }
}

/** Read save blob from localStorage (returns null if absent) */
export function localRead(): string | null {
  try {
    return localStorage.getItem(SAVE_KEY);
  } catch {
    return null;
  }
}

/** Remove save from localStorage */
export function localClear(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(PENDING_SYNC_KEY);
  } catch { /* ignore */ }
}

/** Mark that we have a pending upload to Firestore */
export function markPendingSync(): void {
  try {
    localStorage.setItem(PENDING_SYNC_KEY, '1');
  } catch { /* ignore */ }
}

/** Remove the pending-sync flag */
export function clearPendingSync(): void {
  try {
    localStorage.removeItem(PENDING_SYNC_KEY);
  } catch { /* ignore */ }
}

/** Returns true if there is a save waiting to be synced */
export function hasPendingSync(): boolean {
  try {
    return localStorage.getItem(PENDING_SYNC_KEY) === '1';
  } catch {
    return false;
  }
}
