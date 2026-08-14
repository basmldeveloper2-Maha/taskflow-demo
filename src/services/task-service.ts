import type { Task, TaskStatus } from '@prisma/client';
import { createTask, findManyTasks } from '../db/tasks.repo';

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

export const createNewTask = (input: CreateTaskInput): Promise<Task> =>
  createTask({
    title: input.title,
    description: input.description,
    status: input.status,
    project: { connect: { id: input.projectId } },
  });
