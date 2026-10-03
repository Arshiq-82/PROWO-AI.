import { JobQueue } from "./job-queue";
import { QueueWorker } from "./worker";
import {
  Job,
  JobHandler,
  JobPriority,
} from "./types";

export class QueueManager {
  readonly queue: JobQueue;
  readonly worker: QueueWorker;

  constructor() {
    this.queue = new JobQueue();
    this.worker = new QueueWorker(this.queue);
  }

  registerHandler(handler: JobHandler): void {
    this.worker.registerHandler(handler);
  }

  enqueue<TPayload>(
    type: string,
    payload: TPayload,
    options: {
      priority?: JobPriority;
      maxAttempts?: number;
      metadata?: Record<string, unknown>;
    } = {}
  ): Job<TPayload> {
    return this.queue.enqueue({
      type,
      payload,
      priority: options.priority ?? "normal",
      maxAttempts: options.maxAttempts ?? 3,
      metadata: options.metadata,
    });
  }

  async processNext(): Promise<Job | undefined> {
    return this.worker.processNext();
  }

  async start(): Promise<void> {
    return this.worker.start();
  }

  stop(): void {
    this.worker.stop();
  }
}
