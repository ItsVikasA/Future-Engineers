'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import { User, UserRole } from '@/types';

interface AuthContextType {
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Use email as document ID for better Firebase console display
          const emailDocId = firebaseUser.email!;
          const userDoc = await getDoc(doc(db, 'users', emailDocId));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: userData.role || 'Student',
              reputation: userData.reputation || 0,
              badges: userData.badges || [],
              joinedAt: userData.joinedAt?.toDate() || new Date(),
              lastActive: new Date(),
              emailVerified: firebaseUser.emailVerified,
            };
            setUser(user);
          } else {
            // Create new user document using email as ID
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'Student' as UserRole,
              reputation: 0,
              badges: [],
              joinedAt: new Date(),
              lastActive: new Date(),
              emailVerified: firebaseUser.emailVerified,
            };

            await setDoc(doc(db, 'users', emailDocId), {
              ...newUser,
              _originalUID: firebaseUser.uid, // Keep original UID for reference
              joinedAt: new Date(),
              lastActive: new Date(),
            });

            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      console.log('Sign in successful:', result.user.email);
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      
      // Handle specific Firebase auth errors
      const firebaseError = error as { code?: string; message?: string };
      
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed. Please try again.');
      } else if (firebaseError.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by browser. Please allow popups and try again.');
      } else if (firebaseError.code === 'auth/configuration-not-found' || 
                 (firebaseError.message && firebaseError.message.includes('CONFIGURATION_NOT_FOUND'))) {
        throw new Error('Google Sign-In is not properly configured in Firebase Console. Please enable Google Authentication in your Firebase project settings.');
      } else {
        throw new Error(`Sign-in failed: ${firebaseError.message || 'Unknown error'}`);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
