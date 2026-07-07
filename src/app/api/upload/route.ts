// src/app/api/operations/metadata/upload.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import * as XLSX from 'xlsx';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows: any[] = XLSX.utils.sheet_to_json(sheet);

    // Accept all rows without any filtering
    const rows = rawRows.map((row) => ({
      shippingID: String(row.shipping_code ?? '').trim(),
      city:       String(row.city_odd ?? '').trim(),
    }));

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No rows found in file' },
        { status: 400 }
      );
    }

    // In one transaction: clear historic data, reset auto-increment, bulk insert
    await prisma.$executeRawUnsafe('ALTER TABLE ShippingMetadata AUTO_INCREMENT = 1');
    await prisma.$transaction([
      prisma.shippingMetadata.deleteMany(),
      prisma.shippingMetadata.createMany({
        data: rows,
        skipDuplicates: true, // safe-guard if sheet has duplicates
      }),
    ]);

    return NextResponse.json({ success: true, count: rows.length });
  } catch (err: any) {
    console.error('Upload API error:', err);
    return NextResponse.json(
      { error: err.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
