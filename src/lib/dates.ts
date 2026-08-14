/** Framework-free date helpers. */

/** Milliseconds in one day. */
export const DAY_MS = 24 * 60 * 60 * 1000;

/** Return a new Date `days` before `from` (defaults to now). */
export const daysAgo = (days: number, from: Date = new Date()): Date =>
  new Date(from.getTime() - days * DAY_MS);

/** Serialize a Date to ISO-8601, passing through null/undefined. */
export const toIso = (value: Date | null | undefined): string | null =>
  value ? value.toISOString() : null;
