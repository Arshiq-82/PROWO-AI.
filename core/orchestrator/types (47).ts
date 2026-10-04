import {
  TargetExecutionContext,
  TargetExecutionOutput,
} from "../executors/types";

export interface EngineAdapter {
  execute(context: TargetExecutionContext): Promise<TargetExecutionOutput>;
}

export interface LocalEngine {
  execute(request: {
    taskId: string;
    input: Record<string, unknown>;
    timeoutMs?: number;
    metadata?: Record<string, unknown>;
  }): Promise<unknown>;
}

export interface NetworkEngine {
  submit(
    request: {
      taskId: string;
      priority: "critical" | "high" | "normal" | "low";
      payload: Record<string, unknown>;
      preferredDeviceId?: string;
      maxAttempts?: number;
      timeoutMs?: number;
      metadata?: Record<string, unknown>;
    },
    devices?: unknown[]
  ): Promise<unknown>;
}

export interface WorkflowEngine {
  execute(
    workflow: unknown
  ): Promise<unknown>;
}

export interface CodeEngine {
  generate(
    request: {
      taskId: string;
      prompt: string;
      projectId?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<unknown>;
}

export interface ToolSystem {
  run(
    request: {
      taskId: string;
      input: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    }
  ): Promise<unknown>;
}

export function success(
  target: TargetExecutionContext["plan"]["target"],
  output: unknown,
  metadata?: Record<string, unknown>
): TargetExecutionOutput {
  return {
    target,
    success: true,
    output,
    metadata,
  };
}

export function failure(
  target: TargetExecutionContext["plan"]["target"],
  error: unknown
): TargetExecutionOutput {
  return {
    target,
    success: false,
    error: error instanceof Error ? error.message : String(error),
  };
}
