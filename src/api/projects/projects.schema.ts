import { z } from 'zod';

/** Zod validation schemas for the projects endpoints. */

export const createProjectBodySchema = z.object({
  name: z.string().min(1).max(120),
});

export type CreateProjectBody = z.infer<typeof createProjectBodySchema>;
