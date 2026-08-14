import type { Comment } from '@prisma/client';

/** Public shape returned by the comments API. */
export interface CommentDto {
  id: string;
  body: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export const toCommentDto = (comment: Comment): CommentDto => ({
  id: comment.id,
  body: comment.body,
  taskId: comment.taskId,
  createdAt: comment.createdAt.toISOString(),
  updatedAt: comment.updatedAt.toISOString(),
});
