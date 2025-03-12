'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md py-2' 
            : 'bg-gradient-to-r from-green-50 to-green-100 py-3'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 hover:bg-green-100 text-gray-700 rounded-full transition-colors" 
                onClick={toggleSidebar}
                aria-label="פתח תפריט"
              >
                ☰
              </button>
              <div className="w-10 h-10 relative">
                <Image 
                  src="https://i.imgur.com/9kDBUCB.png" 
                  alt="המגינים על העצים" 
                  width={40}
                  height={40}
                  className={`object-contain transition-transform duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}
                />
              </div>
              <div className="flex flex-col">
                <h1 className={`font-bold transition-all duration-300 text-green-700 drop-shadow-sm ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                  המגינים על העצים
                </h1>
                {!isScrolled && <p className="text-xs text-gray-600 hidden sm:block">מגינים על העצים, מחנכים לעתיד</p>}
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-green-700 transition relative group py-2">
                בית
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/trees" className="text-gray-700 hover:text-green-700 transition relative group py-2">
                עצים
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/activities" className="text-gray-700 hover:text-green-700 transition relative group py-2">
                פעילויות
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/skills" className="text-gray-700 hover:text-green-700 transition relative group py-2">
                מיומנויות
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/documentation" className="text-gray-700 hover:text-green-700 transition relative group py-2">
                תיעוד
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ספייסר כדי שהתוכן לא יוסתר מתחת לכותרת הקבועה */}
      <div className="h-16 md:h-20"></div>

      {/* Sidebar for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm" onClick={toggleSidebar}>
          <div 
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Image 
                    src="https://i.imgur.com/9kDBUCB.png" 
                    alt="לוגו" 
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <h2 className="text-xl font-bold text-green-700">תפריט</h2>
                </div>
                <button 
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={toggleSidebar}
                  aria-label="סגור תפריט"
                >
                  ✕
                </button>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/" 
                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                    onClick={toggleSidebar}
                  >
                    <span className="mr-3">🏠</span>
                    בית
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/trees" 
                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                    onClick={toggleSidebar}
                  >
                    <span className="mr-3">🌳</span>
                    עצים
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/activities" 
                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                    onClick={toggleSidebar}
                  >
                    <span className="mr-3">📚</span>
                    פעילויות
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/skills" 
                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                    onClick={toggleSidebar}
                  >
                    <span className="mr-3">🧠</span>
                    מיומנויות
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/documentation" 
                    className="flex items-center py-3 px-4 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                    onClick={toggleSidebar}
                  >
                    <span className="mr-3">📝</span>
                    תיעוד
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;