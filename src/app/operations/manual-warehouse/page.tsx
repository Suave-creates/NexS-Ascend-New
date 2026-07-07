"use client";

import { useState, useEffect } from 'react';
import { Card, PageHeader, Field, Input, Modal } from '@/components/ui';

export default function PackingPage() {
  const [scanId, setScanId] = useState('');
  const [nexsId, setNexsId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [hourCount, setHourCount] = useState(0);
  const [city, setCity] = useState<string | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  const FORMAT_REGEX = /^CT\d{5}$/;

  /* Hourly stats — backend maps tray → fitting → stationId */
  useEffect(() => {
    if (!scanId) return;

    const fetchStats = async () => {
      const res = await fetch(`/api/manual-warehouse/stats?trayId=${scanId}`);
      if (res.ok) {
        const { count } = await res.json();
        setHourCount(count);
      }
    };

    fetchStats();
    const iv = setInterval(fetchStats, 45_000);
    return () => clearInterval(iv);
  }, [scanId]);

  /* Auto scan */
  useEffect(() => {
    if (!FORMAT_REGEX.test(scanId)) return;

    if (!nexsId.trim()) {
      setMessage('❌ NexS ID cannot be empty.');
      setScanId('');
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    (async () => {
      const res = await fetch('/api/manual-warehouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, nexsId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✔️ Scan recorded.');
        if (data.city) {
          setCity(data.city);
          setShowCityModal(true);
          setTimeout(() => setShowCityModal(false), 3000);
        }
      } else {
        setMessage(`❌ ${data.error}`);
      }

      setScanId('');
      setTimeout(() => setMessage(null), 2000);
    })();
  }, [scanId, nexsId]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/manual-warehouse-bg.png')" }}
    >
      <Card variant="floating" className="w-full max-w-md p-6">

        <PageHeader title="Manual Warehouse Scan" />

        {message && (
          <div className="mb-3 text-center text-sm text-gray-900">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <Field label="Scan ID">
            <Input
              value={scanId}
              onChange={e => setScanId(e.target.value.toUpperCase())}
              placeholder="CT + 5 digits"
            />
          </Field>

          <Field label="NexS ID">
            <Input
              value={nexsId}
              onChange={e => setNexsId(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Last 1 hr scans: <strong>{hourCount}</strong>
        </div>

        <Modal open={showCityModal && !!city} onClose={() => setShowCityModal(false)} size="sm" className="text-center">
          <h3 className="text-lg font-bold text-brand-700">
            Destination City
          </h3>
          <p className="text-xl mt-2 text-gray-900">{city}</p>
        </Modal>
      </Card>
    </div>
  );
}
