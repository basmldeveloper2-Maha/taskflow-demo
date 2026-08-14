import type { NextFunction, Request, Response } from 'express';

/**
 * Placeholder auth middleware.
 *
 * For the workshop this is a no-op that simply attaches a stub user so
 * downstream code can assume `req.userId` exists. A real implementation
 * would verify a bearer token here and reject with 401 on failure.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const auth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const header = req.header('authorization');
  // No-op: accept any (or missing) token and attach a stub user id.
  req.userId = header?.replace(/^Bearer\s+/i, '') || 'workshop-user';
  next();
};
