// Import the functions you need from the SDKs you need
// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  // הכנס כאן את פרטי הקונפיגורציה שלך מ-Firebase Console
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
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