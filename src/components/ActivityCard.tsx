import Link from 'next/link';
import { Activity } from '@/types';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link href={`/activities/${activity.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold text-green-800 mb-2">{activity.name}</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span className="px-2 py-1 bg-green-100 rounded">{activity.subject}</span>
          <span>•</span>
          <span>{activity.duration}</span>
          <span>•</span>
          <span>{activity.gradeLevel}</span>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">{activity.description}</p>
        
        {activity.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">מיומנויות:</h4>
            <div className="flex flex-wrap gap-2">
              {activity.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
} 