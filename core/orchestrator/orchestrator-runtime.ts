import { ExecutionPlanner } from "./execution-planner";
import {
  OrchestratorExecutionResult,
  OrchestratorTaskRequest,
  ExecutionPlan,
  ExecutionTarget,
} from "./types";

export interface OrchestratorTargetExecutor {
  execute(
    request: OrchestratorTaskRequest,
    plan: ExecutionPlan
  ): Promise<unknown> | unknown;
}

export type OrchestratorExecutors = Partial<
  Record<ExecutionTarget, OrchestratorTargetExecutor>
>;

export class OrchestratorRuntime {
  constructor(
    private readonly planner: ExecutionPlanner = new ExecutionPlanner(),
    private readonly executors: OrchestratorExecutors = {}
  ) {}

  async run(
    request: OrchestratorTaskRequest
  ): Promise<OrchestratorExecutionResult> {
    if (!request.taskId.trim()) {
      return {
        accepted: false,
        taskId: request.taskId,
        target: "local",
        status: "failed",
        reason: "taskId is required.",
      };
    }

    if (!request.prompt.trim()) {
      return {
        accepted: false,
        taskId: request.taskId,
        target: "local",
        status: "failed",
        reason: "prompt is required.",
      };
    }

    const plan = this.planner.plan(request);

    if (plan.requiresApproval) {
      return {
        accepted: true,
        taskId: request.taskId,
        target: plan.target,
        status: "planned",
        reason: "Execution plan requires approval before dispatch.",
      };
    }

    const executor = this.executors[plan.target];

    if (!executor) {
      return {
        accepted: true,
        taskId: request.taskId,
        target: plan.target,
        status: "planned",
        reason: "Execution plan created; target executor is not connected yet.",
      };
    }

    try {
      const output = await executor.execute(request, plan);

      return {
        accepted: true,
        taskId: request.taskId,
        target: plan.target,
        status: "completed",
        output,
      };
    } catch (error) {
      return {
        accepted: false,
        taskId: request.taskId,
        target: plan.target,
        status: "failed",
        reason: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
