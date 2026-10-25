import type { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';

/** Log the method and path of every incoming request via the shared logger. */
export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  logger.info({ method: req.method, path: req.originalUrl }, 'request');
  next();
};
