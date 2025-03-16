// src/lib/treeService.ts
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tree } from '@/types';
import { addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { api } from './api';

export async function getTrees(): Promise<Tree[]> {
  return api.trees.getAll();
}

export async function getTreeById(id: string): Promise<Tree | null> {
  try {
    return await api.trees.getById(id);
  } catch (error) {
    console.error('Error fetching tree:', error);
    return null;
  }
}

// הוספת עץ חדש
export async function addTree(treeData: Omit<Tree, "id">): Promise<Tree | null> {
    try {
      const timestamp = new Date();
      const dataWithTimestamp = {
        ...treeData,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const docRef = await addDoc(collection(db, "trees"), dataWithTimestamp);
      
      return {
        id: docRef.id,
        ...dataWithTimestamp
      };
    } catch (error) {
      console.error("Error adding tree:", error);
      return null;
    }
  }
  
  // עדכון עץ קיים
  export async function updateTree(id: string, treeData: Partial<Tree>): Promise<boolean> {
    try {
      const treeRef = doc(db, "trees", id);
      
      const updateData = {
        ...treeData,
        updatedAt: new Date()
      };
      
      await updateDoc(treeRef, updateData);
      return true;
    } catch (error) {
      console.error(`Error updating tree with ID ${id}:`, error);
      return false;
    }
  }
  
  // מחיקת עץ
  export async function deleteTree(id: string): Promise<boolean> {
    try {
      const treeRef = doc(db, "trees", id);
      await deleteDoc(treeRef);
      return true;
    } catch (error) {
      console.error(`Error deleting tree with ID ${id}:`, error);
      return false;
    }
  }