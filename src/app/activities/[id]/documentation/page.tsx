import { Activity } from '@/types/activity';

interface Documentation {
  id: string;
  title: string;
  description: string;
  date: string;
  images?: string[];
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const documentations: Documentation[] = [
    {
      id: '1',
      title: 'תיעוד ראשון',
      description: 'תיאור של התיעוד הראשון',
      date: '2024-03-20',
      images: ['/images/doc1.jpg', '/images/doc2.jpg']
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">תיעוד הפעילות</h1>
      <div className="space-y-4">
        {documentations.map((doc) => (
          <div key={doc.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{doc.title}</h2>
            <p className="text-gray-600 mt-2">{doc.description}</p>
            <p className="text-sm text-gray-500 mt-1">{doc.date}</p>
            {doc.images && doc.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {doc.images.map((img: string, index: number) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`תמונה ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}