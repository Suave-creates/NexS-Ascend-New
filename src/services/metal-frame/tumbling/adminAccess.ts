import { timingSafeEqual } from 'crypto';
import { TumblingError } from './types';

/**
 * Gates the Tumbling user-admin page/API with a single shared secret (not a
 * per-employee password) — set via TUMBLING_ADMIN_TOKEN. Fails closed: if the
 * token isn't configured, the page is unreachable rather than falling back to
 * a default. Distinct from authorization.service.ts, which verifies a real
 * employeeCode/password for Complete Early / Stop / Settings.
 */
export function verifyAdminAccessToken(provided: unknown): void {
  const expected = process.env.TUMBLING_ADMIN_TOKEN;
  if (!expected) {
    throw new TumblingError(503, 'Admin access is not configured on this server. Set TUMBLING_ADMIN_TOKEN.');
  }

  const providedStr = typeof provided === 'string' ? provided : '';
  const a = Buffer.from(providedStr);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new TumblingError(401, 'Invalid access token.');
  }
}
