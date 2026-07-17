import { createNexsPool } from "./adaptiveExecPool";

// Production: set NEXS_DB_PICKING_ADAPTIVE_ENDPOINT to route through the
// Adaptive PAM CLI instead of a static prod credential/IP. Local dev
// (NexS_DB_PICKING pointed at the bundled docker MySQL) is untouched - see
// adaptiveExecPool.ts.
export const nexsPickingPool = createNexsPool({
  adaptiveEndpointEnv: "NEXS_DB_PICKING_ADAPTIVE_ENDPOINT",
  fallbackUriEnv: "NexS_DB_PICKING",
  label: "NexS_DB_PICKING",
  connectionLimit: 6,
});
