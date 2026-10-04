import {
  ExecutionPlan,
  ExecutionTarget,
  OrchestratorTaskRequest,
} from "../runtime-types";

export interface TargetExecutionContext {
  request: OrchestratorTaskRequest;
  plan: ExecutionPlan;
  metadata?: Record<string, unknown>;
}

export interface TargetExecutionOutput {
  target: ExecutionTarget;
  success: boolean;
  output?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface TargetExecutor {
  readonly target: ExecutionTarget;
  execute(context: TargetExecutionContext): Promise<TargetExecutionOutput>;
}

export interface LocalExecutionAdapter {
  execute(context: TargetExecutionContext): Promise<unknown>;
}

export interface ConnectedDeviceExecutionAdapter {
  execute(context: TargetExecutionContext): Promise<unknown>;
}

export interface WorkflowExecutionAdapter {
  execute(context: TargetExecutionContext): Promise<unknown>;
}

export interface CodeExecutionAdapter {
  execute(context: TargetExecutionContext): Promise<unknown>;
}

export interface ToolExecutionAdapter {
  execute(context: TargetExecutionContext): Promise<unknown>;
}
