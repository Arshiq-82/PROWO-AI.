import { AgentCommand, AgentEvent } from "../protocol/types";

export interface AgentExecutionContext {
  deviceId: string;
  taskId?: string;
  userId?: string;
  projectId?: string;
  approved?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AgentExecutionRequest {
  command: AgentCommand;
  context: AgentExecutionContext;
}

export interface AgentExecutionResult {
  success: boolean;
  taskId?: string;
  output?: unknown;
  error?: string;
  startedAt: string;
  completedAt: string;
}

export interface AgentCommandExecutor {
  execute(
    request: AgentExecutionRequest
  ): Promise<AgentExecutionResult>;
}

export interface ExecutionRoute {
  commandType: AgentCommand["type"];
  handler: string;
}
