export type CancellationDecision = 'CONCERN' | 'OUT_OF_SCOPE' | 'REVIEW';

export type RawCancellationRow = {
  created_at?: unknown;
  increment_id?: unknown;
  item_id?: unknown;
  uw_item_id?: unknown;
  cancelled_date?: unknown;
  cancelled_by?: unknown;
  reason_for_cancellation?: unknown;
  facility?: unknown;
  facility_code?: unknown;
  handover_type?: unknown;
  city?: unknown;
  channel?: unknown;
  brand?: unknown;
  lens_package?: unknown;
  power_type?: unknown;
  payment_method?: unknown;
  unicom_order_code?: unknown;
  item_delivery_status?: unknown;
};

export type CancellationExtract = {
  totalOrders: number;
  sourceRows: number;
  totalItemIds: number;
  totalUwItemIds: number;
  missingUwItemRows: number;
  duplicateUwItemRows: number;
  candidateItemCount: number;
  rows: RawCancellationRow[];
  reasonTotals: Array<{ name: string; total: number }>;
  facilityTotals: Array<{ name: string; total: number }>;
  unknownReasons: string[];
  sheetEvidence: {
    frameLocalFitting: string[];
    framePlant: string[];
    power: string[];
  };
  sources: { powerBi: string; googleSheets: string };
  warnings: string[];
};

export type CancellationRecord = {
  incrementId: string;
  uwItemCount: number;
  uwItemIds: string[];
  createdAt: string;
  cancelledAt: string;
  ageingDays: number;
  cancelledBy: string;
  initiator: string;
  reason: string;
  facility: string;
  facilityCode: string;
  handoverTypes: string[];
  city: string;
  channel: string;
  decision: Exclude<CancellationDecision, 'OUT_OF_SCOPE'>;
  rule: string;
  evidence: string[];
};

type EvidenceSources = {
  frameLocalFitting: Set<string>;
  framePlant: Set<string>;
  power: Set<string>;
  portal: Set<string>;
  googleAvailable: boolean;
  portalAvailable: boolean;
};

type Classification = {
  decision: CancellationDecision;
  rule: string;
  evidence: string[];
};

const DAY_MS = 86_400_000;

const PLANT_CANCELLERS = new Set([
  'swati.sharma@lenskart.mobi',
  'saleem.sheikh@lenskart.com',
  'rajesh.kumar2@thelenskart.com',
  'ashish.kumar1@lenskart.mobi',
  'vishal.bohra@lenskart.in',
]);

const CUSTOMER_DELAY_REASONS = new Set([
  'need a different product/lens package',
  'delivery time too long',
  'frame / lens change needed',
  'delay in dispatch',
  'high power restriction',
  'frame height issue / precal / dia',
  'getting delayed due to any reason',
  'stock not available',
  'product out of stock',
]);

const FRAME_SHEET_REASONS = new Set([
  'frame damaged/broken by lf vendor',
  'lf order added into cwh gatepass',
]);

const POWER_SHEET_REASONS = new Set([
  'need to change power/ power not available',
  'power not compatible',
  'base curvature issue',
]);

const ONE_DAY_REASONS = new Set(['tat breached', 'wrong power details']);

const KNOWN_OUT_OF_SCOPE_REASONS = new Set([
  'auto cancelled due to prolonged no response from customer',
  'ordered by mistake',
  'medibuddy panel rejected case',
  'others',
  'other',
  'found lower price elsewhere',
  'shipping address incorrect',
  'customer mind changed',
  'no response for 15+ days',
  'cs team requested for cancellation',
  'no response',
  'wrong frame selection',
  'test order',
  'medibuddy customer requested agent driven cancelation',
  'tech issue',
  'medibuddy unff/lost in courier/lost in warehouse cases',
  'market place order cancellation request',
  'not synced order',
  'urgent delivery unfulfilled by lf vendor',
  'cut lens',
]);

