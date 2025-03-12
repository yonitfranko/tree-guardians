'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GRADE_LEVELS } from '@/lib/constants';

// נתונים לדוגמה - בהמשך יגיעו מ-Firebase
const classesData = {
  'ג1': {
    id: 'ג1',
    name: 'ג1',
    acquiredSkills: ['חשיבה מתמטית', 'פתרון בעיות', 'עבודת צוות'],
    lastActivity: '2024-03-20',
    totalActivities: 5
  },
  'ג2': {
    id: 'ג2',
    name: 'ג2',
    acquiredSkills: ['חשיבה יצירתית', 'עבודת צוות', 'מודעות עצמית'],
    lastActivity: '2024-03-19',
    totalActivities: 4
  }
  // ... עוד כיתות
};

export default function ClassesPage() {
  const [expandedGrade, setExpandedGrade] = useState<string | null>('ג'); // ברירת מחדל - שכבה ג' פתוחה

  // מארגן את הכיתות לפי שכבות
  const gradeGroups = GRADE_LEVELS.reduce((groups, grade) => {
    const gradePrefix = grade.charAt(0); // 'א', 'ב', 'ג' וכו'
    if (!groups[gradePrefix]) {
      groups[gradePrefix] = [];
    }
    groups[gradePrefix].push(grade);
    return groups;
  }, {} as { [key: string]: string[] });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-800 mb-8">כיתות</h1>

        <div className="space-y-4">
          {Object.entries(gradeGroups).map(([grade, classes]) => (
            <div key={grade} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* כותרת השכבה - לחיצה מרחיבה/מכווצת */}
              <button
                onClick={() => setExpandedGrade(expandedGrade === grade ? null : grade)}
                className="w-full px-6 py-4 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors"
              >
                <h2 className="text-2xl font-bold text-green-800">שכבה {grade}</h2>
                <svg 
                  className={`w-6 h-6 transform transition-transform ${
                    expandedGrade === grade ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* תוכן השכבה - מוצג רק כשהשכבה מורחבת */}
              {expandedGrade === grade && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {classes.map((className) => {
                      const classData = classesData[className] || {
                        id: className,
                        name: className,
                        acquiredSkills: [],
                        lastActivity: null,
                        totalActivities: 0
                      };

                      return (
                        <Link 
                          key={className}
                          href={`/classes/${encodeURIComponent(className)}`}
                          className="block p-4 border rounded-lg hover:border-green-500 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-800">{className}</h3>
                            <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                              {classData.totalActivities} פעילויות
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{classData.acquiredSkills.length}</span> מיומנויות נרכשו
                            </div>
                            {classData.lastActivity && (
                              <div className="text-sm text-gray-600">
                                פעילות אחרונה: {new Date(classData.lastActivity).toLocaleDateString('he-IL')}
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
