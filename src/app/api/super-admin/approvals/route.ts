import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { superAdminMiddleware } from '@/middleware/auth';

export const GET = superAdminMiddleware(async () => {
  const requests = await prisma.user.findMany({
    where: { role: 'USER', status: { in: ['PENDING', 'REJECTED'] } },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      employeeCode: true,
      status: true,
      createdAt: true,
      approvedAt: true,
      approvedBy: true,
      rejectionReason: true,
    },
  });

  return NextResponse.json({ requests });
});
