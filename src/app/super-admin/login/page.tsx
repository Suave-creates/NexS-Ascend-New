'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiLock, FiShield, FiUser } from 'react-icons/fi';
import { Alert, Button } from '@/components/ui';
import { useAuth } from '@/lib/authClient';

export default function SuperAdminLoginPage() {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { adminLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await adminLogin(employeeCode, password);
    if (result.ok) {
      router.push('/super-admin/approvals');
    } else {
      setError(result.error || 'Super-admin login failed');
    }
    setSubmitting(false);
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover px-6 py-12"
      style={{ backgroundImage: 'url(/images/home-bg.png)', backgroundPosition: 'center 70%' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-brand-900/90 to-brand-900/75" />
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm sm:p-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <FiShield className="h-6 w-6" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">Super Admin</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to review account requests.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && <Alert tone="error">{error}</Alert>}

          <label className="block space-y-1.5 text-sm font-medium text-gray-700">
            <span>Employee Code</span>
            <span className="relative block">
              <FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={employeeCode}
                onChange={(event) => setEmployeeCode(event.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                autoComplete="username"
                autoFocus
                required
              />
            </span>
          </label>

          <label className="block space-y-1.5 text-sm font-medium text-gray-700">
            <span>Password</span>
            <span className="relative block">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                autoComplete="current-password"
                required
              />
            </span>
          </label>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : <>Open Approval Panel <FiArrowRight /></>}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Return to operator sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
