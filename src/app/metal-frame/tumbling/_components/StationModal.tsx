'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiX, FiRefreshCw } from 'react-icons/fi';
import { Modal, Alert, Field, Input } from '@/components/ui';
import type { StationDetailResponse } from '@/services/metal-frame/tumbling/types';
import { ContainerPanel } from './ContainerPanel';
import { formatClockTime } from './format';

const POLL_INTERVAL_MS = 15_000;
const OPERATOR_STORAGE_KEY = 'tumbling.operatorName';

export function StationModal({ stationNumber, onClose }: { stationNumber: number | null; onClose: () => void }) {
  const [data, setData] = useState<StationDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [operatorName, setOperatorName] = useState('');

  const busyRef = useRef(false);
  const clockOffsetRef = useRef(0);

  useEffect(() => {
    setOperatorName(localStorage.getItem(OPERATOR_STORAGE_KEY) ?? '');
  }, []);

  function updateOperatorName(value: string) {
    setOperatorName(value);
    localStorage.setItem(OPERATOR_STORAGE_KEY, value);
  }

  const fetchDetail = useCallback(async () => {
    if (stationNumber == null || busyRef.current) return;
    busyRef.current = true;
    try {
      const res = await fetch(`/api/metal-frame/tumbling/stations/${stationNumber}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load this station.');
      clockOffsetRef.current = new Date(json.serverTime).getTime() - Date.now();
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load this station.');
    } finally {
      busyRef.current = false;
    }
  }, [stationNumber]);

  useEffect(() => {
    if (stationNumber == null) {
      setData(null);
      setError(null);
      return;
    }
    fetchDetail();
    const iv = setInterval(fetchDetail, POLL_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [stationNumber, fetchDetail]);

  useEffect(() => {
    if (stationNumber == null) return;
    const iv = setInterval(() => setNow(new Date(Date.now() + clockOffsetRef.current)), 1000);
    return () => clearInterval(iv);
  }, [stationNumber]);

  if (stationNumber == null) return null;

  const stationLabel = `Station ${String(stationNumber).padStart(2, '0')}`;

  return (
    <Modal open onClose={onClose} size="lg" className="max-h-[85vh] overflow-y-auto">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-brand-700">{stationLabel}</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
            <FiRefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Server time {formatClockTime(now.toISOString())}
          </p>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Close">
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <Alert tone="error" className="mb-4">
          {error}
        </Alert>
      )}

      {!data ? (
        <div className="space-y-4">
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      ) : (
        <>
          <div className="mb-4 max-w-xs">
            <Field label="Operator Name" hint="Recorded in the audit trail for actions you perform">
              <Input value={operatorName} onChange={(e) => updateOperatorName(e.target.value)} placeholder="Enter your name" />
            </Field>
          </div>

          <div className="space-y-4">
            <ContainerPanel
              stationLabel={stationLabel}
              panel={data.left}
              config={data.config}
              operatorName={operatorName}
              now={now}
              onRefresh={fetchDetail}
            />
            <ContainerPanel
              stationLabel={stationLabel}
              panel={data.right}
              config={data.config}
              operatorName={operatorName}
              now={now}
              onRefresh={fetchDetail}
            />
          </div>
        </>
      )}
    </Modal>
  );
}
