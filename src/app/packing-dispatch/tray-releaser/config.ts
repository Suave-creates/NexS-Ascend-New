// src/app/packing-dispatch/tray-releaser/config.ts
//
// Single source of truth for the Tray Releaser — the webapp port of the
// extension's src/config.js. Endpoints, release body shape, match keys, labels,
// and auto-flush limits live here.

export type DumpOrder = {
  storeCode: string;
  softCourier: string;
  channel: string;
  priority: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  shipmentId: string;
  incrementId: string;
  _raw?: Record<string, unknown>;
};

// A raw tray record from fetchTrays. We only type the fields we use; the rest
// flow through untouched (e.g. for channel detection / export).
export type TrayRecord = {
  trayId: string;
  storeCode: string;
  softCourier: string;
  parentId: string;
  orderPriority?: number | string | null;
  noOfShipments?: number | string | null;
  createdAt?: string | null;
  [key: string]: unknown;
};

export const NEXS_CONFIG = {
  // ---- NexS app API (called live from the browser, like the extension) -----
  ENDPOINT:
    'https://app.nexs.lenskart.com/nexs-consolidation/addverb/api/v1/fetchTrays',
  RELEASE_ENDPOINT:
    'https://app.nexs.lenskart.com/nexs-consolidation/addverb/api/v1/releaseTray',
  RELEASE_METHOD: 'PUT' as const,
  // releaseTray body shape (confirmed from the app bundle), one PUT per tray.
  RELEASE_BODY_FIELDS: ['trayId', 'storeCode', 'parentId'] as const,
  SOURCE_DOMAIN: 'https://app.nexs.lenskart.com',

  FACILITY_FALLBACK: 'NXS1',
  WORKSTATION_FALLBACK: 'QC01',

  // ---- fetchTrays request shape -------------------------------------------
  PAGE_SIZE: 500,
  SORT_BY: 'createdAt',
  SORT_ORDER: 'DESC' as 'ASC' | 'DESC',
  FETCH_BOTH_DIRECTIONS: true,
  FILTERS: {} as Record<string, unknown>,

  // ---- Pagination safety ---------------------------------------------------
  MAX_PAGES: 50,
  PAGE_DELAY_MS: 250,
  MAX_RETRIES: 2,
  RETRY_BASE_MS: 600,

  // ---- Dump --------------------------------------------------------------
  // The dump comes from our own BigQuery-backed endpoint.
  // {facility}/{days} are filled in at call time.
  DUMP_ENDPOINT: '/api/packing-dispatch/dump?facility={facility}&days={days}',
  DUMP_DAYS: 7,

  // ---- Matching / suggestion logic ----------------------------------------
  MAX_FILL: 8,
  MATCH_KEYS: ['storeCode', 'softCourier', 'channel'] as const,
  MATCH_KEYS_FALLBACK: ['storeCode', 'softCourier'] as const,
  TRAY_CHANNEL_FIELDS: ['channel', 'orderChannel', 'channelName', 'order_channel'],
  AGING_FIELD: 'createdAt',
  QUICK_WAITING_AGE_HOURS: 4,

  // ---- Priority ------------------------------------------------------------
  PRIORITY_LABELS: { 1: 'P1', 2: 'P2', 10: '–' } as Record<number, string>,
  PRIORITY_RANK: { 1: 0, 2: 1, 10: 2 } as Record<number, number>,

  // ---- City filter ---------------------------------------------------------
  // The City column filter shows only this curated list of cities (not every
  // distinct city in the data). Add more city names here to expand the filter.
  // Names must match the values produced by the Store.xlsx mapping (storeCity.ts).
  CITY_FILTER_OPTIONS: ['Pune', 'Bengaluru', 'Chennai', 'Ahmedabad', 'Agra', 'Nagpur'] as string[],

  // ---- Display / export ----------------------------------------------------
  COLUMNS: [
    { key: 'trayId', label: 'Tray ID' },
    { key: 'storeCode', label: 'Store Code' },
    { key: 'softCourier', label: 'Soft Courier' },
    { key: 'orderPriority', label: 'Priority' },
    { key: 'noOfShipments', label: 'No. of Shipments' },
    { key: 'status', label: 'Status' },
    { key: 'shippingProvider', label: 'Shipping Provider' },
    { key: 'nearestCutOff', label: 'Nearest Cut-Off' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'updatedAt', label: 'Updated At' },
    { key: 'updatedBy', label: 'Updated By' },
    { key: 'parentId', label: 'Parent ID' },
    { key: 'addverb', label: 'Addverb' },
  ],

  DEDUPE_KEY: 'parentId',
  RELEASE_DELAY_MS: 600,

  // ---- Auto-flush ----------------------------------------------------------
  AUTO_DEFAULTS: { batchSize: 50, intervalMinutes: 5, refreshDumpEachCycle: true },
  AUTO_MIN_INTERVAL_MIN: 1,
  AUTO_MAX_BATCH: 200,

  // localStorage key for persisted UI settings + facility/workstation.
  SETTINGS_STORAGE_KEY: 'nexs_tray_releaser_settings',
};

export type NexsConfig = typeof NEXS_CONFIG;
