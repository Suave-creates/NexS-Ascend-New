'use client';

import { useAuth } from '@/lib/authClient';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-1.5 rounded-full bg-brand-700" aria-hidden="true" />
        <h1 className="text-lg font-semibold tracking-tight text-brand-700">NexS Ascend</h1>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated && user && (
          <>
            <span className="text-xs font-medium text-gray-500">
              {user.employeeCode}{user.accountType === 'SUPER_ADMIN' ? ' - Super Admin' : ''}
            </span>
            <button
              onClick={logout}
              className="text-xs font-medium text-gray-400 hover:text-brand-700"
            >
              Log out
            </button>
          </>
        )}
        <span className="text-xs font-medium text-gray-400">Crafted by: K_ARYA</span>
      </div>
    </header>
  );
}
