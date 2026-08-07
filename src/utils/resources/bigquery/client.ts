import { readFile } from 'fs/promises';
import path from 'path';

export const BIGQUERY_PROJECT_ID = process.env.BQ_PROJECT_ID || 'lenskart-datahub';
export const BIGQUERY_DATA_PROJECT_ID = process.env.BQ_DATA_PROJECT_ID || 'lenskart-datahub';

const TOKEN_PATH = process.env.BQ_TOKEN_PATH || path.join(
  process.cwd(), 'src', 'utils', 'resources', 'bigquery', 'token.json',
);

type TokenFile = {
  refresh_token: string;
  token_uri: string;
  client_id: string;
  client_secret: string;
};

type BQField = { name: string; type: string };
type BQRow = { f: Array<{ v: unknown }> };
type BQResponse = {
  jobComplete?: boolean;
  jobReference?: { jobId: string; location?: string };
  schema?: { fields: BQField[] };
  rows?: BQRow[];
  pageToken?: string;
  errors?: Array<{ message: string }>;
  error?: { message: string };
};

export type BigQueryResult = {
  columns: string[];
  rows: Record<string, unknown>[];
};


export type BigQueryParameters = Record<string, string | string[]>;

function queryParameters(parameters: BigQueryParameters) {
  return Object.entries(parameters).map(([name, value]) => Array.isArray(value)
    ? {
        name,
        parameterType: { type: 'ARRAY', arrayType: { type: 'STRING' } },
        parameterValue: { arrayValues: value.map((item) => ({ value: item })) },
      }
    : {
        name,
        parameterType: { type: 'STRING' },
        parameterValue: { value },
      });
}

async function accessToken(): Promise<string> {
  let token: TokenFile;
  try {
    token = JSON.parse(await readFile(TOKEN_PATH, 'utf8')) as TokenFile;
  } catch {
    throw new Error(`Could not read BigQuery token at ${TOKEN_PATH}. Run src/utils/resources/bigquery/oauth_setup.py.`);
  }
  if (!token.refresh_token) throw new Error('BigQuery token has no refresh_token. Run OAuth setup again.');

  const response = await fetch(token.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
      client_id: token.client_id,
      client_secret: token.client_secret,
    }),
    cache: 'no-store',
  });
  const body = await response.json() as { access_token?: string; error?: string; error_description?: string };
  if (!response.ok || !body.access_token) {
    throw new Error(`BigQuery OAuth refresh failed: ${body.error || response.status} ${body.error_description || ''}`.trim());
  }
  return body.access_token;
}

function assertResponse(response: BQResponse): void {
  if (response.error) throw new Error(`BigQuery: ${response.error.message}`);
  if (response.errors?.length) throw new Error(`BigQuery: ${response.errors[0].message}`);
}

function shape(fields: BQField[], rows: BQRow[]): Record<string, unknown>[] {
  return rows.map((row) => Object.fromEntries(
    fields.map((field, index) => [field.name, row.f?.[index]?.v ?? null]),
  ));
}

/** Run Standard SQL and collect every result page. Intended for server-only dump routes. */
export async function runBigQuery(
  query: string,
  maxResults = 10_000,
  parameters: BigQueryParameters = {},
): Promise<BigQueryResult> {
  const token = await accessToken();
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const base = `https://bigquery.googleapis.com/bigquery/v2/projects/${BIGQUERY_PROJECT_ID}`;

  let response = await fetch(`${base}/queries`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      useLegacySql: false,
      parameterMode: 'NAMED',
      queryParameters: queryParameters(parameters),
      timeoutMs: 300_000,
      maxResults,
    }),
    cache: 'no-store',
  }).then((res) => res.json() as Promise<BQResponse>);
  assertResponse(response);

  const job = response.jobReference;
  if (!job?.jobId) throw new Error('BigQuery response did not include a job ID.');
  while (response.jobComplete === false) {
    const params = new URLSearchParams({ timeoutMs: '300000', maxResults: String(maxResults) });
    if (job.location) params.set('location', job.location);
    response = await fetch(`${base}/queries/${job.jobId}?${params}`, { headers, cache: 'no-store' })
      .then((res) => res.json() as Promise<BQResponse>);
    assertResponse(response);
  }

  const fields = response.schema?.fields || [];
  const rows: Record<string, unknown>[] = shape(fields, response.rows || []);
  let pageToken = response.pageToken;
  while (pageToken) {
    const params = new URLSearchParams({ pageToken, maxResults: String(maxResults) });
    if (job.location) params.set('location', job.location);
    const page = await fetch(`${base}/queries/${job.jobId}?${params}`, { headers, cache: 'no-store' })
      .then((res) => res.json() as Promise<BQResponse>);
    assertResponse(page);
    rows.push(...shape(fields, page.rows || []));
    pageToken = page.pageToken;
  }

  return { columns: fields.map((field) => field.name), rows };
}
