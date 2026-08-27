export const FRAME_INVENTORY_SOURCES = [
  { key: 'asrs', label: 'ASRS', hasDoh: true },
  { key: 'nxs1', label: 'NXS1', hasDoh: true },
  { key: 'nxs2', label: 'NXS2', hasDoh: true },
  { key: 'eglManual', label: 'EGL Manual 05', hasDoh: false },
  { key: 'putawayPending', label: 'Putaway Pending', hasDoh: false },
] as const;

export type FrameInventorySourceKey = (typeof FRAME_INVENTORY_SOURCES)[number]['key'];
export type FrameStockStatus = 'No Stock' | 'Sufficient' | 'Insufficient';
export type FrameSourceMetrics = {
  count: number;
  doh: number | null;
  status7Day: FrameStockStatus | null;
  status10Day: FrameStockStatus | null;
};

export type FrameDecantingRow = {
  productId: string;
  brand: string;
  productType: string;
  plc: string;
  rosPerDayHighestMonth: number;
  flag: '' | 'New PID';
  target7Day: number;
  target10Day: number;
  rosWindowStart: string;
  rosWindowEnd: string;
  sources: Record<FrameInventorySourceKey, FrameSourceMetrics>;
  iqcStatus: string;
  pidQty: number;
  grnQty: number;
  transferPendency: number;
  bulkRequired: number;
  totalInventory: number;
  nxs1Split: number;
  sevenDayRequirement: number;
  sevenDayShortage: number;
  availableOtherThanAsrs: number;
  decantComment: string;
  comments: string;
};

export type FrameDecantingSummary = {
  totalPids: number;
  newPids: number;
  grnMatchedPids: number;
  totalInventory: number;
  priority: {
    p0: number;
    p1: number;
    hhd: number;
    extraInAsrs: number;
    checkTransfers: number;
  };
  sourceTotals: Record<FrameInventorySourceKey, number>;
  decantDistribution: Array<{ name: string; count: number }>;
  commentsDistribution: Array<{ name: string; count: number }>;
};

export type RawFrameRosRow = { pid?: unknown; month?: unknown; sales?: unknown };
export type RawFrameInventoryRow = Record<string, unknown>;
export type RawFrameGrnRow = {
  pid?: unknown;
  iqcStatus?: unknown;
  pidQty?: unknown;
  grnQty?: unknown;
};
export type RawFrameCountRow = { pid?: unknown; count?: unknown };
export type RawFramePlcRow = { pid?: unknown; plc?: unknown };

const INVENTORY_FIELDS: Record<FrameInventorySourceKey, string> = {
  asrs: 'asrs_count',
  nxs1: 'nxs1_count',
  nxs2: 'nxs2_count',
  eglManual: 'egl_manual_05_count',
  putawayPending: 'putaway_pending_count',
};
const FRAME_PID = /^\d{5,6}$/;
const DUMP_ONLY_PID = /^\d{6}$/;
const REMOVE_PRODUCT_TYPES = new Set([
  'accessories',
  'case',
  'chains',
  'gold membership',
  'contact lens',
  'contact lens-fast moving',
  'contact lens-cylindrical',
  'contact lens-spherical',
  'contact lens-solution',
]);
const NO_DECANT_BRANDS = new Set([
  'branded',
  'mask',
  'fallon colby',
  'matt eyewear',
  'new balance',
  'polaroid',
  'phonic',
]);

export const FRAME_DECANT_300 =
  'Decant (300- ASRS COUNT ) Qty nearest to 10 multiple of Available other than ASRS';
export const FRAME_DECANT_700 =
  'Decant (700- ASRS COUNT ) Qty nearest to 10 multiple of Available other than ASRS';
export const FRAME_DECANT_7_DAY =
  'Decant (7 Day Count- ASRS COUNT ) Qty nearest to 10 multiple of Available other than ASRS';

const P0_TRANSFER = 'P0 Transfer 70% of Total Inventory - NXS1 Count';
const P1_TRANSFER = 'P1 Transfer 70% of Total Inventory - NXS1 Count';
const P2_TRANSFER = 'P2 Transfer 70% of Total Inventory - NXS1 Count';

