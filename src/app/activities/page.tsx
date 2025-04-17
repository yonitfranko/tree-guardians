// src/app/activities/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ActivityForm from '@/components/activities/ActivityForm';
import { Activity } from '@/types';
import { getAllActivities } from '@/lib/activityService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Activity as FirebaseActivity } from '@/lib/types';
import { ActivityCard } from '@/components/ActivityCard';
import { getActivities } from '@/lib/activityService';
import { useActivities } from '@/hooks/useActivities';
import { AGE_GROUPS, GRADE_TO_GROUP } from '@/constants/ageGroups';
import { MAIN_SKILLS, ADDITIONAL_SKILLS } from '@/constants/skills';

const subjects = [
  {
    id: 'science',
    name: 'מדעים',
    description: 'פעילויות חקר וגילוי בתחומי המדעים השונים',
    icon: '🔬',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'math',
    name: 'מתמטיקה',
    description: 'פעילויות לפיתוח חשיבה מתמטית ופתרון בעיות',
    icon: '📐',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'language',
    name: 'שפה',
    description: 'פעילויות לפיתוח מיומנויות שפה וכתיבה',
    icon: '📚',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'history',
    name: 'היסטוריה',
    description: 'פעילויות להכרת אירועים היסטוריים משמעותיים',
    icon: '🏛️',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'geography',
    name: 'גיאוגרפיה',
    description: 'פעילויות להכרת העולם והסביבה',
    icon: '🌍',
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'art',
    name: 'אומנות',
    description: 'פעילויות יצירה ופיתוח חשיבה יצירתית',
    icon: '🎨',
    color: 'from-pink-500 to-pink-600'
  }
];

// הגדרת טיפוס Tree
interface Tree {
  id: string;
  name: string;
  image: string;
  description: string;
}

// הגדרת טיפוס ActivitiesData
interface ActivitiesData {
  [key: string]: {
    id: string;
    name: string;
    subjects: string[];
    treeIds: string[];
    ageGroup: string;
    skillIds: string[];
    description: string;
    materials: string;
    preparation: string;
    expectedOutcomes: string[];
    steps: string[];
    duration: string;
    treeType: string;
    gradeLevel: string;
    skills: string[];
    tags: string[];
    resources: {
      teacherResources: Array<{
        type: string;
        title: string;
        url: string;
        description: string;
      }>;
      studentResources: any[];
      worksheets: Array<{
        type: string;
        title: string;
        url: string;
        description: string;
      }>;
      media: Array<{
        type: string;
        title: string;
        url: string;
        description: string;
      }>;
      relatedActivities: Array<{
        type: string;
        title: string;
        url: string;
        description: string;
      }>;
    };
    summary: string;
    image: string;
    participants: string;
    objectives: string[];
    location: string;
    assessment: string;
    extensions: string[];
    safety: string[];
    link: string;
  };
}

// מערך העצים
const trees: Tree[] = [
  {
    id: 'olive',
    name: 'עץ זית',
    image: 'https://i.imgur.com/sPIIkjH.png',
    description: 'עץ הזית הוא אחד מסמלי ארץ ישראל'
  },
  {
    id: 'pomegranate',
    name: 'עץ רימון',
    image: 'https://i.imgur.com/yogNdDO.png',
    description: 'עץ הרימון מלא בפירות מתוקים וטעימים'
  },
  {
    id: 'cypress',
    name: 'עץ ברוש',
    image: 'https://i.imgur.com/blOQVis.png',
    description: 'עץ הברוש הגבוה מתנשא לשמיים'
  },
  {
    id: 'chinaberry',
    name: 'עץ איזדרכת',
    image: 'https://i.imgur.com/trksnJM.png',
    description: 'עץ האיזדרכת מספק צל נעים'
  },
  {
    id: 'clementine',
    name: 'עץ קלמנטינות',
    image: 'https://i.imgur.com/C9kxwmD.png',
    description: 'עץ הקלמנטינות מלא בפירות הדר מתוקים'
  },
  {
    id: 'poplar',
    name: 'עץ צפצפה',
    image: 'https://i.imgur.com/P5K3T73.png',
    description: 'עץ הצפצפה רוקד ברוח'
  },
  {
    id: 'oak',
    name: 'עץ אלון',
    image: 'https://i.imgur.com/ttMzfh5.png',
    description: 'עץ האלון החזק והיציב'
  },
  {
    id: 'sycamore',
    name: 'עץ השיקמה',
    image: 'https://i.imgur.com/PWXwrFQ.png',
    description: 'עץ השיקמה העתיק והחכם'
  }
];

