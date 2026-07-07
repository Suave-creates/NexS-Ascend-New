"use client";

import { useState, useEffect } from 'react';
import { Card, PageHeader, Field, Input, Select, Button, Modal, Alert } from '@/components/ui';

export default function fr0Page() {
  const [scanId, setScanId] = useState('');
  const [stationId, setStationId] = useState('');
  const [nexsId, setNexsId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [showDupModal, setShowDupModal] = useState(false);
  const [prevStation, setPrevStation] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  const FORMAT_REGEX = /^SNXS\d{16}$/;

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

    (async () => {
      const res = await fetch('/api/fr0bulkhoto', {
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
          setMessage('✔️ Scan recorded.');
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
        backgroundImage: "url('/images/fr0bulkhoto-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card variant="floating" className="relative z-10 w-full max-w-md p-6">
        <PageHeader title="FR0 BULK CL/CLs HOTO" />

        {message && (
          <Alert
            tone={message.startsWith('✔️') ? 'success' : 'error'}
            className="mb-4 text-center"
          >
            {message}
          </Alert>
        )}

        <div className="space-y-4">
          <Field label="Scan ID">
            <Input
              type="text"
              value={scanId}
              onChange={e => setScanId(e.target.value.toUpperCase())}
              placeholder="SNXS + 16 digits"
              autoFocus
            />
          </Field>

          <Field label="Station ID">
            <Select
              value={stationId}
              onChange={e => setStationId(e.target.value)}
            >
              <option value="">Select station</option>
              <option value="BULK-FR0">BULK-FR0</option>
              <option value="CL_CLs-FR0">CL_CLs-FR0</option>
              <option value="CL_CLs-BULK">CL_CLs-BULK</option>
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

        <Modal open={showDupModal} onClose={() => setShowDupModal(false)} size="sm" className="text-center">
          <Alert tone="warning" className="mb-4 text-left">
            ⚠️ Duplicate detected!<br />
            Previously at station <strong>{prevStation}</strong>.
          </Alert>
          <Button onClick={() => setShowDupModal(false)}>OK</Button>
        </Modal>

        <Modal open={showCityModal && !!city} onClose={() => setShowCityModal(false)} size="sm" className="text-center">
          <h3 className="text-lg font-bold text-brand-700">Destination City</h3>
          <p className="mt-2 text-xl">{city}</p>
        </Modal>
      </Card>
    </div>
  );
}
