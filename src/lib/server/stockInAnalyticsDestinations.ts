export type StockInAnalyticsDestination = {
  key: 'asrs' | 'manual-warehouse' | 'bermuda-triangle';
  label: string;
  routeSegment: string;
  /** When set, destination movements are restricted to this facility. */
  facility?: string;
  /**
   * A trailing `%` means "starts with". Patterns without `%` are exact
   * locations. They are always sent to BigQuery as parameters, never SQL.
   */
  locationPatterns: string[];
};

const DESTINATIONS: StockInAnalyticsDestination[] = [
  {
    key: 'asrs',
    label: 'ASRS',
    routeSegment: 'decanting-analytics',
    locationPatterns: ['NXS1-ASRS-T%'],
  },
  {
    key: 'manual-warehouse',
    label: 'Manual Warehouse',
    routeSegment: 'manual-warehouse-analytics',
    locationPatterns: [
      'NXS1-156%',
      'NXS1-160%',
      'NXS1-EGL_Fastzone%',
      'NXS1-PL_Tinted_HIGH%',
      'NXS1-PL_Tinted_LOW%',
      'NXS1-PL_TOKAI%',
      'NXS1-PL_Photochromatic%',
      'NXS1-PL_Other%',
      'NXS1-PL_Nightdrive%',
      'NXS1-Progressive_MR8%',
      'NXS1-PL_Rodenstock%',
      'NXS1-Progressive_Acrylic%',
      'NXS1-PL_167_160Bluecut%',
      'NXS1-PL_174Bluecut%',
      'NXS1-PL_ARC%',
      'NXS1-PL_MR8_IR%',
      'NXS1-156_Bluecut%',
      'NXS1-EGL_Eye%',
      'NXS1-EGL_Sun%',
      'NXS1-Bhiwadi_Manual-EGL_Eye%',
      'NXS1-Bhiwadi_Manual-EGL_Fastzone%',
      'NXS1-Bhiwadi_Manual-EGL_Sun%',
    ],
  },
  {
    key: 'bermuda-triangle',
    label: 'Bermuda Triangle',
    routeSegment: 'bermuda-triangle-analytics',
    facility: 'NXS1',
    // This is the canonical location value in barcode_item_history.
    locationPatterns: ['Bermuda Triangle'],
  },
];

const DESTINATION_BY_ROUTE = new Map(
  DESTINATIONS.map((destination) => [destination.routeSegment, destination]),
);

const DESTINATION_BY_KEY = new Map(
  DESTINATIONS.map((destination) => [destination.key, destination]),
);

export function stockInAnalyticsDestination(pathname: string): StockInAnalyticsDestination {
  const segments = pathname.split('/').filter(Boolean);
  const routeSegment = segments[segments.length - 1] || 'decanting-analytics';
  return DESTINATION_BY_ROUTE.get(routeSegment) || DESTINATIONS[0];
}

export function stockInAnalyticsDestinationByKey(
  key: StockInAnalyticsDestination['key'],
): StockInAnalyticsDestination {
  return DESTINATION_BY_KEY.get(key) || DESTINATIONS[0];
}
