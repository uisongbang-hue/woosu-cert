import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let appSingleton: FirebaseApp | null = null;
let dbSingleton: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (appSingleton) return appSingleton;
  appSingleton = getApps().length ? getApp() : initializeApp(config);
  return appSingleton;
}

export function getDb(): Firestore {
  if (dbSingleton) return dbSingleton;
  dbSingleton = getFirestore(getFirebaseApp());
  return dbSingleton;
}

export function isFirebaseConfigured() {
  return !!(config.apiKey && config.projectId);
}
