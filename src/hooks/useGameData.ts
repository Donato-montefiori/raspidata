import { useState, useEffect, useRef, useCallback } from 'react';
import {
  resolveAndMigrateOnFirstLogin,
  bridgeSave,
  setCurrentUser,
} from '../sync/syncManager';
import { localRead, type SaveBlob } from '../sync/localStore';

export interface GameDataState {
  /** JSON string to seed the game engine, or null for a fresh start */
  saveJson: string | null;
  loading: boolean;
  persistSave: (data: SaveBlob) => void;
}

export function useGameData(uid: string): GameDataState {
  const [saveJson, setSaveJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const saveJsonRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setCurrentUser(uid);

    resolveAndMigrateOnFirstLogin(uid).then(() => {
      if (cancelled) return;
      const raw = localRead();
      saveJsonRef.current = raw;
      setSaveJson(raw);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [uid]);

  const persistSave = useCallback((data: SaveBlob) => {
    const json = JSON.stringify(data);
    saveJsonRef.current = json;
    bridgeSave(data);
  }, []);

  return { saveJson, loading, persistSave };
}
