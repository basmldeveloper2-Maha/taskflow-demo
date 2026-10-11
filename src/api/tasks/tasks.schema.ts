import { z } from 'zod';

/** Zod validation schemas for the tasks endpoints. */

export const listTasksQuerySchema = z.object({
  projectId: z.string().min(1).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

export const taskIdParamsSchema = z.object({
  id: z.string().min(1).max(64),
});

export const createTaskBodySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  projectId: z.string().min(1),
});

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
