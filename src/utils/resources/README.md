# Central authentication resources

Server-side authentication helpers and local credential files live here, grouped by provider.

- `bigquery/client.ts` — shared paginated BigQuery REST client.
- `bigquery/oauth_setup.py` — creates the local BigQuery OAuth token.
- `bigquery/credentials.json` and `bigquery/token.json` — local secrets; git-ignored.
- `power-bi/pbi_auth.py` — shared Power BI MSAL authentication helper.
- `power-bi/pbi_token_cache.json` — local secret cache; git-ignored.
- `google/gcreds.json` and `google/gsheet_token.json` — local Google API secrets; git-ignored.
- `nexs/auth.ts` — shared NexS server-login/token cache helper; credentials come from environment variables.

- `google/gsheet_auth.py` - shared non-interactive Google Sheets authentication and range reader.

Deployments may override the BigQuery token location with `BQ_TOKEN_PATH`. Never import these helpers into client components.

Power BI access tokens renew silently from the delegated cache. Deployments
may set `POWER_BI_TOKEN_CACHE_PATH` when mounting that cache elsewhere. For
fully unattended app-only authentication, set `POWER_BI_TENANT_ID`,
`POWER_BI_CLIENT_ID`, and `POWER_BI_CLIENT_SECRET`; the Entra application must
also have access to the target Power BI workspace and semantic model.
