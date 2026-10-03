export type DeviceStatus =
  | "offline"
  | "connecting"
  | "online"
  | "busy"
  | "error";

export type DevicePlatform =
  | "windows"
  | "macos"
  | "linux"
  | "android"
  | "ios"
  | "unknown";

export interface DeviceCapabilities {
  terminal: boolean;
  filesystem: boolean;
  browser: boolean;
  guiAutomation: boolean;
  codeExecution: boolean;
  maxConcurrentTasks: number;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  platform: DevicePlatform;
  status: DeviceStatus;
  agentVersion: string;
  capabilities: DeviceCapabilities;
  lastHeartbeatAt?: string;
  registeredAt: string;
}

export interface DeviceTask {
  id: string;
  deviceId?: string;
  projectId?: string;
  type:
    | "execute_program"
    | "run_workflow"
    | "file_operation"
    | "browser_task"
    | "system_task";
  payload: Record<string, unknown>;
  priority: "low" | "normal" | "high" | "critical";
  createdAt: string;
}

export interface TaskDispatchResult {
  taskId: string;
  deviceId: string;
  accepted: boolean;
  message: string;
}
