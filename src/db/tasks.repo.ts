import type { Prisma, Task } from '@prisma/client';
import { prisma } from './client';

/**
 * Typed query helpers for the `tasks` table. Controllers/services call
 * these instead of touching the Prisma client directly.
 */

export const findManyTasks = (
  where: Prisma.TaskWhereInput = {},
): Promise<Task[]> =>
  prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } });

export const createTask = (data: Prisma.TaskCreateInput): Promise<Task> =>
  prisma.task.create({ data });

export const findTaskById = (id: string): Promise<Task | null> =>
  prisma.task.findUnique({ where: { id } });

/**
 * Marks every `done` task completed at or before `cutoff` as `archived`.
 * Returns the number of tasks archived.
 */
export const archiveTasksCompletedBefore = async (
  cutoff: Date,
): Promise<number> => {
  const result = await prisma.task.updateMany({
    where: { status: 'done', completedAt: { lte: cutoff } },
    data: { status: 'archived' },
  });
  return result.count;
};
