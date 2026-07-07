// src/app/location-transfer/page.tsx
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  PageHeader,
  Button,
  Input,
  Badge,
  Modal,
  Alert,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';

type InventoryRecord = {
  id: number;
  pid: string;
  barcode: string;
  status: string | null;
  condition: string | null;
  availability: string | null;
  scan_location: string;
  scanned_at: string;
};

type Banner = { type: 'success' | 'error' | 'info'; text: string } | null;

export default function LocationTransferPage() {
  const [scanLocation, setScanLocation] = useState('');
  const [loadedLocation, setLoadedLocation] = useState('');
  const [records, setRecords] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handlePreview = async (e?: FormEvent) => {
    e?.preventDefault();
    const loc = scanLocation.trim();
    if (!loc) return;

    setLoading(true);
    setBanner(null);
    setRecords([]);
    setLoadedLocation('');

    try {
      const res = await fetch('/api/asrs/pid-hunter-transfer/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scan_location: loc }),
      });
      const data = await res.json();

      if (!res.ok) {
        setBanner({ type: 'error', text: data.error || 'Failed to load records' });
        return;
      }
      if (!data.records || data.records.length === 0) {
        setBanner({ type: 'info', text: `No records found at "${loc}"` });
        return;
      }

      setRecords(data.records);
      setLoadedLocation(loc);
      setBanner({
        type: 'info',
        text: `${data.records.length} record(s) at "${loc}" ready to transfer`,
      });
    } catch {
      setBanner({ type: 'error', text: 'Network error while loading records' });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setConfirmOpen(false);
    setTransferring(true);
    setBanner(null);

    try {
      const res = await fetch('/api/asrs/pid-hunter-transfer/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scan_location: loadedLocation }),
      });
      const data = await res.json();

      if (!res.ok) {
        setBanner({ type: 'error', text: data.error || 'Transfer failed' });
        return;
      }

      setBanner({
        type: 'success',
        text: `Transferred ${data.count} record(s) from "${loadedLocation}"`,
      });
      setRecords([]);
      setScanLocation('');
      setLoadedLocation('');
      inputRef.current?.focus();
    } catch {
      setBanner({ type: 'error', text: 'Network error during transfer' });
    } finally {
      setTransferring(false);
    }
  };

  const handleClear = () => {
    setScanLocation('');
    setRecords([]);
    setLoadedLocation('');
    setBanner(null);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-4 p-6">
      <PageHeader
        title="PID Hunter Transfer"
        subtitle={
          <>
            Move scanned inventory from <code>scanned_barcode_inventory</code> →{' '}
            <code>scanned_barcode_inventory_transfer</code>
          </>
        }
      />

      <div className="space-y-4">
        {banner && (
          <Alert
            tone={banner.type}
            className="flex items-center justify-between gap-3"
          >
            <span>{banner.text}</span>
            <button
              className="shrink-0 px-1 text-xl leading-none opacity-55 hover:opacity-100"
              onClick={() => setBanner(null)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </Alert>
        )}

        <Card>
          <CardHeader className="flex-col items-start gap-1 border-b-0">
            <h2 className="text-base font-semibold text-brand-700">Scan Location</h2>
            <p className="text-sm text-gray-500">
              Enter or scan the location code to load all records currently at that location.
            </p>
          </CardHeader>

          <CardBody className="pt-0">
            <form className="flex flex-wrap gap-2" onSubmit={handlePreview}>
              <Input
                ref={inputRef}
                type="text"
                className="min-w-[240px] flex-1"
                placeholder="e.g. WH-A-12-3"
                value={scanLocation}
                onChange={(e) => setScanLocation(e.target.value)}
                disabled={loading || transferring}
                autoComplete="off"
                spellCheck={false}
              />
              <Button
                type="submit"
                disabled={loading || transferring || !scanLocation.trim()}
              >
                {loading ? 'Loading…' : 'Load Records'}
              </Button>
              {(records.length > 0 || scanLocation) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  disabled={loading || transferring}
                >
                  Clear
                </Button>
              )}
            </form>
          </CardBody>
        </Card>

        {records.length > 0 && (
          <Card>
            <CardHeader className="flex-col items-stretch gap-4 border-b-0 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-brand-700">
                  Records at <Badge tone="gold" className="ml-1 font-mono">{loadedLocation}</Badge>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {records.length} record(s) will be inserted into{' '}
                  <code>scanned_barcode_inventory_transfer</code> and removed from{' '}
                  <code>scanned_barcode_inventory</code>.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setConfirmOpen(true)}
                disabled={transferring}
              >
                {transferring ? 'Transferring…' : `Transfer ${records.length} Record(s)`}
              </Button>
            </CardHeader>

            <CardBody className="pt-0">
              <Table>
                <THead>
                  <tr>
                    <TH>PID</TH>
                    <TH>Barcode</TH>
                    <TH>Status</TH>
                    <TH>Condition</TH>
                    <TH>Availability</TH>
                    <TH>Scanned At</TH>
                  </tr>
                </THead>
                <TBody>
                  {records.map((r) => (
                    <TR key={r.id}>
                      <TD><code>{r.pid}</code></TD>
                      <TD><code>{r.barcode}</code></TD>
                      <TD>{r.status || <span className="text-gray-400">—</span>}</TD>
                      <TD>{r.condition || <span className="text-gray-400">—</span>}</TD>
                      <TD>{r.availability || <span className="text-gray-400">—</span>}</TD>
                      <TD className="text-gray-400">
                        {new Date(r.scanned_at).toLocaleString()}
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} size="sm">
        <h3 className="mb-3 text-lg font-bold text-brand-700">Confirm Transfer</h3>
        <p className="mb-5 text-sm leading-relaxed text-gray-700">
          You are about to move <strong>{records.length} record(s)</strong> from location{' '}
          <strong>{loadedLocation}</strong> to the transfer table.
          <br />
          <br />
          <span className="font-medium text-danger-600">
            These records will be deleted from <code>scanned_barcode_inventory</code>. This cannot be undone.
          </span>
        </p>
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleTransfer}>
            Yes, Transfer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
