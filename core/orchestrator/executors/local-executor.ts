import {
  LocalExecutionAdapter,
  TargetExecutionContext,
  TargetExecutionOutput,
  TargetExecutor,
} from "./types";

export class LocalTargetExecutor implements TargetExecutor {
  readonly target = "local" as const;

  constructor(private readonly adapter: LocalExecutionAdapter) {}

  async execute(
    context: TargetExecutionContext
  ): Promise<TargetExecutionOutput> {
    try {
      const output = await this.adapter.execute(context);

      return {
        target: this.target,
        success: true,
        output,
      };
    } catch (error) {
      return {
        target: this.target,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
