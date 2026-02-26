import React, { useEffect, useRef } from "react";
import { initEngine } from "../game/raspadita-engine.js";
import { gameHtml } from "../game/game-html.js";
import { useGameData } from "../hooks/useGameData";
import { bridgeSave, bridgeLoadSync, bridgeClearLocal } from "../sync/syncManager";
import { useAuth } from "../hooks/useAuth";
import { type SaveBlob } from "../sync/localStore";

interface Props {
  uid: string;
}

export default function Game({ uid }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading, persistSave } = useGameData(uid);
  const engineInitialized = useRef(false);
  const { signOut } = useAuth();

  useEffect(() => {
    // Container is always mounted now — wait for data to load
    if (loading) return;
    if (engineInitialized.current) return;
    const container = containerRef.current;
    if (!container) return;

    engineInitialized.current = true;

    // 1. Inject game DOM into the container
    container.innerHTML = gameHtml;

    // 2. Bridge between React sync layer and the game engine
    const bridge = {
      save: (data: unknown) => persistSave(data as SaveBlob),
      loadSync: () => bridgeLoadSync(),
      clearLocal: () => bridgeClearLocal(),
    };

    // 3. Start the engine
    initEngine(bridge);

    // Cleanup: allow re-init if component remounts
    return () => {
      engineInitialized.current = false;
    };
  }, [loading]);

  return (
    <>
      {/* Loading overlay — sits on top while save data is being fetched */}
      {loading && (
        <div
          className="auth-loading"
          style={{ position: "fixed", inset: 0, zIndex: 9999 }}
        >
          <div className="auth-spinner" />
          <p>Cargando partida…</p>
        </div>
      )}

      {/* Game container is ALWAYS in the DOM so containerRef is never null */}
      <div ref={containerRef} id="game-root" />

      <button
        onClick={signOut}
        style={{
          position: "fixed",
          bottom: 12,
          right: 12,
          zIndex: 9999,
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: "0.75rem",
          cursor: "pointer",
          backdropFilter: "blur(6px)",
        }}
      >
        Cerrar sesión
      </button>
    </>
  );
}