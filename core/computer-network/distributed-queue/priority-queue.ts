import { QueueItem, QueuePriority } from "./types";

const PRIORITY_WEIGHT: Record<QueuePriority, number> = {
  critical: 100,
  high: 75,
  normal: 50,
  low: 25,
};

export class PriorityQueue {
  private readonly items = new Map<string, QueueItem>();

  add(item: QueueItem): void {
    this.items.set(item.taskId, item);
  }

  get(taskId: string): QueueItem | undefined {
    const item = this.items.get(taskId);
    return item ? { ...item } : undefined;
  }

  remove(taskId: string): boolean {
    return this.items.delete(taskId);
  }

  next(now = new Date()): QueueItem | undefined {
    const available = [...this.items.values()]
      .filter(
        (item) =>
          item.status === "waiting" &&
          (!item.availableAt || new Date(item.availableAt) <= now)
      )
      .sort((a, b) => {
        const priority =
          PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];

        if (priority !== 0) return priority;
        return (
          new Date(a.enqueuedAt).getTime() -
          new Date(b.enqueuedAt).getTime()
        );
      });

    return available[0] ? { ...available[0] } : undefined;
  }

  list(status?: QueueItem["status"]): QueueItem[] {
    return [...this.items.values()]
      .filter((item) => !status || item.status === status)
      .map((item) => ({ ...item }));
  }

  size(status?: QueueItem["status"]): number {
    return this.list(status).length;
  }
}
