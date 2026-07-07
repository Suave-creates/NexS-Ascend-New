// src/app/operations/excel-upload/page.tsx
'use client';

import { useState } from 'react';
import { Card, PageHeader, Field, Button } from '@/components/ui';

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
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-lg text-left">
        <div className="p-6">
          <PageHeader title="Operations Excel Upload" />

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

          {message && (
            <p className="mt-4 text-green-700">{message}</p>
          )}
          {error && (
            <p className="mt-4 text-red-700">{error}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
