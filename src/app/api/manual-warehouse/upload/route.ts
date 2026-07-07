import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import * as XLSX from 'xlsx';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      raw: false,
    });

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Excel file is empty.' },
        { status: 400 }
      );
    }

    let inserted = 0;

    for (const row of rows) {
      const pid = String(row.PID || '').trim();
      const location = String(row.Location || '').trim();
      const pkg = String(row.Package || '').trim();

      if (!pid || !location || !pkg) continue;

      try {
        await prisma.manualWarehouseSetUp.create({
          data: {
            pid,
            location,
            package: pkg,
          },
        });
        inserted++;
      } catch (err: any) {
        // Ignore duplicates (pid is unique)
        if (err.code !== 'P2002') {
          console.error('Insert error:', err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
    });
  } catch (err: any) {
    console.error('Upload API error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
