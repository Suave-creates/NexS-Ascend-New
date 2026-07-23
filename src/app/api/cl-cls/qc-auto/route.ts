import { NextResponse } from 'next/server';
import { getQcRunStatus, startQcRun } from '@/utils/clClsQcRunner';
import { prismaDispatch } from '@/utils/prismaDispatch';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const runId = new URL(req.url).searchParams.get('runId');
  const latestFailure = await prismaDispatch.clClsQcQueueEntry.findFirst({
    where: { state: 'FAILED' }, orderBy: { lastSeenAt: 'asc' },
    select: { barcode: true, fittingId: true, shippingPackageId: true, attempts: true, lastError: true },
  });
  return NextResponse.json({ ...getQcRunStatus(runId), latestFailure });
}

export async function POST(req: Request) {
  const body = await req.json();
  const username = String(body?.username || '').trim();
  const password = String(body?.password || '');
  const rawPackages = Array.isArray(body?.shippingPackageIds)
    ? body.shippingPackageIds
    : String(body?.shippingPackageIds || '').split(/[\r\n,]+/);
  const shippingPackageIds: string[] = [
    ...new Set<string>(rawPackages.map((value: unknown) => String(value).trim()).filter(Boolean)),
  ];
  if (!username || !password) return NextResponse.json({ error: 'Employee code and password are required' }, { status: 400 });
  if (!shippingPackageIds.length) return NextResponse.json({ error: 'At least one Shipping Package ID is required' }, { status: 400 });
  if (shippingPackageIds.length > 500) return NextResponse.json({ error: 'Maximum 500 Shipping Package IDs per run' }, { status: 400 });
  try { return NextResponse.json(startQcRun(username, password, shippingPackageIds), { status: 202 }); }
  catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 409 }); }
}
