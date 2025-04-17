import { addDomainToFirestore, updateDomainInFirestore, deleteDomainFromFirestore } from './domainService';

export const CORE_SKILLS = {
  THINKING: {
    title: 'חשיבה',
    skills: [
      'חשיבה ביקורתית',
      'חשיבה יצירתית',
      'פתרון בעיות',
      'קבלת החלטות',
      'חשיבה מתמטית',
      'חשיבה מדעית'
    ]
  },
  LEARNING: {
    title: 'למידה',
    skills: [
      'הכוונה עצמית בלמידה',
      'חיפוש ואיתור מידע',
      'ארגון וניהול מידע',
      'ייצוג מידע',
      'הסקת מסקנות'
    ]
  },
  PERSONAL: {
    title: 'אישי',
    skills: [
      'מודעות עצמית',
      'הנעה עצמית',
      'התמדה',
      'אחריות אישית',
      'ניהול זמן'
    ]
  },
  SOCIAL: {
    title: 'חברתי',
    skills: [
      'עבודת צוות',
      'תקשורת',
      'שיתוף פעולה',
      'מנהיגות',
      'אמפתיה'
    ]
  }
};

export const CUSTOM_SKILLS = {
  OTHER: {
    title: 'מיומנויות נוספות',
    skills: [] as string[] // יתמלא דינמית
  }
};

// מערך למיומנויות שעדיין לא משויכות לקטגוריה
export const UNASSIGNED_SKILLS: string[] = [];

// פונקציה לבדיקה אם מיומנות היא מיומנות ליבה
export function isCoreSkill(skill: string): boolean {
  return Object.values(CORE_SKILLS).some(category => 
    category.skills.includes(skill)
  );
}

// פונקציה להוספת מיומנות מותאמת אישית
export function addCustomSkill(skill: string) {
  if (!isCoreSkill(skill) && !CUSTOM_SKILLS.OTHER.skills.includes(skill)) {
    CUSTOM_SKILLS.OTHER.skills.push(skill);
  }
}

// שומר על תאימות לאחור - משלב את כל המיומנויות
export const SKILLS = {
  ...CORE_SKILLS,
  ...CUSTOM_SKILLS
};

export const GRADE_LEVELS = [
  'א1', 'א2',
  'ב1', 'ב2',
  'ג1', 'ג2',
  'ד1', 'ד2',
  'ה1', 'ה2',
  'ו1', 'ו2'
];

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const DEFAULT_DOMAINS: Domain[] = [
  {
    id: 'science',
    name: 'מדעים',
    description: 'לימודי מדע וטכנולוגיה',
    icon: '🔬'
  },
  {
    id: 'math',
    name: 'מתמטיקה',
    description: 'לימודי חשבון ומתמטיקה',
    icon: '🔢'
  },
  {
    id: 'hebrew',
    name: 'עברית',
    description: 'לימודי שפה ואוריינות',
    icon: '📚'
  },
  {
    id: 'english',
    name: 'אנגלית',
    description: 'לימודי אנגלית כשפה זרה',
    icon: '🇬🇧'
  }
];

export async function addDomain(domain: Omit<Domain, 'id'>): Promise<string> {
  return await addDomainToFirestore(domain);
}

export async function updateDomain(id: string, updates: Partial<Omit<Domain, 'id'>>): Promise<void> {
  await updateDomainInFirestore(id, updates);
}

export async function removeDomain(id: string): Promise<void> {
  await deleteDomainFromFirestore(id);
}
