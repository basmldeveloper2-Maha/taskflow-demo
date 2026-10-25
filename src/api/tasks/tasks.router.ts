import { Router } from 'express';
import { getTask, getTasks, postTask } from './tasks.controller';

/** Routes for /v1/tasks. */
export const tasksRouter: Router = Router();

tasksRouter.get('/', getTasks);
tasksRouter.post('/', postTask);
tasksRouter.get('/:id', getTask);
