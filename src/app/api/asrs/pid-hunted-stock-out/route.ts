import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// DELETE: Stock-out by barcode
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { barcode } = body;

    if (!barcode) {
      return NextResponse.json(
        { success: false, message: 'Barcode is required' },
        { status: 400 }
      );
    }

    // Delete all entries with this barcode
    const deleted = await prisma.scannedBarcodeInventory.deleteMany({
      where: {
        barcode: barcode,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Stock-out completed`,
      deletedCount: deleted.count,
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