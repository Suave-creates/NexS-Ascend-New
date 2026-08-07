import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// DELETE: Stock-out by barcode or by the operator's scan location.
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = body?.mode === 'location' ? 'location' : 'barcode';
    const value = mode === 'location'
      ? body?.scan_location?.toString().trim()
      : body?.barcode?.toString().trim().slice(-12);

    if (!value) {
      return NextResponse.json(
        { success: false, message: mode === 'location' ? 'Scan location is required' : 'Barcode is required' },
        { status: 400 }
      );
    }

    const deleted = await prisma.scannedBarcodeInventory.deleteMany({
      where: mode === 'location' ? { scanLocation: value } : { barcode: value },
    });

    return NextResponse.json({
      success: true,
      message: 'Stock-out completed',
      deletedCount: deleted.count,
      mode,
      value,
    });

  } catch (error) {
    console.error('Stock-out error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
