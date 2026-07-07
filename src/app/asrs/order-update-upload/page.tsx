// src/app/asrs/order-update-upload/page.tsx

'use client';

import { useState } from 'react';
import { Card, PageHeader, Field, Button } from '@/components/ui';

export default function OrderUpdateCsvUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a CSV file.');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Only CSV files are allowed.');
      return;
    }

    setLoading(true);
    setMessage('Uploading...');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/asrs/order-update-dashboard/upload', {
        method: 'POST',
        body: formData,
      });

      // 🔐 DO NOT parse JSON unless response is OK
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Upload failed');
      }

      const data = await res.json();

      setMessage(
        `Successfully uploaded ${data.rowsInserted} rows.`
      );
    } catch (err: any) {
      console.error('CSV upload error:', err);
      setError(err.message || 'Upload error');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-lg text-left">
        <div className="p-6">
          <PageHeader title="Order Update Dashboard – CSV Upload" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Select CSV File">
              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  e.target.files && setFile(e.target.files[0])
                }
                className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                disabled={loading}
              />
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Uploading…' : 'Upload'}
              </Button>
            </div>
          </form>

          {message && (
            <p className="mt-4 text-green-700 break-words">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 text-red-700 break-words">
              {error}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
