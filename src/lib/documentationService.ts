import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where, deleteDoc, orderBy } from 'firebase/firestore';
import type { Documentation } from '@/types';
import { getClass, updateClassSkills } from './classService';
import { SKILLS } from './constants';

const COLLECTION_NAME = 'documentations';

// Helper function to get all valid skills
const getAllValidSkills = () => {
  return Object.values(SKILLS).reduce((acc, category) => [...acc, ...category.skills], [] as string[]);
};

export async function addDocumentation(data: Partial<Documentation>): Promise<Documentation> {
  try {
    // Filter out invalid skills
    const validSkills = getAllValidSkills();
    const filteredSkills = (data.skillIds || []).filter(skill => validSkills.includes(skill));
    
    // Add the documentation with filtered skills
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      skillIds: filteredSkills,
      createdAt: new Date().toISOString()
    });

    // Get the class data
    const classData = await getClass(data.className!);
    if (classData) {
      // Update class skills - ensure we only add valid skills
      const existingSkills = classData.acquiredSkills || [];
      const newSkills = Array.from(new Set([...existingSkills, ...filteredSkills]));
      
      // Update both skills and totalActivities
      const classRef = doc(db, 'classes', data.className!);
      await updateDoc(classRef, {
        acquiredSkills: newSkills,
        totalActivities: (classData.totalActivities || 0) + 1,
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Fetch the updated class data to verify the changes
      const updatedClassDoc = await getDoc(classRef);
      console.log('Updated class data:', updatedClassDoc.data());
    }

    return {
      id: docRef.id,
      ...data,
      skillIds: filteredSkills
    } as Documentation;
  } catch (error) {
    console.error('Error adding documentation:', error);
    throw new Error('Failed to add documentation');
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
    const q = query(
      collection(db, COLLECTION_NAME),
      where('className', '==', className),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Documentation[];
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
    
    // Update the documentation
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });

    // If the class name hasn't changed, update the skills for the same class
    if (data.className === originalData.className) {
      const classData = await getClass(data.className!);
      if (classData) {
        // Get all documentations for this class to recalculate skills
        const docs = await getClassDocumentations(data.className!);
        const allSkills = docs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [] as string[]);
        const uniqueSkills = Array.from(new Set(allSkills));
        await updateClassSkills(data.className!, uniqueSkills);
      }
    } else {
      // If the class name has changed, update both classes
      const oldClassData = await getClass(originalData.className);
      const newClassData = await getClass(data.className!);

      if (oldClassData) {
        const oldDocs = await getClassDocumentations(originalData.className);
        const oldSkills = oldDocs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [] as string[]);
        const uniqueOldSkills = Array.from(new Set(oldSkills));
        await updateClassSkills(originalData.className, uniqueOldSkills);
      }

      if (newClassData) {
        const newDocs = await getClassDocumentations(data.className!);
        const newSkills = newDocs.reduce((acc, doc) => [...acc, ...(doc.skillIds || [])], [] as string[]);
        const uniqueNewSkills = Array.from(new Set(newSkills));
        await updateClassSkills(data.className!, uniqueNewSkills);
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