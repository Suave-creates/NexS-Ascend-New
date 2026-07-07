'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, PageHeader, Field, Input, Select, Button, Modal, Alert } from '@/components/ui';

export default function MetalFrameFittingPage() {
  const [scanId, setScanId] = useState('');
  const [stationId, setStationId] = useState('');
  const [nexsId, setNexsId] = useState('');
  const [trayId, setTrayId] = useState('');
  const [pid, setPid] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [hourCount, setHourCount] = useState(0);
  const [showDupModal, setShowDupModal] = useState(false);
  const [prevStation, setPrevStation] = useState<string | null>(null);

  // Any 3 alphabets + digits
  const FORMAT_REGEX = /^[A-Z]{3}\d+$/;

  /* -----------------------------
     Refresh last-hour count
  ------------------------------*/
  useEffect(() => {
    if (!stationId) return;

    const fetchStats = async () => {
      const res = await fetch(
        `/api/metal-frame-fitting/stats?stationId=${stationId}`
      );
      if (res.ok) {
        const { count } = await res.json();
        setHourCount(count);
      }
    };

    fetchStats();
    const iv = setInterval(fetchStats, 45_000);
    return () => clearInterval(iv);
  }, [stationId]);

  /* -----------------------------
     Auto-scan on valid barcode
  ------------------------------*/
  useEffect(() => {
    if (!FORMAT_REGEX.test(scanId)) return;

    if (!stationId.trim()) {
      setMessage('❌ Station ID cannot be empty.');
      setScanId('');
      return;
    }
    if (!nexsId.trim()) {
      setMessage('❌ NexS ID cannot be empty.');
      setScanId('');
      return;
    }

    (async () => {
      const res = await fetch('/api/metal-frame-fitting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanId,
          stationId,
          nexsId,
          trayId,
          pid,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.isDuplicate) {
          setPrevStation(data.previousStation);
          setShowDupModal(true);
        } else {
          setMessage('✔️ Scan recorded.');
        }
      } else {
        setMessage(`❌ ${data.error}`);
      }

      setScanId('');
      setTimeout(() => setMessage(null), 2000);
    })();
  }, [scanId, stationId, nexsId, trayId, pid]);

  function fail(msg: string) {
    setMessage(`❌ ${msg}`);
    setScanId('');
    setTimeout(() => setMessage(null), 2000);
  }

  /* -----------------------------
     PID iframe URL
  ------------------------------*/
  const pidUrl = pid
    ? `https://www.lenskart.com/search?q=${encodeURIComponent(
        pid
      )}&search=true&searchType=custom`
    : null;

  return (
    <div className="max-w-5xl mx-auto mt-10 text-black">
      <div className="flex gap-6">

        {/* LEFT – FORM (same card style) */}
        <Card className="relative w-[40%]">
          <CardBody>
          <PageHeader title="Metal Frame Fitting" />

          <div className="space-y-4">
            <Field label="Scan ID:">
              <Input
                value={scanId}
                onChange={e => setScanId(e.target.value.toUpperCase())}
                placeholder="AAA + numeric"
              />
            </Field>

            <Field label="Station ID:">
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

            <Field label="NexS ID:">
              <Input
                value={nexsId}
                onChange={e => setNexsId(e.target.value)}
              />
            </Field>

            <Field label="Tray ID:">
              <Input
                value={trayId}
                onChange={e => setTrayId(e.target.value)}
              />
            </Field>

            <Field label="PID:">
              <Input
                value={pid}
                onChange={e => setPid(e.target.value)}
                placeholder="e.g. 236746"
              />
            </Field>
          </div>
          </CardBody>
        </Card>

        {/* RIGHT – PID EMBED (larger) */}
        <div className="w-[60%] flex items-start">
          <div className="bg-white rounded shadow p-2">
            {pidUrl ? (
              <iframe
                src={pidUrl}
                className="w-full h-[700px] border rounded"
              />
            ) : (
              <div className="h-[700px] flex items-center justify-center text-gray-400 text-sm">
                Enter PID to preview product
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DUPLICATE MODAL */}
      <Modal open={showDupModal} onClose={() => setShowDupModal(false)} size="sm" className="text-center">
        <Alert tone="warning" className="mb-4 text-left">
          ⚠️ Duplicate detected!<br />
          Previously at station <strong className="text-brand-700">{prevStation || 'N/A'}</strong>.
        </Alert>
        <Button onClick={() => setShowDupModal(false)}>OK</Button>
      </Modal>
    </div>
  );
}
