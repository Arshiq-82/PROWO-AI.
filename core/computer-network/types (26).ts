import { AgentCommand, AgentEvent } from "../protocol/types";

export interface CommandRoute {
  commandType: AgentCommand["type"];
  deviceId: string;
  taskId?: string;
  command: AgentCommand;
  createdAt: string;
}

export interface CommandDispatchResult {
  accepted: boolean;
  commandId: string;
  deviceId: string;
  taskId?: string;
  error?: string;
}

export interface TaskCommandRequest {
  deviceId: string;
  taskId: string;
  action: string;
  input?: Record<string, unknown>;
  timeoutMs?: number;
}

export interface TaskCommandResult {
  taskId: string;
  deviceId: string;
  success: boolean;
  output?: unknown;
  error?: string;
  completedAt: string;
}

export interface CommandResultHandler {
  handle(event: AgentEvent): TaskCommandResult | undefined;
}
