'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Resource, Skill } from '@/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { SKILLS, CUSTOM_SKILLS } from '@/lib/constants';

const MAIN_CATEGORIES = ['חשיבה', 'למידה', 'חברתי', 'אישי'];

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
      worksheets: [],
      externalLinks: []
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
    const fetchActivity = async () => {
      if (!params?.id || typeof params.id !== 'string') return;

      try {
        const activityRef = doc(db, 'activities', params.id);
        const activitySnap = await getDoc(activityRef);

        if (activitySnap.exists()) {
          const data = activitySnap.data();
          console.log('Fetched activity data:', data);
          console.log('Skills in fetched activity:', data.skills);

          const activityData = {
            id: activitySnap.id,
            ...data,
            skills: data.skills || [],
            resources: {
              media: data.media || data.resources?.media || [],
              teacherResources: data.teacherResources || data.resources?.teacherResources || [],
              relatedActivities: data.relatedActivities || data.resources?.relatedActivities || [],
              worksheets: data.worksheets || data.resources?.worksheets || [],
              externalLinks: data.resources?.externalLinks || []
            }
          } as Activity;

          setActivity(activityData);
          console.log('Setting selected skills to:', activityData.skills);
          setSelectedSkills(activityData.skills);
        }
      } catch (error) {
        console.error('Error loading activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [params?.id]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        console.log('Loading skills from Firestore...');
        const skillsSnapshot = await getDocs(collection(db, 'skills'));
        const skillsData = skillsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Skill[];
        console.log('Loaded skills:', skillsData);

        // עדכון המיומנויות הנבחרות אם הן מאוחסנות כשמות במקום ID
        if (selectedSkills.length > 0 && selectedSkills.some(skill => typeof skill === 'string' && skill.length > 30)) {
          // אלו ID-ים, לא צריך לעשות כלום
          setSkills(skillsData);
        } else {
          // אלו שמות של מיומנויות, צריך להמיר ל-ID
          const skillIds = selectedSkills.map(skillName => {
            const skill = skillsData.find(s => s.name === skillName);
            return skill ? skill.id : skillName;
          });
          console.log('Converting skill names to IDs:', skillIds);
          setSelectedSkills(skillIds);
          setActivity(prev => ({
            ...prev,
            skills: skillIds
          }));
          setSkills(skillsData);
        }
      } catch (error) {
        console.error('שגיאה בטעינת מיומנויות:', error);
        setError('שגיאה בטעינת מיומנויות');
      }
    };

    loadSkills();
  }, [selectedSkills]);

  const getSkillsByCategory = (category: string) => {
    console.log('Getting skills for category:', category);
    console.log('Current selected skills:', selectedSkills);
    const filteredSkills = skills.filter(skill => skill.mainCategory === category);
    console.log('Filtered skills for category:', filteredSkills);
    return filteredSkills;
  };

  const getSkillName = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.name : skillId;
  };

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
        resources: {
          media: activityData.resources?.media || [],
          teacherResources: activityData.resources?.teacherResources || [],
          relatedActivities: activityData.resources?.relatedActivities || [],
          worksheets: activityData.resources?.worksheets || [],
          externalLinks: activityData.resources?.externalLinks || []
        },
        // שמירת המשאבים גם בשדות הישירים לתאימות לאחור
        media: activityData.resources?.media || [],
        teacherResources: activityData.resources?.teacherResources || [],
        relatedActivities: activityData.resources?.relatedActivities || [],
        worksheets: activityData.resources?.worksheets || [],
        externalLinks: activityData.resources?.externalLinks || [],
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
      ...activity.resources,
      [resourceType]: [
        ...(activity.resources?.[resourceType] || []),
        newResourceItem
      ]
    };
    
    console.log('Updated resources:', updatedResources);
    
    try {
      const activityRef = doc(db, 'activities', activity.id);
      
      const updateData = {
        resources: updatedResources,
        [resourceType]: updatedResources[resourceType],
        updatedAt: new Date()
      };
      
      console.log('Saving to Firestore:', updateData);
      
      await updateDoc(activityRef, updateData);
      console.log('Resource saved successfully');
      
      setActivity(prevActivity => ({
        ...prevActivity,
        resources: updatedResources,
        [resourceType]: updatedResources[resourceType]
      }));

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

  const handleSkillChange = (skillId: string) => {
    console.log('Handling skill change for:', skillId);
    console.log('Current selected skills:', selectedSkills);
    
    if (selectedSkills.includes(skillId)) {
      const newSelected = selectedSkills.filter(id => id !== skillId);
      console.log('Removing skill, new selection:', newSelected);
      setSelectedSkills(newSelected);
      setActivity(prev => ({
        ...prev,
        skills: newSelected
      }));
    } else {
      if (selectedSkills.length < 5) {
        const newSelected = [...selectedSkills, skillId];
        console.log('Adding skill, new selection:', newSelected);
        setSelectedSkills(newSelected);
        setActivity(prev => ({
          ...prev,
          skills: newSelected
        }));
      } else {
        alert('ניתן לבחור עד 5 מיומנויות');
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
                  <option value="אנגלית">אנגלית</option>
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

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">מיומנויות (עד 5)</h2>
              
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
                              <label 
                                htmlFor={skill.id} 
                                className={`mr-2 text-sm ${selectedSkills.includes(skill.id) ? 'text-blue-700 font-medium' : 'text-gray-700'}`}
                              >
                                {skill.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {selectedSkills.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">מיומנויות נבחרות:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map(skillId => (
                          <span key={skillId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {getSkillName(skillId)}
                            <button
                              onClick={() => handleSkillChange(skillId)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                    <option value="relatedActivities">🔗 פעילויות קשורות</option>
                    <option value="externalLinks">🌐 קישורים חיצוניים</option>
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
                      {type === 'relatedActivities' && '🔗 פעילויות קשורות'}
                      {type === 'externalLinks' && '🌐 קישורים חיצוניים'}
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
                                  externalLinks: activity.resources?.externalLinks || [],
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
