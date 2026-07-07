import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { authMiddleware } from '@/middleware/auth';

interface DeviationInput {
  month: string;
  date: string;
  timeOfRound: string;
  location: string;
  responsibleDepartment: string;
  remarks: string;
  observations: string;
  photographBefore?: string;
  controlMeasures: string;
  photographAfter?: string;
  categorization?: string;
  remarksByDepartment?: string;
  complianceStatus?: string;
  complianceDate?: string;
}

// GET — List deviations with optional date filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const deviations = await prisma.eHSDeviation.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });

    const deviationsWithPendingDays = deviations.map((dev) => {
      const start = new Date(dev.date).getTime();

      const pendingDays =
        dev.complianceStatus === 'Closed' && dev.complianceDate
          ? Math.floor(
              (new Date(dev.complianceDate).getTime() - start) /
              (1000 * 60 * 60 * 24)
            )
          : Math.floor(
              (Date.now() - start) /
              (1000 * 60 * 60 * 24)
            );

      return { ...dev, pendingDays };
    });

    return NextResponse.json(deviationsWithPendingDays);
  } catch (error) {
    console.error('Get deviations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deviations' },
      { status: 500 }
    );
  }
}

// POST — Create new deviation (protected)
export const POST = authMiddleware(async (req: NextRequest) => {
  try {
    const data = (await req.json()) as DeviationInput;

    const deviation = await prisma.eHSDeviation.create({
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
        categorization: data.categorization || 'Yellow',
        remarksByDepartment: data.remarksByDepartment,
        complianceStatus: data.complianceStatus || 'Open',
        complianceDate:
          data.complianceStatus === 'Closed' ? new Date() : undefined,
      },
    });

    return NextResponse.json(deviation);
  } catch (error) {
    console.error('Create deviation error:', error);
    return NextResponse.json(
      { error: 'Failed to create deviation' },
      { status: 500 }
    );
  }
});
