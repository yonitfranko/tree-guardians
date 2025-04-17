export const AGE_GROUPS = ['א-ג', 'ד-ו'] as const;

// מיפוי כיתות ספציפיות לקבוצות גיל
export const GRADE_TO_GROUP: { [key: string]: string } = {
  'כיתה א': 'א-ג',
  'כיתה ב': 'א-ג',
  'כיתה ג': 'א-ג',
  'כיתה ד': 'ד-ו',
  'כיתה ה': 'ד-ו',
  'כיתה ו': 'ד-ו'
};

export type AgeGroup = typeof AGE_GROUPS[number]; 