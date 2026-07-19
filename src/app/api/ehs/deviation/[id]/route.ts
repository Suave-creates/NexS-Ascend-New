// src/app/api/ehs/deviation/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { authMiddleware } from '@/middleware/auth';
import type { AuthenticatedRequest } from '@/middleware/auth';

// ─── GET ───────────────────────────────────────────────────────────────────────
// Get a single deviation by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the incoming params promise
    const { id } = await params;
    const deviation = await prisma.eHSDeviation.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!deviation) {
      return NextResponse.json(
        { error: 'Deviation not found' },
        { status: 404 }
      );
    }

    const start = deviation.date.getTime();
    const pendingDays =
        deviation.complianceStatus === 'Closed' && deviation.complianceDate
        ? Math.floor(
            (new Date(deviation.complianceDate).getTime() - start) / (1000 * 60 * 60 * 24)
          )
        : Math.floor(
            (Date.now() - start) / (1000 * 60 * 60 * 24)
          );


    return NextResponse.json({ ...deviation, pendingDays });
  } catch (error) {
    console.error('Get deviation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deviation' },
      { status: 500 }
    );
  }
}

// ─── PUT ───────────────────────────────────────────────────────────────────────
// Update deviation (protected)
export const PUT = authMiddleware<{ id: string }>(
  async (
    req: AuthenticatedRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      const { id } = params;
      const data = await req.json();

      const deviation = await prisma.eHSDeviation.update({
        where: { id: parseInt(id, 10) },
        data: {
          month: data.month,
          date: new Date(data.date),
          timeOfRound: data.timeOfRound,
          location: data.location,
          responsibleDepartment: data.responsibleDepartment,
          remarks: data.remarks,
          observations: data.observations,
          photographBefore: data.photographBefore,
          controlMeasures: data.controlMeasures,
          photographAfter: data.photographAfter,
          categorization: data.categorization,
          remarksByDepartment: data.remarksByDepartment,
          complianceStatus: data.complianceStatus,
        },
      });

      return NextResponse.json(deviation);
    } catch (error) {
      console.error('Update deviation error:', error);
      return NextResponse.json(
        { error: 'Failed to update deviation' },
        { status: 500 }
      );
    }
  }
);

// ─── DELETE ────────────────────────────────────────────────────────────────────
// Delete deviation (protected)
export const DELETE = authMiddleware<{ id: string }>(
  async (
    req: AuthenticatedRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      const { id } = params;
      await prisma.eHSDeviation.delete({
        where: { id: parseInt(id, 10) },
      });

      return NextResponse.json({
        message: 'Deviation deleted successfully',
      });
    } catch (error) {
      console.error('Delete deviation error:', error);
      return NextResponse.json(
        { error: 'Failed to delete deviation' },
        { status: 500 }
      );
    }
  }
);
