'use client';

import { useState, useEffect } from 'react';
import { Card, PageHeader, Field, Input, Alert } from '@/components/ui';

export default function ManualWarehouseValidatePage() {
  const [pid, setPid] = useState('');
  const [expectedLocation, setExpectedLocation] = useState<string | null>(null);
  const [pkg, setPkg] = useState<string | null>(null);

  const [scanLocation, setScanLocation] = useState('');
  const [status, setStatus] = useState<'correct' | 'wrong' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Auto-fetch PID details after 400 ms debounce
  useEffect(() => {
    if (!pid.trim()) {
      setExpectedLocation(null);
      setPkg(null);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setError(null);
      setExpectedLocation(null);
      setPkg(null);
      setStatus(null);

      const res = await fetch('/api/manual-warehouse/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pid }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setExpectedLocation(data.location);
        setPkg(data.package);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [pid]);

  // ✅ Session-based validation
  useEffect(() => {
    if (!expectedLocation || !scanLocation) return;

    setStatus(scanLocation === expectedLocation ? 'correct' : 'wrong');

    const timer = setTimeout(() => {
      setScanLocation('');
      setStatus(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [scanLocation, expectedLocation]);

  return (
    <div
      className="relative flex min-h-full items-center justify-center"
      style={{
        backgroundImage: "url('/images/mwh-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card variant="floating" className="relative z-10 w-full max-w-md p-6">
        {/* Header */}
        <PageHeader title="PID Location Validator" />

        {/* PID Input */}
        <div className="mt-4">
          <Field label="PID">
            <Input
              type="text"
              value={pid}
              onChange={e => setPid(e.target.value.toUpperCase())}
              placeholder="Scan / Enter PID"
              autoFocus
            />
          </Field>
        </div>

        {/* Error */}
        {error && (
          <Alert tone="error" className="mt-3">
            {error}
          </Alert>
        )}

        {/* Visibility Section */}
        {expectedLocation && (
          <div className="mt-6 space-y-2 text-gray-900">
            <div className="text-base">
              <strong>Expected Location:</strong>{' '}
              <span className="ml-1 text-lg font-bold text-danger-600">
                {expectedLocation}
              </span>
            </div>
            <div className="text-base">
              <strong>Package:</strong>{' '}
              <span className="ml-1 text-lg font-bold text-brand-700">
                {pkg}
              </span>
            </div>
          </div>
        )}

        {/* Location Scan */}
        {expectedLocation && (
          <div className="mt-6">
            <Field label="Location">
              <Input
                type="text"
                value={scanLocation}
                onChange={e => setScanLocation(e.target.value.toUpperCase())}
                placeholder="Scan Location Barcode"
                autoFocus
              />
            </Field>
          </div>
        )}

        {/* Validation Popups */}
        {status === 'correct' && (
          <Alert tone="success" className="mt-4 text-center font-semibold">
            ✅ Correct Location
          </Alert>
        )}

        {status === 'wrong' && (
          <Alert tone="error" className="mt-4 text-center font-semibold">
            ❌ Incorrect Location
          </Alert>
        )}
      </Card>
    </div>
  );
}
