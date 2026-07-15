import { ProductInput, TumblingError } from './types';

export const STOP_REASONS = [
  'Quality Issue',
  'Machine Issue',
  'Incorrect Product Loaded',
  'Emergency Stop',
  'Production Priority Change',
  'Operator Error',
  'Other',
] as const;

export const EARLY_COMPLETION_REASONS = [
  'Process Verified Manually',
  'Supervisor Approval',
  'Product-Specific Reduced Duration',
  'Testing or Trial Batch',
  'Other',
] as const;

const MAX_TEXT_LEN = 250;
const MAX_REMARKS_LEN = 2000;

function requiredString(value: unknown, field: string, maxLen = MAX_TEXT_LEN): string {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) throw new TumblingError(400, `${field} is required.`);
  if (trimmed.length > maxLen) throw new TumblingError(400, `${field} must be ${maxLen} characters or fewer.`);
  return trimmed;
}

function validateQuantity(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
    throw new TumblingError(400, 'Quantity must be a positive whole number.');
  }
  if (n > 1_000_000) throw new TumblingError(400, 'Quantity is too large.');
  return n;
}

export function validateProduct(raw: unknown): ProductInput {
  const p = (raw ?? {}) as Record<string, unknown>;

  return {
    pid: requiredString(p.pid, 'PID'),
    sheetCode: requiredString(p.sheetCode, 'Sheet Code'),
    modelNumber: requiredString(p.modelNumber, 'Model Number'),
    quantity: validateQuantity(p.quantity),
  };
}

export function validateReason(value: unknown, allowed: readonly string[]): string {
  const reason = requiredString(value, 'Reason');
  if (!allowed.includes(reason)) {
    throw new TumblingError(400, 'Reason must be one of the predefined options.');
  }
  return reason;
}

export function validateRemarks(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_REMARKS_LEN) {
    throw new TumblingError(400, `Remarks must be ${MAX_REMARKS_LEN} characters or fewer.`);
  }
  return trimmed;
}

export function validateOperatorName(value: unknown): string {
  return requiredString(value, 'Operator name', 100);
}

export function validatePagination(page: unknown, pageSize: unknown): { page: number; pageSize: number } {
  const p = Number(page);
  const ps = Number(pageSize);
  return {
    page: Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1,
    pageSize: Number.isFinite(ps) && ps >= 1 ? Math.min(Math.floor(ps), 100) : 25,
  };
}

export function validateDurationMinutes(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1 || n > 100_000) {
    throw new TumblingError(400, 'Duration must be a positive number of minutes.');
  }
  return Math.floor(n);
}

export function validateEmployeeCode(value: unknown): string {
  return requiredString(value, 'Employee code', 50);
}

export function validatePassword(value: unknown): string {
  const password = typeof value === 'string' ? value : '';
  if (password.length < 6) throw new TumblingError(400, 'Password must be at least 6 characters.');
  if (password.length > 100) throw new TumblingError(400, 'Password must be 100 characters or fewer.');
  return password;
}
