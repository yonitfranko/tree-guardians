'use client';

import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <Image 
              src="https://i.imgur.com/9kDBUCB.png" 
              alt="המגינים על העצים" 
              width={24}
              height={24}
              className="object-contain mr-2"
            />
            <span className="text-sm text-green-700 font-medium">המגינים על העצים</span>
          </div>
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} כל הזכויות שמורות</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;