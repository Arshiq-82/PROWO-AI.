export type JobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type JobPriority = "low" | "normal" | "high" | "critical";

export interface Job<TPayload = unknown> {
  id: string;
  type: string;
  payload: TPayload;
  priority: JobPriority;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface JobResult<T = unknown> {
  success: boolean;
  output?: T;
  error?: string;
}

export interface JobHandler<TPayload = unknown, TResult = unknown> {
  type: string;
  handle(job: Job<TPayload>): Promise<JobResult<TResult>>;
}

export interface QueueStats {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
}
