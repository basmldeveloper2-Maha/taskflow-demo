import type { Project } from '@prisma/client';
import { createProject, findManyProjects } from '../db/projects.repo';

/** Project business logic — pure functions, no req/res. */

export const listProjects = (): Promise<Project[]> => findManyProjects();

export interface CreateProjectInput {
  name: string;
}

export const createNewProject = (input: CreateProjectInput): Promise<Project> =>
  createProject({ name: input.name });
