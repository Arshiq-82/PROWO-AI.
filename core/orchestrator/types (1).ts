export type WorkflowTrigger =
  | "manual"
  | "schedule"
  | "event"
  | "webhook"
  | "file_change";

export type WorkflowActionType =
  | "run_program"
  | "file_operation"
  | "api_request"
  | "document_process"
  | "computer_task"
  | "condition"
  | "notification";

export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  name: string;
  config: Record<string, unknown>;
  dependsOn: string[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: WorkflowTrigger;
    config: Record<string, unknown>;
  };
  actions: WorkflowAction[];
  enabled: boolean;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  startedAt?: string;
  finishedAt?: string;
  error?: string;
}
