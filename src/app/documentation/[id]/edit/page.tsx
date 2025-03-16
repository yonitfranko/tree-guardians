'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Activity, Documentation } from '@/types';
import DocumentationForm from '@/components/documentation/DocumentationForm';
import { updateDocumentation } from '@/lib/documentationService';
import { getActivities } from '@/lib/activityService';

const MAX_IMAGE_DIMENSION = 1200; // pixels

// Utility function to resize an image
const resizeImage = (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height && width > MAX_IMAGE_DIMENSION) {
        height = (height * MAX_IMAGE_DIMENSION) / width;
        width = MAX_IMAGE_DIMENSION;
      } else if (height > MAX_IMAGE_DIMENSION) {
        width = (width * MAX_IMAGE_DIMENSION) / height;
        height = MAX_IMAGE_DIMENSION;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
};

export default function EditDocumentation() {
  const router = useRouter();
  const params = useParams();
  const [documentation, setDocumentation] = useState<Documentation | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const docId = params?.id;
      if (!docId) {
        console.error('No documentation ID provided');
        return;
      }
      
      try {
        // Fetch documentation
        const docRef = doc(db, 'documentations', docId as string);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          setError('התיעוד לא נמצא');
          return;
        }

        const docData = { id: docSnap.id, ...docSnap.data() } as Documentation;
        setDocumentation(docData);

        // Fetch activities
        const activitiesData = await getActivities();
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  if (loading) {
    return <div className="p-8 text-center">טוען...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!documentation) {
    return <div className="p-8 text-center">לא נמצא תיעוד</div>;
  }

  const activity = activities.find(a => a.id === documentation.activityId);
  if (!activity) {
    return <div className="p-8 text-center text-red-600">לא נמצאה פעילות מקושרת</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">עריכת תיעוד: {documentation.title}</h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">הנחיות להעלאת תמונות:</h2>
            <ul className="list-disc list-inside text-blue-700">
              <li>גודל מקסימלי לתמונה: 500KB</li>
              <li>גודל מקסימלי כולל: 1MB</li>
              <li>תמונות החורגות מהמגבלות לא יישמרו</li>
            </ul>
          </div>
          
          <DocumentationForm
            onSubmit={async (data) => {
              try {
                if (!documentation.id || !data.className || !data.date || !data.title || !data.description) {
                  throw new Error('חסרים פרטים חובה');
                }

                // Resize images if they exist
                let resizedImages: string[] = [];
                if (data.images && data.images.length > 0) {
                  resizedImages = await Promise.all(
                    data.images.map(async (image) => {
                      // Only resize if it's a data URL (base64)
                      if (image.startsWith('data:')) {
                        return await resizeImage(image);
                      }
                      return image;
                    })
                  );
                }

                // עדכון התיעוד בפיירסטור
                await updateDocumentation(documentation.id, {
                  ...data,
                  images: resizedImages,
                  date: new Date(data.date).toISOString()
                });

                alert('התיעוד עודכן בהצלחה!');
                router.push(`/activities/${documentation.activityId}`);
              } catch (error) {
                console.error('Error updating documentation:', error);
                if (error instanceof Error && error.message.includes('longer than')) {
                  setError('שגיאה: התמונות שנבחרו גדולות מדי. אנא הקטן את מספר התמונות או את גודלן.');
                } else {
                  setError('שגיאה בעדכון התיעוד');
                }
              }
            }}
            onCancel={() => router.back()}
            activities={[activity]}
            skills={activity.skills.map((skill, index) => ({
              id: index.toString(),
              name: skill,
              subject: activity.subject
            }))}
            classes={[]}
            initialData={documentation}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 