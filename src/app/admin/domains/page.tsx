'use client';

import React, { useState, useEffect } from 'react';
import { getDomains } from '@/lib/domainService';
import { Domain, DOMAINS } from '@/lib/constants';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>(DOMAINS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const fetchedDomains = await getDomains();
        setDomains(fetchedDomains.length > 0 ? fetchedDomains : DOMAINS);
        setError(null);
      } catch (err) {
        console.error('Error fetching domains:', err);
        setError('שגיאה בטעינת הדומיינים');
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">טוען...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <p className="text-sm mt-2">משתמש בדומיינים ברירת מחדל</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-right">ניהול דומיינים</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <div key={domain.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{domain.icon}</span>
              <h2 className="text-xl font-semibold">{domain.name}</h2>
            </div>
            {domain.description && (
              <p className="text-gray-600 text-right">{domain.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 