// src/app/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBox from '@/components/ui/SearchBox';

// נתוני תחומים לדוגמה
const subjects = [
  {
    id: 'language',
    name: 'שפה',
    description: 'פעילויות פדגוגיות בתחום שפה',
    icon: '📚',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'math',
    name: 'מתמטיקה',
    description: 'פעילויות פדגוגיות בתחום מתמטיקה',
    icon: '🧮',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'history',
    name: 'היסטוריה',
    description: 'פעילויות פדגוגיות בתחום היסטוריה',
    icon: '🏛️',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'geography',
    name: 'גיאוגרפיה',
    description: 'פעילויות פדגוגיות בתחום גיאוגרפיה',
    icon: '🌍',
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'science',
    name: 'מדעים',
    description: 'פעילויות פדגוגיות בתחום מדעים',
    icon: '🔬',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'art',
    name: 'אומנות',
    description: 'פעילויות פדגוגיות בתחום אומנות',
    icon: '🎨',
    color: 'from-pink-500 to-pink-600',
  },
];

export default function Home() {
  return (
    <div>
      {/* באנר ראשי */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">ברוכים הבאים למגינים על העצים</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            פלטפורמה חינוכית המשלבת פעילויות פדגוגיות מגוונות דרך עולם העצים והצמחייה
          </p>
          
          <div className="max-w-xl mx-auto">
            <SearchBox placeholder="חיפוש פעילויות, עצים או מיומנויות..." />
          </div>
        </div>
      </div>
      
      {/* תוכן הדף */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-green-800 mb-2 text-center">תחומי פעילות</h2>
        <div className="w-24 h-1 bg-green-500 mx-auto mb-10 rounded-full"></div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/subjects/${subject.id}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full">
                <div className={`bg-gradient-to-r ${subject.color} h-24 flex items-center justify-center text-white`}>
                  <span className="text-5xl">{subject.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{subject.name}</h3>
                  <p className="text-gray-600">{subject.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* קישור לעצים */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">עצים והפעילויות שלהם</h2>
          <p className="text-xl text-gray-600 mb-6">
            גלו את מגוון העצים ואת הפעילויות הפדגוגיות הקשורות אליהם
          </p>
          <Link href="/trees">
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-md text-lg transition-colors">
              צפו בעצים
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}