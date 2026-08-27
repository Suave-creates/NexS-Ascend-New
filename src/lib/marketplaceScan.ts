export const MARKETPLACE_SCAN_FORMATS = [
  { marketplace: 'Tata Cliq', example: 'CLQC2000053886', regex: /^CLQC\d{10}$/ },
  { marketplace: 'CRED', example: '45729531019880', regex: /^\d{14}$/ },
  { marketplace: 'Flipkart', example: 'FMPC6413541347', regex: /^FMPC\d{10}$/ },
  { marketplace: 'Nykaa', example: 'SF3270823855NYK', regex: /^SF\d{10}NYK$/ },
  { marketplace: 'Shiprocket', example: '14112365544332', regex: /^\d{14}$/ },
  { marketplace: 'Amazon', example: 'AM103131626IN', regex: /^AM\d{9}IN$/ },
  { marketplace: 'Ajio', example: 'FN0901800004', regex: /^FN\d{10}$/ },
  { marketplace: 'Myntra', example: 'MYEC1114362769', regex: /^MYEC\d{10}$/ },
] as const;

export function normalizeMarketplaceScanId(value: unknown): string {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

export function isMarketplaceScanId(value: string): boolean {
  return MARKETPLACE_SCAN_FORMATS.some(({ regex }) => regex.test(value));
}
