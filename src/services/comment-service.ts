import type { Comment } from '@prisma/client';
import { createComment, findCommentsByTask } from '../db/comments.repo';

/** Comment business logic — pure functions, no req/res. */

export const listCommentsForTask = (taskId: string): Promise<Comment[]> =>
  findCommentsByTask(taskId);

export interface CreateCommentInput {
  taskId: string;
  body: string;
}

export const createNewComment = (input: CreateCommentInput): Promise<Comment> =>
  createComment({
    body: input.body,
    task: { connect: { id: input.taskId } },
  });
