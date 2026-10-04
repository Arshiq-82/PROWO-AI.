import {
  LocalEngine,
  EngineAdapter,
  failure,
  success,
} from "./types";
import { TargetExecutionContext, TargetExecutionOutput } from "../executors/types";

export class LocalEngineAdapter implements EngineAdapter {
  constructor(private readonly engine: LocalEngine) {}

  async execute(
    context: TargetExecutionContext
  ): Promise<TargetExecutionOutput> {
    try {
      const output = await this.engine.execute({
        taskId: context.request.taskId,
        input: context.request.metadata ?? {},
        timeoutMs: context.request.timeoutMs,
        metadata: context.metadata,
      });

      return success("local", output);
    } catch (error) {
      return failure("local", error);
    }
  }
}
