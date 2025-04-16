export const gradeMap: Record<string, string> = {
  'א': 'A',
  'ב': 'B',
  'ג': 'C',
  'ד': 'D',
  'ה': 'E',
  'ו': 'F',
  'A': 'א',
  'B': 'ב',
  'C': 'ג',
  'D': 'ד',
  'E': 'ה',
  'F': 'ו'
};

// Helper function to standardize class name format to grade-first (e.g., "א2")
export function standardizeClassName(className: string): string {
  // If empty or invalid, return as is
  if (!className) {
    console.warn('Received empty class name for standardization');
    return className;
  }
  
  console.log('Standardizing class name:', className);
  
  // If starts with a number
  if (/^\d/.test(className)) {
    const number = className.match(/\d+/)?.[0] || '';
    const grade = className.slice(number.length);
    const result = `${grade}${number}`;
    console.log(`Standardized ${className} to ${result}`);
    return result;
  }
  
  // If starts with a letter, it's already in the correct format
  console.log(`Class name ${className} is already standardized`);
  return className;
}

export function convertToHebrewClass(englishClass: string | undefined | null): string {
  if (!englishClass) {
    console.warn('Received invalid class name for Hebrew conversion:', englishClass);
    return '';
  }
  
  console.log('Converting to Hebrew:', englishClass);
  
  try {
    // First standardize the format
    const standardized = standardizeClassName(englishClass);
    console.log('Standardized for Hebrew conversion:', standardized);
    
    // Now convert the grade if it's in English
    const grade = standardized.charAt(0);
    const number = standardized.slice(1);
    
    // If the grade is already in Hebrew, return as is
    if (/[א-ו]/.test(grade)) {
      console.log(`Grade ${grade} is already in Hebrew`);
      return standardized;
    }
    
    const hebrewGrade = gradeMap[grade];
    if (!hebrewGrade) {
      console.warn(`No Hebrew mapping found for grade ${grade} in class ${englishClass}`);
      return standardized;
    }
    
    const result = `${hebrewGrade}${number}`;
    console.log(`Converted ${englishClass} to ${result}`);
    return result;
  } catch (error) {
    console.error('Error converting to Hebrew class:', error);
    return englishClass;
  }
}

export function convertToEnglishClass(hebrewClass: string | undefined | null): string {
  if (!hebrewClass) {
    console.warn('Received invalid class name for English conversion:', hebrewClass);
    return '';
  }
  
  console.log('Converting to English:', hebrewClass);
  
  try {
    // First standardize the format
    const standardized = standardizeClassName(hebrewClass);
    console.log('Standardized for English conversion:', standardized);
    
    // Now convert the grade if it's in Hebrew
    const grade = standardized.charAt(0);
    const number = standardized.slice(1);
    
    // If the grade is already in English, return as is
    if (/[A-F]/.test(grade)) {
      console.log(`Grade ${grade} is already in English`);
      return standardized;
    }
    
    const englishGrade = gradeMap[grade];
    if (!englishGrade) {
      console.warn(`No English mapping found for grade ${grade} in class ${hebrewClass}`);
      return standardized;
    }
    
    const result = `${englishGrade}${number}`;
    console.log(`Converted ${hebrewClass} to ${result}`);
    return result;
  } catch (error) {
    console.error('Error converting to English class:', error);
    return hebrewClass;
  }
} 