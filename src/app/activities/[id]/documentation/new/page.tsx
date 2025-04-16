'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Activity } from '@/types';
import DocumentationForm from '@/components/documentation/DocumentationForm';
import { addDocumentation } from '@/lib/documentationService';
import { convertToEnglishClass } from '@/lib/utils';

const MAX_IMAGE_DIMENSION = 800; // pixels - reduced from 1200

// Utility function to resize an image with better memory handling
const resizeImage = (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height && width > MAX_IMAGE_DIMENSION) {
        height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
        width = MAX_IMAGE_DIMENSION;
      } else if (height > MAX_IMAGE_DIMENSION) {
        width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
        height = MAX_IMAGE_DIMENSION;
      }

      // Create canvas with the new dimensions
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw image with better quality settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG with lower quality to reduce size
      try {
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        
        // Clean up
        canvas.width = 0;
        canvas.height = 0;
        img.src = '';
        
        resolve(resizedDataUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
};

export default function NewDocumentation() {
  const router = useRouter();
  const params = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      const activityId = params?.id;
      if (!activityId) {
        console.error('No activity ID provided');
        return;
      }
      
      try {
        const activityDoc = await getDoc(doc(db, 'activities', activityId as string));
        if (activityDoc.exists()) {
          setActivity({ id: activityDoc.id, ...activityDoc.data() } as Activity);
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
        setError('שגיאה בטעינת הפעילות');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [params?.id]);

  if (loading) {
    return <div className="p-8 text-center">טוען...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!activity) {
    return <div className="p-8 text-center">לא נמצאה פעילות</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">תיעוד פעילות: {activity.name}</h1>
          
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
                if (!activity?.id || !data.className || !data.date || !data.title || !data.description) {
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

                // שמירת התיעוד בפיירסטור
                await addDocumentation({
                  activityId: activity.id,
                  className: convertToEnglishClass(data.className),
                  date: new Date(data.date).toISOString(),
                  title: data.title,
                  description: data.description,
                  skillIds: data.skillIds || [],
                  images: resizedImages,
                  teacherName: "Default Teacher", // You might want to get this from user context
                  createdAt: new Date(),
                  updatedAt: new Date()
                });

                console.log('Documentation saved successfully');
                alert('התיעוד נשמר בהצלחה!');
                router.refresh();
                router.push(`/activities/${activity.id}`);
              } catch (error) {
                console.error('Error saving documentation:', error);
                if (error instanceof Error && error.message.includes('longer than')) {
                  setError('שגיאה: התמונות שנבחרו גדולות מדי. אנא הקטן את מספר התמונות או את גודלן.');
                } else if (error instanceof Error) {
                  setError(`שגיאה בשמירת התיעוד: ${error.message}`);
                } else {
                  setError('שגיאה בשמירת התיעוד');
                }
              }
            }}
            onCancel={() => router.back()}
            activities={[activity]}
            skills={activity.skills.map((skill) => ({
              id: skill,
              name: skill,
              subject: activity.subject
            }))}
            classes={[]}
            initialData={{
              activityId: activity.id,
              title: '',
              className: '',
              date: new Date().toISOString().split('T')[0],
              description: '',
              skillIds: [],
              images: []
            }}
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