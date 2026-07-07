// src/app/dispatch/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, PageHeader, Field, Input, Select, Button, Modal, StatCard, Alert } from '@/components/ui';

export default function DispatchPage() {
  const [scanId, setScanId]       = useState('');
  const [stationId, setStationId] = useState('');
  const [nexsId, setNexsId]       = useState('');
  const [message, setMessage]     = useState<string | null>(null);
  const [showDupModal, setShowDupModal] = useState(false);
  const [prevStation, setPrevStation]   = useState<string | null>(null);
  const [hourCount, setHourCount]       = useState(0);

  const PACKING_REGEX = /^SNXS\d{16}$/;
  const debounceRef   = useRef<NodeJS.Timeout | null>(null);

  // Fetch last-hour stats
  useEffect(() => {
    if (!stationId) return;
    const fetchCount = async () => {
      const res = await fetch(`/api/dispatch/stats?stationId=${stationId}`);
      if (res.ok) {
        const { count } = await res.json();
        setHourCount(count);
      }
    };
    fetchCount();
    const iv = setInterval(fetchCount, 45000);
    return () => clearInterval(iv);
  }, [stationId]);

  // Core scan handler
  const handleScan = async (id: string) => {
    if (PACKING_REGEX.test(id)) {
      setMessage('❌ Packing-format codes not allowed here.');
      setTimeout(() => setMessage(null), 2000);
      setScanId('');
      return;
    }
    if (!stationId.trim()) {
      setMessage('❌ Station ID cannot be empty.');
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    if (!nexsId.trim()) {
      setMessage('❌ NexS ID cannot be empty.');
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    const res  = await fetch('/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scanId: id, stationId, nexsId }),
    });
    const data = await res.json();

    if (res.ok) {
      if (data.isDuplicate) {
        setPrevStation(data.previousStation);
        setShowDupModal(true);
      } else {
        setMessage('✔️ Dispatch scan recorded.');
        setTimeout(() => setMessage(null), 2000);
      }
    } else {
      setMessage(`❌ ${data.error || 'Scan failed.'}`);
      setTimeout(() => setMessage(null), 2000);
    }

    setScanId('');
  };

  // Debounce effect: fire handleScan 1s after typing stops
  useEffect(() => {
    if (!scanId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleScan(scanId);
      debounceRef.current = null;
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [scanId, stationId, nexsId]);

  return (
    <Card className="relative max-w-md mx-auto mt-10">
      <CardBody>
      {/* Last-hour stats */}
      {stationId && (
        <StatCard
          className="absolute right-4 top-4"
          label="Last 1 hr dispatches"
          value={hourCount}
          sub={stationId}
        />
      )}

      <PageHeader title="Dispatch Scan" />

      {/* Feedback message, green for ✔️, red otherwise */}
      {message && (
        <Alert
          tone={message.startsWith('✔️') ? 'success' : 'error'}
          className="mb-4 text-center"
        >
          {message}
        </Alert>
      )}

      <div className="space-y-4">
        {/* Rapid-scan field */}
        <Field label="Scan ID">
          <Input
            type="text"
            value={scanId}
            onChange={e => setScanId(e.target.value.toUpperCase())}
            placeholder="Type or scan any code"
          />
        </Field>

        {/* Station selector */}
        <Field label="Station ID">
          <Select
            value={stationId}
            onChange={e => setStationId(e.target.value)}
          >
            <option value="">Select station</option>
            {Array.from({ length: 20 }, (_, i) => {
              const code = i + 1 < 10 ? `DS0${i + 1}` : `DS${i + 1}`;
              return (
                <option key={code} value={code}>
                  {code}
                </option>
              );
            })}
          </Select>
        </Field>

        {/* NexS ID */}
        <Field label="NexS ID">
          <Input
            type="text"
            value={nexsId}
            onChange={e => setNexsId(e.target.value)}
            placeholder="Enter NexS ID"
          />
        </Field>
      </div>

      {/* Duplicate modal */}
      <Modal open={showDupModal} onClose={() => setShowDupModal(false)} size="sm" className="text-center">
        <Alert tone="warning" className="mb-4 text-left">
          ⚠️ Duplicate detected!<br />
          Previously at station <strong>{prevStation}</strong>.
        </Alert>
        <Button onClick={() => setShowDupModal(false)}>OK</Button>
      </Modal>
      </CardBody>
    </Card>
  );
}
