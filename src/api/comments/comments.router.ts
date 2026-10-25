import { Router } from 'express';
import { getComments, postComment } from './comments.controller';

/** Routes for /v1/comments. */
export const commentsRouter: Router = Router();

commentsRouter.get('/', getComments);
commentsRouter.post('/', postComment);
