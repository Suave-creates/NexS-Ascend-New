// src/app/upload/page.tsx
'use client';

import { Card, PageHeader } from '@/components/ui';
import ExcelUploadForm from '@/components/ExcelUploadForm';

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <div className="p-6">
          <PageHeader title="Excel Upload" />
          <p className="text-black-600 text-sm mb-4">
            Expected columns: <strong>ShippingID</strong> and <strong>City</strong>
          </p>
          <ExcelUploadForm />
        </div>
      </Card>
    </div>
  );
}
