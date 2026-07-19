// src/utils/rackController.ts
//
// Single-ESP32 PTL light controller for ConsolidAte.
//
// The whole system is now driven by ONE ESP32: all racks/LEDs form a single
// addressable chain, and each PTL slot = 2 LEDs in series. The backend only
// ever addresses a slot by its GLOBAL location number (1..N). The firmware maps
//   location -> LEDs (location-1)*2 and (location-1)*2 + 1.
//
// The controller gets its address via DHCP (the firmware prints its MAC on
// boot — request a DHCP reservation for it from IT so the address stays
// stable). Set PTL_ESP32_URL once that reservation is confirmed; until then
// this falls back to the last known-good DHCP-assigned address.

const ESP32_URL = (process.env.PTL_ESP32_URL || 'http://10.9.97.126').replace(/\/$/, '');

export type LightColor = 'YELLOW' | 'BLUE' | 'GREEN' | 'PINK' | 'RED' | 'OFF';

// The light is an OPTIONAL add-on: a missing/unreachable controller must not spam
// the log with a full DOMException per scan. Warn concisely, at most once/minute,
// and note once when it recovers.
let lastWarnAt = 0;
let warnedSinceOk = false;

async function post(path: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${ESP32_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // Never hang on an unreachable/not-yet-installed controller. Callers
      // dispatch this fire-and-forget (the light is an add-on, not a mandate),
      // but keep the timeout short so background calls can't pile up.
      signal: AbortSignal.timeout(1500),
    });
    if (warnedSinceOk) {
      console.info(`[rackController] ESP32 ${ESP32_URL} reachable again`);
      warnedSinceOk = false;
    }
    return res.ok;
  } catch (err) {
    const now = Date.now();
    if (now - lastWarnAt > 60_000) {
      lastWarnAt = now;
      warnedSinceOk = true;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[rackController] ESP32 ${ESP32_URL} unreachable — skipping light (optional add-on): ${msg}`);
    }
    return false;
  }
}

/**
 * Light a slot's 2 LEDs. Pass a single colour to drive both LEDs the same
 * (unchanged behaviour), or an array of 2 to drive them independently — used
 * when 2 concurrent operators (different Ranger colours) both have a live
 * pending item on the same shared slot.
 *
 * Always sends BOTH the legacy singular `color` field and the new `colors`
 * array: dispatch_ptl's routes (scan-awb/confirm-placement/master-reset,
 * out of scope for this redesign) also call through here via sendToRack(),
 * and may be pointed at older/unmodified firmware that only understands
 * `color`. Adding `colors` alongside it — never replacing `color` — means
 * that path keeps working unchanged regardless of which firmware it hits.
 */
export async function setLight(location: number, color: LightColor | string | (LightColor | string)[]): Promise<boolean> {
  const colors = (Array.isArray(color) ? color : [color]).map((c) => String(c).toUpperCase()).slice(0, 2);
  return post('/light', { location, color: colors[0] ?? 'OFF', colors });
}

/** Turn every LED off. */
export async function resetAll(): Promise<boolean> {
  return post('/reset', {});
}

/**
 * Back-compat alias for the legacy dispatch_ptl routes (scan-awb /
 * confirm-placement / master-reset) which called sendToRack(locationNumber,color).
 * ConsolidAte code should call setLight() directly.
 */
export async function sendToRack(locationNumber: number, color: string): Promise<boolean> {
  return setLight(locationNumber, color);
}
