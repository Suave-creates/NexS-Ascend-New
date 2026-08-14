import { NextResponse } from 'next/server';
import { ensureCentralDump, getCentralDumpStatus } from '@/utils/clClsCentralDump';
import { authMiddleware } from '@/middleware/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = authMiddleware(async () => NextResponse.json(getCentralDumpStatus()));
export const POST = authMiddleware(async (req: Request) => {
  const force = new URL(req.url).searchParams.get('force') === 'true';
  return NextResponse.json(ensureCentralDump(force), { status: 202 });
});
