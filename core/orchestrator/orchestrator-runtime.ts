import { ExecutionPlanner } from "./execution-planner";
import {
  OrchestratorExecutionResult,
  OrchestratorTaskRequest,
  ExecutionPlan,
  ExecutionTarget,
} from "./runtime-types";
import { TargetExecutor, TargetExecutionContext } from "./executors/types";

export type OrchestratorTargetExecutor = TargetExecutor;

export type OrchestratorExecutors = Partial<
  Record<ExecutionTarget, TargetExecutor>
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
      return { accepted: false, taskId: request.taskId, target: "local", status: "failed", reason: "taskId is required." };
    }
    if (!request.prompt.trim()) {
      return { accepted: false, taskId: request.taskId, target: "local", status: "failed", reason: "prompt is required." };
    }

    const plan = this.planner.plan(request);
    if (plan.requiresApproval) {
      return { accepted: true, taskId: request.taskId, target: plan.target, status: "planned", reason: "Execution plan requires approval before dispatch." };
    }

    const executor = this.executors[plan.target];
    if (!executor) {
      return { accepted: true, taskId: request.taskId, target: plan.target, status: "planned", reason: "Execution plan created; target executor is not connected yet." };
    }

    try {
      const context: TargetExecutionContext = {
        request,
        plan,
        metadata: request.metadata,
      };
      const output = await executor.execute(context);
      return {
        accepted: output.success,
        taskId: request.taskId,
        target: plan.target,
        status: output.success ? "completed" : "failed",
        output: output.output,
        reason: output.error,
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
