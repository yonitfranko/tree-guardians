// src/app/activities/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ActivityForm from '@/components/activities/ActivityForm';
import { Activity } from '@/types/activity';
import { getAllActivities } from '@/lib/activityService';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getAllActivities();
        setActivities(data);
      } catch (err) {
        console.error("Error loading activities:", err);
        setError("שגיאה בטעינת פעילויות. נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">פעילויות פדגוגיות</h1>
        <button 
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
          onClick={() => setShowForm(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          פעילות חדשה
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">טוען פעילויות...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">אין פעילויות להצגה</p>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
            onClick={() => setShowForm(true)}
          >
            הוסף פעילות ראשונה
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Link key={activity.id} href={`/activities/${activity.id}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow h-full">
                <div className="h-48 bg-green-100 relative">
                {activity.image ? (
  <Image 
    src={activity.image}  // שימוש במשתנה הנכון
    alt={activity.name || "תמונת פעילות"} 
    width={100} 
    height={100} 
    className="w-full h-full object-cover" 
  />
) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">🌳</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-green-800">{activity.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {activity.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{activity.summary || activity.description.substring(0, 100) + '...'}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-500 text-sm">כיתות {activity.ageGroup}</span>
                    {activity.favorite && (
                      <span className="text-yellow-500">★</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* טופס יצירת פעילות חדשה */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">פעילות חדשה</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <ActivityForm 
              onSubmit={async (data) => {
                try {
                  // כאן יהיה קוד לשמירה ב-Firestore
                  console.log('נתוני פעילות לשמירה:', data);
                  // הוספת הפעילות החדשה לרשימה
                  // setActivities(prev => [newActivity, ...prev]);
                  setShowForm(false);
                } catch (err) {
                  console.error('Error saving activity:', err);
                  alert('שגיאה בשמירת הפעילות. נסה שוב מאוחר יותר.');
                }
              }}
              onCancel={() => setShowForm(false)}
              trees={[]}  // כאן יהיו עצים מ-Firestore
              skills={[]} // כאן יהיו מיומנויות מ-Firestore
            />
          </div>
        </div>
      )}
    </div>
  );
}