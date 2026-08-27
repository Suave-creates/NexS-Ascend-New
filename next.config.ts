import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for Docker (.next/standalone).
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // or '5mb'
    },
  },
  // Force files the standalone tracer would otherwise miss into the bundle:
  // the custom-output Prisma clients + query engines, the Prisma schemas
  // (used by the entrypoint for db push/migrate), and the NDD-RCA python
  // pipeline (spawned at runtime by the ndd-rca route).
  outputFileTracingIncludes: {
    "/api/**": [
      "./src/generated/**",
      "./prisma/**",
      "./src/app/api/packing-dispatch/ndd-rca/NDD-RCA/**",
      "./src/app/api/planning-and-process-excellence/order-cancellation/**",
      "./src/app/api/stock-in/**",
      // Frame Decanting's versioned PLC/exclusion snapshots are read by its
      // Python adapter, so Next's JavaScript tracer cannot discover them.
      "./src/lib/plc flag.csv",
      "./src/lib/pid excusion.csv",
      "./src/utils/resources/power-bi/*.py",
      "./src/utils/resources/google/*.py",
    ],
  },
  // Credential files are runtime mounts, never build artifacts. The BigQuery
  // client reads a predictable token path, which would otherwise make Next's
  // file tracer copy a developer token into `.next/standalone`.
  outputFileTracingExcludes: {
    "/api/**": [
      "./src/utils/resources/**/credentials.json",
      "./src/utils/resources/**/gcreds.json",
      "./src/utils/resources/**/token.json",
      "./src/utils/resources/**/gsheet_token.json",
      "./src/utils/resources/**/pbi_token_cache.json",
      "./src/utils/resources/**/*.lock",
    ],
  },
};

export default nextConfig;

