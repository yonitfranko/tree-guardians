'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Resource } from '@/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { SKILLS } from '@/lib/constants';

export default function EditActivity() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<Activity>({
    id: '',
    name: '',
    treeType: '',
    subject: '',
    gradeLevel: '',
    duration: '',
    description: '',
    skills: [],
    materials: [],
    steps: [],
    expectedOutcomes: [],
    tags: [],
    resources: {
      media: [],
      teacherResources: [],
      relatedActivities: [],
      worksheets: []
    },
    title: '',
    domain: '',
    ageGroup: '',
    expectedResults: [],
    media: [],
    teacherResources: [],
    relatedActivities: [],
    worksheets: [],
    isActive: true,
    updatedAt: new Date()
  });
  const [saving, setSaving] = useState(false);
  const [newResource, setNewResource] = useState<Resource>({
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

  useEffect(() => {
    const fetchActivity = async () => {
      if (!params?.id || typeof params.id !== 'string') {
        router.push('/activities');
        return;
      }

      try {
        const activityRef = doc(db, 'activities', params.id);
        const activitySnap = await getDoc(activityRef);

        if (activitySnap.exists()) {
          const data = activitySnap.data();
          // Initialize resources from both locations
          const resources = {
            media: data.media || data.resources?.media || [],
            teacherResources: data.teacherResources || data.resources?.teacherResources || [],
            relatedActivities: data.relatedActivities || data.resources?.relatedActivities || [],
            worksheets: data.worksheets || data.resources?.worksheets || []
          };
          
          setActivity({
            id: activitySnap.id,
            ...data,
            resources: resources
          } as Activity);
        } else {
          router.push('/activities');
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
        router.push('/activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [params?.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activity?.id) return;
    
    setSaving(true);
    try {
      const activityRef = doc(db, 'activities', activity.id);
      const { id, ...activityData } = activity;
      
      console.log('Current activity data:', activityData);
      
      // Clean up the data before saving
      const dataToSave = {
        name: activityData.name || '',
        title: activityData.name || '',
        treeType: activityData.treeType || '',
        subject: activityData.subject || '',
        domain: activityData.subject || '',
        gradeLevel: activityData.gradeLevel || '',
        ageGroup: activityData.gradeLevel || '',
        duration: activityData.duration || '',
        description: activityData.description || '',
        skills: activityData.skills || [],
        materials: activityData.materials || [],
        steps: activityData.steps || [],
        expectedOutcomes: activityData.expectedOutcomes || [],
        expectedResults: activityData.expectedOutcomes || [],
        tags: activityData.tags || [],
        // שמירת המשאבים בשני המקומות לתאימות לאחור
        resources: {
          media: activityData.resources?.media || [],
          teacherResources: activityData.resources?.teacherResources || [],
          relatedActivities: activityData.resources?.relatedActivities || [],
          worksheets: activityData.resources?.worksheets || []
        },
        // שמירת המשאבים גם בשדות הישירים
        media: activityData.resources?.media || [],
        teacherResources: activityData.resources?.teacherResources || [],
        relatedActivities: activityData.resources?.relatedActivities || [],
        worksheets: activityData.resources?.worksheets || [],
        updatedAt: new Date(),
        isActive: true
      };
      
      console.log('Saving data to Firestore:', dataToSave);
      
      await updateDoc(activityRef, dataToSave);
      alert('הפעילות עודכנה בהצלחה!');
      router.push(`/activities/${activity.id}`);
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('שגיאה בעדכון הפעילות');
    } finally {
      setSaving(false);
    }
  };

  const handleAddResource = async () => {
    if (!activity?.id || !newResource.title || !newResource.url) {
      alert('יש למלא כותרת וקישור');
      return;
    }
    
    console.log('Adding resource:', newResource);
    
    const resourceType = newResource.type;
    const newResourceItem = {
      title: newResource.title.trim(),
      url: newResource.url.trim(),
      description: newResource.description?.trim() || '',
      type: resourceType
    };
    
    const updatedResources = {
      media: activity.resources?.media || [],
      teacherResources: activity.resources?.teacherResources || [],
      relatedActivities: activity.resources?.relatedActivities || [],
      worksheets: activity.resources?.worksheets || [],
      [resourceType]: [
        ...(activity.resources?.[resourceType] || []),
        newResourceItem
      ]
    };
    
    console.log('Updated resources:', updatedResources);
    
    try {
      const activityRef = doc(db, 'activities', activity.id);
      
      // שמירת המשאב החדש בשני המקומות
      const updateData = {
        [`resources.${resourceType}`]: updatedResources[resourceType],
        [resourceType]: updatedResources[resourceType],
        updatedAt: new Date()
      };
      
      console.log('Saving to Firestore:', updateData);
      
      await updateDoc(activityRef, updateData);
      console.log('Resource saved successfully');
      
      // עדכון הסטייט המקומי
      setActivity(prevActivity => ({
        ...prevActivity,
        resources: updatedResources,
        [resourceType]: updatedResources[resourceType]
      }));

      // איפוס הטופס
      setNewResource({
        type: 'teacherResources',
        title: '',
        url: '',
        description: ''
      });
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('שגיאה בשמירת המשאב');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!activity) {
    return <div className="text-center py-8">הפעילות לא נמצאה</div>;
  }

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
                  <option value="היסטוריה">היסטוריה</option>
                  <option value="גיאוגרפיה">גיאוגרפיה</option>
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
                placeholder="רשום כל חומר בשורה חדשה"
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
                placeholder="רשום כל שלב בשורה חדשה"
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
                placeholder="רשום כל תוצר בשורה חדשה"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">תגיות</label>
              <textarea
                value={activity.tags?.join('\n')}
                onChange={(e) => setActivity({
                  ...activity,
                  tags: e.target.value.split('\n').filter(Boolean)
                })}
                className="w-full p-2 border rounded h-32"
                placeholder="רשום כל תגית בשורה חדשה"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">חומרי עזר וקישורים</h3>
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
                    כותרת הקישור
                  </label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="למשל: מצגת על עצים, דף עבודה וכו'"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    כתובת URL
                  </label>
                  <input
                    type="url"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://www.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    תיאור קצר (אופציונלי)
                  </label>
                  <input
                    type="text"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="תיאור קצר של הקישור"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddResource}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  הוסף קישור
                </button>
              </div>

              {/* Display existing resources */}
              {activity.resources && Object.entries(activity.resources).map(([type, resources]) => (
                resources && resources.length > 0 && (
                  <div key={type} className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">
                      {type === 'teacherResources' && '📚 חומרי עזר למורה'}
                      {type === 'worksheets' && '📝 דפי עבודה'}
                      {type === 'media' && '🎥 סרטונים ומצגות'}
                      {type === 'relatedActivities' && '🔗 קישורים נוספים'}
                    </h4>
                    <ul className="space-y-3">
                      {resources.map((resource, index) => (
                        <li key={index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                          <div className="flex-1">
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {resource.title}
                            </a>
                            {resource.description && (
                              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedResources = [...resources];
                              updatedResources.splice(index, 1);
                              setActivity({
                                ...activity,
                                resources: {
                                  media: activity.resources?.media || [],
                                  teacherResources: activity.resources?.teacherResources || [],
                                  relatedActivities: activity.resources?.relatedActivities || [],
                                  worksheets: activity.resources?.worksheets || [],
                                  [type]: updatedResources
                                }
                              });
                            }}
                            className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                            title="הסר קישור"
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
                href={`/activities/${activity.id}`}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              >
                ביטול
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'שומר...' : 'שמור שינויים'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
