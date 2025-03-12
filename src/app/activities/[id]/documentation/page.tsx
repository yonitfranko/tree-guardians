'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

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

export default function DocumentationPage() {
  const params = useParams();
  const activityId = params?.id as string;
  
  const documentations: Documentation[] = [
    {
      id: '1',
      title: 'פעילות מדידה - כיתה ג1',
      description: 'התלמידים מדדו את היקף העץ ויצרו גרף השוואתי',
      date: '2024-03-15',
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
      ]
    }
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

        <div className="grid gap-6">
          {documentations.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-green-800 mb-2">{doc.title}</h2>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              <div className="text-sm text-gray-500">{doc.date}</div>
              {doc.images && doc.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {doc.images.map((img, index) => (
                    <img 
                      key={index}
                      src={img}
                      alt={`תמונה ${index + 1}`}
                      className="rounded-lg w-full h-48 object-cover"
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