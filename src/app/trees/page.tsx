// src/app/trees/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllTrees } from '@/lib/treeService';
import { Tree } from '@/types/tree';

export default function TreesPage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTrees = async () => {
      try {
        setLoading(true);
        const data = await getAllTrees();
        setTrees(data);
      } catch (err) {
        console.error("Error loading trees:", err);
        setError("שגיאה בטעינת העצים. נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrees();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">עצים</h1>
      <div className="w-24 h-1 bg-green-500 mx-auto mb-10 rounded-full"></div>
      
      {loading ? (
        <div className="text-center py-8">טוען עצים...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : trees.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">אין עצים להצגה</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <Link key={tree.id} href={`/trees/${tree.id}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow h-full overflow-hidden">
                <div className="h-48 bg-green-100 relative">
                  {tree.image ? (
                  <Image 
                  src={tree.image} 
                  alt={tree.name} 
                  width={500} 
                  height={300} 
                  className="w-full h-full object-cover" 
                />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">🌳</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-2">{tree.name}</h3>
                  <p className="text-gray-600">{tree.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}