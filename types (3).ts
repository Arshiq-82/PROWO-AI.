import { TaskKind, TaskPlan } from "../../core/orchestrator/types";

export interface PlannerContext {
  projectId?: string;
  selectedModel?: string;
  availableTools: string[];
  availableDevices: string[];
  previousContext?: string;
}

export interface PlannerRequest {
  message: string;
  context: PlannerContext;
}

export interface PlannerResult {
  kind: TaskKind;
  plan: TaskPlan;
  assumptions: string[];
  questions: string[];
}
