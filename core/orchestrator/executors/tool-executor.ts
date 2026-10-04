import {
  TargetExecutionContext,
  TargetExecutionOutput,
  TargetExecutor,
  ToolExecutionAdapter,
} from "./types";

export class ToolTargetExecutor implements TargetExecutor {
  readonly target = "external_tool" as const;

  constructor(private readonly adapter: ToolExecutionAdapter) {}

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
