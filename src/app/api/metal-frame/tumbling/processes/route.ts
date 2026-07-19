import { NextResponse } from 'next/server';
import { listProcessHistory, ProcessHistoryFilters } from '@/services/metal-frame/tumbling/history.service';
import { createDraftProcess } from '@/services/metal-frame/tumbling/process.service';
import { validateOperatorName, validatePagination, validateProduct } from '@/services/metal-frame/tumbling/validators';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';
import { TumblingError } from '@/services/metal-frame/tumbling/types';
import type { TumblingProcessStatus } from '@/generated/metal_frame';

export const dynamic = 'force-dynamic';

const VALID_STATUSES: TumblingProcessStatus[] = ['DRAFT', 'RUNNING', 'COMPLETED', 'COMPLETED_EARLY', 'STOPPED', 'CANCELLED'];

// GET /api/metal-frame/tumbling/processes -> server-side paginated, filterable process history
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;

    const status = sp.get('status');
    if (status && !VALID_STATUSES.includes(status as TumblingProcessStatus)) {
      throw new TumblingError(400, 'Invalid status filter.');
    }

    const filters: ProcessHistoryFilters = {
      search: sp.get('search') || undefined,
      stationNumber: sp.get('stationNumber') ? Number(sp.get('stationNumber')) : undefined,
      containerId: sp.get('containerId') ? Number(sp.get('containerId')) : undefined,
      status: (status as TumblingProcessStatus) || undefined,
      operator: sp.get('operator') || undefined,
      dateFrom: sp.get('dateFrom') ? new Date(sp.get('dateFrom')!) : undefined,
      dateTo: sp.get('dateTo') ? new Date(sp.get('dateTo')!) : undefined,
    };

    const pagination = validatePagination(sp.get('page'), sp.get('pageSize'));
    const result = await listProcessHistory(filters, pagination);
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError('Tumbling processes list', err);
  }
}

// POST /api/metal-frame/tumbling/processes -> create a DRAFT process with its one product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const containerId = Number(body.containerId);
    if (!Number.isInteger(containerId)) throw new TumblingError(400, 'A valid containerId is required.');

    const product = validateProduct(body.product);
    const operatorName = validateOperatorName(body.operatorName);

    const process = await createDraftProcess({ containerId, product, operator: { name: operatorName } });
    return NextResponse.json({ process }, { status: 201 });
  } catch (err) {
    return handleRouteError('Tumbling process create', err);
  }
}
