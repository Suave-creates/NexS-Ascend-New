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

require('../.next/standalone/server.js');