function text(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

export function normalizeFramePid(value: unknown): string {
  const normalized = text(value);
  return /^\d+\.0$/.test(normalized) ? normalized.slice(0, -2) : normalized;
}

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function integer(value: unknown): number {
  return Math.trunc(number(value));
}

const FLOAT64_VIEW = new DataView(new ArrayBuffer(8));
const ONE = BigInt(1);
const TWO = BigInt(2);
const FRACTION_BITS = BigInt(52);
const EXPONENT_MASK = BigInt(0x7ff);
const FRACTION_MASK = (ONE << FRACTION_BITS) - ONE;

function roundHalfEven(value: number, digits: number): number {
  if (!Number.isFinite(value) || value === 0) return value;
  FLOAT64_VIEW.setFloat64(0, Math.abs(value), false);
  const bits = FLOAT64_VIEW.getBigUint64(0, false);
  const exponentBits = Number((bits >> FRACTION_BITS) & EXPONENT_MASK);
  let mantissa = bits & FRACTION_MASK;
  let binaryExponent: number;
  if (exponentBits === 0) {
    binaryExponent = -1022 - 52;
  } else {
    mantissa |= ONE << FRACTION_BITS;
    binaryExponent = exponentBits - 1023 - 52;
  }
  let numerator = mantissa * (BigInt(5) ** BigInt(digits));
  binaryExponent += digits;
  let rounded: bigint;
  if (binaryExponent >= 0) {
    rounded = numerator << BigInt(binaryExponent);
  } else {
    const denominator = ONE << BigInt(-binaryExponent);
    let quotient = numerator / denominator;
    const twiceRemainder = (numerator % denominator) * TWO;
    if (twiceRemainder > denominator || (twiceRemainder === denominator && quotient % TWO === ONE)) {
      quotient += ONE;
    }
    rounded = quotient;
  }
  if (value < 0) rounded = -rounded;
  return Number(rounded) / (10 ** digits);
}

function daysInMonth(monthKey: string): number {
  const match = /^(\d{4})-(\d{2})$/.exec(monthKey);
  if (!match) return 0;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]), 0)).getUTCDate();
}

function aggregateRos(rows: RawFrameRosRow[]): Map<string, number> {
  const monthly = new Map<string, Map<string, number>>();
  for (const row of rows) {
    const pid = normalizeFramePid(row.pid);
    const month = text(row.month);
    if (!FRAME_PID.test(pid) || !daysInMonth(month)) continue;
    let months = monthly.get(pid);
    if (!months) {
      months = new Map();
      monthly.set(pid, months);
    }
    months.set(month, (months.get(month) ?? 0) + number(row.sales));
  }

  const result = new Map<string, number>();
  for (const [pid, months] of monthly) {
    let highest = 0;
    for (const [month, sales] of months) {
      highest = Math.max(highest, roundHalfEven(sales / daysInMonth(month), 4));
    }
    result.set(pid, highest);
  }
  return result;
}

function inventoryByPid(rows: RawFrameInventoryRow[]): Map<string, RawFrameInventoryRow> {
  const result = new Map<string, RawFrameInventoryRow>();
  for (const row of rows) {
    const pid = normalizeFramePid(row.pid);
    if (!pid) continue;
    const current = result.get(pid);
    if (!current) {
      result.set(pid, { ...row });
      continue;
    }
    for (const field of Object.values(INVENTORY_FIELDS)) {
      current[field] = integer(current[field]) + integer(row[field]);
    }
    if (!text(current.brand) && text(row.brand)) current.brand = row.brand;
    if (!text(current.product_type) && text(row.product_type)) current.product_type = row.product_type;
  }
  return result;
}

function countsByPid(rows: RawFrameCountRow[]): Map<string, number> {
  const result = new Map<string, number>();
  for (const row of rows) {
    const pid = normalizeFramePid(row.pid);
    if (pid) result.set(pid, (result.get(pid) ?? 0) + integer(row.count));
  }
  return result;
}

function plcByPid(rows: RawFramePlcRow[]): Map<string, string> {
  const result = new Map<string, string>();
  for (const row of rows) {
    const pid = normalizeFramePid(row.pid);
    if (pid) result.set(pid, text(row.plc));
  }
  return result;
}

