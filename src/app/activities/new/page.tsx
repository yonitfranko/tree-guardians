'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addActivity } from '@/lib/activityService';
import type { Activity, Resource, Skill } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MAIN_CATEGORIES = ['חשיבה', 'למידה', 'חברתי', 'אישי'];

export default function NewActivity() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [activity, setActivity] = useState<Partial<Activity>>({
    name: '',
    subject: '',
    treeType: '',
    gradeLevel: '',
    duration: '',
    skills: [],
    description: '',
    materials: [],
    steps: [],
    expectedOutcomes: [],
    tags: [],
    resources: {
      teacherResources: [],
      worksheets: [],
      media: [],
      relatedActivities: [],
      externalLinks: []
    }
  });

  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'teacherResources',
    title: '',
    url: '',
    description: ''
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const trees = [
    { id: 'olive', name: 'עץ זית' },
    { id: 'pomegranate', name: 'עץ רימון' },
    { id: 'cypress', name: 'עץ ברוש' },
    { id: 'chinaberry', name: 'עץ איזדרכת' },
    { id: 'clementine', name: 'עץ קלמנטינות' },
    { id: 'poplar', name: 'עץ צפצפה' },
    { id: 'oak', name: 'עץ אלון' },
    { id: 'sycamore', name: 'עץ השיקמה' }
  ];

  useEffect(() => {
    const loadSkills = async () => {
      try {
        console.log('Starting to load skills...');
        const skillsCollection = collection(db, 'skills');
        const skillsSnapshot = await getDocs(skillsCollection);
        console.log('Skills snapshot:', skillsSnapshot.docs.length, 'documents found');
        const skillsList = skillsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Skill data:', data);
          return {
            id: doc.id,
            ...data
          };
        }) as Skill[];
        console.log('Processed skills:', skillsList);
        setSkills(skillsList);
      } catch (err) {
        console.error('Error loading skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  const getSkillsByCategory = (category: string) => {
    return skills.filter(skill => skill.category === category);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const savedActivity = await addActivity(activity as Activity);
      alert('הפעילות נשמרה בהצלחה!');
      router.push(`/activities/${savedActivity.id}`);
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('שגיאה בשמירת הפעילות');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      const tags = newTag.split(',').map(tag => tag.trim()).filter(tag => tag);
      setActivity({
        ...activity,
        tags: [...(activity.tags || []), ...tags]
      });
      setNewTag('');
    }
  };

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      const resourceType = newResource.type as keyof NonNullable<Activity['resources']>;
      const currentResources = activity.resources?.[resourceType] || [];
      
      setActivity({
        ...activity,
        resources: {
          teacherResources: [],
          worksheets: [],
          media: [],
          relatedActivities: [],
          externalLinks: [],
          ...activity.resources,
          [resourceType]: [...currentResources, newResource as Resource]
        }
      });

      setNewResource({
        type: 'teacherResources',
        title: '',
        url: '',
        description: ''
      });
    }
  };

  const handleSkillChange = (skillId: string) => {
    const newSelected = selectedSkills.includes(skillId)
      ? selectedSkills.filter(id => id !== skillId)
      : selectedSkills.length < 5
      ? [...selectedSkills, skillId]
      : selectedSkills;
    
    setSelectedSkills(newSelected);
    setActivity(prev => ({
      ...prev,
      skills: newSelected
    }));
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

            <div>
              <label className="block text-gray-700 mb-2">סוג העץ</label>
              <select
                value={activity.treeType}
                onChange={(e) => setActivity({...activity, treeType: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">בחר עץ</option>
                {trees.map((tree) => (
                  <option key={tree.id} value={tree.id}>
                    {tree.name}
                  </option>
                ))}
              </select>
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
                  <option value="אנגלית">אנגלית</option>
                  <option value="היסטוריה">היסטוריה</option>
                  <option value="גיאוגרפיה">גיאוגרפיה</option>
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

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                מיומנויות (עד 5)
              </label>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">טוען מיומנויות...</p>
                </div>
              ) : error ? (
                <div className="text-red-600 py-4">{error}</div>
              ) : (
                <div className="space-y-4">
                  {MAIN_CATEGORIES.map((category) => {
                    const categorySkills = getSkillsByCategory(category);
                    if (categorySkills.length === 0) return null;
                    
                    return (
                      <div key={category} className="space-y-1">
                        <h3 className="font-bold text-lg text-green-800">{category}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {categorySkills.map((skill) => (
                            <div key={skill.id} className="flex items-center py-1">
                              <input
                                type="checkbox"
                                id={skill.id}
                                checked={selectedSkills.includes(skill.id)}
                                onChange={() => handleSkillChange(skill.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                disabled={!selectedSkills.includes(skill.id) && selectedSkills.length >= 5}
                              />
                              <label htmlFor={skill.id} className="mr-2 text-sm text-gray-700">
                                {skill.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {selectedSkills.length >= 5 && (
                    <p className="text-amber-600 text-sm">
                      הגעת למקסימום המיומנויות המותר (5)
                    </p>
                  )}
                </div>
              )}
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="הוסף תגיות, הפרד עם פסיקים"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  הוסף
                </button>
              </div>
              {activity.tags && activity.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setActivity({
                          ...activity,
                          tags: activity.tags?.filter(t => t !== tag)
                        })}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">חומרי עזר</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    סוג המשאב
                  </label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value as Resource['type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="teacherResources">📚 חומרי עזר למורה</option>
                    <option value="worksheets">📝 דפי עבודה</option>
                    <option value="media">🎥 סרטונים ומצגות</option>
                    <option value="relatedActivities">🔗 פעילויות קשורות</option>
                    <option value="externalLinks">🌐 קישורים חיצוניים</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כותרת
                  </label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    קישור
                  </label>
                  <input
                    type="url"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תיאור (אופציונלי)
                  </label>
                  <input
                    type="text"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddResource}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  הוסף משאב
                </button>
              </div>

              {activity.resources && Object.entries(activity.resources).map(([type, resources]) => (
                resources && resources.length > 0 && (
                  <div key={type} className="mt-4">
                    <h4 className="font-medium mb-2">
                      {type === 'teacherResources' && '📚 חומרי עזר למורה'}
                      {type === 'worksheets' && '📝 דפי עבודה'}
                      {type === 'media' && '🎥 סרטונים ומצגות'}
                      {type === 'relatedActivities' && '🔗 פעילויות קשורות'}
                      {type === 'externalLinks' && '🌐 קישורים חיצוניים'}
                    </h4>
                    <ul className="space-y-2">
                      {resources.map((resource, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{resource.title}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedResources = [...resources];
                              updatedResources.splice(index, 1);
                              setActivity({
                                ...activity,
                                resources: {
                                  teacherResources: [],
                                  worksheets: [],
                                  media: [],
                                  relatedActivities: [],
                                  externalLinks: [],
                                  ...activity.resources,
                                  [type]: updatedResources
                                }
                              });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
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
                disabled={loading}
                className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'שומר...' : 'שמור פעילות'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
