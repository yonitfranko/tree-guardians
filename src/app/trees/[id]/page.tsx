'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Activity, Tree } from '@/types';
import { ActivityCard } from '@/components/ActivityCard';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function TreePage() {
  const params = useParams();
  const treeId = params?.id as string;
  const [tree, setTree] = useState<Tree | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTreeAndActivities() {
      if (!treeId) return;
      
      try {
        // קבלת הפעילויות הקשורות לעץ מפיירסטור
        const activitiesRef = collection(db, 'activities');
        const q = query(activitiesRef, where('treeType', '==', treeId));
        const querySnapshot = await getDocs(q);
        
        const treeActivities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Activity[];

        // מציאת העץ המתאים
        const trees = {
          'olive': {
            id: 'olive',
            name: 'עץ זית',
            image: 'https://i.imgur.com/sPIIkjH.png',
            description: 'עץ הזית הוא אחד מסמלי ארץ ישראל, המסמל שלום, חיים ארוכים ושורשיות.'
          },
          'pomegranate': {
            id: 'pomegranate',
            name: 'עץ רימון',
            image: 'https://i.imgur.com/yogNdDO.png',
            description: 'עץ הרימון מלא בפירות מתוקים וטעימים'
          },
          'cypress': {
            id: 'cypress',
            name: 'עץ ברוש',
            image: 'https://i.imgur.com/blOQVis.png',
            description: 'עץ הברוש הגבוה מתנשא לשמיים'
          },
          'chinaberry': {
            id: 'chinaberry',
            name: 'עץ איזדרכת',
            image: 'https://i.imgur.com/trksnJM.png',
            description: 'עץ האיזדרכת מספק צל נעים'
          },
          'clementine': {
            id: 'clementine',
            name: 'עץ קלמנטינות',
            image: 'https://i.imgur.com/C9kxwmD.png',
            description: 'עץ הקלמנטינות מלא בפירות הדר מתוקים'
          },
          'poplar': {
            id: 'poplar',
            name: 'עץ צפצפה',
            image: 'https://i.imgur.com/P5K3T73.png',
            description: 'עץ הצפצפה רוקד ברוח'
          },
          'oak': {
            id: 'oak',
            name: 'עץ אלון',
            image: 'https://i.imgur.com/ttMzfh5.png',
            description: 'עץ האלון החזק והיציב'
          },
          'sycamore': {
            id: 'sycamore',
            name: 'עץ השיקמה',
            image: 'https://i.imgur.com/PWXwrFQ.png',
            description: 'עץ השיקמה העתיק והחכם'
          }
        };

        const selectedTree = trees[treeId as keyof typeof trees];
        
        setTree(selectedTree);
        setActivities(treeActivities);
      } catch (error) {
        console.error('Error fetching tree and activities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTreeAndActivities();
  }, [treeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!tree) {
    return <div>העץ לא נמצא</div>;
  }

  return (
        <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img
            src={tree.image}
            alt={tree.name}
            className="w-full h-full object-cover"
              />
            </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-green-800 mb-4">{tree.name}</h1>
          <p className="text-gray-600 mb-6">{tree.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6">פעילויות קשורות</h2>
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
        ) : (
          <p className="text-gray-600 text-center">אין עדיין פעילויות לעץ זה</p>
        )}
      </div>
    </div>
  );
}