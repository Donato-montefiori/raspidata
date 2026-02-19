import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

export interface AuthState {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error('[useAuth] signInWithGoogle error:', e);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('[useAuth] signOut error:', e);
    }
  };

  return { user, loading, signInWithGoogle, signOut };
}
