export type Partner =
  | 'Purpledrone'
  | 'Delcart'
  | 'Blitz'
  | 'DOT'
  | 'Velocity'
  | 'Shadowfax'
  | 'XPressBees';

export const PARTNERS: Partner[] = [
  'Purpledrone',
  'Delcart',
  'Blitz',
  'DOT',
  'Velocity',
  'Shadowfax',
  'XPressBees',
];

// Regex from your rules
export const RE: Record<Partner, RegExp> = {
  Purpledrone: /^PR[A-Za-z0-9]{11}$/i,      // starts PR, total 13
  Delcart: /^15\d{8}$/,                     // starts 15, total 10
  Blitz: /^(?:BK|BZ)[A-Za-z0-9]{10}$/i,     // starts BK, total 12
  DOT: /^(?:\d{8}|NCR[A-Za-z0-9]{7})$/i,    // 8 digits OR NCR+7
  Velocity: /^LK[A-Za-z0-9]{9}$/i,          // starts LK, total 11
  Shadowfax: /^SF[A-Za-z0-9]{12}$/i,        // starts SF, total 14
  XPressBees: /^15\d{13}$/,                 // starts 15, total 15
};

export function validateForPartner(partner: Partner, awb: string): boolean {
  const s = (awb || '').trim();
  return RE[partner].test(s);
}

// Find which partner this AWB *looks like* (if any)
export function detectPartner(awb: string): Partner | null {
  const s = (awb || '').trim();
  for (const p of PARTNERS) {
    if (RE[p].test(s)) return p;
  }
  return null;
}
