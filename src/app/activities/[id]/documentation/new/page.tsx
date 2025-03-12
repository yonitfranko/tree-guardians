'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SKILLS, GRADE_LEVELS } from '@/lib/constants';

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

// מאגר זמני של פעילויות
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

interface FormData {
  title: string;
  className: string;
  description: string;
  images: File[];
  date: string;
  skills: string[];
}

export default function NewDocumentation() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    className: '',
    description: '',
    images: [],
    date: new Date().toISOString().split('T')[0],
    skills: []
  });
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

  useEffect(() => {
    // טעינת פרטי הפעילות
    const currentActivity = activitiesData[params.id as string];
    if (currentActivity) {
      setActivity(currentActivity);
      setFormData(prev => ({
        ...prev,
        title: currentActivity.name, // שם הפעילות כברירת מחדל
        skills: [...currentActivity.skills] // העתקת המיומנויות מהפעילות
      }));
    }
  }, [params.id]);

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData(prev => {
      if (checked && prev.skills.length < 5) {
        return { ...prev, skills: [...prev.skills, skill] };
      } else if (!checked) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      }
      return prev;
    });
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({...prev, images: [...prev.images, ...files]}));
    
    // יצירת תצוגה מקדימה של התמונות
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. שמירת התיעוד
      // TODO: שמירה ב-Firebase

      // 2. עדכון המיומנויות של הכיתה
      const classId = encodeURIComponent(formData.className);
      
      // TODO: עדכון המיומנויות ב-Firebase
      console.log('מעדכן מיומנויות לכיתה:', classId, formData.skills);

      // 3. הודעת הצלחה
      alert(`כיתה ${formData.className} צברה את המיומנויות הבאות:\n${formData.skills.join('\n')}`);

      // 4. ניווט לדף הכיתה
      router.push(`/classes/${classId}`);
      
    } catch (error) {
      console.error('שגיאה בשמירת התיעוד:', error);
      alert('אירעה שגיאה בשמירת התיעוד');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">הוספת תיעוד חדש</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">כותרת</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">כיתה</label>
              <select
                value={formData.className}
                onChange={(e) => setFormData({...formData, className: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">בחר כיתה</option>
                {GRADE_LEVELS.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">מיומנויות (עד 5)</label>
              <div className="space-y-4">
                {Object.entries(SKILLS).map(([category, { title, skills }]) => (
                  <div key={category} className="border-b pb-4">
                    <h3 className="font-bold mb-2">{title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {skills.map(skill => (
                        <label key={skill} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(skill)}
                            onChange={(e) => handleSkillChange(skill, e.target.checked)}
                            disabled={!formData.skills.includes(skill) && formData.skills.length >= 5}
                          />
                          {skill}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {formData.skills.length >= 5 && (
                <p className="text-red-500 mt-2">הגעת למקסימום המיומנויות האפשרי (5)</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">תיאור</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded h-32"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">תמונות</label>
              <div className="space-y-4">
                {/* כפתורי צילום והעלאה */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    העלאה מהגלריה
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.capture = 'environment';
                        fileInputRef.current.click();
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    צילום
                  </button>
                </div>

                {/* input נסתר לקבצים */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageCapture}
                />

                {/* תצוגה מקדימה של התמונות */}
                {imagesPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`תמונה ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagesPreviews(prev => prev.filter((_, i) => i !== index));
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                שמירת תיעוד
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}