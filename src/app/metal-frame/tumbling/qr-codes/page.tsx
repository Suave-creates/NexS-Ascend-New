'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiPrinter, FiDownload, FiSearch } from 'react-icons/fi';
import { PageHeader, Alert, Input, Button, Card, CardBody } from '@/components/ui';

interface StationQrCode {
  stationNumber: number;
  targetUrl: string;
  qrDataUrl: string;
}

function downloadQr(qr: StationQrCode) {
  const a = document.createElement('a');
  a.href = qr.qrDataUrl;
  a.download = `station-${String(qr.stationNumber).padStart(2, '0')}-qr.png`;
  a.click();
}

export default function QrCodesPage() {
  const [qrCodes, setQrCodes] = useState<StationQrCode[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [printOnly, setPrintOnly] = useState<number | null>(null);

  const fetchQrCodes = useCallback(async () => {
    try {
      const res = await fetch('/api/metal-frame/tumbling/qr-codes');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load QR codes.');
      setQrCodes(json.qrCodes);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load QR codes.');
    }
  }, []);

  useEffect(() => {
    fetchQrCodes();
  }, [fetchQrCodes]);

  useEffect(() => {
    const onAfterPrint = () => setPrintOnly(null);
    window.addEventListener('afterprint', onAfterPrint);
    return () => window.removeEventListener('afterprint', onAfterPrint);
  }, []);

  const filtered = useMemo(() => {
    if (!qrCodes) return [];
    const list = printOnly != null ? qrCodes.filter((q) => q.stationNumber === printOnly) : qrCodes;
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => String(c.stationNumber).includes(q));
  }, [qrCodes, search, printOnly]);

  function printOne(stationNumber: number) {
    setPrintOnly(stationNumber);
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  }

  return (
    <div>
      <style>{`
        @media print {
          header, aside, .no-print { display: none !important; }
          main { padding: 0 !important; overflow: visible !important; }
        }
      `}</style>

      <PageHeader
        title="Tumbling — QR Codes"
        subtitle="One QR code per station. Scanning opens the dashboard with that station's panel already open."
        actions={
          <Button className="no-print" variant="outline" onClick={() => { setPrintOnly(null); requestAnimationFrame(() => window.print()); }}>
            <FiPrinter className="h-4 w-4" /> Print All
          </Button>
        }
      />

      {error && (
        <Alert tone="error" className="no-print mb-4">
          {error}
        </Alert>
      )}

      <div className="no-print relative mb-4 max-w-xs">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search station number..." className="pl-9" />
      </div>

      {!qrCodes ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2">
          {filtered.map((qr) => (
            <Card key={qr.stationNumber} className="break-inside-avoid">
              <CardBody className="flex flex-col items-center gap-2 text-center">
                <div className="text-sm font-bold text-gray-900">Station {String(qr.stationNumber).padStart(2, '0')}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr.qrDataUrl} alt={`QR code for Station ${qr.stationNumber}`} className="h-40 w-40" />
                <div className="max-w-full truncate text-[11px] text-gray-400">{qr.targetUrl}</div>
                <div className="no-print mt-1 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => printOne(qr.stationNumber)}>
                    <FiPrinter className="h-3.5 w-3.5" /> Print
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => downloadQr(qr)}>
                    <FiDownload className="h-3.5 w-3.5" /> Download
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
