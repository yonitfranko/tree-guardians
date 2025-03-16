'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SKILLS } from '@/lib/constants';
import { addActivity } from '@/lib/activityService';
import type { Activity, Resource } from '@/types';

export default function NewActivity() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      relatedActivities: []
    }
  });

  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'teacherResources',
    title: '',
    url: '',
    description: ''
  });

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

  const handleAddSkill = () => {
    if (activity.skills && activity.skills.length < 5) {
      const skill = document.querySelector<HTMLInputElement>('input[name="skill"]')?.value;
      if (skill) {
        setActivity({
          ...activity,
          skills: [...activity.skills, skill]
        });
        if (document.querySelector<HTMLInputElement>('input[name="skill"]')) {
          (document.querySelector<HTMLInputElement>('input[name="skill"]') as HTMLInputElement).value = '';
        }
      }
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
                              if (e.target.checked && (activity.skills?.length ?? 0) < 5) {
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
                            disabled={!activity.skills?.includes(skill) && ((activity.skills?.length ?? 0) >= 5)}
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
                    <option value="relatedActivities">🔗 קישורים נוספים</option>
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
