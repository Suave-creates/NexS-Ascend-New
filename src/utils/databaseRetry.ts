const RETRYABLE_DATABASE_CODES = new Set([
  'P1001', // Database host could not be reached.
  'P1002', // Database host was reached but timed out.
  'P1017', // The server closed the connection.
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ETIMEDOUT',
]);

type ErrorWithDetails = {
  code?: unknown;
  message?: unknown;
  cause?: unknown;
};

function boundedInteger(value: string | undefined, fallback: number, minimum: number, maximum: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

function errorChain(error: unknown) {
  const chain: ErrorWithDetails[] = [];
  let current = error as ErrorWithDetails | undefined;
  while (current && chain.length < 5) {
    chain.push(current);
    current = typeof current.cause === 'object' && current.cause !== null
      ? current.cause as ErrorWithDetails
      : undefined;
  }
  return chain;
}

export function databaseErrorCode(error: unknown) {
  for (const item of errorChain(error)) {
    if (typeof item.code === 'string') return item.code;
  }
  return 'DATABASE_ERROR';
}

export function isDatabaseUnavailableError(error: unknown) {
  return errorChain(error).some((item) => {
    if (typeof item.code === 'string' && RETRYABLE_DATABASE_CODES.has(item.code)) return true;
    const message = String(item.message ?? '').toLowerCase();
    return message.includes("can't reach database server")
      || message.includes('database server was reached but timed out')
      || message.includes('server has closed the connection')
      || message.includes('connection refused')
      || message.includes('connection reset');
  });
}

export async function withDatabaseConnectionRetry<T>(
  operation: () => Promise<T>,
  label: string,
): Promise<T> {
  const attempts = boundedInteger(process.env.DATABASE_RETRY_ATTEMPTS, 3, 1, 5);
  const baseDelayMs = boundedInteger(process.env.DATABASE_RETRY_DELAY_MS, 300, 50, 5_000);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isDatabaseUnavailableError(error) || attempt === attempts) throw error;

      const delayMs = baseDelayMs * (2 ** (attempt - 1));
      console.warn(
        `[database:${label}] ${databaseErrorCode(error)}; retrying in ${delayMs}ms `
          + `(attempt ${attempt + 1}/${attempts})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error('Database retry loop ended unexpectedly');
}
