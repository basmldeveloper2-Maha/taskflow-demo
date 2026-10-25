import type { NextFunction, Request, Response } from 'express';
import { badRequest } from '../../lib/app-error';
import {
  createNewComment,
  listCommentsForTask,
} from '../../services/comment-service';
import { toCommentDto } from './comments.dto';
import {
  createCommentBodySchema,
  listCommentsQuerySchema,
} from './comments.schema';

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = listCommentsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw badRequest(parsed.error.issues[0]?.message ?? 'Invalid query');
    }

    const comments = await listCommentsForTask(parsed.data.taskId);
    res.json({ data: comments.map(toCommentDto) });
  } catch (error) {
    next(error);
  }
};

export const postComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = createCommentBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw badRequest(parsed.error.issues[0]?.message ?? 'Invalid body');
    }

    const comment = await createNewComment(parsed.data);
    res.status(201).json({ data: toCommentDto(comment) });
  } catch (error) {
    next(error);
  }
};
