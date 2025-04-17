// Import the functions you need from the SDKs you need
// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Export services we'll use
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// Initialize Analytics only on client side and only once
let analyticsInitialized = false;
if (typeof window !== 'undefined' && !analyticsInitialized) {
  analyticsInitialized = true;
  // Import dynamically to avoid server-side issues
  import('firebase/analytics').then(({ getAnalytics }) => {
    try {
      if (firebaseApp) {
        getAnalytics(firebaseApp);
      }
    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }).catch(error => {
    console.error('Analytics failed to load:', error);
  });
}

// Connection check (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase connection status:', {
    initialized: !!firebaseApp,
    projectId: firebaseConfig.projectId
  });
}

export default firebaseApp;

export async function testFirestore() {
  try {
    const activitiesRef = collection(db, 'activities');
    const snapshot = await getDocs(activitiesRef);
    console.log('מספר הפעילויות:', snapshot.size);
    snapshot.forEach(doc => {
      console.log('פעילות:', doc.id, doc.data());
    });
  } catch (error) {
    console.error('Error testing Firestore:', error);
  }
}