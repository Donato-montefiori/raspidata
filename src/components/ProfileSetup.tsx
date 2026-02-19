import React, { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { markProfileSetupDone } from '../sync/syncManager';

const AVATARS = ['💎','🔮','💠','🌀','⭐','🌟','✨','💫','🪩','👑','🏆','🌈'];

interface Props {
  uid: string;
  onComplete: () => void;
}

export default function ProfileSetup({ uid, onComplete }: Props) {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    const name = username.trim();
    if (!name) { setError('Elige un nombre para continuar'); return; }
    if (name.length > 15) { setError('Máximo 15 caracteres'); return; }
    setSaving(true);
    try {
      // Persist profile fields merged into Firestore user doc
      await setDoc(doc(db, 'users', uid), {
        profile: { username: name, avatar },
        profileSetupDone: true,
      }, { merge: true });
      await markProfileSetupDone(uid);
      onComplete();
    } catch (e) {
      setError('Error al guardar. Intenta de nuevo.');
      setSaving(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card profile-setup-card">
        <h2 className="auth-title" style={{ fontSize: '1.5rem' }}>Configura tu perfil</h2>
        <p className="auth-subtitle">Cuéntanos cómo quieres que te llamen</p>

        <label className="profile-field-label">Nombre de jugador</label>
        <input
          className="profile-text-input"
          type="text"
          maxLength={15}
          placeholder="Ej: GemMaster"
          value={username}
          onChange={e => { setUsername(e.target.value); setError(''); }}
        />

        <label className="profile-field-label" style={{ marginTop: 20 }}>Elige tu avatar</label>
        <div className="profile-avatar-grid">
          {AVATARS.map(a => (
            <button
              key={a}
              className={`profile-avatar-option${avatar === a ? ' selected' : ''}`}
              onClick={() => setAvatar(a)}
            >
              {a}
            </button>
          ))}
        </div>

        {error && <p className="profile-error">{error}</p>}

        <button
          className="auth-google-btn"
          style={{ marginTop: 24 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Guardando…' : '¡Empezar a jugar!'}
        </button>
      </div>
    </div>
  );
}
