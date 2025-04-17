export const AGE_GROUPS = [
  'גן חובה',
  'כיתה א',
  'כיתה ב',
  'כיתה ג',
  'כיתה ד',
  'כיתה ה',
  'כיתה ו'
] as const;

export type AgeGroup = typeof AGE_GROUPS[number]; 