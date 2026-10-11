import type { Task } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../../src/app';
import * as tasksRepo from '../../src/db/tasks.repo';

// Mock the db layer so these integration tests exercise the full HTTP
// stack (routing, validation, DTO mapping) without a real Postgres.
jest.mock('../../src/db/tasks.repo');

const mockedRepo = jest.mocked(tasksRepo);
const app = createApp();

const sampleTask: Task = {
  id: 'task_1',
  title: 'Write the deck',
  description: null,
  status: 'todo',
  projectId: 'proj_1',
  completedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('GET /v1/tasks', () => {
  it('returns a list of task DTOs', async () => {
    mockedRepo.findManyTasks.mockResolvedValue([sampleTask]);

    const res = await request(app).get('/v1/tasks');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({
      id: 'task_1',
      title: 'Write the deck',
      status: 'todo',
      projectId: 'proj_1',
      completedAt: null,
    });
  });

  it('rejects an invalid status filter with 400', async () => {
    const res = await request(app).get('/v1/tasks?status=nope');

    expect(res.status).toBe(400);
  });
});

describe('GET /v1/tasks/:id', () => {
  it('returns a single task DTO', async () => {
    mockedRepo.findTaskById.mockResolvedValue(sampleTask);

    const res = await request(app).get('/v1/tasks/task_1');

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      id: 'task_1',
      title: 'Write the deck',
      status: 'todo',
      projectId: 'proj_1',
    });
  });

  it('returns 404 when the task does not exist', async () => {
    mockedRepo.findTaskById.mockResolvedValue(null);

    const res = await request(app).get('/v1/tasks/missing');

    expect(res.status).toBe(404);
  });

  it('returns 400 when the id is too long', async () => {
    const res = await request(app).get(`/v1/tasks/${'a'.repeat(65)}`);

    expect(res.status).toBe(400);
    expect(mockedRepo.findTaskById).not.toHaveBeenCalled();
  });
});

describe('POST /v1/tasks', () => {
  it('creates a task and returns 201', async () => {
    mockedRepo.createTask.mockResolvedValue(sampleTask);

    const res = await request(app)
      .post('/v1/tasks')
      .send({ title: 'Write the deck', projectId: 'proj_1' });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe('task_1');
  });

  it('rejects a body missing the title with 400', async () => {
    const res = await request(app)
      .post('/v1/tasks')
      .send({ projectId: 'proj_1' });

    expect(res.status).toBe(400);
  });
});
