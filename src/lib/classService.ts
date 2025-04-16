import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { convertToHebrewClass, convertToEnglishClass, standardizeClassName } from './utils';
import { getDocumentations } from './documentationService';

const COLLECTION_NAME = 'classes';

export interface Class {
  id: string;
  name: string;
  acquiredSkills: string[];
  lastActivity?: string;
  totalActivities: number;
  createdAt: string;
  updatedAt: string;
}

export async function getClass(className: string): Promise<Class | null> {
  try {
    console.log('Getting class with original name:', className);
    
    // First standardize the name format
    const standardizedName = standardizeClassName(className);
    console.log('Standardized name:', standardizedName);
    
    // Then convert to English if needed
    const englishClassName = convertToEnglishClass(standardizedName);
    console.log('English class name:', englishClassName);
    
    const docRef = doc(db, COLLECTION_NAME, englishClassName);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Found class data:', data);
      return {
        id: docSnap.id,
        name: convertToHebrewClass(standardizedName), // Keep the Hebrew name for display
        ...data
      } as Class;
    }
    
    console.log('Class not found, creating new class');
    // If class doesn't exist, create it
    await createClass(className);
    // Get the newly created class
    const newDocSnap = await getDoc(docRef);
    if (newDocSnap.exists()) {
      const data = newDocSnap.data();
      console.log('New class data:', data);
      return {
        id: newDocSnap.id,
        name: convertToHebrewClass(standardizedName), // Keep the Hebrew name for display
        ...data
      } as Class;
    }
    
    console.log('Failed to create or retrieve class');
    return null;
  } catch (error) {
    console.error('Error getting class:', error);
    throw new Error('Failed to get class');
  }
}

export async function createClass(className: string): Promise<void> {
  try {
    console.log('Creating new class with name:', className);
    
    // First standardize the name format
    const standardizedName = standardizeClassName(className);
    console.log('Standardized name:', standardizedName);
    
    // Then convert to English if needed
    const englishClassName = convertToEnglishClass(standardizedName);
    console.log('English class name:', englishClassName);
    
    const docRef = doc(db, COLLECTION_NAME, englishClassName);
    
    const newClassData = {
      id: englishClassName,
      name: convertToHebrewClass(standardizedName), // Keep the Hebrew name for display
      acquiredSkills: [],
      totalActivities: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Creating class with data:', newClassData);
    await setDoc(docRef, newClassData);
    console.log('Class created successfully');
  } catch (error) {
    console.error('Error creating class:', error);
    throw new Error('Failed to create class');
  }
}

export async function updateClassSkills(className: string, skills: string[]): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, className);
    await updateDoc(docRef, {
      acquiredSkills: skills,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating class skills:', error);
    throw new Error('Failed to update class skills');
  }
}

export async function getAllClasses(): Promise<Class[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Class[];
  } catch (error) {
    console.error('Error getting all classes:', error);
    throw new Error('Failed to get all classes');
  }
}

export async function getClasses(): Promise<Class[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    console.log('Raw class data from Firestore:', querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    // Create a map to store unique classes by standardized name
    const uniqueClasses = new Map<string, Class>();
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (!doc.id) {
        console.warn('Found class document without ID:', data);
        return;
      }
      
      // Convert everything to Hebrew format for consistency
      const standardizedName = standardizeClassName(doc.id);
      const hebrewName = convertToHebrewClass(standardizedName);
      
      // Skip if we couldn't convert to Hebrew
      if (!hebrewName) {
        console.warn(`Could not convert class name to Hebrew: ${doc.id}`);
        return;
      }
      
      console.log(`Class name conversion: ${doc.id} -> ${standardizedName} -> ${hebrewName}`);
      
      // Use Hebrew name as the key for uniqueness
      const existingClass = uniqueClasses.get(hebrewName);
      if (!existingClass || new Date(data.updatedAt) > new Date(existingClass.updatedAt)) {
        const classData = {
          id: hebrewName, // Use Hebrew name as ID
          name: hebrewName,
          acquiredSkills: data.acquiredSkills || [],
          totalActivities: data.totalActivities || 0,
          lastActivity: data.lastActivity || null,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        } as Class;
        
        uniqueClasses.set(hebrewName, classData);
      }
    });
    
    const classes = Array.from(uniqueClasses.values());
    console.log('Final unique classes:', classes);
    return classes;
  } catch (error) {
    console.error('Error getting classes:', error);
    throw new Error('Failed to get classes');
  }
}

export async function deleteAllClasses(): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting all classes:', error);
    throw new Error('Failed to delete all classes');
  }
}

// Function to sync all classes with their documentations
export async function syncClassesWithDocumentations(): Promise<void> {
  try {
    console.log('Starting class sync with documentations...');
    
    // Get all documentations
    const documentations = await getDocumentations();
    console.log(`Found ${documentations.length} documentations`);
    
    // First, get all existing classes to handle duplicates
    const existingClasses = await getAllClasses();
    console.log('Existing classes:', existingClasses);
    
    // Group documentations by standardized class name
    const docsByClass = documentations.reduce((acc, doc) => {
      // Standardize the class name
      const standardizedName = standardizeClassName(doc.className);
      if (!acc[standardizedName]) {
        acc[standardizedName] = [];
      }
      acc[standardizedName].push(doc);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Delete duplicate classes (e.g., if both "2ג" and "ג2" exist)
    for (const className of Object.keys(docsByClass)) {
      const duplicates = existingClasses.filter(cls => 
        standardizeClassName(cls.id) === className && cls.id !== className
      );
      
      for (const duplicate of duplicates) {
        console.log(`Deleting duplicate class: ${duplicate.id}`);
        await deleteDoc(doc(db, COLLECTION_NAME, duplicate.id));
      }
    }
    
    // Update each class with standardized name
    for (const [className, docs] of Object.entries(docsByClass)) {
      console.log(`Updating class ${className} with ${docs.length} documentations`);
      
      // Get all unique skills from documentations
      const allSkills = docs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [] as string[]);
      const uniqueSkills = Array.from(new Set(allSkills));
      
      // Get the latest activity date
      const dates = docs.map(doc => doc.date).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      const lastActivity = dates[0];
      
      // Always use standardized name for the document ID
      const standardizedName = standardizeClassName(className);
      const classRef = doc(db, COLLECTION_NAME, standardizedName);
      
      // Create or update the class
      await setDoc(classRef, {
        id: standardizedName,
        name: convertToHebrewClass(standardizedName),
        acquiredSkills: uniqueSkills,
        totalActivities: docs.length,
        lastActivity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Updated class ${standardizedName} with:`, {
        skills: uniqueSkills.length,
        activities: docs.length,
        lastActivity
      });
    }
    
    console.log('Class sync completed successfully');
  } catch (error) {
    console.error('Error syncing classes with documentations:', error);
    throw new Error('Failed to sync classes with documentations');
  }
} 