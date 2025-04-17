export const MAIN_SKILLS = [
  'חשיבה ביקורתית',
  'עבודת צוות',
  'פתרון בעיות',
  'חשיבה מדעית'
] as const;

// מיומנויות נוספות שיכולות להתעדכן דינמית
export const ADDITIONAL_SKILLS = [
  'תקשורת',
  'יצירתיות',
  'אוריינות דיגיטלית',
  'מדידה',
  'תצפית',
  'איסוף נתונים',
  'ניתוח מידע',
  'הסקת מסקנות',
  'תכנון ניסוי',
  'עבודת שטח',
  'זיהוי צמחים',
  'שימוש בכלי מדידה'
] as const;

export type MainSkill = typeof MAIN_SKILLS[number];
export type AdditionalSkill = typeof ADDITIONAL_SKILLS[number];
export type Skill = MainSkill | AdditionalSkill; 