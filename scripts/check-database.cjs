// Read-only Prisma connectivity diagnostic. Connection credentials are never printed.
// Usage: npm run db:check -- dispatch   (or: all, primary, lens-lab, metal-frame)
const path = require('path');
const { performance } = require('perf_hooks');
const { loadEnvConfig } = require('@next/env');

const projectRoot = path.resolve(__dirname, '..');
loadEnvConfig(projectRoot, process.env.NODE_ENV !== 'production');

const databases = {
  primary: { envName: 'DATABASE_URL', generatedDirectory: 'mydb' },
  dispatch: { envName: 'DATABASE_URL_DISPATCH', generatedDirectory: 'dispatch' },
  'lens-lab': { envName: 'DATABASE_URL_LENS_LAB', generatedDirectory: 'lens_lab' },
  'metal-frame': { envName: 'DATABASE_URL_MF', generatedDirectory: 'metal_frame' },
};

function safeTarget(connectionUrl) {
  const separator = connectionUrl.lastIndexOf('@');
  const targetAndQuery = separator >= 0 ? connectionUrl.slice(separator + 1) : connectionUrl;
  const [target, query = ''] = targetAndQuery.split('?', 2);
  const parameters = new URLSearchParams(query);
  const pool = ['connection_limit', 'connect_timeout', 'pool_timeout']
    .filter((name) => parameters.has(name))
    .map((name) => `${name}=${parameters.get(name)}`)
    .join(', ');
  return pool ? `${target} (${pool})` : target;
}

function statusMap(rows) {
  return Object.fromEntries(rows.map((row) => [row.Variable_name, row.Value]));
}

async function checkDatabase(name, config) {
  const connectionUrl = process.env[config.envName];
  if (!connectionUrl) throw new Error(`${config.envName} is not set`);

  const generated = require(path.join(projectRoot, 'src', 'generated', config.generatedDirectory));
  const prisma = new generated.PrismaClient();
  const startedAt = performance.now();

  try {
    const [server] = await prisma.$queryRawUnsafe(
      'SELECT @@hostname AS hostname, @@version AS version, @@max_connections AS max_connections',
    );
    const status = statusMap(await prisma.$queryRawUnsafe(
      `SHOW GLOBAL STATUS WHERE Variable_name IN (
        'Uptime', 'Threads_connected', 'Threads_running', 'Max_used_connections',
        'Aborted_connects', 'Connection_errors_internal', 'Connection_errors_max_connections'
      )`,
    ));
    const latencyMs = Math.round(performance.now() - startedAt);

    console.log(`\n[${name}] OK in ${latencyMs}ms`);
    console.log(`  target: ${safeTarget(connectionUrl)}`);
    console.log(`  Prisma client: ${generated.Prisma.prismaVersion.client}`);
    console.log(`  MySQL: ${server.version} on ${server.hostname}`);
    console.log(
      `  connections: ${status.Threads_connected}/${server.max_connections} current, `
        + `${status.Max_used_connections} peak`,
    );
    console.log(`  uptime: ${status.Uptime}s; aborted connects: ${status.Aborted_connects}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const requested = process.argv[2] || 'dispatch';
  const selected = requested === 'all' ? Object.entries(databases) : [[requested, databases[requested]]];
  if (!selected[0][1]) {
    throw new Error(`Unknown database "${requested}". Use: ${Object.keys(databases).join(', ')}, or all.`);
  }

  for (const [name, config] of selected) await checkDatabase(name, config);
}

main().catch((error) => {
  console.error('\nDatabase check failed:', {
    code: error.code || 'DATABASE_CHECK_FAILED',
    message: error.message,
  });
  process.exitCode = 1;
});
