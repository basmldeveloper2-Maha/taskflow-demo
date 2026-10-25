import type { Prisma, Project } from '@prisma/client';
import { prisma } from './client';

/** Typed query helpers for the `projects` table. */

export const findManyProjects = (): Promise<Project[]> =>
  prisma.project.findMany({ orderBy: { createdAt: 'desc' } });

export const createProject = (
  data: Prisma.ProjectCreateInput,
): Promise<Project> => prisma.project.create({ data });
