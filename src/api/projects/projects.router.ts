import { Router } from 'express';
import { getProjects, postProject } from './projects.controller';

/** Routes for /v1/projects. */
export const projectsRouter: Router = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', postProject);
