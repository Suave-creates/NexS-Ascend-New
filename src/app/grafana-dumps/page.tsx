'use client';

import { useState } from 'react';
import { FiDatabase, FiDownload } from 'react-icons/fi';
import { Alert, Button, Card, CardBody, PageHeader, Spinner } from '@/components/ui';

const DUMPS = [
  ['asrs-tote', 'ASRS Tote Dump', 'Complete ASRS inventory by PID and location'],
  ['blocked-inventory', 'Blocked Inventory', 'NXS1 non-zero blocked inventory'],
  ['dubai-inventory', 'Dubai Inventory', 'DXB1 available inventory'],
  ['egl-manual', 'EGL Manual', 'NXS1 EGL manual-location stock'],
  ['manual-stock-progressive', 'Manual Location Stock Progressive', 'Progressive manual-location stock'],
  ['manual-warehouse-replenishment', 'Manual Warehouse Replenishment', 'Eligible replenishment inventory'],
  ['nxs1-inventory', 'NXS1 Inventory', 'NXS1 available inventory'],
  ['nxs2-inventory', 'NXS2 Inventory', 'NXS2 available inventory'],
  ['reserve-inventory', 'Reserve Inventory', 'NXS1 reserved inventory by PID'],
  ['singapore-inventory', 'Singapore Inventory', 'SGNXS1 available inventory'],
  ['thailand-inventory', 'Thailand Inventory', 'TH01 available inventory'],
  ['br01-inventory', 'BR01 Inventory Dump', 'Vistaclara inventory by PID and location'],
  ['br01-putaway-pending', 'BR01 Putaway Pending', 'Available BR01 putaway-pending barcodes'],
] as const;

type JobState = { id: string; error: string | null } | null;

function filenameFromDisposition(value: string | null, fallback: string): string {
  return value?.match(/filename="?([^";]+)"?/i)?.[1] || `${fallback}.csv`;
}

export default function GrafanaDumpsPage() {
  const [job, setJob] = useState<JobState>(null);

  const download = async (id: string, label: string) => {
    setJob({ id, error: null });
    try {
      const response = await fetch(`/api/grafana-dumps?id=${encodeURIComponent(id)}`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || `Dump failed with HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filenameFromDisposition(response.headers.get('content-disposition'), label);
      anchor.click();
      URL.revokeObjectURL(url);
      setJob(null);
    } catch (error) {
      setJob({ id, error: error instanceof Error ? error.message : 'Download failed' });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Grafana Dumps"
        subtitle="Run heavy inventory queries and download the result directly as CSV"
      />

      {job && !job.error && (
        <Card>
          <CardBody className="space-y-3">
            <div className="flex items-center gap-3 text-sm font-semibold text-brand-700">
              <Spinner className="h-5 w-5" />
              Processing dump. Keep this page open; large queries may take several minutes.
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-brand-600" />
            </div>
          </CardBody>
        </Card>
      )}

      {job?.error && <Alert tone="error">{job.error}</Alert>}

      <div className="grid gap-4 md:grid-cols-2">
        {DUMPS.map(([id, label, description]) => {
          const running = job?.id === id && !job.error;
          return (
            <Card key={id}>
              <CardBody className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <FiDatabase className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-brand-800">{label}</h2>
                  <p className="mt-1 text-xs text-gray-500">{description}</p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  loading={running}
                  disabled={!!job && !job.error}
                  onClick={() => download(id, label.replace(/\s+/g, '_'))}
                  className="shrink-0"
                >
                  {!running && <FiDownload className="h-4 w-4" />}
                  Download
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
