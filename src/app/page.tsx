'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// הגדרת טיפוס Tree
interface Tree {
  id: string;
  name: string;
  image: string;
  description: string;
}

// מערך העצים
const trees: Tree[] = [
  {
    id: 'olive',
    name: 'עץ זית',
    image: 'https://i.imgur.com/sPIIkjH.png',
    description: 'עץ הזית הוא אחד מסמלי ארץ ישראל'
  },
  {
    id: 'pomegranate',
    name: 'עץ רימון',
    image: 'https://i.imgur.com/yogNdDO.png',
    description: 'עץ הרימון מלא בפירות מתוקים וטעימים'
  },
  {
    id: 'cypress',
    name: 'עץ ברוש',
    image: 'https://i.imgur.com/blOQVis.png',
    description: 'עץ הברוש הגבוה מתנשא לשמיים'
  },
  {
    id: 'chinaberry',
    name: 'עץ איזדרכת',
    image: 'https://i.imgur.com/trksnJM.png',
    description: 'עץ האיזדרכת מספק צל נעים'
  },
  {
    id: 'clementine',
    name: 'עץ קלמנטינות',
    image: 'https://i.imgur.com/C9kxwmD.png',
    description: 'עץ הקלמנטינות מלא בפירות הדר מתוקים'
  },
  {
    id: 'poplar',
    name: 'עץ צפצפה',
    image: 'https://i.imgur.com/P5K3T73.png',
    description: 'עץ הצפצפה רוקד ברוח'
  },
  {
    id: 'oak',
    name: 'עץ אלון',
    image: 'https://i.imgur.com/ttMzfh5.png',
    description: 'עץ האלון החזק והיציב'
  },
  {
    id: 'sycamore',
    name: 'עץ השיקמה',
    image: 'https://i.imgur.com/PWXwrFQ.png',
    description: 'עץ השיקמה העתיק והחכם'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src="https://i.imgur.com/LfR1M8M.png"
              alt="המגינים על העצים"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-3">המגינים על העצים</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto px-4">
            פלטפורמה חינוכית המשלבת פעילויות פדגוגיות מגוונות דרך עולם העצים והצמחיה
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trees.map((tree) => (
            <Link 
              href={`/trees/${tree.id}`} 
              key={tree.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={tree.image}
                  alt={tree.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-green-800 mb-2">{tree.name}</h2>
                <p className="text-gray-600">{tree.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
