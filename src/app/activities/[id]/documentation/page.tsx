'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import React from 'react';

// הגדרת הטיפוס למסמך
interface Documentation {
  id: string;
  title: string;
  description: string;
  date: string;
  images?: string[];
}

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics, db };

export default function DocumentationList() {
  const params = useParams();

  // כאן יבוא הקוד לטעינת התיעודים מ-Firebase
  const documentations: Documentation[] = [
    // דוגמה לנתונים
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">תיעודי פעילות</h1>
          <Link
            href={`/activities/${params.id}/documentation/new`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            תיעוד חדש
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentations.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl">{doc.title}</h3>
                <span className="text-sm text-gray-500">{doc.date}</span>
              </div>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              {doc.images && doc.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {doc.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`תמונה ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}