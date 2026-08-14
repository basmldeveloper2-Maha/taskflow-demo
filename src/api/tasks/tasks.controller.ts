import type { NextFunction, Request, Response } from 'express';
import { badRequest } from '../../lib/app-error';
import { createNewTask, listTasks } from '../../services/task-service';
import { toTaskDto } from './tasks.dto';
import {
  createTaskBodySchema,
  listTasksQuerySchema,
} from './tasks.schema';

/**
 * Thin controllers: validate input with Zod at the top, delegate to the
 * service, map the result through a DTO. No business logic here.
 */

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = listTasksQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw badRequest(parsed.error.issues[0]?.message ?? 'Invalid query');
    }

    const tasks = await listTasks(parsed.data);
    res.json({ data: tasks.map(toTaskDto) });
  } catch (error) {
    next(error);
  }
};

export const postTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = createTaskBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw badRequest(parsed.error.issues[0]?.message ?? 'Invalid body');
    }

    const task = await createNewTask(parsed.data);
    res.status(201).json({ data: toTaskDto(task) });
  } catch (error) {
    next(error);
  }
};
