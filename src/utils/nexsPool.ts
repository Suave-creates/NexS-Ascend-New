//src/utils/nexsPool.ts

import { createNexsPool } from "./adaptiveExecPool";

// Production: set NEXS_DB_ADAPTIVE_ENDPOINT to route through the Adaptive PAM
// CLI instead of a static prod credential/IP. Local dev (NexS_DB pointed at
// the bundled docker MySQL) is untouched - see adaptiveExecPool.ts.
export const nexsPool = createNexsPool({
  adaptiveEndpointEnv: "NEXS_DB_ADAPTIVE_ENDPOINT",
  fallbackUriEnv: "NexS_DB",
  label: "NexS_DB",
  connectionLimit: 6, // tune later
});
