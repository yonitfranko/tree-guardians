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
  import { Activity } from "@/types/activity";
  
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
      const docRef = doc(db, "activities", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data() as Omit<Activity, "id">
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching activity with ID ${id}:`, error);
      throw error;
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
  export async function deleteActivity(id: string): Promise<void> {
    try {
      const activityRef = doc(db, "activities", id);
      await deleteDoc(activityRef);
    } catch (error) {
      console.error(`Error deleting activity with ID ${id}:`, error);
      throw error;
    }
  }