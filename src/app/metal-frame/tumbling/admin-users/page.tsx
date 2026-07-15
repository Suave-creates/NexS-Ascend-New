'use client';

import { useCallback, useEffect, useState } from 'react';
import { FiLock, FiKey } from 'react-icons/fi';
import { PageHeader, Card, CardHeader, CardBody, Field, Input, Button, Alert, Table, THead, TBody, TR, TH, TD } from '@/components/ui';

interface PortalUser {
  id: number;
  employeeCode: string;
  createdAt: string;
}

const TOKEN_STORAGE_KEY = 'tumbling.adminAccessToken';

export default function TumblingAdminUsersPage() {
  const [accessToken, setAccessToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateBusy, setGateBusy] = useState(false);

  const [users, setUsers] = useState<PortalUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newEmployeeCode, setNewEmployeeCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [creating, setCreating] = useState(false);

  const [resetTarget, setResetTarget] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
  const [resetting, setResetting] = useState(false);

  const loadUsers = useCallback(async (token: string) => {
    const res = await fetch('/api/metal-frame/tumbling/admin-users', { headers: { 'x-tumbling-admin-token': token } });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load users.');
    setUsers(json.users);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return;
    setGateBusy(true);
    loadUsers(stored)
      .then(() => {
        setAccessToken(stored);
        setUnlocked(true);
      })
      .catch(() => sessionStorage.removeItem(TOKEN_STORAGE_KEY))
      .finally(() => setGateBusy(false));
  }, [loadUsers]);

  async function unlock() {
    setGateBusy(true);
    setGateError(null);
    try {
      await loadUsers(tokenInput);
      sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenInput);
      setAccessToken(tokenInput);
      setUnlocked(true);
    } catch (e) {
      setGateError(e instanceof Error ? e.message : 'Failed to unlock.');
    } finally {
      setGateBusy(false);
    }
  }

  async function createUser() {
    setError(null);
    setSuccess(null);
    if (newPassword !== newPasswordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/metal-frame/tumbling/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tumbling-admin-token': accessToken },
        body: JSON.stringify({ employeeCode: newEmployeeCode.trim(), password: newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create user.');
      setSuccess(`Created account for ${json.user.employeeCode}.`);
      setNewEmployeeCode('');
      setNewPassword('');
      setNewPasswordConfirm('');
      await loadUsers(accessToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  }

  async function submitReset() {
    if (!resetTarget) return;
    setError(null);
    setSuccess(null);
    if (resetPassword !== resetPasswordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setResetting(true);
    try {
      const res = await fetch(`/api/metal-frame/tumbling/admin-users/${encodeURIComponent(resetTarget)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-tumbling-admin-token': accessToken },
        body: JSON.stringify({ password: resetPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to reset password.');
      setSuccess(`Password reset for ${resetTarget}.`);
      setResetTarget(null);
      setResetPassword('');
      setResetPasswordConfirm('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reset password.');
    } finally {
      setResetting(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto mt-24 max-w-sm">
        <Card>
          <CardHeader>
            <span className="flex items-center gap-2 font-semibold text-gray-800">
              <FiLock className="h-4 w-4" /> Restricted Access
            </span>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-gray-500">Enter the access token to manage login accounts.</p>
            <Field label="Access Token">
              <Input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && unlock()}
                autoFocus
                autoComplete="off"
              />
            </Field>
            {gateError && <Alert tone="error">{gateError}</Alert>}
            <Button className="w-full" onClick={unlock} loading={gateBusy}>
              <FiKey className="h-4 w-4" /> Unlock
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Tumbling — Users" subtitle="Login accounts used to authorize Complete Early, Stop, and Settings changes." />

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}
      {success && <Alert tone="success" className="mb-4">{success}</Alert>}

      <Card className="mb-6">
        <CardHeader>
          <span className="font-semibold text-gray-800">Create User</span>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Employee Code">
            <Input value={newEmployeeCode} onChange={(e) => setNewEmployeeCode(e.target.value)} />
          </Field>
          <Field label="Password">
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="off" />
          </Field>
          <Field label="Confirm Password">
            <Input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} autoComplete="off" />
          </Field>
          <div className="sm:col-span-3">
            <Button onClick={createUser} loading={creating} disabled={!newEmployeeCode.trim() || !newPassword}>
              Create User
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <span className="font-semibold text-gray-800">Existing Users</span>
        </CardHeader>
        <CardBody>
          {!users ? (
            <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Employee Code</TH>
                  <TH>Created</TH>
                  <TH />
                </TR>
              </THead>
              <TBody>
                {users.map((user) => (
                  <TR key={user.id}>
                    <TD className="font-medium">{user.employeeCode}</TD>
                    <TD>{new Date(user.createdAt).toLocaleDateString()}</TD>
                    <TD>
                      {resetTarget === user.employeeCode ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <Input
                            type="password"
                            placeholder="New password"
                            value={resetPassword}
                            onChange={(e) => setResetPassword(e.target.value)}
                            className="w-36"
                            autoComplete="off"
                          />
                          <Input
                            type="password"
                            placeholder="Confirm"
                            value={resetPasswordConfirm}
                            onChange={(e) => setResetPasswordConfirm(e.target.value)}
                            className="w-36"
                            autoComplete="off"
                          />
                          <Button size="sm" onClick={submitReset} loading={resetting}>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setResetTarget(null);
                              setResetPassword('');
                              setResetPasswordConfirm('');
                            }}
                            disabled={resetting}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setResetTarget(user.employeeCode)}>
                          Reset Password
                        </Button>
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
