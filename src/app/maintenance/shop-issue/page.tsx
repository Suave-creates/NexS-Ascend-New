'use client';
import React, { useState, useEffect } from 'react';
import { Card, PageHeader, Field, Input, Select, Button, Alert } from '@/components/ui';

const DEPARTMENTS = [
  'BH-M-ASRS - ASRS',
  'BH-M-CNVYR - Conveyor',
  'BH-M-DISP - Dispatch',
  'BH-M-F&QC - Fitting & QC',
  'BH-M-MF - Metal Frame',
  'BH-M-L-ARC - ARC',
  'BH-M-L-H.C. - Hardcoating',
  'BH-M-L-Sur - Surfacing',
  'BH-M-MAIN - Maintenance Others',
  'BH-M-MEI - Edging',
  'BH-M-PACK - Packing',
  'BH-M-F&QC - QC',
  'BH-U-ELEC - Utilities - Electrical',
  'BH-U-MAIN - Utilities - ETP/STP',
  'BH-U-HVAC - Utilities - HVAC',
  'BH-U-COMP - Utilities - Compressor Unit',
  'BH-U-MAIN - Utilities - Others',
  'BH-U-WTP - Utilities - Water Treatment Plant',
].sort();

const CURRENCIES = [
  { label: '₹', value: 'INR' },
  { label: '€', value: 'EUR' },
  { label: '$', value: 'USD' },
];

export default function MaintenanceShopIssuePage() {
  const [pid, setPid] = useState('');
  const [partName, setPartName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('nos');
  const [rate, setRate] = useState(0);
  const [category, setCategory] = useState('R&M');
  const [destination, setDestination] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [currency, setCurrency] = useState('INR');
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTotal(quantity * rate);
  }, [quantity, rate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const issuedAt = new Date().toISOString();
    const payload = {
      pid,
      partName,
      quantity,
      unit,
      rate,
      category,
      destination,
      department,
      total,
      currency,
      issuedAt,
    };

    try {
      const res = await fetch('/api/maintenance/shop-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setMessage('Issue logged successfully');
      // Clear form fields after successful log
      setPid('');
      setPartName('');
      setQuantity(0);
      setUnit('nos');
      setRate(0);
      setCategory('R&M');
      setDestination('');
      setDepartment(DEPARTMENTS[0]);
      setCurrency('INR');
      setTotal(0);
    } catch (err: any) {
      setMessage(err.message || 'Error logging issue');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-8">
      <Card className="relative w-full max-w-md p-6 text-left">
        <PageHeader title="Maintenance: Shop Issue" />
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">

          {/* PID */}
          <Field label="PID" htmlFor="pid">
            <Input
              id="pid"
              type="text"
              value={pid}
              onChange={e => setPid(e.target.value)}
              required
            />
          </Field>

          {/* Spare Part Name */}
          <Field label="Spare Part Name" htmlFor="partName">
            <Input
              id="partName"
              type="text"
              value={partName}
              onChange={e => setPartName(e.target.value)}
              required
            />
          </Field>

          {/* Quantity & Unit */}
          <div className="flex space-x-4">
            <Field label="Quantity" htmlFor="quantity" className="flex-1">
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                required
              />
            </Field>
            <Field label="Unit" htmlFor="unit" className="flex-1">
              <Select
                id="unit"
                value={unit}
                onChange={e => setUnit(e.target.value)}
              >
                <option value="nos">nos</option>
                <option value="pcs">pcs</option>
                <option value="ltr">ltr</option>
                <option value="ea">ea</option>
                <option value="set">set</option>
                <option value="mtr">mtr</option>
                <option value="roll">roll</option>
                <option value="pack">pack</option>
                <option value="kg">kg</option>
              </Select>
            </Field>
          </div>

          {/* Rate & Category */}
          <div className="flex space-x-4">
            <Field label="Rate" htmlFor="rate" className="flex-1">
              <Input
                id="rate"
                type="number"
                min="0"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                required
              />
            </Field>
            <Field label="Category" htmlFor="category" className="flex-1">
              <Select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="R&M">R&M</option>
                <option value="FOC">FOC</option>
                <option value="Tool">Tool</option>
                <option value="Consumable">Consumable</option>
              </Select>
            </Field>
          </div>

          {/* Destination */}
          <Field label="Destination of Use / Machine" htmlFor="destination">
            <Input
              id="destination"
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              required
            />
          </Field>

          {/* Department */}
          <Field label="Department" htmlFor="department">
            <Select
              id="department"
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>

          {/* Currency & Total */}
          <div className="flex space-x-4 items-end">
            <Field label="Currency" htmlFor="currency" className="w-24">
              <Select
                id="currency"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Total" className="flex-1">
              <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100">
                {total.toFixed(2)}
              </div>
            </Field>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Log Issue
          </Button>
        </form>

        {message && (
          <Alert tone="success" className="mt-4">
            {message}
          </Alert>
        )}
      </Card>
    </div>
  );
}
