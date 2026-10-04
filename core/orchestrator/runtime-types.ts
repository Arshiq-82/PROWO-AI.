export type ExecutionTarget =
  | "local"
  | "connected_device"
  | "workflow"
  | "code_generation"
  | "external_tool";

export interface OrchestratorTaskRequest {
  taskId: string;
  userId?: string;
  projectId?: string;
  selectedModel?: string;
  prompt: string;
  target?: ExecutionTarget;
  preferredDeviceId?: string;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export interface ExecutionPlan {
  taskId: string;
  target: ExecutionTarget;
  steps: ExecutionPlanStep[];
  requiresApproval: boolean;
  preferredDeviceId?: string;
  createdAt: string;
}

export interface ExecutionPlanStep {
  stepId: string;
  action: string;
  description: string;
  target?: ExecutionTarget;
  requiresApproval: boolean;
  metadata?: Record<string, unknown>;
}

export interface OrchestratorRoute {
  target: ExecutionTarget;
  reason: string;
  confidence: number;
}

export interface OrchestratorExecutionResult {
  accepted: boolean;
  taskId: string;
  target: ExecutionTarget;
  status: "planned" | "queued" | "running" | "completed" | "failed";
  reason?: string;
  output?: unknown;
}
