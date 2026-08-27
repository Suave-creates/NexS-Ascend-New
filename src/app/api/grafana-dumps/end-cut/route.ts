import { NextResponse } from 'next/server';

import {
  EndCutBusyError,
  EndCutConfigurationError,
  endCutCsvResponse,
} from '@/lib/server/endCutDump';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 6000;

async function handleGet(request: Request): Promise<NextResponse> {
  try {
    console.info('[grafana-dumps:end-cut] source=mei-jobviewer-sqlserver window=last-48-hours');
    return await endCutCsvResponse(request.signal);
  } catch (error) {
    if (error instanceof EndCutBusyError) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 429,
          headers: { 'Cache-Control': 'no-store', 'Retry-After': '30' },
        },
      );
    }
    if (error instanceof EndCutConfigurationError) {
      console.error('[grafana-dumps:end-cut] data source is not configured');
      return NextResponse.json(
        { error: 'End Cut is not configured on the server.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    const failure = error as { name?: unknown; code?: unknown };
    console.error('[grafana-dumps:end-cut] export failed', {
      name: typeof failure?.name === 'string' ? failure.name : 'Error',
      code: typeof failure?.code === 'string' ? failure.code : 'UNKNOWN',
    });
    return NextResponse.json(
      { error: 'Unable to generate the End Cut export. Check the server logs.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export const GET = handleGet;
