export type TaskLifecycleState =
  | "created"
  | "queued"
  | "planning"
  | "scheduled"
  | "allocated"
  | "dispatched"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "retrying"
  | "cancelled";

export type TaskLifecycleEventType =
  | "task.created"
  | "task.queued"
  | "task.planned"
  | "task.scheduled"
  | "task.allocated"
  | "task.dispatched"
  | "task.started"
  | "task.paused"
  | "task.resumed"
  | "task.completed"
  | "task.failed"
  | "task.retrying"
  | "task.cancelled";

export interface TaskLifecycleEvent {
  eventId: string;
  taskId: string;
  type: TaskLifecycleEventType;
  from?: TaskLifecycleState;
  to: TaskLifecycleState;
  timestamp: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface TaskLifecycleRecord {
  taskId: string;
  state: TaskLifecycleState;
  version: number;
  updatedAt: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface LifecycleTransition {
  from: TaskLifecycleState;
  event: TaskLifecycleEventType;
  to: TaskLifecycleState;
}

export interface LifecycleResult {
  success: boolean;
  record?: TaskLifecycleRecord;
  event?: TaskLifecycleEvent;
  reason?: string;
}
