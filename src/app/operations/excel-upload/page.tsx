// src/app/operations/excel-upload/page.tsx
'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  PageHeader,
  Field,
  Button,
  Alert,
} from '@/components/ui';

export default function OperationsExcelUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an Excel file.');
      return;
    }

    setMessage('Uploading...');
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/operations/excel-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        setMessage(`Successfully uploaded ${data.count} rows.`);
      }
    } catch (err: any) {
      setError(err.message || 'Upload error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Operations Excel Upload"
        subtitle="Import operations data from an Excel workbook (.xlsx / .xls)."
      />

      <Card>
        <CardBody className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Select Excel File" htmlFor="file">
              <input
                id="file"
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => {
                  if (e.target.files) setFile(e.target.files[0]);
                }}
                className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
              />
            </Field>

            <div className="flex justify-end">
              <Button type="submit">Upload</Button>
            </div>
          </form>

          {message && <Alert tone="success">{message}</Alert>}
          {error && <Alert tone="error">{error}</Alert>}
        </CardBody>
      </Card>
    </div>
  );
}
