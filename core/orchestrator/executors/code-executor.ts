import {
  CodeExecutionAdapter,
  TargetExecutionContext,
  TargetExecutionOutput,
  TargetExecutor,
} from "./types";

export class CodeTargetExecutor implements TargetExecutor {
  readonly target = "code_generation" as const;

  constructor(private readonly adapter: CodeExecutionAdapter) {}

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
