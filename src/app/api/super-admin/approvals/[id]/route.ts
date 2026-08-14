import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import {
  superAdminMiddleware,
  type AuthenticatedRequest,
} from '@/middleware/auth';

type Params = { id: string };

export const PATCH = superAdminMiddleware<Params>(async (req: AuthenticatedRequest, { params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid signup request' }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const action = body?.action;
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Action must be approve or reject' }, { status: 400 });
  }

  const rejectionReason = typeof body?.reason === 'string' ? body.reason.trim() : '';
  if (rejectionReason.length > 255) {
    return NextResponse.json({ error: 'Rejection reason is too long' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id } });
      if (!user || user.role !== 'USER') return { outcome: 'not_found' as const };
      if (user.status === 'APPROVED') return { outcome: 'already_approved' as const };

      if (action === 'reject') {
        if (user.status === 'REJECTED') return { outcome: 'already_rejected' as const };
        await tx.user.update({
          where: { id },
          data: {
            status: 'REJECTED',
            approvedAt: null,
            approvedBy: req.user.employeeCode,
            rejectionReason: rejectionReason || null,
          },
        });
        return { outcome: 'rejected' as const };
      }

      await tx.user.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: req.user.employeeCode,
          rejectionReason: null,
        },
      });
      return { outcome: 'approved' as const };
    });

    if (result.outcome === 'not_found') {
      return NextResponse.json({ error: 'Signup request not found' }, { status: 404 });
    }
    if (result.outcome === 'already_approved' || result.outcome === 'already_rejected') {
      return NextResponse.json({ error: 'This request has already been reviewed' }, { status: 409 });
    }

    return NextResponse.json({ status: result.outcome.toUpperCase() });
  } catch (error) {
    console.error('Signup approval error:', error);
    return NextResponse.json({ error: 'Unable to review signup request' }, { status: 500 });
  }
});
