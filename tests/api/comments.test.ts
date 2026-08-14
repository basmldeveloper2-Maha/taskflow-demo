import type { Comment } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../../src/app';
import * as commentsRepo from '../../src/db/comments.repo';

jest.mock('../../src/db/comments.repo');

const mockedRepo = jest.mocked(commentsRepo);
const app = createApp();

const sampleComment: Comment = {
  id: 'comment_1',
  body: 'Looks good',
  taskId: 'task_1',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('GET /v1/comments', () => {
  it('returns comments for a task', async () => {
    mockedRepo.findCommentsByTask.mockResolvedValue([sampleComment]);

    const res = await request(app).get('/v1/comments?taskId=task_1');

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toMatchObject({ id: 'comment_1', taskId: 'task_1' });
  });

  it('rejects a missing taskId with 400', async () => {
    const res = await request(app).get('/v1/comments');

    expect(res.status).toBe(400);
  });
});

describe('POST /v1/comments', () => {
  it('creates a comment and returns 201', async () => {
    mockedRepo.createComment.mockResolvedValue(sampleComment);

    const res = await request(app)
      .post('/v1/comments')
      .send({ taskId: 'task_1', body: 'Looks good' });

    expect(res.status).toBe(201);
    expect(res.body.data.body).toBe('Looks good');
  });
});
