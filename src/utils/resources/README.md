# Central authentication resources

Server-side authentication helpers and local credential files live here, grouped by provider.

- `bigquery/client.ts` — shared paginated BigQuery REST client.
- `bigquery/oauth_setup.py` — creates the local BigQuery OAuth token.
- `bigquery/credentials.json` and `bigquery/token.json` — local secrets; git-ignored.
- `power-bi/pbi_auth.py` — shared Power BI MSAL authentication helper.
- `power-bi/pbi_token_cache.json` — local secret cache; git-ignored.
- `google/gcreds.json` and `google/gsheet_token.json` — local Google API secrets; git-ignored.
- `nexs/auth.ts` — shared NexS server-login/token cache helper; credentials come from environment variables.

Deployments may override the BigQuery token location with `BQ_TOKEN_PATH`. Never import these helpers into client components.
