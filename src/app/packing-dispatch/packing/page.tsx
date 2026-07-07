"use client";

import { useState, useEffect } from 'react';
import { Card, PageHeader, Field, Input, Select, Button, Modal, StatCard, Alert } from '@/components/ui';

export default function PackingPage() {
  const [scanId, setScanId] = useState('');
  const [stationId, setStationId] = useState('');
  const [nexsId, setNexsId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [hourCount, setHourCount] = useState(0);
  const [showDupModal, setShowDupModal] = useState(false);
  const [prevStation, setPrevStation] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  const FORMAT_REGEX = /^SNXS\d{16}$/;

  // Refresh “last hour” count every 45s
  useEffect(() => {
    if (!stationId) return;
    const fetchStats = async () => {
      const res = await fetch(`/api/packing/stats?stationId=${stationId}`);
      if (res.ok) {
        const { count } = await res.json();
        setHourCount(count);
      }
    };
    fetchStats();
    const iv = setInterval(fetchStats, 45_000);
    return () => clearInterval(iv);
  }, [stationId]);

  // Auto‐scan when ID is valid
  useEffect(() => {
    if (!FORMAT_REGEX.test(scanId)) return;

    if (!stationId.trim()) {
      setMessage('❌ Station ID cannot be empty.');
      setScanId('');
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    if (!nexsId.trim()) {
      setMessage('❌ NexS ID cannot be empty.');
      setScanId('');
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Process scan
    (async () => {
      const res = await fetch('/api/packing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, stationId, nexsId }),
      });
      const data = await res.json();

      if (res.ok) {
        // Duplicate?
        if (data.isDuplicate) {
          setPrevStation(data.previousStation);
          setShowDupModal(true);
        } else {
          // Success
          setMessage('✔️ Scan recorded.');
          // Show city if available
          if (data.city) {
            setCity(data.city);
            setShowCityModal(true);
            setTimeout(() => setShowCityModal(false), 3000);
          }
        }
      } else {
        // Validation or server error
        setMessage(`❌ ${data.error}`);
      }
      // Clear input & message timeout
      setScanId('');
      setTimeout(() => setMessage(null), 2000);
    })();
  }, [scanId, stationId, nexsId]);

  return (
    <div
      className="relative flex min-h-full items-center justify-center"
      style={{
        backgroundImage: "url('/images/packing-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Main Content Wrapper */}
      <Card variant="floating" className="relative z-10 w-full max-w-md p-6">
        {/* Hourly Count */}
        {stationId && (
          <StatCard
            className="absolute right-4 top-4"
            label="Last 1 hr scans"
            value={hourCount}
            sub={stationId}
            tone="navy"
          />
        )}

        {/* Header */}
        <PageHeader title="Packing Scan" />

        {/* Message */}
        {message && (
          <Alert tone={message.startsWith('✔️') ? 'success' : 'error'} className="mb-4">
            {message}
          </Alert>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <Field label="Scan ID">
            <Input
              type="text"
              value={scanId}
              onChange={e => setScanId(e.target.value.toUpperCase())}
              placeholder="SNXS + 16 digits"
            />
          </Field>

          <Field label="Station ID">
            <Select
              value={stationId}
              onChange={e => setStationId(e.target.value)}
            >
              <option value="">Select station</option>
              {Array.from({ length: 30 }, (_, i) => {
                const code = i + 1 < 10 ? `PS0${i + 1}` : `PS${i + 1}`;
                return (
                  <option key={code} value={code}>
                    {code}
                  </option>
                );
              })}
            </Select>
          </Field>

          <Field label="NexS ID">
            <Input
              type="text"
              value={nexsId}
              onChange={e => setNexsId(e.target.value)}
              placeholder="Enter NexS ID"
            />
          </Field>
        </div>

        {/* Duplicate Modal */}
        <Modal open={showDupModal} onClose={() => setShowDupModal(false)} size="sm" className="text-center">
          <Alert tone="warning" className="mb-4 text-left">
            ⚠️ Duplicate detected!<br />
            Previously at station <strong>{prevStation}</strong>.
          </Alert>
          <Button onClick={() => setShowDupModal(false)}>OK</Button>
        </Modal>

        {/* City Modal */}
        <Modal open={showCityModal && !!city} onClose={() => setShowCityModal(false)} size="sm" className="text-center">
          <h3 className="text-lg font-bold text-brand-700">Destination City</h3>
          <p className="mt-2 text-xl">{city}</p>
        </Modal>
      </Card>
    </div>
  );
}
