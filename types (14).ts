export type RealtimeEventType =
  | "task.created"
  | "task.updated"
  | "task.progress"
  | "task.completed"
  | "task.failed"
  | "ai.stream"
  | "device.connected"
  | "device.disconnected"
  | "device.heartbeat"
  | "workflow.started"
  | "workflow.progress"
  | "workflow.completed"
  | "approval.requested"
  | "approval.resolved"
  | "notification"
  | "log";

export interface RealtimeEvent<T = unknown> {
  id: string;
  type: RealtimeEventType;
  timestamp: string;
  userId?: string;
  projectId?: string;
  deviceId?: string;
  taskId?: string;
  payload: T;
}

export interface RealtimeConnection {
  id: string;
  userId?: string;
  deviceId?: string;
  connectedAt: string;
  metadata?: Record<string, unknown>;
}

export type RealtimeListener = (
  event: RealtimeEvent
) => void | Promise<void>;
