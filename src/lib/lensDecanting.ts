export const INVENTORY_SOURCES = [
  { key: 'asrs', label: 'ASRS', hasDoh: true },
  { key: 'nxs1', label: 'NXS1', hasDoh: true },
  { key: 'nxs2', label: 'NXS2', hasDoh: true },
  { key: 'eglManual', label: 'EGL Manual', hasDoh: false },
  { key: 'putawayPending', label: 'Putaway Pending', hasDoh: false },
  { key: 'plManual', label: 'PL Manual', hasDoh: false },
  { key: 'pl10', label: 'PL 10', hasDoh: false },
  { key: 'pl11', label: 'PL 11', hasDoh: false },
  { key: 'pl40', label: 'PL 40', hasDoh: false },
] as const;

export type InventorySourceKey = (typeof INVENTORY_SOURCES)[number]['key'];
export type StockStatus = 'No Stock' | 'Sufficient' | 'Insufficient';

export type SourceMetrics = {
  count: number;
  doh: number | null;
  status7Day: StockStatus | null;
  status10Day: StockStatus | null;
};

export type LensDecantingRow = {
  productId: string;
  hsnClassification: string;
  brand: string;
  productType: string;
  rosUnits7Day: number;
  rosPerDay7Day: number;
  flag: '' | 'New PID';
  target7Day: number;
  target10Day: number;
  rosWindowStart: string;
  rosWindowEnd: string;
  sources: Record<InventorySourceKey, SourceMetrics>;
  iqcStatus: string;
  pidQty: number;
  grnQty: number;
  totalInventory: number;
  nxs1Split: number;
  sevenDayRequirement: number;
  sevenDayShortage: number;
  availableOtherThanAsrs: number;
  decantComment: string;
  comments: string;
};

export type LensDecantingSummary = {
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
  sourceTotals: Record<InventorySourceKey, number>;
  decantDistribution: Array<{ name: string; count: number }>;
  commentsDistribution: Array<{ name: string; count: number }>;
};

export type RawRosRow = {
  pid?: unknown;
  hsn?: unknown;
  brand?: unknown;
  productType?: unknown;
  rosUnits?: unknown;
};

export type RawInventoryRow = Record<string, unknown>;

export type RawGrnRow = {
  pid?: unknown;
  iqcStatus?: unknown;
  pidQty?: unknown;
  grnQty?: unknown;
};

const HSN_SCOPE = new Set(['prescription-lens', 'prescription-blank']);
const ROS_WINDOW_DAYS = 7;
const ROS_THRESHOLD = 1;
const NEW_PID_TARGET_7_DAY = 700;
const NEW_PID_TARGET_10_DAY = 1_000;

const EXCLUDED_PRODUCT_TYPES = new Set([
  'Accessories',
  'Case',
  'Chains',
  'Gold Membership',
  'Contact Lens',
  'Contact lens-fast moving',
  'Contact Lens-Cylindrical',
  'Contact Lens-Spherical',
  'Contact lens-solution',
]);

const BRANDED_BRANDS = new Set([
  'B',
  'BRANDED',
  'Carrera',
  'Cholamandalam',
  'Fallon Colby',
  'French Connection',
  'Hugo',
  'Lenskart TOI Special',
  'Mask',
  'Matt Eyewear',
  'New Balance',
  'Phonic',
  'Polaroid',
  'Ray-Ban',
  'Tommy Hilfiger',
  'Vogue',
]);

const INVENTORY_FIELDS: Record<InventorySourceKey, string> = {
  asrs: 'asrs_count',
  nxs1: 'nxs1_count',
  nxs2: 'nxs2_count',
  eglManual: 'egl_manual_count',
  putawayPending: 'putaway_pending_count',
  plManual: 'pl_manual_count',
  pl10: 'pl_10_count',
  pl11: 'pl_11_count',
  pl40: 'pl_40_count',
};

type AggregatedRos = {
  productId: string;
  hsns: Set<string>;
  brands: Set<string>;
  productTypes: Set<string>;
  rosUnits: number;
};

type AggregatedGrn = { statuses: Set<string>; pidQty: number; grnQty: number };

