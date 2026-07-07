'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Select,
  Field,
  Card,
  CardBody,
  PageHeader,
  Modal,
  Alert,
  StatCard,
} from '@/components/ui';

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

  const messageTone = message?.startsWith('✔️') ? 'success' : 'error';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Metal Frame Fitting"
        subtitle="Scan frames into a packing station and preview the product"
      />

      {stationId && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Scans (last hour)" value={hourCount} tone="navy" />
          <StatCard label="Station" value={stationId} tone="good" />
        </div>
      )}

      {message && <Alert tone={messageTone}>{message}</Alert>}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* LEFT – FORM */}
        <Card className="w-full lg:w-2/5">
          <CardBody className="space-y-4">
            <Field label="Scan ID">
              <Input
                value={scanId}
                onChange={e => setScanId(e.target.value.toUpperCase())}
                placeholder="AAA + numeric"
                autoFocus
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
              <Input value={nexsId} onChange={e => setNexsId(e.target.value)} />
            </Field>

            <Field label="Tray ID">
              <Input value={trayId} onChange={e => setTrayId(e.target.value)} />
            </Field>

            <Field label="PID">
              <Input
                value={pid}
                onChange={e => setPid(e.target.value)}
                placeholder="e.g. 236746"
              />
            </Field>
          </CardBody>
        </Card>

        {/* RIGHT – PID EMBED */}
        <Card className="w-full lg:w-3/5">
          <CardBody className="p-2">
            {pidUrl ? (
              <iframe
                src={pidUrl}
                className="h-[700px] w-full rounded border border-gray-200"
              />
            ) : (
              <div className="flex h-[700px] items-center justify-center text-sm text-gray-400">
                Enter PID to preview product
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* DUPLICATE MODAL */}
      <Modal
        open={showDupModal}
        onClose={() => setShowDupModal(false)}
        size="sm"
        className="text-center"
      >
        <Alert tone="warning" className="mb-4 text-left">
          ⚠️ Duplicate detected!
          <br />
          Previously at station{' '}
          <strong className="text-brand-700">{prevStation || 'N/A'}</strong>.
        </Alert>
        <Button onClick={() => setShowDupModal(false)}>OK</Button>
      </Modal>
    </div>
  );
}
