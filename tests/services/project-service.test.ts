import type { Project } from '@prisma/client';
import {
  createNewProject,
  listProjects,
} from '../../src/services/project-service';
import * as projectsRepo from '../../src/db/projects.repo';

jest.mock('../../src/db/projects.repo');

const mockedRepo = jest.mocked(projectsRepo);

const sampleProject: Project = {
  id: 'proj_1',
  name: 'Workshop prep',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('project-service', () => {
  it('lists projects from the repo', async () => {
    mockedRepo.findManyProjects.mockResolvedValue([sampleProject]);

    const result = await listProjects();

    expect(result).toEqual([sampleProject]);
  });

  it('creates a project by name', async () => {
    mockedRepo.createProject.mockResolvedValue(sampleProject);

    const result = await createNewProject({ name: 'Workshop prep' });

    expect(result).toEqual(sampleProject);
    expect(mockedRepo.createProject).toHaveBeenCalledWith({
      name: 'Workshop prep',
    });
  });
});
