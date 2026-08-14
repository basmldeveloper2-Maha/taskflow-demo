import type { Project } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../../src/app';
import * as projectsRepo from '../../src/db/projects.repo';

jest.mock('../../src/db/projects.repo');

const mockedRepo = jest.mocked(projectsRepo);
const app = createApp();

const sampleProject: Project = {
  id: 'proj_1',
  name: 'Workshop prep',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('GET /v1/projects', () => {
  it('returns a list of project DTOs', async () => {
    mockedRepo.findManyProjects.mockResolvedValue([sampleProject]);

    const res = await request(app).get('/v1/projects');

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toMatchObject({
      id: 'proj_1',
      name: 'Workshop prep',
    });
  });
});

describe('POST /v1/projects', () => {
  it('creates a project and returns 201', async () => {
    mockedRepo.createProject.mockResolvedValue(sampleProject);

    const res = await request(app)
      .post('/v1/projects')
      .send({ name: 'Workshop prep' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Workshop prep');
  });

  it('rejects an empty name with 400', async () => {
    const res = await request(app).post('/v1/projects').send({ name: '' });

    expect(res.status).toBe(400);
  });
});
