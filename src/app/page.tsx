// src/app/activities/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ActivityForm from '@/components/activities/ActivityForm';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/lib/activityService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Activity as FirebaseActivity } from '@/lib/types';

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
  const [activities, setActivities] = useState<FirebaseActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    async function fetchActivities() {
      try {
        const activitiesCollection = collection(db, 'activities');
        const activitiesSnapshot = await getDocs(activitiesCollection);
        const activitiesList = activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseActivity[];
        
        setActivities(activitiesList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('אירעה שגיאה בטעינת הפעילויות');
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען פעילויות...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-800 mb-8">פעילויות</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4">{activity.name}</h2>
                
                {/* תגיות נושאים */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.subjects.map((subject, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>

                {/* תקציר */}
                <p className="text-gray-600 mb-4 line-clamp-3">{activity.summary}</p>

                {/* מידע נוסף */}
                <div className="text-sm text-gray-500">
                  <p>משתתפים: {activity.participants}</p>
                  <p>הכנה: {activity.preparation}</p>
                </div>
              </div>

              {/* כפתורי פעולה */}
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <button 
                  onClick={() => window.location.href = `/activities/${activity.id}`}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  פרטים נוספים
                </button>
                <button 
                  onClick={() => window.location.href = `/activities/${activity.id}/documentation/new`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  תיעוד פעילות
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}