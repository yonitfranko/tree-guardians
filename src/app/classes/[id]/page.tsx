'use client';

import { useParams } from 'next/navigation';
import SkillsProgress from '@/components/SkillsProgress';

// נתונים לדוגמה - בהמשך יגיעו מ-Firebase
const classData = {
  'א1': {
    name: 'א1',
    acquiredSkills: ['חשיבה יצירתית', 'עבודת צוות']
  },
  'א2': {
    name: 'א2',
    acquiredSkills: ['חשיבה מתמטית', 'פתרון בעיות']
  },
  'ב1': {
    name: 'ב1',
    acquiredSkills: ['הכוונה עצמית בלמידה', 'תקשורת']
  },
  'ב2': {
    name: 'ב2',
    acquiredSkills: ['מודעות עצמית', 'שיתוף פעולה']
  },
  'ג1': {
    name: 'ג1',
    acquiredSkills: [
      'חשיבה מתמטית',
      'פתרון בעיות',
      'עבודת צוות',
      'הכוונה עצמית בלמידה',
      'מודעות עצמית'
    ]
  },
  'ג2': {
    name: 'ג2',
    acquiredSkills: ['חשיבה יצירתית', 'עבודת צוות', 'מודעות עצמית']
  }
};

export default function ClassPage() {
  const params = useParams();
  const decodedId = decodeURIComponent(params.id as string);
  const classInfo = classData[decodedId];

  if (!classInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl text-red-600">
            כיתה {decodedId} לא נמצאה
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-green-800 mb-8">כיתה {classInfo.name}</h1>
        
        <SkillsProgress 
          acquiredSkills={classInfo.acquiredSkills}
          className={classInfo.name}
        />
      </div>
    </div>
  );
} 