import type { Comment, Prisma } from '@prisma/client';
import { prisma } from './client';

/** Typed query helpers for the `comments` table. */

export const findCommentsByTask = (taskId: string): Promise<Comment[]> =>
  prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: 'asc' },
  });

export const createComment = (
  data: Prisma.CommentCreateInput,
): Promise<Comment> => prisma.comment.create({ data });
