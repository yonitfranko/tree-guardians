// src/app/activities/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ActivityForm from '@/components/activities/ActivityForm';
import { Activity } from '@/types';
import { getAllActivities } from '@/lib/activityService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Activity as FirebaseActivity } from '@/lib/types';
import { ActivityCard } from '@/components/ActivityCard';
import { getActivities } from '@/lib/activityService';
import { useActivities } from '@/hooks/useActivities';

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

const activitiesData: ActivitiesData = {
  'olive-math': {
    id: 'olive-math',
    name: 'גילוי היקף העץ ועולם הזיתים',
    subjects: ['מתמטיקה'],
    treeIds: [],
    ageGroup: 'ד-ו',
    skillIds: [],
    description: 'פעילות חקר מתמטית סביב עץ הזית',
    materials: 'סרט מדידה, דף נייר, עיפרון',
    preparation: 'להכין את דפי העבודה מראש',
    expectedOutcomes: [
      'התלמידים ילמדו למדוד היקף של עץ',
      'התלמידים יבינו את הקשר בין היקף לקוטר'
    ],
    steps: ['מדידת היקף העץ', 'חישוב הקוטר', 'השוואה בין עצים שונים'],
    duration: '45 דקות',
    treeType: 'זית',
    gradeLevel: 'כיתה ה',
    skills: ['מדידה', 'חישוב', 'עבודת צוות'],
    tags: ['פעילות חוץ', 'עבודת צוות', 'מדידה', 'חישובים', 'חקר'],
    resources: {
      teacherResources: [
        {
          type: 'teacher',
          title: 'מדריך למורה - פעילות מדידת היקף',
          url: '#',
          description: 'מדריך מפורט למורה לביצוע הפעילות'
        }
      ],
      studentResources: [],
      worksheets: [
        {
          type: 'worksheet',
          title: 'דף עבודה - רישום מדידות',
          url: '#',
          description: 'דף עבודה לתלמידים לרישום תוצאות המדידות'
        }
      ],
      media: [
        {
          type: 'video',
          title: 'סרטון הדרכה - מדידת היקף עץ',
          url: '#',
          description: 'סרטון המדגים את תהליך מדידת היקף העץ'
        }
      ],
      relatedActivities: [
        {
          type: 'related',
          title: 'חישוב שטח הצל של העץ',
          url: '/activities/olive-math-shadow',
          description: 'פעילות המשך לחישוב שטח הצל שהעץ מטיל'
        }
      ]
    },
    summary: 'פעילות חקר מתמטית המשלבת מדידות והיכרות עם עץ הזית',
    image: '/images/olive-tree.jpg',
    participants: '20-30 תלמידים',
    objectives: ['הבנת מושג ההיקף', 'פיתוח מיומנויות מדידה', 'היכרות עם עץ הזית'],
    location: 'חצר בית הספר',
    assessment: 'הערכת דפי העבודה ותצפית על עבודת התלמידים',
    extensions: ['חישוב נפח גזע העץ', 'מעקב אחר גדילת העץ לאורך זמן'],
    safety: ['להיזהר מענפים נמוכים', 'לשמור על מרחק בטוח בין התלמידים'],
    link: '/activities/olive-math'
  }
};

export default function ActivitiesPage() {
  const { activities, loading, error } = useActivities();

  useEffect(() => {
    // נקרא לפונקציה ישירות בדף
    getActivities().then(activities => {
      console.log('Activities from Firestore:', activities);
    }).catch(error => {
      console.error('Error fetching activities:', error);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">שגיאה: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">פעילויות</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}