//src/utils/nexsPool.ts

import mysql from "mysql2/promise";

export const nexsPool = mysql.createPool({
  uri: process.env.NexS_DB!,
  connectionLimit: 6,        // tune later
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
