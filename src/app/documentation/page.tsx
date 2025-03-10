'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DocumentationForm from '@/components/documentation/DocumentationForm';

// נתוני תיעוד לדוגמה
const mockDocumentations = [
  {
    id: 'doc1',
    title: 'פעילות זיהוי עלים - כיתה ב2',
    description: 'במהלך הפעילות התלמידים אספו ומיינו עלים מסוגים שונים, ולמדו על מבנה העלה ותפקידיו.',
    className: 'ב2',
    date: '2023-11-10',
    activityId: 'act1',
    activityName: 'זיהוי עלים',
    images: ['/images/doc1-1.jpg', '/images/doc1-2.jpg'],
    skills: ['observation', 'classification']
  },
  {
    id: 'doc2',
    title: 'מדידת גובה עצים - כיתה ה1',
    description: 'התלמידים יצאו לחצר בית הספר ומדדו את גובהם של העצים השונים באמצעות שיטת הצל.',
    className: 'ה1',
    date: '2023-11-15',
    activityId: 'act2',
    activityName: 'חישוב גובה העץ',
    images: ['/images/doc2-1.jpg'],
    skills: ['measurement', 'calculation']
  },
  {
    id: 'doc3',
    title: 'ציור נוף בגינה - כיתה ג3',
    description: 'התלמידים ציירו את הנוף והעצים בגינת בית הספר, תוך התמקדות במבנה העצים השונים.',
    className: 'ג3',
    date: '2023-11-20',
    activityId: 'act3',
    activityName: 'ציור נוף',
    images: ['/images/doc3-1.jpg', '/images/doc3-2.jpg', '/images/doc3-3.jpg'],
    skills: ['creativity']
  }
];

export default function DocumentationPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // הפונקציה לסינון תיעודים לפי כיתה
  const filteredDocs = selectedClass 
    ? mockDocumentations.filter(doc => doc.className === selectedClass)
    : mockDocumentations;
  
  // מיצוי כל הכיתות הייחודיות מהתיעודים
  const classes = Array.from(new Set(mockDocumentations.map(doc => doc.className)));
  
  return (
    <div className="min-h-screen flex flex-col">      
      <main className="flex-1">
        {/* כותרת העמוד */}
        <div className="bg-green-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-green-800 mb-2">תיעוד פעילויות</h1>
                <p className="text-xl text-gray-600">תיעוד פעילויות שבוצעו בכיתות השונות</p>
              </div>
              
              <button 
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
                onClick={() => setShowForm(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  תיעוד חדש
                </button>
            </div>
          </div>
        </div>
        
        {/* תוכן ראשי */}
        <div className="container mx-auto px-4 py-12">
          {/* סרגל סינון כיתות */}
          <div className="mb-8">
            <label className="block text-gray-700 mb-2">סינון לפי כיתה:</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full ${
                  !selectedClass ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedClass(null)}
              >
                כל הכיתות
              </button>
              
              {classes.map((className) => (
                <button
                  key={className}
                  className={`px-4 py-2 rounded-full ${
                    selectedClass === className ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedClass(className)}
                >
                  {className}
                </button>
              ))}
            </div>
          </div>
          
          {/* רשימת תיעודים */}
          {filteredDocs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocs.map((doc) => (
                <Link href={`/documentation/${doc.id}`} key={doc.id}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      {/* במקום התמונה האמיתית */}
                      <div className="absolute inset-0 flex items-center justify-center bg-green-100">
                        <span className="text-4xl">📝</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-xl text-green-800 mb-2">{doc.title}</h3>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>{new Date(doc.date).toLocaleDateString('he-IL')}</span>
                        <span className="mx-2">•</span>
                        <span>כיתה {doc.className}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{doc.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {doc.skills.map(skillId => (
                          <span key={skillId} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {skillId === 'observation' ? 'תצפית' : 
                             skillId === 'classification' ? 'מיון וסיווג' :
                             skillId === 'measurement' ? 'מדידה' :
                             skillId === 'calculation' ? 'חישוב' :
                             skillId === 'creativity' ? 'יצירתיות' : skillId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">אין תיעודים להצגה</p>
              {selectedClass && (
                <p className="text-sm text-gray-400 mt-1">נסה לבחור כיתה אחרת או להוסיף תיעוד חדש</p>
              )}
            </div>
          )}
            {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">תיעוד חדש</h2>
                <DocumentationForm 
                  onSubmit={(data) => {
                    console.log('תיעוד נשמר:', data);
                    setShowForm(false);
                    // כאן תוסיף קוד לשמירת התיעוד ב-Firestore
                  }}
                  onCancel={() => setShowForm(false)}
                  activities={[]}  // כאן תוסיף פעילויות אמיתיות מ-Firestore
                  skills={[]}      // כאן תוסיף מיומנויות אמיתיות מ-Firestore
                  classes={['א1', 'א2', 'ב1', 'ב2', 'ג1', 'ג2']}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}