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
        <div className="flex items-center mb-2">
          {domain && (
            <span className="text-2xl mr-2">{domain.icon}</span>
          )}
          <h3 className="text-lg font-semibold">{activity.name}</h3>
        </div>
        <p className="text-gray-600 text-sm">{activity.description}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {activity.skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}; 