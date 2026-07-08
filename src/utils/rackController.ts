// src/utils/rackController.ts
//
// Single-ESP32 PTL light controller for ConsolidAte.
//
// The whole system is now driven by ONE ESP32: all racks/LEDs form a single
// addressable chain, and each PTL slot = 2 LEDs in series. The backend only
// ever addresses a slot by its GLOBAL location number (1..N). The firmware maps
//   location -> LEDs (location-1)*2 and (location-1)*2 + 1.
//
// The controller address is configurable (hardware is wired later): set
// PTL_ESP32_URL, e.g. PTL_ESP32_URL=http://10.9.97.101

const ESP32_URL = (process.env.PTL_ESP32_URL || 'http://10.9.97.101').replace(/\/$/, '');

export type LightColor = 'YELLOW' | 'BLUE' | 'GREEN' | 'PINK' | 'RED' | 'OFF';

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
    return res.ok;
  } catch (err) {
    console.error(`[rackController] ${path} failed (ESP32 ${ESP32_URL} unreachable?)`, err);
    return false;
  }
}

/** Light a slot (its 2 LEDs) a colour, or turn it OFF. */
export async function setLight(location: number, color: LightColor | string): Promise<boolean> {
  return post('/light', { location, color: String(color).toUpperCase() });
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
