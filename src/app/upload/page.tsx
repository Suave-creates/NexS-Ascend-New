// src/app/upload/page.tsx
'use client';

import { Card, CardBody, PageHeader } from '@/components/ui';
import ExcelUploadForm from '@/components/ExcelUploadForm';

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <PageHeader title="Excel Upload" />
      <Card>
        <CardBody className="space-y-4">
          <p className="text-sm text-gray-600">
            Expected columns: <strong>ShippingID</strong> and <strong>City</strong>
          </p>
          <ExcelUploadForm />
        </CardBody>
      </Card>
    </div>
  );
}