type GrnAggregate = { statuses: Set<string>; pidQty: number; grnQty: number };
function grnByPid(rows: RawFrameGrnRow[]): Map<string, GrnAggregate> {
  const result = new Map<string, GrnAggregate>();
  for (const row of rows) {
    const pid = normalizeFramePid(row.pid);
    if (!pid) continue;
    let aggregate = result.get(pid);
    if (!aggregate) {
      aggregate = { statuses: new Set(), pidQty: 0, grnQty: 0 };
      result.set(pid, aggregate);
    }
    const status = text(row.iqcStatus);
    if (status) aggregate.statuses.add(status);
    aggregate.pidQty += integer(row.pidQty);
    aggregate.grnQty += integer(row.grnQty);
  }
  return result;
}

function plcIsExclusive(value: string): boolean {
  const plc = value.trim().toLowerCase();
  if (!plc || ['#n/a', 'na', 'n/a', 'nan', 'none'].includes(plc)) return true;
  if (plc.includes('excl')) return true;
  return ['singapore ex', 'discontinued', 'sizing'].includes(plc);
}

function demandTarget(ros: number, days: number, fallback: number): number {
  return ros < 1 ? fallback : Math.ceil((ros * days) / 100) * 100;
}

function status(count: number, target: number): FrameStockStatus {
  if (count === 0) return 'No Stock';
  return count >= target ? 'Sufficient' : 'Insufficient';
}

function frameDecantComment(row: Omit<FrameDecantingRow, 'decantComment' | 'comments'>): string {
  if (NO_DECANT_BRANDS.has(row.brand.trim().toLowerCase())) return 'BRANDED DO NOT DECANT';
  const exclusive = plcIsExclusive(row.plc);
  const cap = exclusive ? 300 : 700;
  const decant = exclusive ? FRAME_DECANT_300 : FRAME_DECANT_700;
  const ros = row.rosPerDayHighestMonth;
  const asrs = row.sources.asrs.count;
  const asrsDoh = row.sources.asrs.doh ?? 0;
  const available = row.availableOtherThanAsrs;
  const nxs2 = row.sources.nxs2.count;

  if (ros === 0) {
    if (available > 0 && asrs <= cap) return decant;
    if ((row.plc.trim().toLowerCase() === 'discontinued' && asrs > 0) || asrs > cap) {
      return 'Check for Retrieval';
    }
    return 'All ok';
  }
  if (ros > 0 && ros <= 3 && asrsDoh < 7 && available > 120) return decant;
  if (ros > 0 && asrsDoh < 7 && available <= 120) {
    return nxs2 > 120 ? 'Check for Transfers' : 'All ok No Stock';
  }
  if (asrsDoh >= 7 && asrsDoh <= 15) return 'All ok';
  if (ros > 3 && asrsDoh < 7 && available > 120) {
    return exclusive ? FRAME_DECANT_300 : FRAME_DECANT_7_DAY;
  }
  if (asrsDoh > 15) return 'Over Decanted';
  return 'All ok';
}

function frameTransferComment(
  row: Omit<FrameDecantingRow, 'decantComment' | 'comments'>,
  decantComment: string,
): string {
  if (decantComment === 'BRANDED DO NOT DECANT') return 'Planning teams Call';
  const exclusive = plcIsExclusive(row.plc);
  if (decantComment === 'Check for Transfers') return exclusive ? P2_TRANSFER : P0_TRANSFER;
  if (['Over Decanted', 'Check for Retrieval', 'All ok No Stock'].includes(decantComment)) {
    return 'All ok';
  }
  if (row.nxs1Split >= 0.7) return 'All ok';
  return exclusive ? 'Required but Planning teams Call' : P1_TRANSFER;
}

