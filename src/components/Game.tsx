import React, { useEffect, useRef } from 'react';
import { initEngine } from '../game/raspadita-engine.js';
import { gameHtml } from '../game/game-html.js';
import { useGameData } from '../hooks/useGameData';
import { bridgeSave, bridgeLoadSync, bridgeClearLocal } from '../sync/syncManager';
import { useAuth } from '../hooks/useAuth';

interface Props {
  uid: string;
}

export default function Game({ uid }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { saveJson, loading, persistSave } = useGameData(uid);
  const engineInitialized = useRef(false);
  const { signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (engineInitialized.current) return;
    if (!containerRef.current) return;

    engineInitialized.current = true;

    // 1. Inject the game DOM
    containerRef.current.innerHTML = gameHtml;

    // 2. Build the bridge object the engine will use
    const bridge = {
      save: (data: unknown) => persistSave(data as Parameters<typeof persistSave>[0]),
      loadSync: () => bridgeLoadSync(),
      clearLocal: () => bridgeClearLocal(),
    };

    // 3. Start the engine
    initEngine(bridge);
  }, [loading]);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <p>Cargando partida…</p>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} id="game-root" />
      {/* Floating sign-out button */}
      <button
        onClick={signOut}
        style={{
          position: 'fixed',
          bottom: 12,
          right: 12,
          zIndex: 9999,
          background: 'rgba(0,0,0,0.55)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 8,
          padding: '6px 12px',
          fontSize: '0.75rem',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        Cerrar sesión
      </button>
    </>
  );
}
