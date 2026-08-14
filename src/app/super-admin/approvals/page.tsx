'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiCheck, FiClock, FiRefreshCw, FiShield, FiX } from 'react-icons/fi';
import { Alert, Button, Card, CardBody, PageHeader, Spinner } from '@/components/ui';
import { apiFetch } from '@/lib/authClient';

type ApprovalRequest = {
  id: number;
  employeeCode: string;
  status: 'PENDING' | 'REJECTED';
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
};

export default function AccountApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch('/api/super-admin/approvals');
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to load requests');
      setRequests(data.requests || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === 'PENDING').length,
    [requests],
  );

  const review = async (request: ApprovalRequest, action: 'approve' | 'reject') => {
    const reason = action === 'reject'
      ? window.prompt('Optional rejection reason:', request.rejectionReason || '')
      : '';
    if (action === 'reject' && reason === null) return;
    if (action === 'approve' && !window.confirm(`Approve ${request.employeeCode}?`)) return;

    setActingOn(request.id);
    setError(null);
    setNotice(null);
    try {
      const response = await apiFetch(`/api/super-admin/approvals/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to review request');
      setNotice(
        action === 'approve'
          ? `${request.employeeCode} is approved and can now sign in.`
          : `${request.employeeCode} was rejected.`,
      );
      await loadRequests();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'Unable to review request');
    } finally {
      setActingOn(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Account Approvals"
        subtitle="Review signup requests before users receive access."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <FiShield className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-gray-900">{pendingCount} pending</p>
            <p className="text-xs text-gray-500">Rejected requests remain visible and are never deleted.</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => void loadRequests()} disabled={loading}>
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {notice && <Alert tone="success">{notice}</Alert>}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner className="h-7 w-7" /></div>
      ) : requests.length === 0 ? (
        <Card><CardBody className="py-16 text-center text-sm text-gray-500">No signup requests need review.</CardBody></Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardBody className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    request.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {request.status === 'PENDING' ? <FiClock /> : <FiX />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{request.employeeCode}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Requested {new Date(request.createdAt).toLocaleString()}
                    </p>
                    {request.rejectionReason && (
                      <p className="mt-2 text-sm text-red-700">Reason: {request.rejectionReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="danger"
                    onClick={() => void review(request, 'reject')}
                    disabled={actingOn !== null || request.status === 'REJECTED'}
                  >
                    <FiX /> Reject
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => void review(request, 'approve')}
                    disabled={actingOn !== null}
                  >
                    <FiCheck /> Approve
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
