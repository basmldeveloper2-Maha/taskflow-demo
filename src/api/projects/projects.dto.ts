import type { Project } from '@prisma/client';

/** Public shape returned by the projects API. */
export interface ProjectDto {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const toProjectDto = (project: Project): ProjectDto => ({
  id: project.id,
  name: project.name,
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
});
