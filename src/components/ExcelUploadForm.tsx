// src/components/ExcelUploadForm.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui';

export default function ExcelUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('❌ Please select an Excel file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (res.ok) {
      setMessage(`✅ Uploaded ${data.count} records.`);
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
      />
      <Button type="submit">Upload Excel</Button>
      {message && <p className="mt-2 text-center text-sm text-gray-600">{message}</p>}
    </form>
  );
}
