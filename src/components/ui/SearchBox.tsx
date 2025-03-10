'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  type: 'activity' | 'tree' | 'skill';
  name: string;
  category?: string;
  link: string;
}

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ 
  placeholder = "חיפוש...",
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // מוק לתוצאות חיפוש - יוחלף בחיפוש אמיתי בהמשך
  const mockSearch = (term: string): SearchResult[] => {
    if (!term || term.length < 2) return [];
    
    // תוצאות לצורך הדגמה בלבד
    // וודא שהערכים של type הם בדיוק "activity", "tree", או "skill"
    return [
        { id: '1', type: 'activity' as const, name: 'זיהוי עלים', category: 'מדעים', link: '/activities/act1' },
        { id: '2', type: 'activity' as const, name: 'חישוב גובה העץ', category: 'מתמטיקה', link: '/activities/act2' },
        { id: '3', type: 'tree' as const, name: 'עץ אלון', link: '/trees/oak' },
        { id: '4', type: 'tree' as const, name: 'עץ אורן', link: '/trees/pine' },
        { id: '5', type: 'skill' as const, name: 'תצפית', category: 'מדעים', link: '/skills#observation' }
      ].filter(item => 
        item.name.includes(term) || 
        (item.category && item.category.includes(term))
      );
    };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      const results = mockSearch(searchTerm);
      setResults(results);
      setIsOpen(true);
      if (onSearch) onSearch(searchTerm);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchTerm, onSearch]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <ul className="py-1">
            {results.map((result) => (
              <li key={`${result.type}-${result.id}`}>
                <Link href={result.link}>
                  <div className="px-4 py-2 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{result.name}</span>
                      {result.category && (
                        <span className="mr-2 text-sm text-gray-500">({result.category})</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {result.type === 'activity' ? 'פעילות' : 
                       result.type === 'tree' ? 'עץ' : 'מיומנות'}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBox;