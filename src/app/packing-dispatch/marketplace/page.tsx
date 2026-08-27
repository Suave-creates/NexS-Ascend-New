"use client";

import { useEffect, useState } from 'react';
import { Alert, Button, Card, Field, Input, Modal, PageHeader, Select, StatCard } from '@/components/ui';
import {
  isMarketplaceScanId,
  MARKETPLACE_SCAN_FORMATS,
  normalizeMarketplaceScanId,
} from '@/lib/marketplaceScan';

export default function MarketplacePage() {
  const [scanId, setScanId] = useState('');
  const [stationId, setStationId] = useState('');
  const [nexsId, setNexsId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [hourCount, setHourCount] = useState(0);
  const [showDupModal, setShowDupModal] = useState(false);
  const [prevStation, setPrevStation] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  useEffect(() => {
    if (!stationId) return;

    const fetchStats = async () => {
      const res = await fetch(
        `/api/packing-dispatch/marketplace/stats?stationId=${encodeURIComponent(stationId)}`
      );
      if (res.ok) {
        const { count } = await res.json();
        setHourCount(count);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 45_000);
    return () => clearInterval(interval);
  }, [stationId]);

  useEffect(() => {
    if (!isMarketplaceScanId(scanId)) return;

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

    (async () => {
      const res = await fetch('/api/packing-dispatch/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, stationId, nexsId }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.isDuplicate) {
          setPrevStation(data.previousStation);
          setShowDupModal(true);
        } else {
          setMessage('✔️ Marketplace scan recorded.');
          if (data.city) {
            setCity(data.city);
            setShowCityModal(true);
            setTimeout(() => setShowCityModal(false), 3000);
          }
        }
      } else {
        setMessage(`❌ ${data.error}`);
      }

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
      <Card variant="floating" className="relative z-10 w-full max-w-md p-6">
        {stationId && (
          <StatCard
            className="absolute right-4 top-4"
            label="Last 1 hr scans"
            value={hourCount}
            sub={stationId}
            tone="navy"
          />
        )}

        <PageHeader title="Marketplace Scan" />

        {message && (
          <Alert tone={message.startsWith('✔️') ? 'success' : 'error'} className="mb-4">
            {message}
          </Alert>
        )}

        <div className="space-y-4">
          <Field label="Marketplace Scan ID">
            <Input
              type="text"
              value={scanId}
              onChange={event => setScanId(normalizeMarketplaceScanId(event.target.value))}
              placeholder="Scan marketplace barcode"
              autoComplete="off"
            />
            <p className="mt-2 text-xs text-slate-500">
              Accepted: {MARKETPLACE_SCAN_FORMATS.map(format => format.marketplace).join(', ')}
            </p>
          </Field>

          <Field label="Station ID">
            <Select value={stationId} onChange={event => setStationId(event.target.value)}>
              <option value="">Select station</option>
              {Array.from({ length: 30 }, (_, index) => {
                const number = index + 1;
                const code = number < 10 ? `PS0${number}` : `PS${number}`;
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
              onChange={event => setNexsId(event.target.value)}
              placeholder="Enter NexS ID"
            />
          </Field>
        </div>

        <Modal
          open={showDupModal}
          onClose={() => setShowDupModal(false)}
          size="sm"
          className="text-center"
        >
          <Alert tone="warning" className="mb-4 text-left">
            ⚠️ Duplicate detected!
            <br />
            Previously at station <strong>{prevStation}</strong>.
          </Alert>
          <Button onClick={() => setShowDupModal(false)}>OK</Button>
        </Modal>

        <Modal
          open={showCityModal && !!city}
          onClose={() => setShowCityModal(false)}
          size="sm"
          className="text-center"
        >
          <h3 className="text-lg font-bold text-brand-700">Destination City</h3>
          <p className="mt-2 text-xl">{city}</p>
        </Modal>
      </Card>
    </div>
  );
}

