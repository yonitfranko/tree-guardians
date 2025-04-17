'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Activity } from '@/types';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, deleteDoc } from 'firebase/firestore';
import Link from 'next/link';
import { DOMAINS } from '@/lib/constants';
import { getActivities } from '@/lib/activityService';

export default function ActivityPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!params?.id) {
        setError('מזהה פעילות לא תקין');
        setLoading(false);
        return;
      }

      try {
        const activityRef = doc(db, 'activities', params.id as string);
        const activityDoc = await getDoc(activityRef);
        
        if (activityDoc.exists()) {
          const data = activityDoc.data() as Activity;
          setActivity({ ...data, id: activityDoc.id });
        } else {
          setError('הפעילות לא נמצאה');
        }
      } catch (err) {
        setError('שגיאה בטעינת הפעילות');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [params?.id]);

  const handleDelete = async () => {
    if (!activity?.id) return;
    
    if (window.confirm('האם אתה בטוח שברצונך למחוק פעילות זו?')) {
      try {
        const activityRef = doc(db, 'activities', activity.id);
        await deleteDoc(activityRef);
        router.push('/activities');
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('שגיאה במחיקת הפעילות');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !activity) {
    return <div className="text-center text-red-500 p-4">{error || 'הפעילות לא נמצאה'}</div>;
  }

  const domain = DOMAINS.find(d => d.id === activity.domain);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* כותרת ופעולות */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-green-800">{activity.name}</h1>
            <div className="flex gap-4 mb-8">
              <Link
                href={`/activities/${activity.id}/edit`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                ערוך פעילות
              </Link>
              <Link
                href={`/activities/${activity.id}/documentation/new`}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                הוסף תיעוד
              </Link>
            </div>
      </div>
      </div>

        {/* פרטי הפעילות */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">פרטי הפעילות</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">סוג העץ:</span> {activity.treeType}</p>
              <p><span className="font-medium">תחום דעת:</span> {activity.subject}</p>
            </div>
            <div>
              <p><span className="font-medium">שכבת גיל:</span> {activity.gradeLevel}</p>
              <p><span className="font-medium">משך הפעילות:</span> {activity.duration}</p>
        </div>
      </div>
        </div>

        {/* תיאור */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">תיאור</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{activity.description}</p>
        </div>

        {/* מיומנויות */}
        {activity.skills?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">מיומנויות</h2>
            <div className="flex flex-wrap gap-2">
              {activity.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* חומרים נדרשים */}
        {activity.materials?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">ציוד נדרש</h2>
            <ul className="list-disc list-inside space-y-1">
              {activity.materials.map((material, index) => (
                <li key={`material-${index}`}>{material}</li>
              ))}
          </ul>
        </div>
        )}

        {/* שלבי הפעילות */}
        {activity.steps?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">שלבי הפעילות</h2>
            <ol className="list-decimal list-inside space-y-2">
              {activity.steps.map((step, index) => (
                <li key={`step-${index}`}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* תוצרים מצופים */}
        {activity.expectedOutcomes?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">תוצרים מצופים</h2>
            <ul className="list-disc list-inside space-y-1">
              {activity.expectedOutcomes.map((outcome, index) => (
                <li key={`outcome-${index}`}>{outcome}</li>
              ))}
          </ul>
        </div>
        )}

        {/* משאבים */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">משאבים וקישורים</h2>
          <div className="space-y-6">
            {activity.resources?.teacherResources && activity.resources.teacherResources.length > 0 && (
              <div>
                <h3 className="font-medium text-lg mb-3">📚 חומרי עזר למורה</h3>
                <ul className="space-y-3">
                  {activity.resources.teacherResources.map((resource, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <span className="mr-2">🔗</span>
                        {resource.title}
                      </a>
                      {resource.description && (
                        <p className="text-sm text-gray-600 mt-2 pr-6">{resource.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
      </div>
            )}

            {activity.resources?.worksheets && activity.resources.worksheets.length > 0 && (
        <div>
                <h3 className="font-medium text-lg mb-3">📝 דפי עבודה</h3>
                <ul className="space-y-3">
                  {activity.resources.worksheets.map((resource, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <span className="mr-2">🔗</span>
                        {resource.title}
                      </a>
                      {resource.description && (
                        <p className="text-sm text-gray-600 mt-2 pr-6">{resource.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
        </div>
            )}

            {activity.resources?.media && activity.resources.media.length > 0 && (
        <div>
                <h3 className="font-medium text-lg mb-3">🎥 סרטונים ומצגות</h3>
                <ul className="space-y-3">
                  {activity.resources.media.map((resource, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <span className="mr-2">🔗</span>
                        {resource.title}
                      </a>
                      {resource.description && (
                        <p className="text-sm text-gray-600 mt-2 pr-6">{resource.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
        </div>
            )}

            {activity.resources?.relatedActivities && activity.resources.relatedActivities.length > 0 && (
        <div>
                <h3 className="font-medium text-lg mb-3">🔗 קישורים נוספים</h3>
                <ul className="space-y-3">
                  {activity.resources.relatedActivities.map((resource, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <span className="mr-2">🔗</span>
                        {resource.title}
                      </a>
                      {resource.description && (
                        <p className="text-sm text-gray-600 mt-2 pr-6">{resource.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
        </div>
            )}

            {activity.resources?.externalLinks && activity.resources.externalLinks.length > 0 && (
        <div>
                <h3 className="font-medium text-lg mb-3">🌐 קישורים חיצוניים</h3>
                <div className="space-y-2">
                  {activity.resources.externalLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {link.title || 'קישור חיצוני'}
                      </a>
                      {link.description && (
                        <span className="text-gray-600">- {link.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!activity.resources?.teacherResources?.length &&
              !activity.resources?.worksheets?.length &&
              !activity.resources?.media?.length &&
              !activity.resources?.relatedActivities?.length &&
              !activity.resources?.externalLinks?.length) && (
              <p className="text-gray-500 text-center py-4">אין משאבים זמינים</p>
            )}
        </div>
      </div>

        {/* תגיות */}
        {activity.tags?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">תגיות</h2>
            <div className="flex flex-wrap gap-2">
              {activity.tags.map((tag, index) => (
                <span
                  key={`tag-${index}`}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}