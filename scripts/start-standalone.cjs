// Start Next's standalone output consistently on Windows and Linux.
process.env.NODE_ENV = 'production';
process.env.PORT ||= '3069';
process.env.HOSTNAME ||= '0.0.0.0';

require('../.next/standalone/server.js');
