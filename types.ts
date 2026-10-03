export type TaskKind = "program" | "workflow";

export type TaskStatus =
  | "queued"
  | "planning"
  | "generating"
  | "validating"
  | "testing"
  | "completed"
  | "failed"
  | "awaiting_approval";

export interface ProwoRequest {
  id: string;
  message: string;
  projectId?: string;
  selectedModel?: string;
  createdAt: string;
}

export interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dependencies: string[];
}

export interface TaskPlan {
  id: string;
  kind: TaskKind;
  objective: string;
  steps: TaskStep[];
}

export interface OrchestratorResult {
  requestId: string;
  status: TaskStatus;
  plan: TaskPlan;
  output?: unknown;
  error?: string;
}

export interface Orchestrator {
  plan(request: ProwoRequest): Promise<TaskPlan>;
  execute(
    request: ProwoRequest,
    plan: TaskPlan
  ): Promise<OrchestratorResult>;
}
