import { NextResponse } from 'next/server';
import { prismaMetalFrame } from '@/utils/prismaMetalFrame';

const prisma = prismaMetalFrame;

export async function POST(req: Request) {
  try {
    const data = await req.json();

    /* =========================
       Category Validation
    ========================= */
    if (!data.categoryOfWork?.trim()) {
      return NextResponse.json(
        { error: 'Category of Work is required' },
        { status: 400 }
      );
    }

    if (!['Fresh', 'Rework'].includes(data.categoryOfWork)) {
      return NextResponse.json(
        { error: 'Invalid Category of Work' },
        { status: 400 }
      );
    }

    /* =========================
       NG Calculation
    ========================= */
    const ng = data.totalQuantity - data.qcQuantity;

    if (ng < 0) {
      return NextResponse.json(
        { error: 'QC cannot exceed total' },
        { status: 400 }
      );
    }

    const breakupTotal =
      data.copperRejection +
      data.nickelRejection +
      data.lineRejection +
      data.fqcRejection;

    if (breakupTotal !== ng) {
      return NextResponse.json(
        { error: 'NG breakup mismatch' },
        { status: 400 }
      );
    }

    /* =========================
       Insert
    ========================= */
    await prisma.plating.create({
      data: {
        categoryOfWork: data.categoryOfWork,
        modelId: data.modelId,
        size: data.size,
        finish: data.finish,
        totalQuantity: data.totalQuantity,
        qcQuantity: data.qcQuantity,
        ngQuantity: ng,
        copperRejection: data.copperRejection,
        nickelRejection: data.nickelRejection,
        lineRejection: data.lineRejection,
        fqcRejection: data.fqcRejection,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Plating POST error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}