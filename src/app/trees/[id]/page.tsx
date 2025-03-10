'use client';

import React from 'react';
import Link from 'next/link';

// נתוני עצים לדוגמה
const mockTrees = [
  {
    id: 'oak',
    name: 'עץ אלון',
    description: 'עץ האלון הוא אחד מהעצים החזקים והעמידים ביותר בטבע.',
    image: '/images/oak-tree.jpg'
  },
  {
    id: 'pine',
    name: 'עץ אורן',
    description: 'עץ האורן הוא עץ מחטני נפוץ בישראל.',
    image: '/images/pine-tree.jpg'
  },
  {
    id: 'olive',
    name: 'עץ זית',
    description: 'עץ הזית הוא עץ עתיק ובעל משמעות היסטורית ותרבותית.',
    image: '/images/olive-tree.jpg'
  },
  {
    id: 'eucalyptus',
    name: 'עץ איקליפטוס',
    description: 'עץ האיקליפטוס מקורו באוסטרליה והוא גבוה ומרשים.',
    image: '/images/eucalyptus-tree.jpg'
  },
  {
    id: 'fig',
    name: 'עץ תאנה',
    description: 'עץ התאנה מפורסם בפירותיו המתוקים ובעליו הגדולים.',
    image: '/images/fig-tree.jpg'
  },
  {
    id: 'citrus',
    name: 'עץ הדר',
    description: 'עצי הדר כוללים תפוזים, לימונים ואשכוליות.',
    image: '/images/citrus-tree.jpg'
  }
];

export default function TreesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">עצים</h1>
      <div className="w-24 h-1 bg-green-500 mx-auto mb-10 rounded-full"></div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTrees.map((tree) => (
          <Link key={tree.id} href={`/trees/${tree.id}`}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow h-full overflow-hidden">
              <div className="h-48 bg-green-100 relative">
                {/* במקום התמונה האמיתית */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">🌳</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800 mb-2">{tree.name}</h3>
                <p className="text-gray-600">{tree.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}