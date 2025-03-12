// src/app/activities/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ActivityForm from '@/components/activities/ActivityForm';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/lib/activityService';

const subjects = [
  {
    id: 'science',
    name: 'מדעים',
    description: 'פעילויות חקר וגילוי בתחומי המדעים השונים',
    icon: '🔬',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'math',
    name: 'מתמטיקה',
    description: 'פעילויות לפיתוח חשיבה מתמטית ופתרון בעיות',
    icon: '📐',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'language',
    name: 'שפה',
    description: 'פעילויות לפיתוח מיומנויות שפה וכתיבה',
    icon: '📚',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'history',
    name: 'היסטוריה',
    description: 'פעילויות להכרת אירועים היסטוריים משמעותיים',
    icon: '🏛️',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'geography',
    name: 'גיאוגרפיה',
    description: 'פעילויות להכרת העולם והסביבה',
    icon: '🌍',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'art',
    name: 'אומנות',
    description: 'פעילויות יצירה ופיתוח חשיבה יצירתית',
    icon: '🎨',
    color: 'from-pink-500 to-pink-600'
  }
];

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getAllActivities();
        setActivities(data);
      } catch (err) {
        console.error("Error loading activities:", err);
        setError("שגיאה בטעינת פעילויות. נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-end">
          <Link
            href="/activities/new"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            הוספת פעילות חדשה
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-green-800 mb-2 text-center">העצים המגינים</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          גלו את העצים המיוחדים בבית ספרנו והפעילויות הפדגוגיות הקשורות אליהם
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <Link 
              key={tree.id} 
              href={`/trees/${tree.id}`}
              className="block group"
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <div className="relative h-48">
                  <Image
                    src={tree.image}
                    alt={tree.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-green-800 mb-2">{tree.name}</h2>
                  <p className="text-gray-600">{tree.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}