import { NextResponse } from 'next/server';
import { ensureCentralDump, getCentralDumpStatus } from '@/utils/clClsCentralDump';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() { return NextResponse.json(getCentralDumpStatus()); }
export async function POST(req: Request) {
  const force = new URL(req.url).searchParams.get('force') === 'true';
  return NextResponse.json(ensureCentralDump(force), { status: 202 });
}
