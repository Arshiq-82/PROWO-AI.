export type TaskStatus =
  | "queued"
  | "planning"
  | "generating"
  | "validating"
  | "testing"
  | "awaiting_approval"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface Task {
  id: string;
  userId: string;
  projectId?: string;
  kind: "program" | "workflow";
  title: string;
  description?: string;
  status: TaskStatus;
  progress: number;
  queueJobId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateTaskInput {
  id: string;
  userId: string;
  projectId?: string;
  kind: Task["kind"];
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateTaskInput {
  status?: TaskStatus;
  progress?: number;
  queueJobId?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}
