import type { Task } from '@prisma/client';
import { toIso } from '../../lib/dates';

/**
 * Public shape returned by the tasks API. Never leak raw Prisma models —
 * always map through a DTO so DB-only fields stay internal.
 */
export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  status: Task['status'];
  projectId: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toTaskDto = (task: Task): TaskDto => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  projectId: task.projectId,
  completedAt: toIso(task.completedAt),
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});
