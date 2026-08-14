import type { Prisma, Task } from '@prisma/client';
import { prisma } from './client';

/**
 * Typed query helpers for the `tasks` table. Controllers/services call
 * these instead of touching the Prisma client directly.
 */

export const findManyTasks = (where: Prisma.TaskWhereInput = {}): Promise<Task[]> =>
  prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } });

export const createTask = (data: Prisma.TaskCreateInput): Promise<Task> =>
  prisma.task.create({ data });
