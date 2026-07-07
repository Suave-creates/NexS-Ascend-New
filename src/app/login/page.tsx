'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Field, Input, Button, Alert } from '@/components/ui';

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
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          <h1 className="text-center text-2xl font-bold text-brand-700">NexS Login</h1>

          {error && (
            <Alert tone="error" className="text-center">
              {error}
            </Alert>
          )}

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
