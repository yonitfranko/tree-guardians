'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function DocumentationList() {
  const params = useParams();

  // כאן יבוא הקוד לטעינת התיעודים מ-Firebase
  const documentations = [
    // דוגמה לנתונים
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">תיעודי פעילות</h1>
          <Link
            href={`/activities/${params.id}/documentation/new`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            תיעוד חדש
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentations.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl">{doc.title}</h3>
                <span className="text-sm text-gray-500">{doc.date}</span>
              </div>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              {doc.images && doc.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {doc.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`תמונה ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}