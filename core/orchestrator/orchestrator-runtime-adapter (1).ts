import {
  Orchestrator,
  OrchestratorResult,
  ProwoRequest,
  TaskPlan,
  TaskStatus,
} from "./types";
import { OrchestratorRuntime } from "./orchestrator-runtime";
import { ExecutionPlanner } from "./execution-planner";
import { ExecutionTarget } from "./runtime-types";

export class OrchestratorRuntimeAdapter implements Orchestrator {
  constructor(
    private readonly runtime: OrchestratorRuntime,
    private readonly planner: ExecutionPlanner = new ExecutionPlanner()
  ) {}

  async plan(request: ProwoRequest): Promise<TaskPlan> {
    const target = this.inferTarget(request.message);
    const executionPlan = this.planner.plan({
      taskId: request.id,
      projectId: request.projectId,
      prompt: request.message,
      target,
    });

    return {
      id: `plan-${request.id}`,
      kind: target === "workflow" ? "workflow" : "program",
      objective: request.message,
      steps: executionPlan.steps.map((step) => ({
        id: step.stepId,
        title: step.action,
        description: step.description,
        status: step.requiresApproval ? "awaiting_approval" : "planning",
        dependencies: [],
      })),
    };
  }

  async execute(
    request: ProwoRequest,
    plan: TaskPlan
  ): Promise<OrchestratorResult> {
    const target = this.inferTarget(request.message);

    const result = await this.runtime.run({
      taskId: request.id,
      projectId: request.projectId,
      prompt: request.message,
      target,
    });

    return {
      requestId: request.id,
      status: this.mapStatus(result.status),
      plan,
      output: result.output,
      error: result.reason,
    };
  }

  private inferTarget(message: string): ExecutionTarget {
    const prompt = message.toLowerCase();

    if (
      prompt.includes("computer") ||
      prompt.includes("remote machine") ||
      prompt.includes("connected device") ||
      prompt.includes("run on my pc")
    ) return "connected_device";

    if (
      prompt.includes("workflow") ||
      prompt.includes("automate") ||
      prompt.includes("schedule") ||
      prompt.includes("every day")
    ) return "workflow";

    if (
      prompt.includes("create a program") ||
      prompt.includes("write code") ||
      prompt.includes("build an app") ||
      prompt.includes("generate code")
    ) return "code_generation";

    if (
      prompt.includes("api") ||
      prompt.includes("send email") ||
      prompt.includes("external service")
    ) return "external_tool";

    return "local";
  }

  private mapStatus(
    status: "planned" | "queued" | "running" | "completed" | "failed"
  ): TaskStatus {
    switch (status) {
      case "planned": return "planning";
      case "queued": return "queued";
      case "running": return "testing";
      case "completed": return "completed";
      case "failed": return "failed";
    }
  }
}
