import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'חצר פעילה',
  description: 'מערכת לניהול פעילויות בחצר בית הספר',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>
        <Navbar />
        <main>
          <nav className="flex items-center gap-12 p-4 bg-gray-50 border-b">
            <Link href="/" className="text-green-700 hover:text-green-900">
              דף הבית
            </Link>
            <Link href="/activities" className="text-green-700 hover:text-green-900">
              כל הפעילויות
            </Link>
            <Link href="/classes" className="text-green-700 hover:text-green-900">
              כיתות
            </Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}