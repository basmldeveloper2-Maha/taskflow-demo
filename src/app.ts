import express, { type Express } from 'express';
import { v1Router } from './api/router';
import { auth } from './middleware/auth';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';

/**
 * Assemble the Express application. Exported (without listening) so
 * supertest can exercise it directly in integration tests.
 */
export const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);
  app.use(auth);

  app.use('/v1', v1Router);

  // Central error handler must be registered last.
  app.use(errorHandler);

  return app;
};
