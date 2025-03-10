'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DocumentationForm from '@/components/documentation/DocumentationForm';

export default function NewDocumentationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('activityId');
  
  // פה אפשר לטעון את פרטי הפעילות מ-Firestore לפי ה-activityId

  const [activities, setActivities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [classes, setClasses] = useState(['א1', 'א2', 'ב1', 'ב2', 'ג1', 'ג2']);

  // טוען נתונים בטעינת העמוד
  useEffect(() => {
    // כאן תוכל לטעון את רשימות הפעילויות והמיומנויות מ-Firestore
    // לדוגמה: fetchActivities(), fetchSkills()
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-800 mb-8">תיעוד חדש</h1>
      
      <DocumentationForm
        initialData={{
          activityId: activityId || '', // שימוש ב-activityId שהועבר כפרמטר
        }}
        onSubmit={(data) => {
          console.log('תיעוד נשמר:', data);
          // כאן תוסיף קוד לשמירת התיעוד ב-Firestore
          
          // ניווט חזרה לדף התיעודים לאחר השמירה
          router.push('/documentation');
        }}
        onCancel={() => router.back()}
        activities={activities}
        skills={skills}
        classes={classes}
      />
    </div>
  );
}