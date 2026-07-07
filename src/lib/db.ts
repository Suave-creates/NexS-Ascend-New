// src/lib/db.ts
import mysql from 'mysql2/promise';

// Connection details are env-overridable for containerized / portable deploys.
// The fallbacks preserve the original on-prem values so existing behavior is
// unchanged when the env vars are unset.
// SECURITY: the fallback password below is committed in source — rotate it and
// prefer setting BOSCH_DB_* env vars instead of relying on the fallback.
export const pool = mysql.createPool({
  host: process.env.BOSCH_DB_HOST || '192.168.24.8',
  port: Number(process.env.BOSCH_DB_PORT || 3306),
  user: process.env.BOSCH_DB_USER || 'arya.khadgi',
  password: process.env.BOSCH_DB_PASSWORD || '1289M#*u',
  database: process.env.BOSCH_DB_NAME || 'bosch_cv_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
