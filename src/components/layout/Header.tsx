'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 relative">
              <Image 
                src="https://i.imgur.com/9kDBUCB.png" 
                alt="המגינים על העצים" 
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">המגינים על העצים</h1>
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
          
          <div className="md:hidden">
            <button className="p-2">☰</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;