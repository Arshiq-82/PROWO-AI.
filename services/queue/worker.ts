import { JobQueue } from "./job-queue";
import {
  Job,
  JobHandler,
} from "./types";

export class QueueWorker {
  private readonly handlers = new Map<string, JobHandler>();
  private running = false;

  constructor(private readonly queue: JobQueue) {}

  registerHandler(handler: JobHandler): void {
    if (this.handlers.has(handler.type)) {
      throw new Error(`Handler for "${handler.type}" is already registered.`);
    }

    this.handlers.set(handler.type, handler);
  }

  async processNext(): Promise<Job | undefined> {
    const job = this.queue.next();

    if (!job) {
      return undefined;
    }

    const handler = this.handlers.get(job.type);

    if (!handler) {
      this.queue.fail(
        job.id,
        `No worker handler registered for job type "${job.type}".`
      );

      return this.queue.get(job.id);
    }

    try {
      const result = await handler.handle(job);

      if (result.success) {
        this.queue.complete(job.id);
      } else {
        this.queue.fail(
          job.id,
          result.error ?? "Job failed."
        );
      }
    } catch (error) {
      this.queue.fail(
        job.id,
        error instanceof Error ? error.message : "Worker execution failed."
      );
    }

    return this.queue.get(job.id);
  }

  async start(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;

    while (this.running) {
      const job = await this.processNext();

      if (!job) {
        break;
      }
    }
  }

  stop(): void {
    this.running = false;
  }
}
