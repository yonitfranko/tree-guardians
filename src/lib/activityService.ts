// src/lib/activityService.ts
import { 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy 
  } from "firebase/firestore";
  import { db } from "@/lib/firebase";
  import { Activity } from "@/types";
  import { api } from './api';
  
  // קבלת כל הפעילויות
  export async function getAllActivities(): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, "activities");
      const q = query(activitiesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Activity, "id">
      }));
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  }
  
  // קבלת פעילות לפי מזהה
  export async function getActivityById(id: string): Promise<Activity | null> {
    try {
      const activityRef = doc(db, 'activities', id);
      const activityDoc = await getDoc(activityRef);
      
      if (!activityDoc.exists()) {
        return null;
      }
      
      return { id: activityDoc.id, ...activityDoc.data() } as Activity;
    } catch (error) {
      console.error('שגיאה בטעינת פעילות:', error);
      return null;
    }
  }
  
  // קבלת פעילויות לפי עץ
  export async function getActivitiesByTree(treeId: string): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, "activities");
      const q = query(
        activitiesRef, 
        where("treeIds", "array-contains", treeId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Activity, "id">
      }));
    } catch (error) {
      console.error(`Error fetching activities for tree ${treeId}:`, error);
      throw error;
    }
  }
  
  // הוספת פעילות חדשה
  export async function addActivity(activityData: Omit<Activity, "id">): Promise<Activity> {
    try {
      const timestamp = new Date();
      const dataWithTimestamp = {
        ...activityData,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const docRef = await addDoc(collection(db, "activities"), dataWithTimestamp);
      
      return {
        id: docRef.id,
        ...dataWithTimestamp
      };
    } catch (error) {
      console.error("Error adding activity:", error);
      throw error;
    }
  }
  
  // עדכון פעילות קיימת
  export async function updateActivity(id: string, activityData: Partial<Activity>): Promise<void> {
    try {
      const activityRef = doc(db, "activities", id);
      
      const updateData = {
        ...activityData,
        updatedAt: new Date()
      };
      
      await updateDoc(activityRef, updateData);
    } catch (error) {
      console.error(`Error updating activity with ID ${id}:`, error);
      throw error;
    }
  }
  
  // מחיקת פעילות
  export async function deleteActivity(id: string): Promise<boolean> {
    try {
      const activityRef = doc(db, 'activities', id);
      
      // בדיקה שהפעילות קיימת לפני המחיקה
      const activityDoc = await getDoc(activityRef);
      if (!activityDoc.exists()) {
        console.error('הפעילות לא נמצאה');
        return false;
      }
      
      // מחיקת הפעילות
      await deleteDoc(activityRef);
      console.log('הפעילות נמחקה בהצלחה');
      return true;
    } catch (error) {
      console.error('שגיאה במחיקת הפעילות:', error);
      return false;
    }
  }

  export async function getActivities(): Promise<Activity[]> {
    // נוריד את ה-try-catch כרגע כדי לראות שגיאות אם יש
    const activitiesRef = collection(db, 'activities');
    const snapshot = await getDocs(activitiesRef);
    
    // נדפיס את הנתונים הגולמיים
    console.log('Raw Firestore data:', {
      collectionRef: activitiesRef,
      snapshotSize: snapshot.size,
      documents: snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }))
    });

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Activity));
  }

  export async function getActivitiesByTreeId(treeId: string): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, 'activities');
      const q = query(activitiesRef, where('treeType', '==', treeId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
    } catch (error) {
      console.error('שגיאה בטעינת פעילויות לפי עץ:', error);
      return [];
    }
  }