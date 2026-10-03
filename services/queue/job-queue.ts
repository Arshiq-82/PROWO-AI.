import {
  Job,
  JobPriority,
  QueueStats,
} from "./types";

const PRIORITY_WEIGHT: Record<JobPriority, number> = {
  low: 1,
  normal: 2,
  high: 3,
  critical: 4,
};

export class JobQueue {
  private readonly jobs = new Map<string, Job>();

  enqueue<TPayload>(
    input: Omit<
      Job<TPayload>,
      "id" | "status" | "attempts" | "createdAt"
    >
  ): Job<TPayload> {
    const job: Job<TPayload> = {
      ...input,
      id: this.createJobId(),
      status: "queued",
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    this.jobs.set(job.id, job as Job);
    return { ...job };
  }

  get(jobId: string): Job | undefined {
    const job = this.jobs.get(jobId);
    return job ? { ...job } : undefined;
  }

  cancel(jobId: string): boolean {
    const job = this.jobs.get(jobId);

    if (!job || job.status !== "queued") {
      return false;
    }

    job.status = "cancelled";
    job.completedAt = new Date().toISOString();
    return true;
  }

  next(): Job | undefined {
    const queued = Array.from(this.jobs.values()).filter(
      (job) => job.status === "queued"
    );

    queued.sort(
      (a, b) =>
        PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority] ||
        new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
    );

    const job = queued[0];

    if (!job) {
      return undefined;
    }

    job.status = "running";
    job.startedAt = new Date().toISOString();
    job.attempts += 1;

    return { ...job };
  }

  complete(jobId: string): boolean {
    const job = this.jobs.get(jobId);

    if (!job) {
      return false;
    }

    job.status = "completed";
    job.completedAt = new Date().toISOString();
    return true;
  }

  fail(jobId: string, error: string): boolean {
    const job = this.jobs.get(jobId);

    if (!job) {
      return false;
    }

    if (job.attempts < job.maxAttempts) {
      job.status = "queued";
      job.error = error;
      return true;
    }

    job.status = "failed";
    job.error = error;
    job.completedAt = new Date().toISOString();
    return true;
  }

  stats(): QueueStats {
    const stats: QueueStats = {
      queued: 0,
      running: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
    };

    for (const job of this.jobs.values()) {
      stats[job.status] += 1;
    }

    return stats;
  }

  list(): Job[] {
    return Array.from(this.jobs.values()).map((job) => ({ ...job }));
  }

  private createJobId(): string {
    return `job_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}
