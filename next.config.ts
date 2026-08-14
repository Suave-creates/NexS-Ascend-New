import type { NextConfig } from "next";

// Floor stations run a local hardware-agent helper on this origin (see
// src/app/lens-lab/fqc/page.tsx); it must stay in connect-src or those
// scan flows lose their live gauge readings.
const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL ?? "http://127.0.0.1:13131";

// Next.js injects its own inline bootstrap/hydration <script> tags on every
// page (server-rendered props, RSC flight data) — this isn't optional and
// happens in prod too, so script-src needs 'unsafe-inline' or the browser
// refuses to run ANY client JS at all (no hydration, no redirects, nothing
// works — a strict 'self'-only script-src breaks the whole app, not just
// tightens it). 'unsafe-eval' is dev-only, for webpack/Fast Refresh.
const SCRIPT_SRC = process.env.NODE_ENV === 'production'
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const CSP = [
  "default-src 'self'",
  SCRIPT_SRC,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  `connect-src 'self' ${AGENT_URL}`,
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: CSP },
];

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for Docker (.next/standalone).
  output: "standalone",
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
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

