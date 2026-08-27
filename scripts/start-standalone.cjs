// Start Next's standalone output consistently on Windows and Linux.
// A generated standalone server does not load the project-root .env files the
// same way `next start` does, so load them before any bundled module creates a
// DB pool. Existing process environment values still take precedence.
const path = require('path');
const { loadEnvConfig } = require('@next/env');

const projectRoot = path.resolve(__dirname, '..');
loadEnvConfig(projectRoot, false);

process.env.NODE_ENV = 'production';
process.env.PORT ||= '3069';
process.env.HOSTNAME ||= '0.0.0.0';
// Keep credential material outside `.next/standalone`. Local production runs
// use the project-native resource mounts just like Docker; explicit deployment
// paths still take precedence.
process.env.NEXS_RESOURCE_ROOT ||= path.join(projectRoot, 'src', 'utils', 'resources');
process.env.BQ_TOKEN_PATH ||= path.join(
  process.env.NEXS_RESOURCE_ROOT,
  'bigquery',
  'token.json',
);

require('../.next/standalone/server.js');
