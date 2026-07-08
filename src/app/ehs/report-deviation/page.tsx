'use client';

import { useState, useEffect } from 'react';
import {
  PageHeader,
  Card,
  CardBody,
  Field,
  Input,
  Select,
  Textarea,
  Button,
  Modal,
  Badge,
  StatCard,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from '@/components/ui';

interface EHSDeviation {
  id: number;
  month: string;
  date: string;
  timeOfRound: string;
  location: string;
  responsibleDepartment: string;
  remarks: string;
  observations: string;
  photographBefore?: string;
  controlMeasures: string;
  photographAfter?: string;
  pendingDays: number;
  categorization: string;
  remarksByDepartment?: string;
  complianceStatus: string;
  createdAt: string;
  updatedAt: string;
}

const DEPARTMENTS = [
  'Lens lab', 'Tint lab', 'MEI Maintenance', 'Utility', 'Packing & Dispatch',
  'OMT', 'Fitting & QC', 'Project', 'Metal Frame', 'Admin', 'Bulk',
  'Security', 'ASRS Maintenance', 'Metal Frame Maintenance', 'MEI', 'JIT'
];

const REMARKS_OPTIONS = ['Unsafe Act', 'Unsafe Condition', 'Near Miss', 'Hazard Spotting'];
const CATEGORIZATION_OPTIONS = ['Red', 'Orange', 'Yellow'];
const COMPLIANCE_STATUS_OPTIONS = ['Open', 'Closed'];

export default function EHSReportDeviationPage() {
  const [deviations, setDeviations] = useState<EHSDeviation[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeviation, setEditingDeviation] = useState<EHSDeviation | null>(null);

  // Login form
  const [loginForm, setLoginForm] = useState({ employeeCode: '', password: '' });

  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // New deviation form
  const [newDeviation, setNewDeviation] = useState({
    month: '',
    date: '',
    timeOfRound: '',
    location: '',
    responsibleDepartment: '',
    remarks: '',
    observations: '',
    photographBefore: '',
    controlMeasures: '',
    photographAfter: '',
    categorization: 'Yellow',
    remarksByDepartment: '',
    complianceStatus: 'Open'
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('ehsToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    fetchDeviations();
  }, []);

  const fetchDeviations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start', startDate);
      if (endDate) params.append('end', endDate);

      const response = await fetch(`/api/ehs/deviations?${params}`);
      const data = await response.json();
      // Map remarksByDept to remarksByDepartment for UI consistency
      const normalized = Array.isArray(data)
        ? data.map((d) => ({
            ...d,
            remarksByDepartment: d.remarksByDepartment ?? '',
          }))
        : [];

      setDeviations(
        normalized.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
    } catch (error) {
      console.error('Failed to fetch deviations:', error);
      setDeviations([]);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/ehs-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('ehsToken', data.token);
        setShowLoginModal(false);
        setLoginForm({ employeeCode: '', password: '' });
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ehsToken');
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('/api/ehs/uploadPhoto', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.url;
  };

  const handleCreateDeviation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/api/ehs/deviations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newDeviation),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewDeviation({
          month: '',
          date: '',
          timeOfRound: '',
          location: '',
          responsibleDepartment: '',
          remarks: '',
          observations: '',
          photographBefore: '',
          controlMeasures: '',
          photographAfter: '',
          categorization: 'Yellow',
          remarksByDepartment: '',
          complianceStatus: 'Open'
        });
        fetchDeviations();
      } else {
        alert('Failed to create deviation');
      }
    } catch (error) {
      alert('Failed to create deviation');
    }
  };

  const handleUpdateDeviation = async (id: number, data: Partial<EHSDeviation>) => {
    try {
      const url = isAuthenticated
        ? `/api/ehs/deviation/${id}`
        : `/api/ehs/deviation/${id}/public-edit`;

      const method = isAuthenticated ? 'PUT' : 'PATCH';
      const headers: any = { 'Content-Type': 'application/json' };

      if (isAuthenticated) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchDeviations();
        setEditingDeviation(null);
      } else {
        alert('Failed to update deviation');
      }
    } catch (error) {
      alert('Failed to update deviation');
    }
  };

  const handleDeleteDeviation = async (id: number) => {
    if (!isAuthenticated || !confirm('Are you sure you want to delete this deviation?')) return;

    try {
      const response = await fetch(`/api/ehs/deviation/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchDeviations();
      } else {
        alert('Failed to delete deviation');
      }
    } catch (error) {
      alert('Failed to delete deviation');
    }
  };

  const handleExportPDF = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/ehs/exportPDF?${params}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ehs-deviations-${startDate || 'all'}-${endDate || 'all'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to export PDF');
    }
  };

  const totalCount = deviations.length;
  const openCount = deviations.filter((d) => d.complianceStatus !== 'Closed').length;
  const closedCount = deviations.filter((d) => d.complianceStatus === 'Closed').length;
  const redCount = deviations.filter((d) => d.categorization === 'Red').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="EHS Deviation Reporting"
        subtitle="Track, categorize, and close out environment, health & safety deviations."
        actions={
          isAuthenticated ? (
            <>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Deviation
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => setShowLoginModal(true)}>
              EHS Officer Login
            </Button>
          )
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Deviations" value={totalCount} tone="navy" />
        <StatCard label="Open" value={openCount} tone="danger" />
        <StatCard label="Closed" value={closedCount} tone="good" />
        <StatCard label="Red Category" value={redCount} tone="notice" />
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-end gap-4">
            <Field label="Start Date">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>
            <Field label="End Date">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Field>
            <Button onClick={fetchDeviations}>
              Filter
            </Button>
            <Button variant="success" onClick={handleExportPDF}>
              Export PDF
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Data Table */}
      <Card>
        <Table>
          <THead>
            <TR>
              <TH>Month</TH>
              <TH>Date</TH>
              <TH>Time of Round</TH>
              <TH>Location</TH>
              <TH>Responsible Department</TH>
              <TH>Remarks</TH>
              <TH>Observations</TH>
              <TH>Photo (Before)</TH>
              <TH>Control Measures</TH>
              <TH>Photo (After)</TH>
              <TH>Pending Days</TH>
              <TH>Categorization</TH>
              <TH>Dept Remarks</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {loading ? (
              <TR>
                <TD colSpan={15} className="py-8 text-center text-gray-500">
                  Loading...
                </TD>
              </TR>
            ) : deviations.length === 0 ? (
              <TR>
                <TD colSpan={15} className="py-8 text-center text-gray-500">
                  No deviations found
                </TD>
              </TR>
            ) : (
              deviations.map((deviation) => (
                <TR key={deviation.id}>
                  <TD>{deviation.month}</TD>
                  <TD>{new Date(deviation.date).toLocaleDateString()}</TD>
                  <TD>{deviation.timeOfRound}</TD>
                  <TD>{deviation.location}</TD>
                  <TD>{deviation.responsibleDepartment}</TD>
                  <TD>{deviation.remarks}</TD>
                  <TD className="max-w-xs truncate">{deviation.observations}</TD>
                  <TD>
                    {deviation.photographBefore ? (
                      <img
                        src={
                          deviation.photographBefore?.startsWith('/')
                            ? deviation.photographBefore
                            : `/${deviation.photographBefore}`
                        }
                        alt="Before"
                        className="h-16 w-16 rounded object-cover"
                      />
                    ) : (
                      'N/A'
                    )}
                  </TD>
                  <TD className="max-w-xs truncate">{deviation.controlMeasures}</TD>
                  <TD>
                    {deviation.photographAfter ? (
                      <img
                        src={
                          deviation.photographAfter?.startsWith('/')
                            ? deviation.photographAfter
                            : `/${deviation.photographAfter}`
                        }
                        alt="After"
                        className="h-16 w-16 rounded object-cover"
                      />
                    ) : (
                      'N/A'
                    )}
                  </TD>
                  <TD>{deviation.pendingDays}</TD>
                  <TD>
                    <Badge
                      tone={
                        deviation.categorization === 'Red' ? 'danger' :
                        deviation.categorization === 'Orange' ? 'notice' :
                        'gold'
                      }
                    >
                      {deviation.categorization}
                    </Badge>
                  </TD>
                  <TD className="max-w-xs truncate">{deviation.remarksByDepartment || 'N/A'}</TD>
                  <TD>
                    <Badge tone={deviation.complianceStatus === 'Closed' ? 'good' : 'danger'}>
                      {deviation.complianceStatus}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDeviation(deviation)}
                      >
                        Edit
                      </Button>
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDeviation(deviation.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </Card>

      {/* Login Modal */}
      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)} size="sm">
        <h2 className="mb-4 text-xl font-bold text-brand-700">EHS Officer Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Field label="Employee Code">
            <Input
              type="text"
              value={loginForm.employeeCode}
              onChange={(e) => setLoginForm({ ...loginForm, employeeCode: e.target.value })}
              required
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
          </Field>
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Login
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowLoginModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto"
      >
        <h2 className="mb-4 text-xl font-bold text-brand-700">Create New Deviation</h2>
        <form onSubmit={handleCreateDeviation} className="grid grid-cols-2 gap-4">
          <Field label="Month">
            <Select
              value={newDeviation.month}
              onChange={(e) => setNewDeviation({ ...newDeviation, month: e.target.value })}
              required
            >
              <option value="">Select Month</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </Select>
          </Field>
          <Field label="Date">
            <Input
              type="date"
              value={newDeviation.date}
              onChange={(e) => setNewDeviation({ ...newDeviation, date: e.target.value })}
              required
            />
          </Field>
          <Field label="Time of Round">
            <div className="flex gap-2">
              {/* From Time Dropdown */}
              <Select
                value={newDeviation.timeOfRound.split(' to ')[0] || ''}
                onChange={(e) => {
                  const to = newDeviation.timeOfRound.split(' to ')[1] || '';
                  const from = e.target.value;
                  const updated = from && to ? `${from} to ${to}` : from;
                  setNewDeviation({ ...newDeviation, timeOfRound: updated });
                }}
                className="w-1/2"
                required
              >
                <option value="">From</option>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i % 12 === 0 ? 12 : i % 12;
                  const ampm = i < 12 ? 'AM' : 'PM';
                  return [
                    <option key={`${i}:00`} value={`${hour}:00 ${ampm}`}>{`${hour}:00 ${ampm}`}</option>,
                    <option key={`${i}:30`} value={`${hour}:30 ${ampm}`}>{`${hour}:30 ${ampm}`}</option>,
                  ];
                }).flat()}
              </Select>

              {/* To Time Dropdown */}
              <Select
                value={newDeviation.timeOfRound.split(' to ')[1] || ''}
                onChange={(e) => {
                  const from = newDeviation.timeOfRound.split(' to ')[0] || '';
                  const to = e.target.value;
                  const updated = from && to ? `${from} to ${to}` : to;
                  setNewDeviation({ ...newDeviation, timeOfRound: updated });
                }}
                className="w-1/2"
                required
              >
                <option value="">To</option>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i % 12 === 0 ? 12 : i % 12;
                  const ampm = i < 12 ? 'AM' : 'PM';
                  return [
                    <option key={`${i}:00`} value={`${hour}:00 ${ampm}`}>{`${hour}:00 ${ampm}`}</option>,
                    <option key={`${i}:30`} value={`${hour}:30 ${ampm}`}>{`${hour}:30 ${ampm}`}</option>,
                  ];
                }).flat()}
              </Select>
            </div>
          </Field>

          <Field label="Location">
            <Input
              type="text"
              value={newDeviation.location}
              onChange={(e) => setNewDeviation({ ...newDeviation, location: e.target.value })}
              required
            />
          </Field>
          <Field label="Responsible Department">
            <Select
              value={newDeviation.responsibleDepartment}
              onChange={(e) => setNewDeviation({ ...newDeviation, responsibleDepartment: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Select>
          </Field>
          <Field label="Remarks">
            <Select
              value={newDeviation.remarks}
              onChange={(e) => setNewDeviation({ ...newDeviation, remarks: e.target.value })}
              required
            >
              <option value="">Select Remarks</option>
              {REMARKS_OPTIONS.map(remark => (
                <option key={remark} value={remark}>{remark}</option>
              ))}
            </Select>
          </Field>
          <Field label="Observations" className="col-span-2">
            <Textarea
              value={newDeviation.observations}
              onChange={(e) => setNewDeviation({ ...newDeviation, observations: e.target.value })}
              rows={3}
              required
            />
          </Field>
          <Field label="Photograph (Before)">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = await handleFileUpload(file);
                  setNewDeviation({ ...newDeviation, photographBefore: url });
                }
              }}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm file:mr-3 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-brand-700"
            />
          </Field>
          <Field label="Categorization">
            <Select
              value={newDeviation.categorization}
              onChange={(e) => setNewDeviation({ ...newDeviation, categorization: e.target.value })}
            >
              {CATEGORIZATION_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </Field>
          <Field label="Control Measures" className="col-span-2">
            <Textarea
              value={newDeviation.controlMeasures}
              onChange={(e) => setNewDeviation({ ...newDeviation, controlMeasures: e.target.value })}
              rows={3}
              required
            />
          </Field>
          <div className="col-span-2 flex gap-4">
            <Button type="submit" className="flex-1">
              Create Deviation
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editingDeviation}
        onClose={() => setEditingDeviation(null)}
        size="lg"
        className="max-h-[90vh] overflow-y-auto"
      >
        {editingDeviation && (
          <>
            <h2 className="mb-4 text-xl font-bold text-brand-700">
              {isAuthenticated ? 'Edit Deviation' : 'Update Deviation (Limited)'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data: any = {};

              if (isAuthenticated) {
                // EHS officers can edit all fields
                data.month = formData.get('month');
                data.date = formData.get('date');
                data.timeOfRound = formData.get('timeOfRound');
                data.location = formData.get('location');
                data.responsibleDepartment = formData.get('responsibleDepartment');
                data.remarks = formData.get('remarks');
                data.observations = formData.get('observations');
                data.photographBefore = editingDeviation.photographBefore;
                data.controlMeasures = formData.get('controlMeasures');
                data.categorization = formData.get('categorization');
              } else {
                // Anonymous users can only edit specific fields
                data.remarksByDepartment = formData.get('remarksByDepartment');
                data.complianceStatus = formData.get('complianceStatus');
                if (editingDeviation.photographAfter) {
                  data.photographAfter = editingDeviation.photographAfter;
                }
              }

              handleUpdateDeviation(editingDeviation.id, data);
            }}>
              {isAuthenticated ? (
                // Full form for EHS officers
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Month">
                    <Input
                      name="month"
                      type="text"
                      defaultValue={editingDeviation.month}
                      required
                    />
                  </Field>
                  <Field label="Date">
                    <Input
                      name="date"
                      type="date"
                      defaultValue={editingDeviation.date.split('T')[0]}
                      required
                    />
                  </Field>
                  <Field label="Time of Round">
                    <Input
                      name="timeOfRound"
                      type="text"
                      defaultValue={editingDeviation.timeOfRound}
                      required
                    />
                  </Field>
                  <Field label="Location">
                    <Input
                      name="location"
                      type="text"
                      defaultValue={editingDeviation.location}
                      required
                    />
                  </Field>
                  <Field label="Responsible Department">
                    <Select
                      name="responsibleDepartment"
                      defaultValue={editingDeviation.responsibleDepartment}
                      required
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Remarks">
                    <Select
                      name="remarks"
                      defaultValue={editingDeviation.remarks}
                      required
                    >
                      {REMARKS_OPTIONS.map(remark => (
                        <option key={remark} value={remark}>{remark}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Observations" className="col-span-2">
                    <Textarea
                      name="observations"
                      defaultValue={editingDeviation.observations}
                      rows={3}
                      required
                    />
                  </Field>
                  <Field label="Control Measures" className="col-span-2">
                    <Textarea
                      name="controlMeasures"
                      defaultValue={editingDeviation.controlMeasures}
                      rows={3}
                      required
                    />
                  </Field>
                  <Field label="Categorization">
                    <Select
                      name="categorization"
                      defaultValue={editingDeviation.categorization}
                    >
                      {CATEGORIZATION_OPTIONS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
              ) : (
                // Limited form for anonymous users
                <div className="space-y-4">
                  <Field label="Photograph (After)">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          setEditingDeviation({ ...editingDeviation, photographAfter: url });
                        }
                      }}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm file:mr-3 file:rounded file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-brand-700"
                    />
                    {editingDeviation.photographAfter && (
                      <img src={editingDeviation.photographAfter} alt="After" className="mt-2 h-32 w-32 rounded object-cover" />
                    )}
                  </Field>
                  <Field label="Remarks by Department">
                    <Textarea
                      name="remarksByDepartment"
                      defaultValue={editingDeviation.remarksByDepartment || ''}
                      rows={3}
                    />
                  </Field>
                  <Field label="Compliance Status">
                    <Select
                      name="complianceStatus"
                      defaultValue={editingDeviation.complianceStatus}
                    >
                      {COMPLIANCE_STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <Button type="submit" className="flex-1">
                  Update
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingDeviation(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
}
