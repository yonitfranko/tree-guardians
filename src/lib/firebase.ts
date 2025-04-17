// Import the functions you need from the SDKs you need
// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
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

// Initialize Firebase only once in browser environment
// (prevent double initialization during Hot Reload)
const firebaseApp = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

// Export services we'll use
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// Initialize Analytics only on client side
if (typeof window !== 'undefined') {
  // Import dynamically to avoid server-side issues
  import('firebase/analytics').then(({ getAnalytics }) => {
    getAnalytics(firebaseApp);
  }).catch(error => {
    console.error('Analytics failed to load:', error);
  });
}

// Connection check
if (process.env.NODE_ENV !== 'production') {
  console.log('Trying to connect to Firebase...');
  if (firebaseApp) {
    console.log('Firebase connection successful!');
    console.log('Connected to project:', firebaseConfig.projectId);
  } else {
    console.error('Firebase connection failed!');
  }
}

export default firebaseApp;

export async function testFirestore() {
  const activitiesRef = collection(db, 'activities');
  const snapshot = await getDocs(activitiesRef);
  console.log('מספר הפעילויות:', snapshot.size);
  snapshot.forEach(doc => {
    console.log('פעילות:', doc.id, doc.data());
  });
}