'use client';

import { CORE_SKILLS, CUSTOM_SKILLS, UNASSIGNED_SKILLS } from '@/lib/constants';
import { useState } from 'react';
import { getClass } from '@/lib/classService';

interface SkillsProgressProps {
  acquiredSkills: string[];
  className: string;
}

interface SkillCategory {
  title: string;
  skills: string[];
}

export default function SkillsProgress({ acquiredSkills, className }: SkillsProgressProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localSkills, setLocalSkills] = useState(acquiredSkills || []);

  // מחשב את אחוז ההתקדמות לכל קטגוריה
  const getCategoryProgress = (categorySkills: string[]) => {
    console.log('Checking skills for category:', categorySkills);
    console.log('Local skills:', localSkills);
    console.log('Original acquired skills:', acquiredSkills);
    
    const acquired = categorySkills.filter(skill => {
      const isAcquired = localSkills.includes(skill);
      console.log(`Skill ${skill}: ${isAcquired ? 'acquired' : 'not acquired'}`);
      return isAcquired;
    });
    
    const progress = {
      count: acquired.length,
      total: categorySkills.length,
      percentage: (acquired.length / categorySkills.length) * 100
    };
    
    console.log('Category progress:', progress);
    return progress;
  };

  // פונקציה לרענון המיומנויות
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      console.log('Refreshing skills for class:', className);
      const classData = await getClass(className);
      console.log('Retrieved class data:', classData);
      if (classData) {
        console.log('Setting local skills:', classData.acquiredSkills);
        setLocalSkills(classData.acquiredSkills || []);
      } else {
        console.log('No class data found');
        setLocalSkills([]);
      }
    } catch (error) {
      console.error('Error refreshing skills:', error);
      alert('שגיאה ברענון המיומנויות');
    } finally {
      setIsRefreshing(false);
    }
  };

  // צבעים וכותרות לכל קטגוריה
  const categoryInfo = {
    THINKING: { color: 'bg-blue-500', title: 'חשיבה' },
    LEARNING: { color: 'bg-green-500', title: 'למידה' },
    PERSONAL: { color: 'bg-purple-500', title: 'אישי' },
    SOCIAL: { color: 'bg-orange-500', title: 'חברתי' },
    OTHER: { color: 'bg-gray-500', title: 'מיומנויות נוספות' }
  };

  // פונקציה עזר לקבלת צבע לקטגוריה
  const getCategoryColor = (category: string) => {
    return categoryInfo[category as keyof typeof categoryInfo]?.color || 'bg-gray-400';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">מיומנויות שנרכשו - {className}</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded-lg text-white ${
            isRefreshing ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRefreshing ? 'מרענן...' : 'רענן מיומנויות'}
        </button>
      </div>
      
      <div className="space-y-6">
        {/* קטגוריות ליבה */}
        {Object.entries(CORE_SKILLS).map(([category, { title, skills }]) => {
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
                      className={`h-full ${getCategoryColor(category)} transition-all`}
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

              {expandedCategory === category && (
                <div className="mt-4 grid gap-2">
                  {skills.map(skill => {
                    const isAcquired = localSkills.includes(skill);
                    return (
                      <div 
                        key={skill}
                        className={`p-2 rounded flex items-center ${
                          isAcquired 
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {isAcquired ? (
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                        <span className="flex-1">{skill}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* קטגוריות מותאמות אישית */}
        {Object.entries(CUSTOM_SKILLS).map(([category, { title, skills }]) => {
          if (skills.length === 0) return null;
          
          const progress = getCategoryProgress(skills);
          return (
            <div key={category} className="border rounded-lg p-4 bg-gray-50">
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
                      className={`h-full ${getCategoryColor(category)} transition-all`}
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

              {expandedCategory === category && (
                <div className="mt-4 grid gap-2">
                  {skills.map(skill => {
                    const isAcquired = localSkills.includes(skill);
                    return (
                      <div 
                        key={skill}
                        className={`p-2 rounded flex items-center ${
                          isAcquired 
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {isAcquired ? (
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                        <span className="flex-1">{skill}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* מיומנויות לא משויכות */}
        {UNASSIGNED_SKILLS.length > 0 && (
          <div className="border rounded-lg p-4 bg-gray-100">
            <h3 className="font-bold text-lg text-gray-600">מיומנויות נוספות</h3>
            <div className="mt-2">
              {UNASSIGNED_SKILLS.map(skill => {
                const isAcquired = localSkills.includes(skill);
                return (
                  <div 
                    key={skill}
                    className={`p-2 rounded flex items-center ${
                      isAcquired 
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {isAcquired ? (
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                    <span className="flex-1">{skill}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
