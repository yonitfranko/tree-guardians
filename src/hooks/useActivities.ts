import { useState, useEffect, useCallback } from 'react';
import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy 
  } from 'firebase/firestore';
  import { db } from '@/lib/firebase';
  import { Activity } from '@/types/activity';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // פונקציה לטעינת כל הפעילויות
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const activitiesRef = collection(db, 'activities');
      const q = query(activitiesRef);
      
      const querySnapshot = await getDocs(q);
      const activitiesList: Activity[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Activity, 'id'>;
        activitiesList.push({
          id: doc.id,
          ...data
        });
      });
      
      setActivities(activitiesList);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('שגיאה בטעינת פעילויות. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  }, []);

  // טעינת פעילויות בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    fetchActivities
  };
}