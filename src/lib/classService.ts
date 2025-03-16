import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, updateDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'classes';

export interface Class {
  id: string;
  name: string;
  acquiredSkills: string[];
  lastActivity?: string;
  totalActivities: number;
}

export async function getClass(className: string): Promise<Class | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, className);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Class;
    }
    
    // If class doesn't exist, create it
    await createClass(className);
    // Get the newly created class
    const newDocSnap = await getDoc(docRef);
    if (newDocSnap.exists()) {
      return {
        id: newDocSnap.id,
        ...newDocSnap.data()
      } as Class;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting class:', error);
    throw new Error('Failed to get class');
  }
}

export async function createClass(className: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, className);
    await setDoc(docRef, {
      id: className,
      name: className,
      acquiredSkills: [],
      totalActivities: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
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