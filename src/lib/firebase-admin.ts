import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Check if we're in build time or if required env vars are missing
const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
const hasRequiredEnvVars = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;

let app: App | null = null;

if (!isProductionBuild && hasRequiredEnvVars) {
  const firebaseAdminConfig = {
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  };

  // Initialize Firebase Admin SDK
  app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
}

export const admin = {
  auth: () => {
    if (!app) throw new Error('Firebase Admin not initialized');
    return getAuth(app);
  },
  firestore: () => {
    if (!app) throw new Error('Firebase Admin not initialized');
    return getFirestore(app);
  },
};

export { app };
