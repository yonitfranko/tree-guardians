// src/components/trees/TreeCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tree } from '@/types/tree';

interface TreeCardProps {
  tree: Tree;
}

const TreeCard: React.FC<TreeCardProps> = ({ tree }) => {
  return (
    <Link href={`/trees/${tree.id}`}>
      <div className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="h-48 relative">
          <Image
            src={tree.image}
            alt={tree.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-bold">צפה בפעילויות</span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-green-600 bg-opacity-80 text-white p-2 text-center">
          <h3 className="text-xl font-semibold">{tree.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default TreeCard;