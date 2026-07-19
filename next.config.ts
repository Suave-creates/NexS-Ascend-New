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
    ],
  },
};

export default nextConfig;

