import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// Strictly read Firebase configuration from environment variables (.env.local or Vercel env)
export function getFirebaseConfig() {
  const envConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  return null;
}

export function isFirebaseConfigured() {
  return !!getFirebaseConfig();
}

let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }
    firebaseAuth = getAuth(firebaseApp);
    firestoreDb = getFirestore(firebaseApp);
    return { app: firebaseApp, auth: firebaseAuth, db: firestoreDb };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    return null;
  }
}

export function getFirebaseAuth() {
  if (!firebaseAuth) {
    initFirebase();
  }
  return firebaseAuth;
}

export function getFirebaseDb() {
  if (!firestoreDb) {
    initFirebase();
  }
  return firestoreDb;
}

// Authentication helpers
export async function registerWithEmail(email, password, displayName = "") {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured in .env.local.");
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}

export async function loginWithEmail(email, password) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase is not configured in .env.local.");
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser() {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuth(callback) {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Cloud Firestore Sync helpers
export async function syncTabsToCloud(userId, tabs, activeTabId) {
  const db = getFirebaseDb();
  if (!db || !userId) return false;

  try {
    const docRef = doc(db, "users", userId, "notepad", "workspace");
    await setDoc(
      docRef,
      {
        tabs: tabs.map((t) => ({
          id: t.id,
          title: t.title,
          content: t.content,
          language: t.language || "plaintext",
          updatedAt: t.updatedAt || Date.now(),
        })),
        activeTabId,
        lastSyncedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error syncing tabs to cloud:", error);
    throw error;
  }
}

export async function fetchTabsFromCloud(userId) {
  const db = getFirebaseDb();
  if (!db || !userId) return null;

  try {
    const docRef = doc(db, "users", userId, "notepad", "workspace");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching tabs from cloud:", error);
    throw error;
  }
}

export function subscribeToCloudTabs(userId, onUpdate) {
  const db = getFirebaseDb();
  if (!db || !userId) return () => {};

  const docRef = doc(db, "users", userId, "notepad", "workspace");
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      }
    },
    (err) => {
      console.warn("Cloud tabs subscription error:", err);
    }
  );
}
