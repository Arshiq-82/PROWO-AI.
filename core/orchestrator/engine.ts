import {
  WorkflowDefinition,
  WorkflowExecution,
} from "./types";

export class WorkflowEngine {
  private readonly workflows = new Map<string, WorkflowDefinition>();

  register(workflow: WorkflowDefinition): void {
    this.workflows.set(workflow.id, workflow);
  }

  get(workflowId: string): WorkflowDefinition | undefined {
    return this.workflows.get(workflowId);
  }

  list(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  async execute(workflowId: string): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);

    if (!workflow) {
      return {
        id: `execution_${Date.now()}`,
        workflowId,
        status: "failed",
        error: `Workflow "${workflowId}" was not found.`,
      };
    }

    if (!workflow.enabled) {
      return {
        id: `execution_${Date.now()}`,
        workflowId,
        status: "cancelled",
        error: "Workflow is disabled.",
      };
    }

    const execution: WorkflowExecution = {
      id: `execution_${Date.now()}`,
      workflowId,
      status: "running",
      startedAt: new Date().toISOString(),
    };

    // Execution adapters will be connected here:
    // program runner, APIs, documents, connected computers, etc.
    await Promise.resolve();

    execution.status = "completed";
    execution.finishedAt = new Date().toISOString();

    return execution;
  }
}
