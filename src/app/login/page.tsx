'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, PageHeader, Field, Input, Button, Alert } from '@/components/ui';

export default function LoginPage() {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeCode, password }),
    });

    if (res.ok) {
      // Login succeeded—send user to dashboard
      router.push('/dashboard');
    } else {
      // Login failed—show error message
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div
      className="relative flex min-h-full items-center justify-center"
      style={{
        backgroundImage: "url('/images/home-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-brand-900/40" />

      <Card variant="floating" className="relative z-10 w-full max-w-md p-6">
        <PageHeader title="NexS Login" subtitle="Sign in to continue" />

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error && <Alert tone="error">{error}</Alert>}

          <Field label="Employee Code">
            <Input
              type="text"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="Enter your code"
              required
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
