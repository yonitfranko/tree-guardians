import { useState, useEffect } from 'react';
import { Activity } from '@/types';
import { getActivities } from '@/lib/activityService';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const fetchedActivities = await getActivities();
        setActivities(fetchedActivities);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('שגיאה בטעינת הפעילויות');
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return { activities, loading, error };
}