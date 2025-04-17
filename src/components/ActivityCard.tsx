import React from 'react';
import Link from 'next/link';
import { Activity } from '@/types';
import { DOMAINS } from '@/lib/constants';
import { getDomains } from '@/lib/domainService';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const [domains, setDomains] = React.useState(DOMAINS);
  const [domain, setDomain] = React.useState(domains.find(d => d.id === activity.domain));

  React.useEffect(() => {
    // טעינת תחומי הדעת מ-Firestore
    const loadDomains = async () => {
      try {
        const loadedDomains = await getDomains();
        setDomains([...DOMAINS, ...loadedDomains]);
        setDomain(domains.find(d => d.id === activity.domain));
      } catch (error) {
        console.error('שגיאה בטעינת תחומי הדעת:', error);
      }
    };

    loadDomains();
  }, [activity.domain]);

  return (
    <Link href={`/activities/${activity.id}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{activity.name}</h3>
          {activity.subject && (
            <span className="text-sm bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center">
              {domain?.icon && <span className="ml-1">{domain.icon}</span>}
              {activity.subject}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {activity.gradeLevel}
          </span>
          <div className="flex flex-wrap gap-1 justify-end">
            {activity.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}; 