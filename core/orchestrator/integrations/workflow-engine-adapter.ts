import {
  WorkflowEngine,
  EngineAdapter,
  failure,
  success,
} from "./types";
import { TargetExecutionContext, TargetExecutionOutput } from "../executors/types";

export class WorkflowEngineAdapter implements EngineAdapter {
  constructor(private readonly engine: WorkflowEngine) {}

  async execute(
    context: TargetExecutionContext
  ): Promise<TargetExecutionOutput> {
    try {
      const workflow = {
        taskId: context.request.taskId,
        prompt: context.request.prompt,
        metadata: context.request.metadata,
        plan: context.plan,
      };

      const output = await this.engine.execute(workflow);
      return success("workflow", output);
    } catch (error) {
      return failure("workflow", error);
    }
  }
}
