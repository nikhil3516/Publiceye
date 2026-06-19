import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApp, getApps } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getAnalytics } from "firebase/analytics";
import type { Firestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase config is populated and does not contain placeholders
const isConfigValid = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" &&
  !firebaseConfig.apiKey.includes("placeholder") &&
  firebaseConfig.projectId
);

let app: FirebaseApp | undefined;
let analytics: Analytics | null = null;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Analytics only runs in browser environment
    analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (err) {
    console.warn("Firebase failed to initialize:", err);
  }
} else {
  console.warn(
    "Firebase config is invalid or missing. Application is running with offline mock services."
  );
}

export { app, analytics, db, auth };