function text(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

export function normalizeCancellationId(value: unknown): string {
  const normalized = text(value).replace(/^'+/, '').replaceAll(',', '').replace(/\.0+$/, '');
  return normalized.toLowerCase();
}

function normalizeReason(value: unknown): string {
  return text(value).replace(/\s+/g, ' ').toLowerCase();
}

function dateMs(value: unknown): number | null {
  const raw = text(value);
  if (!raw) return null;
  const hasTimeZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(raw);
  const parsed = Date.parse(hasTimeZone || !raw.includes('T') ? raw : `${raw}+05:30`);
  return Number.isFinite(parsed) ? parsed : null;
}

function elapsedDays(row: RawCancellationRow): number | null {
  const created = dateMs(row.created_at);
  const cancelled = dateMs(row.cancelled_date);
  if (created == null || cancelled == null || cancelled < created) return null;
  return (cancelled - created) / DAY_MS;
}

function formatDays(value: number): string {
  return `${value.toFixed(1)} days from creation to cancellation`;
}

function classifyInitiator(cancelledBy: string): string {
  const value = cancelledBy.toLowerCase();
  if (!value) return 'Unknown';
  if (value === 'chatbot') return 'Customer';
  if (value === 'autocanceljob' || value === 'auto canncellation') return 'Automated';
  if (value.includes('voicebot')) return 'Voicebot';
  if (value.includes('fos') || value.includes('store')) return 'Store / FOS';
  if (PLANT_CANCELLERS.has(value)) return 'Plant team';
  if (value === 'bhim.bhusal@lenskart.com') return 'PFU';
  if (value.includes('@')) return 'Internal / partner';
  return 'System';
}

function classifyRow(row: RawCancellationRow, sources: EvidenceSources): Classification {
  const reason = normalizeReason(row.reason_for_cancellation);
  const cancelledBy = text(row.cancelled_by).toLowerCase();
  const orderId = normalizeCancellationId(row.increment_id);
  const days = elapsedDays(row);

  if (cancelledBy.includes('voicebot')) {
    return {
      decision: 'OUT_OF_SCOPE',
      rule: 'Voicebot cancellations are explicitly outside plant scope.',
      evidence: [`Cancelled by ${text(row.cancelled_by)}`],
    };
  }

  if (cancelledBy === 'autocanceljob') {
    return {
      decision: 'OUT_OF_SCOPE',
      rule: 'Automatic prolonged-no-response cancellations are outside plant scope.',
      evidence: ['Cancelled by AutoCancelJob'],
    };
  }

  if (!reason) {
    return {
      decision: 'REVIEW',
      rule: 'Cancellation reason is missing.',
      evidence: ['No reason was supplied by the source report'],
    };
  }

  if (CUSTOMER_DELAY_REASONS.has(reason)) {
    if (!PLANT_CANCELLERS.has(cancelledBy)) {
      return {
        decision: 'OUT_OF_SCOPE',
        rule: 'Customer/store cancellation; only named plant cancellers can create a plant concern.',
        evidence: [`Cancelled by ${text(row.cancelled_by) || 'unknown user'}`],
      };
    }
    if (days == null) {
      return {
        decision: 'REVIEW',
        rule: 'The 5-day plant threshold cannot be evaluated without valid dates.',
        evidence: [`Named plant canceller: ${text(row.cancelled_by)}`],
      };
    }
    return days > 5
      ? {
          decision: 'CONCERN',
          rule: 'Named plant canceller and cancellation occurred more than 5 days after creation.',
          evidence: [`Named plant canceller: ${text(row.cancelled_by)}`, formatDays(days)],
        }
      : {
          decision: 'OUT_OF_SCOPE',
          rule: 'Named plant canceller, but the cancellation did not cross the 5-day threshold.',
          evidence: [formatDays(days)],
        };
  }

  if (ONE_DAY_REASONS.has(reason)) {
    if (cancelledBy === 'bhim.bhusal@lenskart.com') {
      return {
        decision: 'OUT_OF_SCOPE',
        rule: 'Cancellation was raised by PFU and is outside plant scope.',
        evidence: ['PFU canceller: bhim.bhusal@lenskart.com'],
      };
    }
    if (days == null) {
      return {
        decision: 'REVIEW',
        rule: 'The 1-day plant threshold cannot be evaluated without valid dates.',
        evidence: [],
      };
    }
    return days > 1
      ? {
          decision: 'CONCERN',
          rule: 'Non-PFU cancellation occurred more than 1 day after creation.',
          evidence: [formatDays(days)],
        }
      : {
          decision: 'OUT_OF_SCOPE',
          rule: 'Cancellation did not cross the 1-day plant threshold.',
          evidence: [formatDays(days)],
        };
  }

  if (FRAME_SHEET_REASONS.has(reason)) {
    if (!sources.googleAvailable) {
      return {
        decision: 'REVIEW',
        rule: 'LF/CWH sheet membership is required, but Google Sheets is unavailable.',
        evidence: [],
      };
    }
    const evidence: string[] = [];
    if (sources.frameLocalFitting.has(orderId)) evidence.push('Found in LO(Local Fitting)');
    if (sources.framePlant.has(orderId)) evidence.push('Found in LO(Plant)');
    return evidence.length
      ? {
          decision: 'CONCERN',
          rule: 'Order is present in an LF/CWH evidence sheet.',
          evidence,
        }
      : {
          decision: 'OUT_OF_SCOPE',
          rule: 'Order is absent from both LF/CWH evidence sheets.',
          evidence: [],
        };
  }

  if (POWER_SHEET_REASONS.has(reason)) {
    if (!sources.googleAvailable) {
      return {
        decision: 'REVIEW',
        rule: 'Power-exception sheet membership is required, but Google Sheets is unavailable.',
        evidence: [],
      };
    }
    return sources.power.has(orderId)
      ? {
          decision: 'CONCERN',
          rule: 'Order is present in the UNFF power-exception sheet.',
          evidence: ['Found in UNFF Single File'],
        }
      : {
          decision: 'OUT_OF_SCOPE',
          rule: 'Order is absent from the UNFF power-exception sheet.',
          evidence: [],
        };
  }

  if (reason === 'frame lost by lf vendor') {
    if (!sources.portalAvailable) {
      return {
        decision: 'REVIEW',
        rule: 'Cancellation Portal membership is required, but the portal is unavailable.',
        evidence: [],
      };
    }
    return sources.portal.has(orderId)
      ? {
          decision: 'CONCERN',
          rule: 'Order has a matching Cancellation Portal request.',
          evidence: ['Found in Cancellation Portal'],
        }
      : {
          decision: 'OUT_OF_SCOPE',
          rule: 'No matching Cancellation Portal request was found.',
          evidence: [],
        };
  }

  if (KNOWN_OUT_OF_SCOPE_REASONS.has(reason)) {
    return {
      decision: 'OUT_OF_SCOPE',
      rule: 'Reason is explicitly outside plant scope.',
      evidence: [],
    };
  }

  return {
    decision: 'REVIEW',
    rule: 'No classification rule exists for this reason.',
    evidence: [`Unmapped reason: ${text(row.reason_for_cancellation)}`],
  };
}

function preferredValue(rows: RawCancellationRow[], key: keyof RawCancellationRow): string {
  for (const row of rows) {
    const value = text(row[key]);
    if (value) return value;
  }
  return '';
}

function selectDate(rows: RawCancellationRow[], key: 'created_at' | 'cancelled_date', latest: boolean): string {
  const valid = rows
    .map((row) => ({ raw: text(row[key]), stamp: dateMs(row[key]) }))
    .filter((entry): entry is { raw: string; stamp: number } => entry.stamp != null);
  valid.sort((a, b) => latest ? b.stamp - a.stamp : a.stamp - b.stamp);
  return valid[0]?.raw || preferredValue(rows, key);
}

const DECISION_WEIGHT: Record<CancellationDecision, number> = {
  CONCERN: 3,
  REVIEW: 2,
  OUT_OF_SCOPE: 1,
};

export function buildCancellationDashboard(
  extract: CancellationExtract,
  portalOrderIds: Iterable<string>,
  portalStatus: string,
  portalWarnings: string[] = [],
) {
  const sources: EvidenceSources = {
    frameLocalFitting: new Set(extract.sheetEvidence.frameLocalFitting.map(normalizeCancellationId)),
    framePlant: new Set(extract.sheetEvidence.framePlant.map(normalizeCancellationId)),
    power: new Set(extract.sheetEvidence.power.map(normalizeCancellationId)),
    portal: new Set([...portalOrderIds].map(normalizeCancellationId)),
    googleAvailable: extract.sources.googleSheets === 'ok',
    portalAvailable: portalStatus === 'ok',
  };

  const grouped = new Map<string, RawCancellationRow[]>();
  for (const row of extract.rows) {
    const incrementId = normalizeCancellationId(row.increment_id);
    const itemId = normalizeCancellationId(row.item_id);
    const uwItemId = normalizeCancellationId(row.uw_item_id);
    const key = incrementId || `uw:${uwItemId || itemId || grouped.size + 1}`;
    const current = grouped.get(key) || [];
    current.push(row);
    grouped.set(key, current);
  }

  const allClassified = [...grouped.entries()].map(([key, rows]) => {
    const classified = rows.map((row) => ({ row, result: classifyRow(row, sources) }));
    classified.sort((a, b) => DECISION_WEIGHT[b.result.decision] - DECISION_WEIGHT[a.result.decision]);
    const selected = classified[0];
    const createdAt = selectDate(rows, 'created_at', false);
    const cancelledAt = selectDate(rows, 'cancelled_date', true);
    const createdStamp = dateMs(createdAt);
    const cancelledStamp = dateMs(cancelledAt);
    const ageingDays = createdStamp != null && cancelledStamp != null && cancelledStamp >= createdStamp
      ? (cancelledStamp - createdStamp) / DAY_MS
      : 0;
    const facility = preferredValue(rows, 'facility');
    const facilityCode = preferredValue(rows, 'facility_code');
    const uwItemIds = new Set(rows.map((row) => normalizeCancellationId(row.uw_item_id)).filter(Boolean));
    const handoverTypes = [
      ...new Set(rows.map((row) => text(row.handover_type)).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));

    return {
      incrementId: normalizeCancellationId(selected.row.increment_id) || key,
      uwItemCount: uwItemIds.size,
      uwItemIds: [...uwItemIds],
      createdAt,
      cancelledAt,
      ageingDays: Number(ageingDays.toFixed(1)),
      cancelledBy: text(selected.row.cancelled_by) || 'Unknown',
      initiator: classifyInitiator(text(selected.row.cancelled_by)),
      reason: text(selected.row.reason_for_cancellation) || 'Unspecified',
      facility: facility || facilityCode || 'Unassigned',
      facilityCode,
      handoverTypes,
      city: preferredValue(rows, 'city') || '—',
      channel: preferredValue(rows, 'channel') || '—',
      decision: selected.result.decision,
      rule: selected.result.rule,
      evidence: [...new Set(selected.result.evidence)],
    };
  });

  const records = allClassified
    .filter((record): record is CancellationRecord => record.decision !== 'OUT_OF_SCOPE')
    .sort((a, b) => {
      if (a.decision !== b.decision) return a.decision === 'CONCERN' ? -1 : 1;
      return (dateMs(b.cancelledAt) || 0) - (dateMs(a.cancelledAt) || 0);
    });
  const concernedOrders = allClassified.filter((record) => record.decision === 'CONCERN').length;
  const needsReviewOrders = allClassified.filter((record) => record.decision === 'REVIEW').length;

  const concernedByReason = new Map<string, number>();
  const concernedByFacility = new Map<string, number>();
  for (const record of records) {
    if (record.decision !== 'CONCERN') continue;
    concernedByReason.set(record.reason, (concernedByReason.get(record.reason) || 0) + 1);
    concernedByFacility.set(record.facility, (concernedByFacility.get(record.facility) || 0) + 1);
  }

  const warnings = [...extract.warnings, ...portalWarnings];
  if (extract.missingUwItemRows || extract.duplicateUwItemRows) {
    warnings.push(
      `UW item reconciliation needs attention: ${extract.missingUwItemRows.toLocaleString('en-IN')} missing and ${extract.duplicateUwItemRows.toLocaleString('en-IN')} duplicate uw_item_id rows.`,
    );
  }
  if (extract.totalItemIds !== extract.totalUwItemIds) {
    warnings.push(
      `Distinct item_id (${extract.totalItemIds.toLocaleString('en-IN')}) and uw_item_id (${extract.totalUwItemIds.toLocaleString('en-IN')}) counts do not match.`,
    );
  }
  const candidateRowsWithoutUwItemId = extract.rows.filter(
    (row) => !normalizeCancellationId(row.uw_item_id),
  ).length;
  if (candidateRowsWithoutUwItemId) {
    warnings.push(
      `${candidateRowsWithoutUwItemId.toLocaleString('en-IN')} candidate rows have no uw_item_id.`,
    );
  }
  if (extract.unknownReasons.length) {
    warnings.push(`New cancellation reasons need rule review: ${extract.unknownReasons.join(', ')}`);
  }

  return {
    metrics: {
      totalOrders: extract.totalOrders,
      sourceRows: extract.sourceRows,
      totalItemIds: extract.totalItemIds,
      totalUwItemIds: extract.totalUwItemIds,
      missingUwItemRows: extract.missingUwItemRows,
      duplicateUwItemRows: extract.duplicateUwItemRows,
      candidateOrders: grouped.size,
      concernedOrders,
      outOfScopeOrders: Math.max(0, extract.totalOrders - concernedOrders - needsReviewOrders),
      needsReviewOrders,
    },
    sources: {
      powerBi: extract.sources.powerBi,
      googleSheets: extract.sources.googleSheets,
      cancellationPortal: portalStatus,
      warnings,
    },
    records,
    breakdowns: {
      reasons: extract.reasonTotals.map((item) => ({
        ...item,
        concerned: concernedByReason.get(item.name) || 0,
      })),
      facilities: extract.facilityTotals.map((item) => ({
        ...item,
        concerned: concernedByFacility.get(item.name) || 0,
      })),
    },
  };
}
