'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getActivityById, updateActivity } from '@/lib/activityService';
import { Activity as ActivityType } from '@/types/activity';
import ActivityForm from '@/components/activities/ActivityForm';
import Link from 'next/link';

interface Resource {
  type: 'teacher' | 'worksheet' | 'video' | 'presentation' | 'related';
  title: string;
  url: string;
  description?: string;
}

interface Documentation {
  id: string;
  title: string;
  description: string;
  date: string;
  images?: string[];
}

interface Activity {
  id: string;
  name: string;
  subject?: string;
  treeType?: string;
  gradeLevel?: string;
  duration?: string;
  skills?: string[];
  description?: string;
  materials?: string[] | string;
  steps?: string[];
  expectedOutcomes?: string[];
  tags?: string[];
  resources?: {
    teacherResources?: Resource[];
    worksheets?: Resource[];
    media?: Resource[];
    relatedActivities?: Resource[];
  };
  documentations?: Documentation[];
}

// הנתונים הקבועים לבדיקה
const activitiesData = {
  'olive-math': {
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
    tags: ['פעילות חוץ', 'עבודת צוות', 'מדידה', 'חישובים', 'חקר'],
    resources: {
      teacherResources: [
        {
          type: 'teacher',
          title: 'מדריך למורה - מדידת היקף',
          url: '#',
          description: 'הסברים מפורטים על אופן העברת הפעילות'
        }
      ],
      worksheets: [
        {
          type: 'worksheet',
          title: 'דף עבודה - רישום מדידות',
          url: '#'
        }
      ],
      media: [
        {
          type: 'video',
          title: 'סרטון הדרכה - מדידת היקף עץ',
          url: '#'
        }
      ],
      relatedActivities: [
        {
          type: 'related',
          title: 'חישוב שטח הצל של העץ',
          url: '/activities/olive-math-shadow'
        }
      ]
    },
    documentations: [
      {
        id: '1',
        title: 'פעילות מדידה - כיתה ג1',
        description: 'התלמידים מדדו את היקף העץ ויצרו גרף השוואתי',
        date: '2024-03-15',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      }
    ]
  }
};

export default function ActivityPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activityId = params?.id;
    // אם activityId הוא מערך, ניקח את הערך הראשון
    const id = Array.isArray(activityId) ? activityId[0] : activityId;
    
    // נוסיף בדיקה שה-id קיים
    if (id && activitiesData) {
      const activityData = activitiesData[id];
      if (activityData) {
        setActivity(activityData);
      } else {
        setError('הפעילות לא נמצאה');
      }
    }
  }, [params, activitiesData]);

  const handleUpdateActivity = async (updatedData: Partial<ActivityType>) => {
    try {
      if (!activity?.id) return;
      await updateActivity(activity.id, updatedData);
      // עדכון המידע המקומי
      setActivity(prev => prev ? { ...prev, ...updatedData } : null);
    } catch (err) {
      console.error("Error updating activity:", err);
      alert("שגיאה בעדכון הפעילות. נסה שוב מאוחר יותר.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error}</h1>
          <Link href="/" className="text-green-600 hover:text-green-700">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">טוען...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* כותרת ומידע בסיסי */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">{activity.name}</h1>
              <div className="flex gap-4 text-sm">
                {activity.subject && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{activity.subject}</span>}
                {activity.gradeLevel && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{activity.gradeLevel}</span>}
                {activity.duration && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{activity.duration}</span>}
              </div>
            </div>
            {/* כפתורי פעולה */}
            <div className="flex gap-4">
              <Link href={`/activities/${activity.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                עריכת פעילות
              </Link>
              <Link href={`/trees/${activity.treeType}`} className="text-green-600 hover:text-green-700">
                חזרה לעץ {activity.treeType}
              </Link>
            </div>
          </div>
          {activity.description && <p className="text-gray-600 text-lg mb-6">{activity.description}</p>}
          
          {/* תגיות */}
          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activity.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* מידע על הפעילות */}
          <div className="space-y-8">
            {/* מיומנויות */}
            {activity.skills && activity.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4">מיומנויות נרכשות</h2>
                <ul className="space-y-2">
                  {activity.skills.map(skill => (
                    <li key={skill} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* חומרים */}
            {activity.materials && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4">חומרים נדרשים</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {Array.isArray(activity.materials) ? (
                    activity.materials.map(material => (
                      <li key={material}>{material}</li>
                    ))
                  ) : (
                    <li>{activity.materials}</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* מהלך ותוצרים */}
          <div className="space-y-8">
            {/* שלבי הפעילות */}
            {activity.steps && activity.steps.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4">מהלך הפעילות</h2>
                <ol className="space-y-4">
                  {activity.steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* תוצרים מצופים */}
            {activity.expectedOutcomes && activity.expectedOutcomes.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4">תוצרים מצופים</h2>
                <ul className="space-y-2">
                  {activity.expectedOutcomes.map(outcome => (
                    <li key={outcome} className="flex items-center gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* קישורים - מוצג רק אם יש קישורים */}
        {activity.resources && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-6">חומרים נלווים</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* חומרי עזר למורה */}
              {activity.resources.teacherResources && (
                <div>
                  <h3 className="font-bold text-lg mb-3">חומרי עזר למורה</h3>
                  <ul className="space-y-2">
                    {activity.resources.teacherResources.map(resource => (
                      <li key={resource.title}>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* דפי עבודה */}
              {activity.resources.worksheets && (
                <div>
                  <h3 className="font-bold text-lg mb-3">דפי עבודה</h3>
                  <ul className="space-y-2">
                    {activity.resources.worksheets.map(resource => (
                      <li key={resource.title}>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* מדיה */}
              {activity.resources.media && (
                <div>
                  <h3 className="font-bold text-lg mb-3">סרטונים ומצגות</h3>
                  <ul className="space-y-2">
                    {activity.resources.media.map(resource => (
                      <li key={resource.title}>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* פעילויות קשורות */}
              {activity.resources.relatedActivities && (
                <div>
                  <h3 className="font-bold text-lg mb-3">פעילויות קשורות</h3>
                  <ul className="space-y-2">
                    {activity.resources.relatedActivities.map(resource => (
                      <li key={resource.title}>
                        <Link
                          href={resource.url}
                          className="text-green-600 hover:text-green-700 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          {resource.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* כפתורי פעולה */}
        <div className="mt-8 flex justify-center gap-4">
          <Link 
            href={`/activities/${activity.id}/documentation/new`}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md text-lg transition-colors"
          >
            הוספת תיעוד לפעילות
          </Link>
          
          <Link 
            href={`/activities/${activity.id}/documentation`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md text-lg transition-colors"
          >
            צפייה בתיעודים קודמים
          </Link>
        </div>

        {/* הצגת תיעודים אחרונים */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6">תיעודים אחרונים</h2>
          <div className="grid gap-4">
            {activity.documentations?.slice(0, 3).map((doc) => (
              <div key={doc.id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{doc.title}</h3>
                  <span className="text-sm text-gray-500">{doc.date}</span>
                </div>
                <p className="text-gray-600">{doc.description}</p>
                {doc.images && doc.images.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {doc.images.map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        alt={`תמונה ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {activity.documentations?.length > 3 && (
            <Link 
              href={`/activities/${activity.id}/documentation`}
              className="mt-4 text-green-600 hover:text-green-700 inline-block"
            >
              הצג את כל התיעודים ({activity.documentations.length})
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
