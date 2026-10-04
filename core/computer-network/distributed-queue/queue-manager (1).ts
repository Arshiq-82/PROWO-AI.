import { randomUUID } from "node:crypto";
import { PriorityQueue } from "./priority-queue";
import {
  QueueItem,
  QueueLease,
  QueueResult,
  QueueStats,
  QueueTask,
} from "./types";

export class DistributedQueueManager {
  constructor(private readonly queue: PriorityQueue = new PriorityQueue()) {}

  enqueue(task: QueueTask): QueueResult {
    if (!task.taskId.trim()) {
      return { success: false, reason: "taskId is required." };
    }

    if (this.queue.get(task.taskId)) {
      return { success: false, reason: "Task is already in the queue." };
    }

    const item: QueueItem = {
      ...task,
      status: "waiting",
      attempt: 0,
      enqueuedAt: new Date().toISOString(),
    };

    this.queue.add(item);
    return { success: true, item: { ...item } };
  }

  leaseNext(workerId: string, leaseDurationMs = 30_000): QueueLease | undefined {
    if (!workerId.trim()) return undefined;

    const item = this.queue.next();
    if (!item) return undefined;

    const now = Date.now();
    const expiresAt = new Date(now + leaseDurationMs).toISOString();

    const leased: QueueItem = {
      ...item,
      status: "leased",
      attempt: item.attempt + 1,
      leasedAt: new Date(now).toISOString(),
      leaseExpiresAt: expiresAt,
    };

    this.queue.add(leased);

    return {
      taskId: item.taskId,
      leaseId: randomUUID(),
      workerId,
      expiresAt,
    };
  }

  markDispatched(taskId: string): QueueResult {
    return this.updateStatus(taskId, "dispatched");
  }

  complete(taskId: string): QueueResult {
    const item = this.queue.get(taskId);
    if (!item) return { success: false, reason: "Task was not found." };

    const completed: QueueItem = {
      ...item,
      status: "completed",
      completedAt: new Date().toISOString(),
    };

    this.queue.add(completed);
    return { success: true, item: completed };
  }

  fail(taskId: string, error: string): QueueResult {
    const item = this.queue.get(taskId);
    if (!item) return { success: false, reason: "Task was not found." };

    const maxAttempts = item.maxAttempts ?? 3;
    const status = item.attempt < maxAttempts ? "waiting" : "failed";

    const failed: QueueItem = {
      ...item,
      status,
      lastError: error,
      leaseExpiresAt: undefined,
    };

    this.queue.add(failed);
    return { success: true, item: failed };
  }

  cancel(taskId: string): QueueResult {
    return this.updateStatus(taskId, "cancelled");
  }

  get(taskId: string): QueueItem | undefined {
    return this.queue.get(taskId);
  }

  list(status?: QueueItem["status"]): QueueItem[] {
    return this.queue.list(status);
  }

  stats(): QueueStats {
    return {
      waiting: this.queue.size("waiting"),
      leased: this.queue.size("leased"),
      dispatched: this.queue.size("dispatched"),
      completed: this.queue.size("completed"),
      failed: this.queue.size("failed"),
      cancelled: this.queue.size("cancelled"),
    };
  }

  private updateStatus(
    taskId: string,
    status: QueueItem["status"]
  ): QueueResult {
    const item = this.queue.get(taskId);
    if (!item) return { success: false, reason: "Task was not found." };

    const updated: QueueItem = {
      ...item,
      status,
      ...(status === "completed"
        ? { completedAt: new Date().toISOString() }
        : {}),
    };

    this.queue.add(updated);
    return { success: true, item: updated };
  }
}
