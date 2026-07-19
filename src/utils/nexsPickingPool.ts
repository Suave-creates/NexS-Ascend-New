import mysql from "mysql2/promise";

export const nexsPickingPool = mysql.createPool({
  uri: process.env.NexS_DB_PICKING!,
  connectionLimit: 6,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
