import { TaskService } from "./task-service";
import {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "./types";

export class TaskManager {
  constructor(private readonly service: TaskService) {}

  async create(input: CreateTaskInput): Promise<Task> {
    return this.service.create(input);
  }

  async get(taskId: string): Promise<Task | undefined> {
    return this.service.get(taskId);
  }

  async listForUser(userId: string): Promise<Task[]> {
    return this.service.listForUser(userId);
  }

  async listForProject(projectId: string): Promise<Task[]> {
    return this.service.listForProject(projectId);
  }

  async update(
    taskId: string,
    changes: UpdateTaskInput
  ): Promise<Task | undefined> {
    return this.service.update(taskId, changes);
  }

  async setStatus(
    taskId: string,
    status: TaskStatus,
    progress?: number
  ): Promise<Task | undefined> {
    return this.service.setStatus(taskId, status, progress);
  }

  async attachQueueJob(
    taskId: string,
    queueJobId: string
  ): Promise<Task | undefined> {
    return this.service.attachQueueJob(taskId, queueJobId);
  }

  async fail(taskId: string, error: string): Promise<Task | undefined> {
    return this.service.fail(taskId, error);
  }
}