const activitiesData: ActivitiesData = {
  'olive-math': {
    id: 'olive-math',
    name: 'גילוי היקף העץ ועולם הזיתים',
    subjects: ['מתמטיקה'],
    treeIds: [],
    ageGroup: 'ד-ו',
    skillIds: [],
    description: 'פעילות חקר מתמטית סביב עץ הזית',
    materials: 'סרט מדידה, דף נייר, עיפרון',
    preparation: 'להכין את דפי העבודה מראש',
    expectedOutcomes: [
      'התלמידים ילמדו למדוד היקף של עץ',
      'התלמידים יבינו את הקשר בין היקף לקוטר'
    ],
    steps: ['מדידת היקף העץ', 'חישוב הקוטר', 'השוואה בין עצים שונים'],
    duration: '45 דקות',
    treeType: 'זית',
    gradeLevel: 'כיתה ה',
    skills: ['מדידה', 'חישוב', 'עבודת צוות'],
    tags: ['פעילות חוץ', 'עבודת צוות', 'מדידה', 'חישובים', 'חקר'],
    resources: {
      teacherResources: [
        {
          type: 'teacher',
          title: 'מדריך למורה - פעילות מדידת היקף',
          url: '#',
          description: 'מדריך מפורט למורה לביצוע הפעילות'
        }
      ],
      studentResources: [],
      worksheets: [
        {
          type: 'worksheet',
          title: 'דף עבודה - רישום מדידות',
          url: '#',
          description: 'דף עבודה לתלמידים לרישום תוצאות המדידות'
        }
      ],
      media: [
        {
          type: 'video',
          title: 'סרטון הדרכה - מדידת היקף עץ',
          url: '#',
          description: 'סרטון המדגים את תהליך מדידת היקף העץ'
        }
      ],
      relatedActivities: [
        {
          type: 'related',
          title: 'חישוב שטח הצל של העץ',
          url: '/activities/olive-math-shadow',
          description: 'פעילות המשך לחישוב שטח הצל שהעץ מטיל'
        }
      ]
    },
    summary: 'פעילות חקר מתמטית המשלבת מדידות והיכרות עם עץ הזית',
    image: '/images/olive-tree.jpg',
    participants: '20-30 תלמידים',
    objectives: ['הבנת מושג ההיקף', 'פיתוח מיומנויות מדידה', 'היכרות עם עץ הזית'],
    location: 'חצר בית הספר',
    assessment: 'הערכת דפי העבודה ותצפית על עבודת התלמידים',
    extensions: ['חישוב נפח גזע העץ', 'מעקב אחר גדילת העץ לאורך זמן'],
    safety: ['להיזהר מענפים נמוכים', 'לשמור על מרחק בטוח בין התלמידים'],
    link: '/activities/olive-math'
  }
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [dynamicSkills, setDynamicSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetchedActivities = await getActivities();
        setActivities(fetchedActivities);
        
        // איסוף כל המיומנויות הייחודיות מהפעילויות
        const uniqueSkills = new Set<string>();
        fetchedActivities.forEach(activity => {
          activity.skills.forEach(skill => {
            if (!MAIN_SKILLS.includes(skill) && !ADDITIONAL_SKILLS.includes(skill)) {
              uniqueSkills.add(skill);
            }
          });
        });
        setDynamicSkills(Array.from(uniqueSkills));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    if (!activities) return;

    const filtered = activities.filter(activity => {
      // Text search in name, description, and tags
      const searchText = searchTerm.toLowerCase();
      const textMatch = !searchText || 
        activity.name.toLowerCase().includes(searchText) ||
        activity.description.toLowerCase().includes(searchText) ||
        activity.tags?.some(tag => tag.toLowerCase().includes(searchText));

      // Age group filter - check if activity's age group matches the selected group
      const ageGroupMatch = !selectedAgeGroup || 
        activity.ageGroup === selectedAgeGroup ||
        GRADE_TO_GROUP[activity.ageGroup] === selectedAgeGroup;

      // Skills filter
      const skillsMatch = selectedSkills.length === 0 || 
        selectedSkills.every(skill => activity.skills.includes(skill));

      return textMatch && ageGroupMatch && skillsMatch;
    });

    setFilteredActivities(filtered);
  }, [activities, searchTerm, selectedAgeGroup, selectedSkills]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  if (loading) {
    return <div className="text-center p-8">טוען פעילויות...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 space-y-4">
        {/* Search input */}
        <div>
          <input
            type="text"
            placeholder="חפש פעילות לפי שם, תיאור או תגיות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg text-right"
          />
        </div>

        {/* Age group filter */}
        <div>
          <select
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="w-full p-2 border rounded-lg text-right"
          >
            <option value="">כל קבוצות הגיל</option>
            {AGE_GROUPS.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {/* Main Skills */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-right">מיומנויות ראשיות:</h3>
          <div className="flex flex-wrap gap-2 justify-end">
            {MAIN_SKILLS.map(skill => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Skills */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-right">מיומנויות נוספות:</h3>
          <div className="flex flex-wrap gap-2 justify-end">
            {[...ADDITIONAL_SKILLS, ...dynamicSkills].map(skill => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedSkills.includes(skill)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="text-center text-gray-500">
          לא נמצאו פעילויות התואמות את החיפוש
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((activity) => (
            <Link 
              href={`/activities/${activity.id}`}
              key={activity.id}
              className="block"
            >
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-bold mb-2 text-right">{activity.name}</h2>
                <p className="text-gray-600 mb-2 text-right">{activity.description}</p>
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {GRADE_TO_GROUP[activity.ageGroup] || activity.ageGroup}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2 justify-end">
                  {activity.skills.map(skill => (
                    <span 
                      key={skill}
                      className={`text-xs px-2 py-1 rounded-full ${
                        MAIN_SKILLS.includes(skill)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 justify-end">
                    {activity.tags.map(tag => (
                      <span 
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}