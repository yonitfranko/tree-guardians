'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SKILLS } from '@/lib/constants';

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

export default function NewActivity() {
  const router = useRouter();
  const [newSkill, setNewSkill] = useState('');
  const [activity, setActivity] = useState<Partial<Activity>>({
    name: '',
    subject: '',
    treeType: 'עץ זית', // ברירת מחדל
    gradeLevel: '',
    duration: '',
    skills: [],
    description: '',
    materials: [],
    steps: [],
    expectedOutcomes: [],
    tags: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // יצירת מזהה ייחודי מבוסס על שם הפעילות
    const id = activity.name
      ?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    const newActivity = {
      ...activity,
      id
    };

    // כאן יבוא הקוד לשמירה ב-Firebase
    console.log('יוצר פעילות חדשה:', newActivity);
    router.push('/');
  };

  const handleAddSkill = () => {
    if (newSkill && activity.skills && activity.skills.length < 5) {
      setActivity({
        ...activity,
        skills: [...activity.skills, newSkill]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setActivity({
      ...activity,
      skills: activity.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">יצירת פעילות חדשה</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">שם הפעילות</label>
              <input
                type="text"
                value={activity.name}
                onChange={(e) => setActivity({...activity, name: e.target.value})}
                className="w-full p-2 border rounded"
                required
                placeholder="לדוגמה: גילוי היקף העץ ועולם הזיתים"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">תחום דעת</label>
                <select
                  value={activity.subject}
                  onChange={(e) => setActivity({...activity, subject: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">בחר תחום דעת</option>
                  <option value="מתמטיקה">מתמטיקה</option>
                  <option value="מדעים">מדעים</option>
                  <option value="שפה">שפה</option>
                  <option value="אמנות">אמנות</option>
                  <option value="חברה">חברה</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">שכבת גיל</label>
                <select
                  value={activity.gradeLevel}
                  onChange={(e) => setActivity({...activity, gradeLevel: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">בחר שכבת גיל</option>
                  <option value="א'-ג'">א'-ג'</option>
                  <option value="ד'-ו'">ד'-ו'</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">משך הפעילות</label>
              <select
                value={activity.duration}
                onChange={(e) => setActivity({...activity, duration: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">בחר משך זמן</option>
                <option value="45 דקות">45 דקות</option>
                <option value="90 דקות">90 דקות</option>
                <option value="שיעור כפול">שיעור כפול</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">תיאור הפעילות</label>
              <textarea
                value={activity.description}
                onChange={(e) => setActivity({...activity, description: e.target.value})}
                className="w-full p-2 border rounded h-32"
                required
                placeholder="תאר את מטרות הפעילות והתהליך הכללי..."
              />
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
                            checked={activity.skills?.includes(skill)}
                            onChange={(e) => {
                              if (e.target.checked && activity.skills?.length < 5) {
                                setActivity({
                                  ...activity,
                                  skills: [...(activity.skills || []), skill]
                                });
                              } else if (!e.target.checked) {
                                setActivity({
                                  ...activity,
                                  skills: activity.skills?.filter(s => s !== skill) || []
                                });
                              }
                            }}
                            disabled={!activity.skills?.includes(skill) && (activity.skills?.length || 0) >= 5}
                          />
                          {skill}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">חומרים נדרשים</label>
              <textarea
                value={activity.materials?.join('\n')}
                onChange={(e) => setActivity({
                  ...activity,
                  materials: e.target.value.split('\n').filter(Boolean)
                })}
                className="w-full p-2 border rounded h-32"
                placeholder="רשום כל חומר בשורה חדשה..."
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">שלבי הפעילות</label>
              <textarea
                value={activity.steps?.join('\n')}
                onChange={(e) => setActivity({
                  ...activity,
                  steps: e.target.value.split('\n').filter(Boolean)
                })}
                className="w-full p-2 border rounded h-32"
                placeholder="רשום כל שלב בשורה חדשה..."
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">תוצרים מצופים</label>
              <textarea
                value={activity.expectedOutcomes?.join('\n')}
                onChange={(e) => setActivity({
                  ...activity,
                  expectedOutcomes: e.target.value.split('\n').filter(Boolean)
                })}
                className="w-full p-2 border rounded h-32"
                placeholder="רשום כל תוצר בשורה חדשה..."
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">תגיות</label>
              <input
                type="text"
                value={activity.tags?.join(', ')}
                onChange={(e) => setActivity({
                  ...activity,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                className="w-full p-2 border rounded"
                placeholder="הפרד תגיות בפסיקים: למשל - חוץ, מדידות, עבודת צוות"
              />
            </div>

            <div className="flex justify-between">
              <Link
                href="/"
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              >
                ביטול
              </Link>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                יצירת פעילות
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
