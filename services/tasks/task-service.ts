import { TaskRepository } from "./task-repository";
import {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "./types";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async create(input: CreateTaskInput): Promise<Task> {
    const title = input.title.trim();

    if (!title) {
      throw new Error("Task title is required.");
    }

    return this.repository.create({
      id: input.id,
      userId: input.userId,
      projectId: input.projectId,
      kind: input.kind,
      title,
      description: input.description?.trim(),
      status: "queued",
      progress: 0,
      metadata: input.metadata,
    });
  }

  async get(taskId: string): Promise<Task | undefined> {
    return this.repository.findById(taskId);
  }

  async listForUser(userId: string): Promise<Task[]> {
    return this.repository.findByUser(userId);
  }

  async listForProject(projectId: string): Promise<Task[]> {
    return this.repository.findByProject(projectId);
  }

  async update(
    taskId: string,
    changes: UpdateTaskInput
  ): Promise<Task | undefined> {
    if (
      changes.progress !== undefined &&
      (changes.progress < 0 || changes.progress > 100)
    ) {
      throw new Error("Task progress must be between 0 and 100.");
    }

    const update: UpdateTaskInput & { completedAt?: string } = {
      ...changes,
    };

    if (
      changes.status === "completed" ||
      changes.status === "failed" ||
      changes.status === "cancelled"
    ) {
      update.completedAt = new Date().toISOString();
    }

    return this.repository.update(taskId, update);
  }

  async setStatus(
    taskId: string,
    status: TaskStatus,
    progress?: number
  ): Promise<Task | undefined> {
    return this.update(taskId, {
      status,
      progress,
    });
  }

  async attachQueueJob(
    taskId: string,
    queueJobId: string
  ): Promise<Task | undefined> {
    return this.update(taskId, {
      queueJobId,
    });
  }

  async fail(
    taskId: string,
    error: string
  ): Promise<Task | undefined> {
    return this.update(taskId, {
      status: "failed",
      error,
    });
  }
}
