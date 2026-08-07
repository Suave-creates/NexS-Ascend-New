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

copy(path.join(root, '.next', 'static'), path.join(standalone, '.next', 'static'));
copy(path.join(root, 'public'), path.join(standalone, 'public'));

console.log('Standalone runtime prepared with static and public assets.');
