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

// עדכון הממשק של FirebaseActivity
interface FirebaseActivity {
  id: string;
  name: string;
  subjects: string[];  // אם זה לא קיים בפיירסטור, אפשר להפוך לאופציונלי עם ?
  summary: string;
  participants: string;
  preparation: string;
}

export default async function ActivitiesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">פעילויות</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* כאן יבואו כרטיסי הפעילויות */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">גילוי היקף העץ ועולם הזיתים</h2>
          <p className="text-gray-600 mt-2">פעילות חקר מתמטית סביב עץ הזית</p>
          <div className="mt-2">
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">
              מתמטיקה
            </span>
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              כיתה ה
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}