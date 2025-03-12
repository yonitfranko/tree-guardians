import { Metadata } from 'next';

interface Documentation {
  id: string;
  title: string;
  description: string;
  date: string;
}

export const metadata: Metadata = {
  title: 'תיעודי פעילות',
  description: 'תיעודי פעילויות בפרויקט המגינים על העצים'
};

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const documentations: Documentation[] = [
    {
      id: '1',
      title: 'פעילות מדידה - כיתה ג1',
      description: 'התלמידים מדדו את היקף העץ ויצרו גרף השוואתי',
      date: '2024-03-15'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-green-800 mb-8">תיעודי פעילות</h1>
        <div className="grid gap-6">
          {documentations.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-green-800 mb-2">{doc.title}</h2>
              <p className="text-gray-600 mb-4">{doc.description}</p>
              <div className="text-sm text-gray-500">{doc.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}