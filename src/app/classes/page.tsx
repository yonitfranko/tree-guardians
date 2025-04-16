'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClasses, deleteAllClasses, syncClassesWithDocumentations } from '@/lib/classService';
import { convertToHebrewClass } from '@/lib/utils';

// Define all grades in Hebrew
const ALL_GRADES = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];
const REFRESH_INTERVAL = 30000; // Refresh every 30 seconds

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function fetchClasses() {
    try {
      const classesData = await getClasses();
      console.log('Classes data before conversion:', classesData);
      
      // Ensure all class names are in Hebrew and filter out invalid entries
      const hebrewClasses = classesData
        .filter(cls => cls && cls.id)
        .map(cls => {
          const hebrewName = convertToHebrewClass(cls.id);
          console.log(`Converting ${cls.id} to ${hebrewName}`);
          return {
            ...cls,
            name: hebrewName || cls.id,
            id: cls.id
          };
        });
      
      console.log('Classes data after conversion:', hebrewClasses);
      setClasses(hebrewClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchClasses();

    // Set up periodic refresh
    const intervalId = setInterval(fetchClasses, REFRESH_INTERVAL);

    // Set up focus event listener
    const handleFocus = () => {
      console.log('Window focused - refreshing classes');
      fetchClasses();
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchClasses();
  };

  const handleSync = async () => {
    if (confirm('האם ברצונך לסנכרן את כל הכיתות עם התיעודים? פעולה זו תעדכן את כל הכיתות.')) {
      try {
        setSyncing(true);
        await syncClassesWithDocumentations();
        await fetchClasses();
        alert('הסנכרון הושלם בהצלחה!');
      } catch (error) {
        console.error('Error syncing classes:', error);
        alert('שגיאה בסנכרון הכיתות');
      } finally {
        setSyncing(false);
      }
    }
  };

  const handleDeleteAllClasses = async () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הכיתות? פעולה זו בלתי הפיכה!')) {
      try {
        setLoading(true);
        await deleteAllClasses();
        await fetchClasses();
        alert('כל הכיתות נמחקו בהצלחה');
      } catch (error) {
        console.error('Error deleting classes:', error);
        alert('שגיאה במחיקת הכיתות');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleGrade = (grade: string) => {
    setExpandedGrade(expandedGrade === grade ? null : grade);
  };

  if (loading || syncing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{syncing ? 'מסנכרן כיתות...' : 'טוען...'}</p>
        </div>
      </div>
    );
  }

  // Group classes by grade
  const classesByGrade = ALL_GRADES.reduce((acc, grade) => {
    // Filter classes that belong to this grade
    const gradeClasses = classes
      .filter(cls => {
        // Get the standardized name in Hebrew
        const hebrewName = cls.name;
        return hebrewName && hebrewName.startsWith(grade);
      })
      .sort((a, b) => {
        // Sort by class number
        const aNum = parseInt(a.name.slice(1)) || 0;
        const bNum = parseInt(b.name.slice(1)) || 0;
        return aNum - bNum;
      });

    acc[grade] = gradeClasses;
    return acc;
  }, {} as Record<string, any[]>);

  // Debug log
  console.log('Classes by grade:', classesByGrade);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-green-800">כיתות</h1>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full hover:bg-green-100 transition-colors"
              title="רענן רשימה"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSync}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              סנכרן כיתות
            </button>
            <button
              onClick={handleDeleteAllClasses}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              מחק את כל הכיתות
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {ALL_GRADES.map((grade) => (
            <div key={grade} className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => toggleGrade(grade)}
                className="w-full px-6 py-4 flex justify-between items-center bg-green-50 hover:bg-green-100 transition-colors"
              >
                <h2 className="text-2xl font-bold text-gray-800">שכבה {grade}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {classesByGrade[grade]?.length || 0} כיתות
                  </span>
                  <span className="transform transition-transform duration-200" style={{
                    transform: expandedGrade === grade ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </div>
              </button>
              
              {expandedGrade === grade && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classesByGrade[grade]?.length > 0 ? (
                      classesByGrade[grade].map((cls: any) => (
                        <Link
                          key={cls.id}
                          href={`/classes/${encodeURIComponent(cls.name)}`}
                          className="block p-4 border rounded-lg hover:border-green-500 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold">{cls.name}</h3>
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {cls.totalActivities || 0} פעילויות
                            </span>
                          </div>
                          
                          {cls.lastActivity && (
                            <p className="text-sm text-gray-500">
                              פעילות אחרונה: {new Date(cls.lastActivity).toLocaleDateString('he-IL')}
                            </p>
                          )}
                          
                          {cls.acquiredSkills?.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                {cls.acquiredSkills.length} מיומנויות נרכשו
                              </p>
                            </div>
                          )}
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 py-4">
                        אין כיתות בשכבה זו
                      </div>
                    )}
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
