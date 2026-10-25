/**
 * Application-level error carrying an HTTP status code.
 * Thrown by services/controllers and translated to a response
 * by the central error handler (src/middleware/error-handler.ts).
 */
export class AppError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const notFound = (message = 'Not found'): AppError =>
  new AppError(404, message);

export const badRequest = (message = 'Bad request'): AppError =>
  new AppError(400, message);
