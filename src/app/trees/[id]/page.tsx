'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// טיפוסי נתונים
interface Activity {
  id: string;
  name: string;
  subject: string;
  treeType: string;
  gradeLevel: string;
  duration: string;
  skills: string[];
  description: string;
  materials: string[];
  steps: string[];
  expectedOutcomes: string[];
  tags: string[];
}

interface TreeData {
  id: string;
  name: string;
  image: string;
  description: string;
  activities: Activity[];
}

// נתוני הדוגמה (בהמשך יגיעו מ-Firebase)
const treeData: TreeData = {
  id: 'olive',
  name: 'עץ זית',
  image: 'https://i.imgur.com/sPIIkjH.png',
  description: 'עץ הזית הוא אחד מסמלי ארץ ישראל, המסמל שלום, חיים ארוכים ושורשיות.',
  activities: [
    {
      id: 'olive-math',
      name: 'גילוי היקף העץ ועולם הזיתים',
      subject: 'מתמטיקה',
      treeType: 'עץ זית',
      gradeLevel: 'א\'-ג\'',
      duration: '45 דקות',
      skills: [
        'הכוונה וניהול עצמי',
        'פתרון בעיות',
        'יכולת למידה'
      ],
      description: 'פעילות חקר מתמטית המשלבת מדידת היקף עצי זית, יצירת גרף השוואתי וחישובי כמויות של פירות על העץ.',
      materials: [
        'סרט מידה',
        'דפי רישום מובנים',
        'כלי כתיבה וצבעים',
        'אפליקציית RING SIZER (אופציונלי)'
      ],
      steps: [
        'מדידת היקף עצי זית באמצעות סרט מדידה ורישום התוצאות',
        'השוואת מדידות - כמה ילדים צריך כדי "להקיף" עץ אחד',
        'יצירת גרף עמודות של העצים לפי עובי הגזע',
        'חישוב כמות הזיתים בעץ על בסיס מדגם מענף אחד'
      ],
      expectedOutcomes: [
        'גרף עמודות השוואתי',
        'טבלת מדידות היקפים',
        'חישובי כמויות זיתים'
      ],
      tags: ['פעילות חוץ', 'עבודת צוות', 'מדידה', 'חישובים', 'חקר']
    },
    // ... שאר הפעילויות
  ]
};

export default function TreePage() {
  const params = useParams();
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  // סינון פעילויות לפי תחום דעת
  const filteredActivities = selectedSubject 
    ? treeData.activities.filter(activity => activity.subject === selectedSubject)
    : treeData.activities;

  // רשימת תחומי הדעת הייחודיים
  const subjects = Array.from(new Set(treeData.activities.map(a => a.subject)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* כותרת ומידע על העץ */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-8">
            <div className="relative w-48 h-48">
              <Image
                src={treeData.image}
                alt={treeData.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-green-800 mb-4">{treeData.name}</h1>
              <p className="text-xl text-gray-600">{treeData.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* סינון לפי תחומי דעת */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSelectedSubject('')}
            className={`px-4 py-2 rounded-full ${
              !selectedSubject ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            הכל
          </button>
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-full ${
                selectedSubject === subject ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* רשימת הפעילויות */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Link 
              key={activity.id} 
              href={`/activities/${activity.id}`}
              className="block"
            >
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-green-800">{activity.name}</h3>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {activity.subject}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{activity.duration}</span>
                  <span>{activity.gradeLevel}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}