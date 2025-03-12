// Import the functions you need from the SDKs you need
// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkmwVEbhnh7UlbzGlClNohQk9ArmOs4D8",
  authDomain: "tree-guardians-ed3ac.firebaseapp.com",
  projectId: "tree-guardians-ed3ac",
  storageBucket: "tree-guardians-ed3ac.firebasestorage.app",
  messagingSenderId: "113633081266",
  appId: "1:113633081266:web:b5571575ccc240ce8b56ab",
  measurementId: "G-ELLT4TXQJV"
};

// אתחול Firebase רק פעם אחת בסביבת דפדפן
// (מניעת אתחול כפול בעת Hot Reload)
const firebaseApp = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

// ייצוא שירותים שנשתמש בהם
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// אתחול Analytics רק בצד הלקוח (לא בצד השרת)
if (typeof window !== 'undefined') {
  // Import dynamically to avoid server-side issues
  import('firebase/analytics').then(({ getAnalytics }) => {
    getAnalytics(firebaseApp);
  }).catch(error => {
    console.error('Analytics failed to load:', error);
  });
}

export default firebaseApp;