function text(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

export function normalizeLensPid(value: unknown): string {
  const valueText = text(value);
  return /^\d+\.0$/.test(valueText) ? valueText.slice(0, -2) : valueText;
}

function normalizeHsn(value: unknown): string {
  return text(value).toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
}

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function count(value: unknown): number {
  return Math.trunc(number(value));
}

function sortedValues(values: Set<string>): string {
  return [...values].filter(Boolean).sort((a, b) => a.localeCompare(b)).join(' | ');
}

function demandTarget(ros: number, days: number, newPidTarget: number): number {
  return ros < ROS_THRESHOLD ? newPidTarget : Math.ceil((ros * days) / 100) * 100;
}

function stockStatus(stock: number, target: number): StockStatus {
  if (stock === 0) return 'No Stock';
  return stock >= target ? 'Sufficient' : 'Insufficient';
}

const FLOAT64_VIEW = new DataView(new ArrayBuffer(8));
const BIGINT_ONE = BigInt(1);
const BIGINT_TWO = BigInt(2);
const FLOAT64_FRACTION_BITS = BigInt(52);
const FLOAT64_EXPONENT_MASK = BigInt(0x7ff);
const FLOAT64_FRACTION_MASK = (BIGINT_ONE << FLOAT64_FRACTION_BITS) - BIGINT_ONE;

/**
 * Match Python's rounding of the actual IEEE-754 value, including ties-to-even.
 * Integer arithmetic avoids a second floating-point multiplication turning a
 * value just above/below a decimal half into a false tie.
 */
function roundHalfEven(value: number, digits: number): number {
  if (!Number.isFinite(value) || value === 0) return value;

  FLOAT64_VIEW.setFloat64(0, Math.abs(value), false);
  const bits = FLOAT64_VIEW.getBigUint64(0, false);
  const exponentBits = Number(
    (bits >> FLOAT64_FRACTION_BITS) & FLOAT64_EXPONENT_MASK,
  );
  let mantissa = bits & FLOAT64_FRACTION_MASK;
  let binaryExponent: number;
  if (exponentBits === 0) {
    binaryExponent = -1022 - 52;
  } else {
    mantissa |= BIGINT_ONE << FLOAT64_FRACTION_BITS;
    binaryExponent = exponentBits - 1023 - 52;
  }

  // 10^digits = 2^digits * 5^digits.
  let numerator = mantissa * (BigInt(5) ** BigInt(digits));
  binaryExponent += digits;
  let roundedMagnitude: bigint;
  if (binaryExponent >= 0) {
    roundedMagnitude = numerator << BigInt(binaryExponent);
  } else {
    const denominator = BIGINT_ONE << BigInt(-binaryExponent);
    let quotient = numerator / denominator;
    const twiceRemainder = (numerator % denominator) * BIGINT_TWO;
    if (
      twiceRemainder > denominator
      || (twiceRemainder === denominator && quotient % BIGINT_TWO === BIGINT_ONE)
    ) {
      quotient += BIGINT_ONE;
    }
    roundedMagnitude = quotient;
  }

  if (value < 0) roundedMagnitude = -roundedMagnitude;
  return Number(roundedMagnitude) / (10 ** digits);
}

function aggregateRos(rows: RawRosRow[]): AggregatedRos[] {
  const grouped = new Map<string, AggregatedRos>();

  for (const row of rows) {
    const productId = normalizeLensPid(row.pid);
    const hsn = normalizeHsn(row.hsn);
    if (!productId || !HSN_SCOPE.has(hsn)) continue;

    let aggregate = grouped.get(productId);
    if (!aggregate) {
      aggregate = {
        productId,
        hsns: new Set(),
        brands: new Set(),
        productTypes: new Set(),
        rosUnits: 0,
      };
      grouped.set(productId, aggregate);
    }
    aggregate.hsns.add(hsn);
    const brand = text(row.brand);
    const productType = text(row.productType);
    if (brand) aggregate.brands.add(brand);
    if (productType) aggregate.productTypes.add(productType);
    aggregate.rosUnits += number(row.rosUnits);
  }

  return [...grouped.values()].sort((a, b) =>
    a.productId.localeCompare(b.productId, undefined, { numeric: true }),
  );
}

function inventoryByPid(rows: RawInventoryRow[]): Map<string, RawInventoryRow> {
  const result = new Map<string, RawInventoryRow>();
  for (const row of rows) {
    const productId = normalizeLensPid(row.pid);
    if (!productId) continue;
    const existing = result.get(productId);
    if (!existing) {
      result.set(productId, { ...row });
      continue;
    }
    for (const field of Object.values(INVENTORY_FIELDS)) {
      existing[field] = count(existing[field]) + count(row[field]);
    }
    if (!text(existing.brand) && text(row.brand)) existing.brand = row.brand;
    if (!text(existing.product_type) && text(row.product_type)) {
      existing.product_type = row.product_type;
    }
  }
  return result;
}

function grnByPid(rows: RawGrnRow[]): Map<string, AggregatedGrn> {
  const result = new Map<string, AggregatedGrn>();
  for (const row of rows) {
    const productId = normalizeLensPid(row.pid);
    if (!productId) continue;
    let aggregate = result.get(productId);
    if (!aggregate) {
      aggregate = { statuses: new Set(), pidQty: 0, grnQty: 0 };
      result.set(productId, aggregate);
    }
    const status = text(row.iqcStatus);
    if (status) aggregate.statuses.add(status);
    aggregate.pidQty += count(row.pidQty);
    aggregate.grnQty += count(row.grnQty);
  }
  return result;
}

function sourceMetrics(
  inventory: RawInventoryRow | undefined,
  ros: number,
  target7Day: number,
  target10Day: number,
): Record<InventorySourceKey, SourceMetrics> {
  return Object.fromEntries(INVENTORY_SOURCES.map((source) => {
    const sourceCount = count(inventory?.[INVENTORY_FIELDS[source.key]]);
    const hasDoh = source.hasDoh;
    return [source.key, {
      count: sourceCount,
      doh: hasDoh
        ? (ros <= 0 || sourceCount === 0 ? 0 : roundHalfEven(sourceCount / ros, 2))
        : null,
      status7Day: hasDoh ? stockStatus(sourceCount, target7Day) : null,
      status10Day: hasDoh ? stockStatus(sourceCount, target10Day) : null,
    }];
  })) as Record<InventorySourceKey, SourceMetrics>;
}

function isPrescriptionBrand(brand: string): boolean {
  return brand.toLowerCase().includes('prescription');
}

function decantComment(row: Omit<LensDecantingRow, 'decantComment' | 'comments'>): string {
  if (EXCLUDED_PRODUCT_TYPES.has(row.productType)) return 'No Need to Evaluate';
  if (isPrescriptionBrand(row.brand)) return 'No Need to Evaluate';
  if (BRANDED_BRANDS.has(row.brand)) return 'No Need to Evaluate';
  // The displayed shortage is intentionally clamped at zero. Preserve the
  // original signed-balance rule by comparing stock with the requirement.
  if (row.sources.asrs.count > row.sevenDayRequirement) return 'Extra in ASRS';

  if (row.sources.asrs.count > 0 && row.availableOtherThanAsrs > 60) {
    if ((row.sources.asrs.doh ?? 0) <= 3) return 'P0 Decant ( ASRS DOH <=3)';
    if ((row.sources.asrs.doh ?? 0) <= 7) return 'P1 Decant (ASRS DOH 3><7)';
  }
  if (row.availableOtherThanAsrs > 0 && row.availableOtherThanAsrs <= 60) {
    return 'HHD Decant (Total Qty <=60)';
  }
  return 'Check for transfers';
}

function transferComment(row: Omit<LensDecantingRow, 'decantComment' | 'comments'>): string {
  if (EXCLUDED_PRODUCT_TYPES.has(row.productType)) {
    return 'To be removed from the list (Contact Lens/Accessories)';
  }
  if (isPrescriptionBrand(row.brand)) return 'BLANKS to be Removed';
  if (BRANDED_BRANDS.has(row.brand)) return 'BRANDED to be decided';
  if (row.rosPerDay7Day < 0.5) return 'ROS=0';
  if (row.sources.putawayPending.count >= 60 && row.nxs1Split < 0.7) {
    return 'NXS1 Split <70% | Putaway Pending >=60';
  }

  const nxs1Doh = row.sources.nxs1.doh ?? 0;
  const nxs2Doh = row.sources.nxs2.doh ?? 0;
  if (nxs1Doh > 7) return 'All ok in NXS1';
  if (row.sources.nxs2.count < 120) return 'NXS2 Count <120 (No need to transfer)';
  if (nxs2Doh > 300 && nxs1Doh <= 7) {
    return 'NXS2 Qty >=120 | NXS2 DOH >10|NXS1 DOH <=7 | Transfer to Bhiwadi';
  }
  if (row.rosPerDay7Day <= 3 && nxs2Doh >= 10 && nxs1Doh <= 7) {
    return 'Max ROS <=3 | NXS2 DOH >=10 | NXS2 QTY >=120|NXS1 DOH<=7 ( Transfer to Bhiwadi)';
  }
  if (row.nxs1Split <= 0.4) {
    return nxs2Doh >= 10
      ? 'NXS1 Split <=40% |NXS2 Qty >=120|NXS2 DOH >=10|  Transfer to Bhiwadi'
      : 'NXS1 Split <=40% | NXS2 Qty >=120| NXS2 DOH <=7|To be Decided';
  }
  if (row.nxs1Split > 0.4 && row.nxs1Split <= 0.7 && nxs2Doh <= 7) {
    return 'NXS1 Split 40<>70 |NXS2 DOH<=7 |NXS2 Qty >=120|To be Decided';
  }
  return 'All ok in NXS1';
}

function distribution(values: string[]): Array<{ name: string; count: number }> {
  const grouped = new Map<string, number>();
  for (const value of values) grouped.set(value, (grouped.get(value) ?? 0) + 1);
  return [...grouped.entries()]
    .map(([name, valueCount]) => ({ name, count: valueCount }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function summarizeLensDecantingRows(rows: LensDecantingRow[]): LensDecantingSummary {
  const sourceTotals = Object.fromEntries(INVENTORY_SOURCES.map((source) => [
    source.key,
    rows.reduce((sum, row) => sum + row.sources[source.key].count, 0),
  ])) as Record<InventorySourceKey, number>;

  return {
    totalPids: rows.length,
    newPids: rows.filter((row) => row.flag === 'New PID').length,
    grnMatchedPids: rows.filter((row) => row.iqcStatus || row.pidQty > 0 || row.grnQty > 0).length,
    totalInventory: rows.reduce((sum, row) => sum + row.totalInventory, 0),
    priority: {
      p0: rows.filter((row) => row.decantComment.startsWith('P0 Decant')).length,
      p1: rows.filter((row) => row.decantComment.startsWith('P1 Decant')).length,
      hhd: rows.filter((row) => row.decantComment.startsWith('HHD Decant')).length,
      extraInAsrs: rows.filter((row) => row.decantComment === 'Extra in ASRS').length,
      checkTransfers: rows.filter((row) => row.decantComment === 'Check for transfers').length,
    },
    sourceTotals,
    decantDistribution: distribution(rows.map((row) => row.decantComment)),
    commentsDistribution: distribution(rows.map((row) => row.comments)),
  };
}

const CSV_SOURCE_PREFIX: Record<InventorySourceKey, string> = {
  asrs: 'ASRS',
  nxs1: 'NXS1',
  nxs2: 'NXS2',
  eglManual: 'EGL_Manual',
  putawayPending: 'Putaway_Pending',
  plManual: 'PL_Manual',
  pl10: 'PL_10',
  pl11: 'PL_11',
  pl40: 'PL_40',
};

type CsvValue = string | number | null;
type CsvColumn = { header: string; value: (row: LensDecantingRow) => CsvValue };

function lensCsvColumns(): CsvColumn[] {
  const columns: CsvColumn[] = [
    { header: 'Product ID', value: (row) => row.productId },
    { header: 'HSN Classification', value: (row) => row.hsnClassification },
    { header: 'Brand', value: (row) => row.brand },
    { header: 'Product_Type', value: (row) => row.productType },
    { header: 'ROS Units (7-Day)', value: (row) => row.rosUnits7Day },
    { header: 'ROS/Day (7-Day)', value: (row) => row.rosPerDay7Day },
    { header: 'Flag', value: (row) => row.flag },
    { header: '7-Day DOH', value: (row) => row.target7Day },
    { header: '10-Day DOH', value: (row) => row.target10Day },
    { header: 'ROS Window Start', value: (row) => row.rosWindowStart },
    { header: 'ROS Window End', value: (row) => row.rosWindowEnd },
  ];
  for (const source of INVENTORY_SOURCES) {
    const prefix = CSV_SOURCE_PREFIX[source.key];
    columns.push({ header: `${prefix}_Count`, value: (row) => row.sources[source.key].count });
    if (source.hasDoh) {
      columns.push(
        { header: `${prefix}_DOH_Inv`, value: (row) => row.sources[source.key].doh },
        { header: `${prefix}_7Day_Status`, value: (row) => row.sources[source.key].status7Day ?? '' },
        { header: `${prefix}_10Day_Status`, value: (row) => row.sources[source.key].status10Day ?? '' },
      );
    }
    if (source.key === 'putawayPending') {
      columns.push(
        { header: 'IQC Status', value: (row) => row.iqcStatus },
        { header: 'PID QTY', value: (row) => row.pidQty },
        { header: 'GRN QTY', value: (row) => row.grnQty },
      );
    }
  }
  columns.push(
    { header: 'Total Inventory', value: (row) => row.totalInventory },
    { header: 'NXS1 Split', value: (row) => row.nxs1Split },
    { header: '7 day Req', value: (row) => row.sevenDayRequirement },
    { header: '7-Day Shortage', value: (row) => row.sevenDayShortage },
    { header: 'Available other than ASRS', value: (row) => row.availableOtherThanAsrs },
    { header: 'Decant Comment | GRN PENDNCY', value: (row) => row.decantComment },
    { header: 'Comments', value: (row) => row.comments },
  );
  return columns;
}

const LENS_CSV_COLUMNS = lensCsvColumns();

function csvCell(value: CsvValue): string {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export function lensDecantingCsvHeader(): string {
  return LENS_CSV_COLUMNS.map((column) => csvCell(column.header)).join(',');
}

export function lensDecantingCsvRow(row: LensDecantingRow): string {
  return LENS_CSV_COLUMNS.map((column) => csvCell(column.value(row))).join(',');
}

export function buildLensDecantingDashboard(
  rosRows: RawRosRow[],
  inventoryRows: RawInventoryRow[],
  grnRows: RawGrnRow[],
  window: { startDate: string; endDate: string },
): { rows: LensDecantingRow[]; summary: LensDecantingSummary } {
  const inventory = inventoryByPid(inventoryRows);
  const grn = grnByPid(grnRows);

  const rows = aggregateRos(rosRows).map((aggregate): LensDecantingRow => {
    const inventoryRow = inventory.get(aggregate.productId);
    const productBrand = text(inventoryRow?.brand);
    const productType = text(inventoryRow?.product_type);
    // Preserve the source total exactly. The legacy checker rounds only the
    // derived daily ROS value, which matters at rule boundaries.
    const rosUnits7Day = aggregate.rosUnits;
    const rosPerDay7Day = roundHalfEven(rosUnits7Day / ROS_WINDOW_DAYS, 4);
    const target7Day = demandTarget(rosPerDay7Day, 7, NEW_PID_TARGET_7_DAY);
    const target10Day = demandTarget(rosPerDay7Day, 10, NEW_PID_TARGET_10_DAY);
    const sources = sourceMetrics(inventoryRow, rosPerDay7Day, target7Day, target10Day);
    const totalInventory = sources.nxs1.count + sources.nxs2.count;
    const nxs1Split = totalInventory === 0 ? 0 : sources.nxs1.count / totalInventory;
    const sevenDayRequirement = rosPerDay7Day * 7;
    const sevenDayShortage = Math.max(sevenDayRequirement - sources.asrs.count, 0);
    const nonAsrsSources = INVENTORY_SOURCES
      .filter((source) => source.key !== 'asrs' && source.key !== 'nxs2')
      .reduce((sum, source) => sum + sources[source.key].count, 0);
    const availableOtherThanAsrs = nonAsrsSources - sources.asrs.count;
    const grnRow = grn.get(aggregate.productId);

    const baseRow: Omit<LensDecantingRow, 'decantComment' | 'comments'> = {
      productId: aggregate.productId,
      hsnClassification: sortedValues(aggregate.hsns),
      brand: productBrand || sortedValues(aggregate.brands),
      productType: productType || sortedValues(aggregate.productTypes),
      rosUnits7Day,
      rosPerDay7Day,
      flag: rosPerDay7Day < ROS_THRESHOLD ? 'New PID' : '',
      target7Day,
      target10Day,
      rosWindowStart: window.startDate,
      rosWindowEnd: window.endDate,
      sources,
      iqcStatus: grnRow ? sortedValues(grnRow.statuses) : '',
      pidQty: grnRow?.pidQty ?? 0,
      grnQty: grnRow?.grnQty ?? 0,
      totalInventory,
      nxs1Split,
      sevenDayRequirement,
      sevenDayShortage,
      availableOtherThanAsrs,
    };
    return {
      ...baseRow,
      decantComment: decantComment(baseRow),
      comments: transferComment(baseRow),
    };
  });

  return { rows, summary: summarizeLensDecantingRows(rows) };
}
