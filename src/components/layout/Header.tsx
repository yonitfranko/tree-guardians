'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2" 
                onClick={toggleSidebar}
                aria-label="פתח תפריט"
              >
                ☰
              </button>
              <div className="w-10 h-10 relative">
                <Image 
                  src="/images/logo.png" 
                  alt="המגינים על העצים" 
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold">המגינים על העצים</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-green-200 transition">
                בית
              </Link>
              <Link href="/trees" className="hover:text-green-200 transition">
                עצים
              </Link>
              <Link href="/activities" className="hover:text-green-200 transition">
                פעילויות
              </Link>
              <Link href="/skills" className="hover:text-green-200 transition">
                מיומנויות
              </Link>
              <Link href="/documentation" className="hover:text-green-200 transition">
                תיעוד
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Sidebar for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleSidebar}>
          <div 
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-green-800">תפריט</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={toggleSidebar}
                >
                  ✕
                </button>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/" 
                    className="block py-2 px-4 text-gray-800 hover:bg-green-100 rounded-lg"
                    onClick={toggleSidebar}
                  >
                    בית
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/trees" 
                    className="block py-2 px-4 text-gray-800 hover:bg-green-100 rounded-lg"
                    onClick={toggleSidebar}
                  >
                    עצים
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/activities" 
                    className="block py-2 px-4 text-gray-800 hover:bg-green-100 rounded-lg"
                    onClick={toggleSidebar}
                  >
                    פעילויות
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/skills" 
                    className="block py-2 px-4 text-gray-800 hover:bg-green-100 rounded-lg"
                    onClick={toggleSidebar}
                  >
                    מיומנויות
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/documentation" 
                    className="block py-2 px-4 text-gray-800 hover:bg-green-100 rounded-lg"
                    onClick={toggleSidebar}
                  >
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