import { useState, useEffect } from 'react';
import { initFirebase } from '../firebase';
import { onAuthStateChanged, User, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface AppUser extends User {
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;
    
    initFirebase().then(({ auth, db }) => {
      unsubscribe = onAuthStateChanged(auth, async (u) => {
        if (u) {
          const userRef = doc(db, 'users', u.uid);
          const userSnap = await getDoc(userRef);
          let role = 'user';
          if (userSnap.exists()) {
            role = userSnap.data().role || 'user';
          } else {
            await setDoc(userRef, {
              displayName: u.displayName || '',
              email: u.email || '',
              photoURL: u.photoURL || '',
              role: 'user',
              createdAt: new Date().toISOString()
            });
          }
          setUser({ ...u, role } as AppUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const { auth, googleProvider } = await initFirebase();
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    const { auth } = await initFirebase();
    await fbSignOut(auth);
  };

  return { user, loading, loginWithGoogle, logout };
}
