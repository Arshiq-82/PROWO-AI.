import {
  ToolSystem,
  EngineAdapter,
  failure,
  success,
} from "./types";
import { TargetExecutionContext, TargetExecutionOutput } from "../executors/types";

export class ToolSystemAdapter implements EngineAdapter {
  constructor(private readonly tools: ToolSystem) {}

  async execute(
    context: TargetExecutionContext
  ): Promise<TargetExecutionOutput> {
    try {
      const output = await this.tools.run({
        taskId: context.request.taskId,
        input: context.request.metadata ?? {},
        metadata: context.metadata,
      });

      return success("external_tool", output);
    } catch (error) {
      return failure("external_tool", error);
    }
  }
}
