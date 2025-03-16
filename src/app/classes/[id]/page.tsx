'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SkillsProgress from '@/components/SkillsProgress';
import { getClassDocumentations, deleteDocumentation } from '@/lib/documentationService';
import { getClass, Class } from '@/lib/classService';
import type { Documentation } from '@/types';

// נתונים לדוגמה - בהמשך יגיעו מ-Firebase
const classData = {
  'א1': {
    name: 'א1',
    acquiredSkills: ['חשיבה יצירתית', 'עבודת צוות']
  },
  'א2': {
    name: 'א2',
    acquiredSkills: ['חשיבה מתמטית', 'פתרון בעיות']
  },
  'ב1': {
    name: 'ב1',
    acquiredSkills: ['הכוונה עצמית בלמידה', 'תקשורת']
  },
  'ב2': {
    name: 'ב2',
    acquiredSkills: ['מודעות עצמית', 'שיתוף פעולה']
  },
  'ג1': {
    name: 'ג1',
    acquiredSkills: [
      'חשיבה מתמטית',
      'פתרון בעיות',
      'עבודת צוות',
      'הכוונה עצמית בלמידה',
      'מודעות עצמית'
    ]
  },
  'ג2': {
    name: 'ג2',
    acquiredSkills: ['חשיבה יצירתית', 'עבודת צוות', 'מודעות עצמית']
  }
};

export default function ClassPage() {
  const params = useParams();
  const router = useRouter();
  const decodedId = decodeURIComponent(params?.id as string);
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [documentations, setDocumentations] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [classData, docs] = await Promise.all([
          getClass(decodedId),
          getClassDocumentations(decodedId)
        ]);
        
        setClassInfo(classData);
        setDocumentations(docs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [decodedId]);

  const handleDelete = async (docId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תיעוד זה?')) {
      return;
    }

    setDeleteLoading(docId);
    try {
      await deleteDocumentation(docId);
      setDocumentations(docs => docs.filter(doc => doc.id !== docId));
      alert('התיעוד נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting documentation:', error);
      alert('שגיאה במחיקת התיעוד');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl text-red-600">
            כיתה {decodedId} לא נמצאה
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-green-800 mb-8">כיתה {classInfo.name}</h1>
        
        <div className="space-y-8">
          {/* מיומנויות */}
          <SkillsProgress 
            acquiredSkills={classInfo.acquiredSkills}
            className={classInfo.name}
          />

          {/* תיעודי פעילויות */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">תיעודי פעילויות</h2>
            </div>

            {documentations.length > 0 ? (
              <div className="grid gap-6">
                {documentations.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">{doc.title}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(doc.date).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/documentation/${doc.id}/edit`}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          ערוך
                        </Link>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleteLoading === doc.id}
                          className={`px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${
                            deleteLoading === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {deleteLoading === doc.id ? '...מוחק' : 'מחק'}
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{doc.description}</p>
                    
                    {doc.images && doc.images.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {doc.images.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`תמונה ${index + 1} מהפעילות`}
                            className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => window.open(photo, '_blank')}
                          />
                        ))}
                      </div>
                    )}

                    {doc.skillIds && doc.skillIds.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {doc.skillIds.map((skill: string, index: number) => {
                          let category = '';
                          if (skill.includes('חשיבה')) category = 'חשיבה';
                          else if (skill.includes('למידה')) category = 'למידה';
                          else if (skill.includes('מודעות') || skill.includes('הנעה') || skill.includes('התמדה') || skill.includes('אחריות')) category = 'אישי';
                          else if (skill.includes('צוות') || skill.includes('תקשורת') || skill.includes('שיתוף') || skill.includes('מנהיגות')) category = 'חברתי';
                          
                          return (
                            <span
                              key={index}
                              className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1"
                            >
                              <span className="text-xs text-gray-500">({category})</span>
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">אין תיעודים להצגה</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 