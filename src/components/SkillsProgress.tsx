'use client';

import { SKILLS } from '@/lib/constants';
import { useState } from 'react';

interface SkillsProgressProps {
  acquiredSkills: string[];
  className: string;
}

export default function SkillsProgress({ acquiredSkills, className }: SkillsProgressProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // מחשב את אחוז ההתקדמות לכל קטגוריה
  const getCategoryProgress = (categorySkills: string[]) => {
    const acquired = categorySkills.filter(skill => acquiredSkills.includes(skill));
    return {
      count: acquired.length,
      total: categorySkills.length,
      percentage: (acquired.length / categorySkills.length) * 100
    };
  };

  // צבעים לכל קטגוריה
  const categoryColors = {
    THINKING: 'bg-blue-500',
    LEARNING: 'bg-green-500',
    PERSONAL: 'bg-purple-500',
    SOCIAL: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">מיומנויות שנרכשו - {className}</h2>
      
      <div className="space-y-6">
        {Object.entries(SKILLS).map(([category, { title, skills }]) => {
          const progress = getCategoryProgress(skills);
          
          return (
            <div key={category} className="border rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
              >
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <span className="text-gray-600">
                      {progress.count} מתוך {progress.total}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${categoryColors[category as keyof typeof categoryColors]} transition-all`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
                <svg 
                  className={`w-6 h-6 ml-2 transform transition-transform ${expandedCategory === category ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* רשימת המיומנויות המפורטת */}
              {expandedCategory === category && (
                <div className="mt-4 grid gap-2">
                  {skills.map(skill => (
                    <div 
                      key={skill}
                      className={`p-2 rounded flex items-center ${
                        acquiredSkills.includes(skill) 
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {acquiredSkills.includes(skill) ? (
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
