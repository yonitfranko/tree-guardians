'use client';

import React, { useState } from 'react';
import Link from 'next/link';


// נתוני מיומנויות לדוגמה (יוחלפו בנתונים מ-Firestore בהמשך)
const mockSkills = [
  { id: 'observation', name: 'תצפית', description: 'יכולת התבוננות מעמיקה בסביבה', subject: 'מדעים', level: 3, count: 12 },
  { id: 'classification', name: 'מיון וסיווג', description: 'יכולת לארגן מידע לקטגוריות', subject: 'מדעים', level: 2, count: 8 },
  { id: 'measurement', name: 'מדידה', description: 'שימוש בכלי מדידה שונים', subject: 'מתמטיקה', level: 2, count: 10 },
  { id: 'calculation', name: 'חישוב', description: 'ביצוע פעולות חשבון', subject: 'מתמטיקה', level: 3, count: 15 },
  { id: 'reading', name: 'הבנת הנקרא', description: 'הבנת טקסטים מסוגים שונים', subject: 'שפה', level: 4, count: 20 },
  { id: 'writing', name: 'הבעה בכתב', description: 'יכולת כתיבה ברורה ומאורגנת', subject: 'שפה', level: 3, count: 18 },
  { id: 'teamwork', name: 'עבודת צוות', description: 'שיתוף פעולה עם אחרים', subject: 'חברתי', level: 2, count: 14 },
  { id: 'creativity', name: 'חשיבה יצירתית', description: 'פיתוח רעיונות חדשים', subject: 'כללי', level: 3, count: 16 }
];

export default function SkillsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  // הפונקציה לסינון מיומנויות לפי תחום
  const filteredSkills = selectedSubject 
    ? mockSkills.filter(skill => skill.subject === selectedSubject)
    : mockSkills;
  
  // מיצוי כל התחומים הייחודיים מהמיומנויות
  const subjects = Array.from(new Set(mockSkills.map(skill => skill.subject)));
  
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        {/* כותרת העמוד */}
        <div className="bg-green-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-green-800 mb-4">עץ המיומנויות</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              צפה במיומנויות הנלמדות במסגרת הפעילויות השונות וגלה אילו פעילויות מסייעות בפיתוח כל מיומנות
            </p>
          </div>
        </div>
        
        {/* תוכן ראשי */}
        <div className="container mx-auto px-4 py-12">
          {/* סרגל סינון תחומים */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              className={`px-4 py-2 rounded-full ${
                !selectedSubject ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedSubject(null)}
            >
              כל התחומים
            </button>
            
            {subjects.map((subject) => (
              <button
                key={subject}
                className={`px-4 py-2 rounded-full ${
                  selectedSubject === subject ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
          
          {/* רשת המיומנויות */}
          {filteredSkills.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <div 
                  key={skill.id} 
                  className="border border-green-200 rounded-lg p-5 hover:border-green-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-green-800">{skill.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {skill.subject}
                    </span>
                  </div><p className="text-gray-600 mb-4">{skill.description}</p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${skill.level * 25}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">רמה {skill.level}/4</span>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {skill.count} פעילויות קשורות
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedSubject ? (
                <p>לא נמצאו מיומנויות בתחום {selectedSubject}</p>
              ) : (
                <p>לא נמצאו מיומנויות. הוסף מיומנויות חדשות כדי להתחיל.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}