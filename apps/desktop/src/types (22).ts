export type DesktopStatus =
  | "starting"
  | "ready"
  | "busy"
  | "stopped"
  | "error";

export interface DesktopConfig {
  backendUrl: string;
  userId?: string;
  deviceId?: string;
  deviceName?: string;
  autoStartAgent?: boolean;
}

export interface DesktopState {
  status: DesktopStatus;
  startedAt?: string;
  userId?: string;
  deviceId?: string;
  agentRunning: boolean;
  error?: string;
}

export interface LocalOperationRequest {
  type: "file_read" | "file_write" | "process" | "system_info";
  payload: Record<string, unknown>;
}

export interface LocalOperationResult {
  success: boolean;
  output?: unknown;
  error?: string;
}
