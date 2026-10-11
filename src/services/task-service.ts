import type { Task, TaskStatus } from '@prisma/client';
import { notFound } from '../lib/app-error';
import { daysAgo } from '../lib/dates';
import { logger } from '../lib/logger';
import {
  archiveTasksCompletedBefore,
  createTask,
  findManyTasks,
  findTaskById,
} from '../db/tasks.repo';

/** Tasks are eligible for archiving this many days after completion. */
const ARCHIVE_AFTER_DAYS = 30;

/**
 * Task business logic — pure functions, no req/res. All persistence goes
 * through the db repo helpers.
 */

export interface ListTasksInput {
  projectId?: string;
  status?: TaskStatus;
}

export const listTasks = (input: ListTasksInput = {}): Promise<Task[]> =>
  findManyTasks({
    ...(input.projectId ? { projectId: input.projectId } : {}),
    ...(input.status ? { status: input.status } : {}),
  });

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: string;
}

export const createNewTask = async (
  input: CreateTaskInput,
): Promise<Task> => {
  const task = await createTask({
    title: input.title,
    description: input.description,
    status: input.status,
    project: { connect: { id: input.projectId } },
  });
  logger.info({ taskId: task.id, projectId: task.projectId }, 'Task created');
  return task;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const task = await findTaskById(id);
  if (!task) {
    throw notFound(`Task ${id} not found`);
  }
  return task;
};

/**
 * Archives tasks that have been `done` for more than
 * `ARCHIVE_AFTER_DAYS` days. Returns the number of tasks archived.
 */
export const archiveOldCompletedTasks = (
  now: Date = new Date(),
): Promise<number> =>
  archiveTasksCompletedBefore(daysAgo(ARCHIVE_AFTER_DAYS, now));
