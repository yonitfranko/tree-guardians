import { addDomainToFirestore, updateDomainInFirestore, deleteDomainFromFirestore } from './domainService';

// Types
export interface Domain {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Core Skills
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

// Custom Skills
export const CUSTOM_SKILLS = {
  OTHER: {
    title: 'מיומנויות נוספות',
    skills: [] as string[]
  }
};

// Unassigned Skills
export const UNASSIGNED_SKILLS: string[] = [];

// Grade Levels
export const GRADE_LEVELS = [
  'א1', 'א2',
  'ב1', 'ב2',
  'ג1', 'ג2',
  'ד1', 'ד2',
  'ה1', 'ה2',
  'ו1', 'ו2'
];

// Domains
export const DOMAINS: Domain[] = [
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
  },
  {
    id: 'history',
    name: 'היסטוריה',
    description: 'לימודי היסטוריה',
    icon: '🏛️'
  },
  {
    id: 'geography',
    name: 'גיאוגרפיה',
    description: 'לימודי גיאוגרפיה',
    icon: '🌍'
  },
  {
    id: 'art',
    name: 'אומנות',
    description: 'לימודי אומנות',
    icon: '🎨'
  }
];

// Helper Functions
export function isCoreSkill(skill: string): boolean {
  return Object.values(CORE_SKILLS).some(category => 
    category.skills.includes(skill)
  );
}

export function addCustomSkill(skill: string) {
  if (!isCoreSkill(skill) && !CUSTOM_SKILLS.OTHER.skills.includes(skill)) {
    CUSTOM_SKILLS.OTHER.skills.push(skill);
  }
}

// Combined Skills (for backward compatibility)
export const SKILLS = {
  ...CORE_SKILLS,
  ...CUSTOM_SKILLS
};

export async function addDomain(domain: Omit<Domain, 'id'>): Promise<string> {
  return await addDomainToFirestore(domain);
}

export async function updateDomain(id: string, updates: Partial<Omit<Domain, 'id'>>): Promise<void> {
  await updateDomainInFirestore(id, updates);
}

export async function removeDomain(id: string): Promise<void> {
  await deleteDomainFromFirestore(id);
}
