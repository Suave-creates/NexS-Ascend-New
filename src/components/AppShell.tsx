'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { RequireAuth } from '@/lib/authClient';

// Auth pages are a standalone, full-screen experience — no sidebar/header
// chrome around a login form. Every other route gets the normal app shell.
const STANDALONE_PATHS = new Set(['/login', '/signup', '/super-admin/login']);

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (STANDALONE_PATHS.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <RequireAuth>{children}</RequireAuth>
        </main>
      </div>
    </>
  );
}
