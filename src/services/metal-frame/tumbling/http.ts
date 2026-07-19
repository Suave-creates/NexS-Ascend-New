import { NextResponse } from 'next/server';
import { TumblingError } from './types';

/** Shared error → HTTP response mapping for every Tumbling API route. */
export function handleRouteError(context: string, err: unknown): NextResponse {
  if (err instanceof TumblingError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(`${context} error:`, err);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
