import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-gem-icon">💎</div>
        <h1 className="auth-title">Raspadita de Gemas</h1>
        <p className="auth-subtitle">
          Inicia sesión para guardar tu progreso en la nube y jugar desde cualquier dispositivo.
        </p>
        <button className="auth-google-btn" onClick={signInWithGoogle}>
          <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 10 }}>
            <path fill="#EA4335" d="M24 9.5c3.4 0 6.1 1.2 8.2 3.1l6.1-6.1C34.4 3.2 29.6 1 24 1 14.7 1 6.8 6.5 3.2 14.4l7.1 5.5C12 13.9 17.5 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.2-.1-.2-.1-.5-.6-.7z"/>
            <path fill="#FBBC05" d="M10.3 28.6A14.4 14.4 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L3.2 13.9A23 23 0 0 0 1 24c0 3.8.9 7.3 2.3 10.4l7-5.8z"/>
            <path fill="#34A853" d="M24 47c5.6 0 10.3-1.8 13.7-5l-7.4-5.7c-1.8 1.2-4.2 2-6.3 2-6.5 0-12-4.4-13.7-10.4L3.2 34c3.6 7.9 11.5 13 20.8 13z"/>
          </svg>
          Continuar con Google
        </button>
        <p className="auth-note">
          ¿Jugaste antes sin cuenta? <br />
          Tu progreso local se migrará automáticamente.
        </p>
      </div>
    </div>
  );
}