function distribution(values: string[]): Array<{ name: string; count: number }> {
  const grouped = new Map<string, number>();
  for (const value of values) grouped.set(value, (grouped.get(value) ?? 0) + 1);
  return [...grouped].map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

export function summarizeFrameDecantingRows(rows: FrameDecantingRow[]): FrameDecantingSummary {
  const sourceTotals = Object.fromEntries(FRAME_INVENTORY_SOURCES.map((source) => [
    source.key,
    rows.reduce((sum, row) => sum + row.sources[source.key].count, 0),
  ])) as Record<FrameInventorySourceKey, number>;
  return {
    totalPids: rows.length,
    newPids: rows.filter((row) => row.flag === 'New PID').length,
    grnMatchedPids: rows.filter((row) => row.iqcStatus || row.pidQty || row.grnQty).length,
    totalInventory: rows.reduce((sum, row) => sum + row.totalInventory, 0),
    priority: {
      p0: rows.filter((row) => row.decantComment === FRAME_DECANT_300).length,
      p1: rows.filter((row) => row.decantComment === FRAME_DECANT_700).length,
      hhd: rows.filter((row) => row.decantComment === FRAME_DECANT_7_DAY).length,
      extraInAsrs: rows.filter((row) => row.decantComment === 'Over Decanted').length,
      checkTransfers: rows.filter((row) => row.decantComment === 'Check for Transfers').length,
    },
    sourceTotals,
    decantDistribution: distribution(rows.map((row) => row.decantComment)),
    commentsDistribution: distribution(rows.map((row) => row.comments)),
  };
}

type CsvValue = string | number | null;
type CsvColumn = { header: string; value: (row: FrameDecantingRow) => CsvValue };
const FRAME_CSV_COLUMNS: CsvColumn[] = [
  { header: 'parent_product_id', value: (row) => row.productId },
  { header: 'Brand', value: (row) => row.brand },
  { header: 'Product_Type', value: (row) => row.productType },
  { header: 'PLC', value: (row) => row.plc },
  { header: 'ROS/Day (Highest Month)', value: (row) => row.rosPerDayHighestMonth },
  { header: 'Flag', value: (row) => row.flag },
  { header: '7-Day DOH', value: (row) => row.target7Day },
  { header: '10-Day DOH', value: (row) => row.target10Day },
  { header: 'ASRS_Count', value: (row) => row.sources.asrs.count },
  { header: 'ASRS_DOH_Inv', value: (row) => row.sources.asrs.doh },
  { header: 'ASRS_7Day_Status', value: (row) => row.sources.asrs.status7Day },
  { header: 'ASRS_10Day_Status', value: (row) => row.sources.asrs.status10Day },
  { header: 'NXS1_Count', value: (row) => row.sources.nxs1.count },
  { header: 'NXS1_DOH_Inv', value: (row) => row.sources.nxs1.doh },
  { header: 'NXS1_7Day_Status', value: (row) => row.sources.nxs1.status7Day },
  { header: 'NXS1_10Day_Status', value: (row) => row.sources.nxs1.status10Day },
  { header: 'EGL_Manual_05_Count', value: (row) => row.sources.eglManual.count },
  { header: 'Putaway_Pending_Count', value: (row) => row.sources.putawayPending.count },
  { header: 'IQC Status', value: (row) => row.iqcStatus },
  { header: 'PID QTY', value: (row) => row.pidQty },
  { header: 'GRN QTY', value: (row) => row.grnQty },
  { header: 'TRANSFER PENDENCY', value: (row) => row.transferPendency },
  { header: 'Bulk Required', value: (row) => row.bulkRequired },
  { header: 'NXS2_Count', value: (row) => row.sources.nxs2.count },
  { header: 'NXS2_DOH_Inv', value: (row) => row.sources.nxs2.doh },
  { header: 'NXS2_7Day_Status', value: (row) => row.sources.nxs2.status7Day },
  { header: 'NXS2_10Day_Status', value: (row) => row.sources.nxs2.status10Day },
  { header: 'Total Inventory', value: (row) => row.totalInventory },
  { header: 'NXS1 Split', value: (row) => row.nxs1Split },
  { header: '7 day Req', value: (row) => row.sevenDayRequirement },
  { header: '7-Day Shortage', value: (row) => row.sevenDayShortage },
  { header: 'Available other than ASRS', value: (row) => row.availableOtherThanAsrs },
  { header: 'Decant Comment | GRN PENDNCY', value: (row) => row.decantComment },
  { header: 'Comments', value: (row) => row.comments },
];

function csvCell(value: CsvValue): string {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export function frameDecantingCsvHeader(): string {
  return FRAME_CSV_COLUMNS.map((column) => csvCell(column.header)).join(',');
}

export function frameDecantingCsvRow(row: FrameDecantingRow): string {
  return FRAME_CSV_COLUMNS.map((column) => csvCell(column.value(row))).join(',');
}

export function buildFrameDecantingDashboard(
  rosRows: RawFrameRosRow[],
  inventoryRows: RawFrameInventoryRow[],
  grnRows: RawFrameGrnRow[],
  increffRows: RawFrameCountRow[],
  transferRows: RawFrameCountRow[],
  plcRows: RawFramePlcRow[],
  excludedPids: unknown[],
  window: { startDate: string; endDate: string },
): { rows: FrameDecantingRow[]; summary: FrameDecantingSummary } {
  const ros = aggregateRos(rosRows);
  const inventory = inventoryByPid(inventoryRows);
  const grn = grnByPid(grnRows);
  const increff = countsByPid(increffRows);
  const transfer = countsByPid(transferRows);
  const plc = plcByPid(plcRows);
  const exclusions = new Set(excludedPids.map(normalizeFramePid).filter(Boolean));
  const pidScope = new Set(ros.keys());
  for (const [pid, row] of inventory) {
    const hasInventory = Object.values(INVENTORY_FIELDS).some((field) => integer(row[field]) !== 0);
    if (DUMP_ONLY_PID.test(pid) && hasInventory) pidScope.add(pid);
  }

  const rows: FrameDecantingRow[] = [];
  for (const productId of [...pidScope].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
    if (exclusions.has(productId)) continue;
    const inventoryRow = inventory.get(productId);
    const productType = text(inventoryRow?.product_type);
    if (REMOVE_PRODUCT_TYPES.has(productType.toLowerCase())) continue;
    const brand = text(inventoryRow?.brand);
    const plcValue = plc.get(productId) ?? '';
    const rosPerDayHighestMonth = ros.get(productId) ?? 0;
    const isNew = rosPerDayHighestMonth < 1;
    const exclusive = plcIsExclusive(plcValue);
    const target7Day = demandTarget(rosPerDayHighestMonth, 7, exclusive ? 300 : 700);
    const target10Day = demandTarget(rosPerDayHighestMonth, 10, exclusive ? 500 : 1_000);
    const bulkRequired = increff.get(productId) ?? 0;
    const sourceCounts = Object.fromEntries(FRAME_INVENTORY_SOURCES.map((source) => [
      source.key,
      integer(inventoryRow?.[INVENTORY_FIELDS[source.key]]),
    ])) as Record<FrameInventorySourceKey, number>;
    const sources = Object.fromEntries(FRAME_INVENTORY_SOURCES.map((source) => {
      const sourceCount = sourceCounts[source.key];
      return [source.key, {
        count: sourceCount,
        doh: source.hasDoh
          ? (rosPerDayHighestMonth === 0 ? 0 : (sourceCount - bulkRequired) / rosPerDayHighestMonth)
          : null,
        status7Day: source.hasDoh ? status(sourceCount, target7Day) : null,
        status10Day: source.hasDoh ? status(sourceCount, target10Day) : null,
      }];
    })) as Record<FrameInventorySourceKey, FrameSourceMetrics>;
    const transferPendency = transfer.get(productId) ?? 0;
    const totalInventory = transferPendency
      + sources.putawayPending.count
      + sources.nxs1.count
      + sources.nxs2.count;
    const nxs1Split = totalInventory === 0 ? 0 : 1 - (sources.nxs2.count / totalInventory);
    const sevenDayRequirement = rosPerDayHighestMonth * 7;
    const grnRow = grn.get(productId);
    const base: Omit<FrameDecantingRow, 'decantComment' | 'comments'> = {
      productId,
      brand,
      productType,
      plc: plcValue,
      rosPerDayHighestMonth,
      flag: isNew ? 'New PID' : '',
      target7Day,
      target10Day,
      rosWindowStart: window.startDate,
      rosWindowEnd: window.endDate,
      sources,
      iqcStatus: grnRow ? [...grnRow.statuses].sort().join(' | ') : '',
      pidQty: grnRow?.pidQty ?? 0,
      grnQty: grnRow?.grnQty ?? 0,
      transferPendency,
      bulkRequired,
      totalInventory,
      nxs1Split,
      sevenDayRequirement,
      sevenDayShortage: Math.max(sevenDayRequirement - sources.asrs.count, 0),
      availableOtherThanAsrs: transferPendency
        + sources.putawayPending.count
        + sources.eglManual.count,
    };
    const decantComment = frameDecantComment(base);
    rows.push({ ...base, decantComment, comments: frameTransferComment(base, decantComment) });
  }

  return { rows, summary: summarizeFrameDecantingRows(rows) };
}
