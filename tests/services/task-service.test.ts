import type { Task } from '@prisma/client';
import {
  archiveOldCompletedTasks,
  createNewTask,
  getTaskById,
  listTasks,
} from '../../src/services/task-service';
import * as tasksRepo from '../../src/db/tasks.repo';

// Mock the db layer so these unit tests run without a real Postgres.
jest.mock('../../src/db/tasks.repo');

const mockedRepo = jest.mocked(tasksRepo);

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

describe('task-service', () => {
  describe('listTasks', () => {
    it('returns tasks from the repo', async () => {
      mockedRepo.findManyTasks.mockResolvedValue([sampleTask]);

      const result = await listTasks();

      expect(result).toEqual([sampleTask]);
      expect(mockedRepo.findManyTasks).toHaveBeenCalledTimes(1);
    });

    it('forwards projectId and status filters to the repo', async () => {
      mockedRepo.findManyTasks.mockResolvedValue([]);

      await listTasks({ projectId: 'proj_1', status: 'done' });

      expect(mockedRepo.findManyTasks).toHaveBeenCalledWith({
        projectId: 'proj_1',
        status: 'done',
      });
    });
  });

  describe('createNewTask', () => {
    it('connects the task to its project', async () => {
      mockedRepo.createTask.mockResolvedValue(sampleTask);

      const result = await createNewTask({
        title: 'Write the deck',
        projectId: 'proj_1',
      });

      expect(result).toEqual(sampleTask);
      expect(mockedRepo.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Write the deck',
          project: { connect: { id: 'proj_1' } },
        }),
      );
    });
  });

  describe('getTaskById', () => {
    it('returns the task from the repo', async () => {
      mockedRepo.findTaskById.mockResolvedValue(sampleTask);

      const result = await getTaskById('task_1');

      expect(result).toEqual(sampleTask);
      expect(mockedRepo.findTaskById).toHaveBeenCalledWith('task_1');
    });

    it('throws a 404 AppError when the task does not exist', async () => {
      mockedRepo.findTaskById.mockResolvedValue(null);

      await expect(getTaskById('missing')).rejects.toMatchObject({
        status: 404,
      });
    });
  });

  describe('archiveOldCompletedTasks', () => {
    it('archives tasks completed 30+ days before the given time', async () => {
      mockedRepo.archiveTasksCompletedBefore.mockResolvedValue(3);

      const now = new Date('2026-02-15T00:00:00.000Z');
      const result = await archiveOldCompletedTasks(now);

      expect(result).toBe(3);
      expect(mockedRepo.archiveTasksCompletedBefore).toHaveBeenCalledWith(
        new Date('2026-01-16T00:00:00.000Z'),
      );
    });

    it('defaults to the current time when none is given', async () => {
      mockedRepo.archiveTasksCompletedBefore.mockResolvedValue(0);

      await archiveOldCompletedTasks();

      expect(mockedRepo.archiveTasksCompletedBefore).toHaveBeenCalledTimes(1);
    });
  });
});
