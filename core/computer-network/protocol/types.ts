export type AgentCommandType =
  | "execute_task"
  | "cancel_task"
  | "pause_task"
  | "resume_task"
  | "collect_status"
  | "shutdown";

export type AgentEventType =
  | "task_started"
  | "task_progress"
  | "task_completed"
  | "task_failed"
  | "device_status"
  | "log"
  | "error";

export interface AgentCommand<T = unknown> {
  id: string;
  type: AgentCommandType;
  timestamp: string;
  deviceId: string;
  taskId?: string;
  payload?: T;
}

export interface AgentEvent<T = unknown> {
  id: string;
  type: AgentEventType;
  timestamp: string;
  deviceId: string;
  taskId?: string;
  payload?: T;
}

export interface TaskCommandPayload {
  action: string;
  input?: Record<string, unknown>;
  timeoutMs?: number;
}

export interface TaskProgressPayload {
  progress: number;
  message?: string;
}

export interface TaskResultPayload {
  success: boolean;
  output?: unknown;
  error?: string;
}

export interface DeviceStatusPayload {
  status: string;
  cpuUsage?: number;
  memoryUsage?: number;
  activeTasks?: number;
}
