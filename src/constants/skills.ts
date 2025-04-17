export const CORE_SKILLS = [
  'חשיבה ביקורתית',
  'עבודת צוות',
  'פתרון בעיות',
  'תקשורת',
  'יצירתיות',
  'חשיבה מדעית',
  'אוריינות דיגיטלית'
] as const;

export const CUSTOM_SKILLS = [
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

export type CoreSkill = typeof CORE_SKILLS[number];
export type CustomSkill = typeof CUSTOM_SKILLS[number];
export type Skill = CoreSkill | CustomSkill; 