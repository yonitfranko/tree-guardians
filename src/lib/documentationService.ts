import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where, deleteDoc, orderBy, setDoc } from 'firebase/firestore';
import type { Documentation, DocumentationFormData } from '@/types';
import { getClass, updateClassSkills } from './classService';
import { SKILLS, CORE_SKILLS, addCustomSkill } from './constants';
import { convertToEnglishClass, convertToHebrewClass, standardizeClassName } from './utils';

const COLLECTION_NAME = 'documentations';

interface DocumentationData {
  activityId: string;
  className: string;
  date: string;
  title: string;
  description: string;
  skillIds?: string[];
  images?: string[];
  teacherName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  type: 'core' | 'custom' | 'unassigned';
}

interface SkillCategory {
  title: string;
  skills: string[];
}

// Helper function to get all valid skills
const getAllValidSkills = () => {
  return Object.values(SKILLS).reduce((acc, category) => [...acc, ...category.skills], [] as string[]);
};

export const addDocumentation = async (data: DocumentationData) => {
  try {
    // Get all valid core skills
    const allCoreSkills = Object.values(CORE_SKILLS).flatMap(category => category.skills);
    
    // Process all skills - add new ones to custom skills if needed
    const processedSkills = (data.skillIds || []).map(skill => {
      if (!allCoreSkills.includes(skill)) {
        console.log('Adding custom skill:', skill);
        addCustomSkill(skill);
      }
      return skill;
    });

    console.log('Processed skills for documentation:', processedSkills);

    // Create documentation with all skills
    const docData = {
      activityId: data.activityId,
      className: data.className,
      date: data.date,
      title: data.title,
      description: data.description,
      skillIds: processedSkills,
      images: data.images || [],
      teacherName: data.teacherName,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    };

    // Add documentation
    const docRef = await addDoc(collection(db, 'documentations'), docData);
    console.log('Documentation added with ID:', docRef.id);

    // Standardize and convert class names
    const standardizedName = standardizeClassName(data.className);
    const englishClassName = convertToEnglishClass(standardizedName);
    const hebrewClassName = convertToHebrewClass(standardizedName);

    console.log('Class name conversions:', {
      original: data.className,
      standardized: standardizedName,
      english: englishClassName,
      hebrew: hebrewClassName
    });

    // Get class reference and ensure it exists
    const classRef = doc(db, 'classes', englishClassName);
    const classDoc = await getDoc(classRef);

    if (!classDoc.exists()) {
      // Create the class if it doesn't exist
      const newClassData = {
        id: englishClassName,
        name: convertToHebrewClass(standardizedName),
        acquiredSkills: processedSkills,
        totalActivities: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      console.log('Creating new class with data:', newClassData);
      await setDoc(classRef, newClassData);
    } else {
      // Get existing class data
      const classData = classDoc.data();
      console.log('Existing class data:', classData);
      
      // Get all documentations for this class to ensure we have all skills
      const docs = await getClassDocumentations(englishClassName);
      console.log('Found documentations for class:', docs.length);
      
      // Collect all skills from all documentations including the new one
      const allSkills = docs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [...processedSkills]);
      const uniqueSkills = Array.from(new Set(allSkills));
      
      console.log('Updating class with skills:', uniqueSkills);

      // Update class with new skills and increment totalActivities
      const updatedData = {
        name: hebrewClassName,
        acquiredSkills: uniqueSkills,
        totalActivities: docs.length + 1,
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      await updateDoc(classRef, updatedData);
      console.log('Class updated successfully');
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding documentation:', error);
    throw error;
  }
}

export async function getDocumentations(): Promise<Documentation[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Documentation[];
  } catch (error) {
    console.error('Error getting documentations:', error);
    throw new Error('Failed to get documentations');
  }
}

export async function getClassDocumentations(className: string): Promise<Documentation[]> {
  try {
    // First standardize and convert to Hebrew
    const standardizedName = standardizeClassName(className);
    const hebrewName = convertToHebrewClass(standardizedName);
    
    // Then convert to English for the query (since we store English names)
    const englishName = convertToEnglishClass(standardizedName);
    
    console.log(`Getting documentations for class: ${className} -> ${hebrewName} -> ${englishName}`);
    
    const q = query(
      collection(db, COLLECTION_NAME),
      where('className', 'in', [englishName, hebrewName]), // Check both English and Hebrew names
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Documentation[];
    
    console.log(`Found ${docs.length} documentations for class ${className}`);
    return docs;
  } catch (error) {
    console.error('Error getting class documentations:', error);
    throw new Error('Failed to get class documentations');
  }
}

export async function getDocumentationsByActivity(activityId: string): Promise<Documentation[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('activityId', '==', activityId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Documentation[];
  } catch (error) {
    console.error('Error getting documentations by activity:', error);
    throw new Error('Failed to get documentations by activity');
  }
}

export async function getDocumentation(id: string): Promise<Documentation | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Documentation;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting documentation:', error);
    throw new Error('Failed to get documentation');
  }
}

export async function updateDocumentation(id: string, data: Partial<Documentation>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Get the original documentation to get the class name
    const originalDoc = await getDoc(docRef);
    const originalData = originalDoc.data() as Documentation;
    
    // Convert class names to English
    const originalClassName = convertToEnglishClass(originalData.className);
    const newClassName = data.className ? convertToEnglishClass(data.className) : originalClassName;
    
    // Update the documentation
    await updateDoc(docRef, {
      ...data,
      className: newClassName,
      updatedAt: new Date().toISOString()
    });

    // If the class name hasn't changed, update the skills for the same class
    if (newClassName === originalClassName) {
      const classData = await getClass(originalData.className);
      if (classData) {
        console.log('Updating skills for class:', originalClassName);
        console.log('Current class data:', classData);
        
        // Get all documentations for this class to recalculate skills
        const docs = await getClassDocumentations(newClassName);
        const allSkills = docs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [] as string[]);
        const uniqueSkills = Array.from(new Set(allSkills));
        console.log('New unique skills:', uniqueSkills);
        
        await updateClassSkills(newClassName, uniqueSkills);
      }
    } else {
      // If the class name has changed, update both classes
      const oldClassData = await getClass(originalData.className);
      const newClassData = await getClass(data.className!);

      if (oldClassData) {
        const oldDocs = await getClassDocumentations(originalClassName);
        const oldSkills = oldDocs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [] as string[]);
        const uniqueOldSkills = Array.from(new Set(oldSkills));
        await updateClassSkills(originalClassName, uniqueOldSkills);
      }

      if (newClassData) {
        const newDocs = await getClassDocumentations(newClassName);
        const newSkills = newDocs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [] as string[]);
        const uniqueNewSkills = Array.from(new Set(newSkills));
        await updateClassSkills(newClassName, uniqueNewSkills);
      }
    }
  } catch (error) {
    console.error('Error updating documentation:', error);
    throw new Error('Failed to update documentation');
  }
}

export async function deleteDocumentation(id: string): Promise<void> {
  try {
    // Get the documentation first to get the class name
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data() as Documentation;
    
    // Delete the documentation
    await deleteDoc(docRef);

    // Update class skills
    if (data.className) {
      const classData = await getClass(data.className);
      if (classData) {
        // Get all remaining documentations for this class
        const docs = await getClassDocumentations(data.className);
        const allSkills = docs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [] as string[]);
        const uniqueSkills = Array.from(new Set(allSkills));
        await updateClassSkills(data.className, uniqueSkills);
      }
    }
  } catch (error) {
    console.error('Error deleting documentation:', error);
    throw new Error('Failed to delete documentation');
  }
} 