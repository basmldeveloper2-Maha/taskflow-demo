import { randomUUID } from 'node:crypto';

/** Generate an opaque, URL-safe identifier (used where the DB does not). */
export const newId = (): string => randomUUID();
