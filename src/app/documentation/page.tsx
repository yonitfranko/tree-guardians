'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DocumentationForm from '@/components/documentation/DocumentationForm';
import { getDocumentations } from '@/lib/documentationService';
import { getActivities } from '@/lib/activityService';
import { GRADE_LEVELS } from '@/lib/constants';
import Image from 'next/image';

// נתוני תיעוד לדוגמה
const mockDocumentations = [
  {
    id: 'doc1',
    title: 'פעילות זיהוי עלים - כיתה ב2',
    description: 'במהלך הפעילות התלמידים אספו ומיינו עלים מסוגים שונים, ולמדו על מבנה העלה ותפקידיו.',
    className: 'ב2',
    date: '2023-11-10',
    activityId: 'act1',
    activityName: 'זיהוי עלים',
    images: ['/images/doc1-1.jpg', '/images/doc1-2.jpg'],
    skills: ['observation', 'classification']
  },
  {
    id: 'doc2',
    title: 'מדידת גובה עצים - כיתה ה1',
    description: 'התלמידים יצאו לחצר בית הספר ומדדו את גובהם של העצים השונים באמצעות שיטת הצל.',
    className: 'ה1',
    date: '2023-11-15',
    activityId: 'act2',
    activityName: 'חישוב גובה העץ',
    images: ['/images/doc2-1.jpg'],
    skills: ['measurement', 'calculation']
  },
  {
    id: 'doc3',
    title: 'ציור נוף בגינה - כיתה ג3',
    description: 'התלמידים ציירו את הנוף והעצים בגינת בית הספר, תוך התמקדות במבנה העצים השונים.',
    className: 'ג3',
    date: '2023-11-20',
    activityId: 'act3',
    activityName: 'ציור נוף',
    images: ['/images/doc3-1.jpg', '/images/doc3-2.jpg', '/images/doc3-3.jpg'],
    skills: ['creativity']
  }
];

export default async function DocumentationPage() {
  const documentations = await getDocumentations();
  const activities = await getActivities();

  // מיון התיעודים לפי תאריך מהחדש לישן
  const sortedDocumentations = documentations.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">תיעוד פעילויות</h1>
        <Link
          href="/documentation/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          תיעוד חדש
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDocumentations.map((doc) => {
          const activity = activities.find(a => a.id === doc.activityId);
          
          return (
            <div key={doc.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {doc.images && doc.images.length > 0 && (
                <div className="relative h-48">
                  <Image
                    src={doc.images[0]}
                    alt={doc.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">
                    {doc.title}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {new Date(doc.date).toLocaleDateString('he-IL')}
                  </span>
                </div>

                <div className="text-gray-600 mb-4">
                  <p><strong>כיתה:</strong> {doc.className}</p>
                  <p><strong>מורה:</strong> {doc.teacherName}</p>
                  {activity && activity.name !== doc.title && (
                    <p><strong>פעילות:</strong> {activity.name}</p>
                  )}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{doc.description}</p>

                {doc.skillIds && doc.skillIds.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2">מיומנויות שנרכשו:</h3>
                    <div className="flex flex-wrap gap-2">
                      {doc.skillIds.map((skillId) => (
                        <span
                          key={skillId}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {skillId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Link
                    href={`/documentation/${doc.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    צפה בפרטים מלאים
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}