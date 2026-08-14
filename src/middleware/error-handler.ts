import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/app-error';
import { logger } from '../lib/logger';

/**
 * Central error handler — must be registered last. Maps AppError to its
 * status code; anything else becomes a 500. Always logs via the shared
 * logger (never console).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    logger.warn({ status: error.status, msg: error.message }, 'handled error');
    res.status(error.status).json({ error: { message: error.message } });
    return;
  }

  logger.error({ err: error }, 'unhandled error');
  res.status(500).json({ error: { message: 'Internal server error' } });
};
