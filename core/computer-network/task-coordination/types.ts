export type CoordinationStatus =
  | "pending"
  | "dispatching"
  | "running"
  | "completed"
  | "failed"
  | "retrying"
  | "cancelled";

export interface CoordinationTask {
  taskId: string;
  priority: "critical" | "high" | "normal" | "low";
  deviceId?: string;
  maxAttempts?: number;
  timeoutMs?: number;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ExecutionAssignment {
  taskId: string;
  deviceId: string;
  attempt: number;
  assignedAt: string;
  status: CoordinationStatus;
}

export interface ExecutionResult {
  taskId: string;
  success: boolean;
  output?: unknown;
  error?: string;
  deviceId?: string;
  attempt: number;
  completedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CoordinationResult {
  accepted: boolean;
  assignment?: ExecutionAssignment;
  reason?: string;
}
