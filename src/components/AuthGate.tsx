import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProfileSetupDone } from '../sync/syncManager';
import LoginScreen from './LoginScreen';
import ProfileSetup from './ProfileSetup';
import Game from './Game';

type Stage = 'loading' | 'unauthenticated' | 'profile-setup' | 'game';

export default function AuthGate() {
  const { user, loading } = useAuth();
  const [stage, setStage] = useState<Stage>('loading');

  useEffect(() => {
    if (loading) { setStage('loading'); return; }
    if (!user) { setStage('unauthenticated'); return; }

    // User is signed in — check if profile setup is done
    setStage('loading');
    getProfileSetupDone(user.uid).then(done => {
      setStage(done ? 'game' : 'profile-setup');
    });
  }, [user, loading]);

  if (stage === 'loading') {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <p>Cargando…</p>
      </div>
    );
  }

  if (stage === 'unauthenticated') {
    return <LoginScreen />;
  }

  if (stage === 'profile-setup') {
    return (
      <ProfileSetup
        uid={user!.uid}
        onComplete={() => setStage('game')}
      />
    );
  }

  return <Game uid={user!.uid} />;
}
