import { readFile } from 'fs/promises';
import path from 'path';
import { BIGQUERY_DATA_PROJECT_ID } from '@/utils/resources/bigquery/client';

const QUERY_PATH = path.join(
  process.cwd(),
  'src',
  'utils',
  'resources',
  'bigquery',
  'queries',
  'bermuda-triangle-analytics.sql',
);

let queryPromise: Promise<string> | null = null;

export function loadBermudaTriangleAnalyticsQuery() {
  queryPromise ??= readFile(QUERY_PATH, 'utf8').then((query) =>
    query.replaceAll('__DATA_PROJECT__', BIGQUERY_DATA_PROJECT_ID),
  );
  return queryPromise;
}
