import {
  CodeEngine,
  EngineAdapter,
  failure,
  success,
} from "./types";
import { TargetExecutionContext, TargetExecutionOutput } from "../executors/types";

export class CodeEngineAdapter implements EngineAdapter {
  constructor(private readonly engine: CodeEngine) {}

  async execute(
    context: TargetExecutionContext
  ): Promise<TargetExecutionOutput> {
    try {
      const output = await this.engine.generate({
        taskId: context.request.taskId,
        prompt: context.request.prompt,
        projectId: context.request.projectId,
        metadata: context.request.metadata,
      });

      return success("code_generation", output);
    } catch (error) {
      return failure("code_generation", error);
    }
  }
}
