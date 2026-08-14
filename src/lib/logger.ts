import pino from 'pino';

/**
 * Shared application logger. Always log through this — never call
 * console.* directly (enforced by the `no-console` ESLint rule).
 */
const usePretty =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'test' ? 'silent' : 'info'),
  transport: usePretty
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});
