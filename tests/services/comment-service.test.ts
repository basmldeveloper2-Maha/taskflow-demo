import type { Comment } from '@prisma/client';
import {
  createNewComment,
  listCommentsForTask,
} from '../../src/services/comment-service';
import * as commentsRepo from '../../src/db/comments.repo';

jest.mock('../../src/db/comments.repo');

const mockedRepo = jest.mocked(commentsRepo);

const sampleComment: Comment = {
  id: 'comment_1',
  body: 'Looks good',
  taskId: 'task_1',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('comment-service', () => {
  it('lists comments for a task', async () => {
    mockedRepo.findCommentsByTask.mockResolvedValue([sampleComment]);

    const result = await listCommentsForTask('task_1');

    expect(result).toEqual([sampleComment]);
    expect(mockedRepo.findCommentsByTask).toHaveBeenCalledWith('task_1');
  });

  it('creates a comment connected to its task', async () => {
    mockedRepo.createComment.mockResolvedValue(sampleComment);

    const result = await createNewComment({
      taskId: 'task_1',
      body: 'Looks good',
    });

    expect(result).toEqual(sampleComment);
    expect(mockedRepo.createComment).toHaveBeenCalledWith({
      body: 'Looks good',
      task: { connect: { id: 'task_1' } },
    });
  });
});
