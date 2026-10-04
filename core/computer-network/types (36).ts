export type QueuePriority = "critical" | "high" | "normal" | "low";

export type QueueItemStatus =
  | "waiting"
  | "leased"
  | "dispatched"
  | "completed"
  | "failed"
  | "cancelled";

export interface QueueTask {
  taskId: string;
  priority: QueuePriority;
  payload: Record<string, unknown>;
  availableAt?: string;
  maxAttempts?: number;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export interface QueueItem extends QueueTask {
  status: QueueItemStatus;
  attempt: number;
  enqueuedAt: string;
  leasedAt?: string;
  leaseExpiresAt?: string;
  completedAt?: string;
  lastError?: string;
}

export interface QueueLease {
  taskId: string;
  leaseId: string;
  workerId: string;
  expiresAt: string;
}

export interface QueueResult {
  success: boolean;
  item?: QueueItem;
  reason?: string;
}

export interface QueueStats {
  waiting: number;
  leased: number;
  dispatched: number;
  completed: number;
  failed: number;
  cancelled: number;
}
