import { Router } from 'express';
import { commentsRouter } from './comments/comments.router';
import { projectsRouter } from './projects/projects.router';
import { tasksRouter } from './tasks/tasks.router';

/** Mounts all resource routers under the versioned /v1 prefix. */
export const v1Router: Router = Router();

v1Router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

v1Router.use('/tasks', tasksRouter);
v1Router.use('/projects', projectsRouter);
v1Router.use('/comments', commentsRouter);
