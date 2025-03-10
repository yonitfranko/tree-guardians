'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DocumentationForm from '@/components/documentation/DocumentationForm';

// Component that uses useSearchParams
function NewDocumentationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('activityId');
  
  const [activities, setActivities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [classes, setClasses] = useState(['א1', 'א2', 'ב1', 'ב2', 'ג1', 'ג2']);

  // Rest of your component logic

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-800 mb-8">תיעוד חדש</h1>
      
      <DocumentationForm
        initialData={{
          activityId: activityId || '',
        }}
        onSubmit={(data) => {
          console.log('תיעוד נשמר:', data);
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

// Main page component with Suspense
export default function NewDocumentationPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">טוען...</div>}>
      <NewDocumentationContent />
    </Suspense>
  );
}