import type { NextFunction, Request, Response } from 'express';
import { badRequest } from '../../lib/app-error';
import { createNewProject, listProjects } from '../../services/project-service';
import { toProjectDto } from './projects.dto';
import { createProjectBodySchema } from './projects.schema';

export const getProjects = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const projects = await listProjects();
    res.json({ data: projects.map(toProjectDto) });
  } catch (error) {
    next(error);
  }
};

export const postProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = createProjectBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw badRequest(parsed.error.issues[0]?.message ?? 'Invalid body');
    }

    const project = await createNewProject(parsed.data);
    res.status(201).json({ data: toProjectDto(project) });
  } catch (error) {
    next(error);
  }
};
