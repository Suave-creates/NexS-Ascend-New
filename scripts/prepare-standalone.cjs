const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const standalone = path.join(root, '.next', 'standalone');

if (!fs.existsSync(path.join(standalone, 'server.js'))) {
  throw new Error('Standalone server was not generated. Check next.config.ts output configuration.');
}

function copy(source, destination) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

function remove(relativePath) {
  fs.rmSync(path.join(standalone, relativePath), { recursive: true, force: true });
}

// Next copies loaded `.env*` files into standalone output, and static token
// paths can be picked up by file tracing. Standalone artifacts are commonly
// archived or handed to another machine, so strip every project credential;
// deployments inject env and mount token caches only at runtime.
for (const entry of fs.readdirSync(standalone, { withFileTypes: true })) {
  if (entry.isFile() && (entry.name === '.env' || entry.name.startsWith('.env.'))) {
    remove(entry.name);
  }
}
for (const secret of [
  'src/utils/resources/bigquery/credentials.json',
  'src/utils/resources/bigquery/token.json',
  'src/utils/resources/google/gcreds.json',
  'src/utils/resources/google/gsheet_token.json',
  'src/utils/resources/power-bi/pbi_token_cache.json',
]) {
  remove(secret);
}
const powerBiResources = path.join(standalone, 'src', 'utils', 'resources', 'power-bi');
if (fs.existsSync(powerBiResources)) {
  for (const entry of fs.readdirSync(powerBiResources)) {
    if (entry.endsWith('.lock')) remove(path.join('src', 'utils', 'resources', 'power-bi', entry));
  }
}

copy(path.join(root, '.next', 'static'), path.join(standalone, '.next', 'static'));
copy(path.join(root, 'public'), path.join(standalone, 'public'));

console.log('Standalone runtime prepared with static and public assets.');
