'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiUser, FiLock, FiArrowRight, FiClock } from 'react-icons/fi';
import { Button, Alert } from '@/components/ui';
import { useAuth } from '@/lib/authClient';

export default function SignupPage() {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const result = await signup(employeeCode, password);

    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Signup failed');
    }
    setSubmitting(false);
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover px-6 py-12"
      style={{ backgroundImage: 'url(/images/home-bg.png)', backgroundPosition: 'center 70%' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-brand-900/85 to-brand-900/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-transparent to-transparent" />

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 lg:grid-cols-2">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between bg-white/5 p-10 backdrop-blur-md lg:flex">
          <div>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ring-1 ring-white/25">
              Warehouse Operations Suite
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] text-white">
              <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                NexS Ascend
              </span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Create your operator account to start scanning — every action on the floor is
              tracked under your own employee code, not a shared station login.
            </p>
          </div>
          <div className="flex gap-8">
            {[{ n: '11', l: 'modules' }, { n: '1', l: 'unified console' }, { n: '24/7', l: 'floor-ready' }].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-white">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-white/50">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center bg-white/95 p-8 backdrop-blur-sm sm:p-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex items-center gap-2.5 lg:hidden">
              <span className="h-6 w-1.5 rounded-full bg-brand-700" aria-hidden="true" />
              <span className="text-lg font-bold tracking-tight text-brand-700">NexS Ascend</span>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <FiClock className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
                  Approval pending
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Your request was sent to a super admin. You can sign in after the account is
                  approved.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex font-semibold text-brand-700 hover:text-brand-800"
                >
                  Return to sign in
                </Link>
              </div>
            ) : (
              <>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 lg:mt-0">Request an account</h2>
            <p className="mt-1 text-sm text-gray-500">A super admin must approve your request.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && <Alert tone="error">{error}</Alert>}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Employee Code</label>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    placeholder="Enter your employee code"
                    autoComplete="username"
                    autoFocus
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full justify-center" disabled={submitting}>
                {submitting ? 'Sending request…' : (
                  <>
                    Request Account <FiArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                Sign in
              </Link>
            </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
