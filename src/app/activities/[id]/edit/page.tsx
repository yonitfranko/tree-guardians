'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// הגדרות הטיפוסים והנתונים (זהים לדף הפעילות)
interface Resource {
  type: 'teacher' | 'worksheet' | 'video' | 'presentation' | 'related';
  title: string;
  url: string;
  description?: string;
}

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
  resources?: {
    teacherResources?: Resource[];
    worksheets?: Resource[];
    media?: Resource[];
    relatedActivities?: Resource[];
  };
}

const activitiesData: { [key: string]: Activity } = {
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
      'יכולת למידה',
      'חשיבה מתמטית',
      'עבודת צוות'
    ],
    description: 'פעילות חקר מתמטית המשלבת מדידת היקף עצי זית',
    materials: ['סרט מידה', 'דפי רישום'],
    steps: ['מדידת היקף', 'רישום תוצאות'],
    expectedOutcomes: ['גרף השוואתי'],
    tags: ['מתמטיקה', 'מדידות']
  }
};

export default function EditActivity() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const activityData = activitiesData[params.id as string];
    if (activityData) {
      setActivity(activityData);
    }
  }, [params.id]);

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">טוען...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // כאן יבוא הקוד לעדכון הפעילות ב-Firebase
    console.log('מעדכן פעילות:', activity);
    router.push(`/activities/${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">עריכת פעילות</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">שם הפעילות</label>
              <input
                type="text"
                value={activity.name}
                onChange={(e) => setActivity({...activity, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">תיאור</label>
              <textarea
                value={activity.description}
                onChange={(e) => setActivity({...activity, description: e.target.value})}
                className="w-full p-2 border rounded h-32"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">תחום דעת</label>
                <input
                  type="text"
                  value={activity.subject}
                  onChange={(e) => setActivity({...activity, subject: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">שכבת גיל</label>
                <input
                  type="text"
                  value={activity.gradeLevel}
                  onChange={(e) => setActivity({...activity, gradeLevel: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">חומרים נדרשים</label>
              <textarea
                value={activity.materials.join('\n')}
                onChange={(e) => setActivity({...activity, materials: e.target.value.split('\n')})}
                className="w-full p-2 border rounded h-32"
                placeholder="רשום כל חומר בשורה חדשה"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">שלבי הפעילות</label>
              <textarea
                value={activity.steps.join('\n')}
                onChange={(e) => setActivity({...activity, steps: e.target.value.split('\n')})}
                className="w-full p-2 border rounded h-32"
                placeholder="רשום כל שלב בשורה חדשה"
              />
            </div>

            <div className="flex justify-between">
              <Link
                href={`/activities/${params.id}`}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              >
                ביטול
              </Link>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                שמירת שינויים
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
