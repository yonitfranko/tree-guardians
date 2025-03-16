'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-green-700' : '';
  };

  return (
    <nav className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* לוגו ושם האפליקציה */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 6l9-4 9 4v12l-9 4-9-4V6z" />
            </svg>
            חצר פעילה
          </Link>

          {/* תפריט ניווט */}
          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/')}`}
            >
              העצים שלנו
            </Link>
            <Link 
              href="/classes"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/classes')}`}
            >
              כיתות
            </Link>
            <Link 
              href="/activities/new"
              className="bg-white text-green-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              פעילות חדשה +
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
