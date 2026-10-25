import { z } from 'zod';

/** Zod validation schemas for the comments endpoints. */

export const listCommentsQuerySchema = z.object({
  taskId: z.string().min(1),
});

export const createCommentBodySchema = z.object({
  taskId: z.string().min(1),
  body: z.string().min(1).max(2000),
});

export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;
export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;
